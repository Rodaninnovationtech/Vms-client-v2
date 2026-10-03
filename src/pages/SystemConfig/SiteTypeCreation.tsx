import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Search, Pencil, Trash2, AlertCircle } from "lucide-react";
import {
  Card,
  PageHeader,
  Table,
  Pagination,
  Button,
  Input,
  Modal,
  Spinner,
} from "@/components/ui";
import type { TableColumn } from "@/types";
import { siteTypeService } from "@/service/sitetypeservice";
import type { SiteTypeRecord } from "@/service/sitetypeservice";

const PAGE_SIZE = 10;

const SiteTypeCreation = () => {
  const [records, setRecords] = useState<SiteTypeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true); // table loading spinner
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingGuid, setEditingGuid] = useState<string | null>(null);
  const [siteType, setSiteType] = useState("");
  const [siteTypeDescription, setSiteTypeDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // create/update button loader

  const [deletingGuid, setDeletingGuid] = useState<string | null>(null);

  // Fetches one page (10 records) straight from the backend.
  const fetchList = async (pageNum: number) => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await siteTypeService.list(pageNum, PAGE_SIZE);
      if (response.success && response.data) {
        setRecords(response.data.results);
        setTotalPages(response.data.pagination?.total_pages ?? 1);
        setTotalRecords(response.data.pagination?.total_records ?? response.data.results.length);
      } else {
        setLoadError(response.message || "Could not load site types.");
      }
    } catch (error: any) {
      setLoadError(
        error?.response?.data?.message || "Could not load site types. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch whenever the page number changes (including the first load).
  useEffect(() => {
    fetchList(page);
  }, [page]);

  // Note: search filters only the current page's 10 loaded records, since
  // the backend list endpoint doesn't support a search parameter yet.
  const visibleRecords = search.trim()
    ? records.filter(
        (r) =>
          r.site_type.toLowerCase().includes(search.toLowerCase()) ||
          r.site_type_description.toLowerCase().includes(search.toLowerCase())
      )
    : records;

  const openAddModal = () => {
    setEditingGuid(null);
    setSiteType("");
    setSiteTypeDescription("");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (row: SiteTypeRecord) => {
    setEditingGuid(row.guid);
    setSiteType(row.site_type);
    setSiteTypeDescription(row.site_type_description);
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!siteType.trim()) {
      setFormError("Site Type Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { site_type: siteType, site_type_description: siteTypeDescription };
      const response = editingGuid
        ? await siteTypeService.update(editingGuid, payload)
        : await siteTypeService.create(payload);

      if (response.success) {
        setModalOpen(false);
        await fetchList(page); // refresh the current page from the server
      } else {
        setFormError(response.message || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      setFormError(
        error?.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (row: SiteTypeRecord) => {
    if (!window.confirm(`Delete site type "${row.site_type}"?`)) return;

    setDeletingGuid(row.guid);
    try {
      const response = await siteTypeService.delete(row.guid);
      if (response.success) {
        // If this was the last record on the page (and not page 1), step back a page.
        if (records.length === 1 && page > 1) {
          setPage((p) => p - 1);
        } else {
          await fetchList(page);
        }
      } else {
        alert(response.message || "Could not delete this site type.");
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Could not delete this site type.");
    } finally {
      setDeletingGuid(null);
    }
  };

  const columns: TableColumn<SiteTypeRecord>[] = [
    { key: "site_type", header: "Site Type Name" },
    { key: "site_type_description", header: "Description" },
    { key: "created_by", header: "Created By" },
    {
      key: "__actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEditModal(row)}
            disabled={deletingGuid === row.guid}
            className="p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            disabled={deletingGuid === row.guid}
            className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
          >
            {deletingGuid === row.guid ? <Spinner size={15} /> : <Trash2 size={15} />}
          </button>
        </div>
      ),
      width: "90px",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Site Type Creation"
        description="Define reusable site types used across properties."
        actions={
          <Button icon={<Plus size={16} />} onClick={openAddModal}>
            Add Site Type
          </Button>
        }
      />

      <Card noPadding>
        <div className="p-4 sm:p-5 border-b border-primary-50">
          <div className="max-w-xs">
            <Input
              placeholder="Search this page..."
              icon={<Search size={15} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {loadError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
              <AlertCircle size={16} />
              {loadError}
            </div>
          )}

          {isLoading ? (
            // Table loading state
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Spinner size={28} className="text-primary-500" />
              <p className="text-sm">Loading site types...</p>
            </div>
          ) : (
            <>
              <Table columns={columns} data={visibleRecords} keyField="guid" />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalRecords={totalRecords}
                pageSize={PAGE_SIZE}
              />
            </>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setModalOpen(false)}
        title={editingGuid ? "Edit Site Type" : "Add Site Type"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size={16} />
                  {editingGuid ? "Saving..." : "Creating..."}
                </>
              ) : editingGuid ? (
                "Save Changes"
              ) : (
                "Create"
              )}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Site Type Name"
            placeholder="e.g. Corporate Office"
            required
            value={siteType}
            onChange={(e) => setSiteType(e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Description"
            placeholder="Short description"
            value={siteTypeDescription}
            onChange={(e) => setSiteTypeDescription(e.target.value)}
            disabled={isSubmitting}
          />
          {formError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default SiteTypeCreation;