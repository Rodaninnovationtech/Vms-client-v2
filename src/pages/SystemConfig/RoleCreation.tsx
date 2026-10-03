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
  Badge,
} from "@/components/ui";
import type { TableColumn } from "@/types";
import { roleService } from "@/service/rolescreationservice";
import type { RoleRecord } from "@/service/rolescreationservice";

const PAGE_SIZE = 10;

const RoleCreation = () => {
  const [records, setRecords] = useState<RoleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true); // table loading spinner
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingGuid, setEditingGuid] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // create/update button loader

  const [deletingGuid, setDeletingGuid] = useState<string | null>(null);

  // Fetches one page (10 records) straight from the backend.
  const fetchList = async (pageNum: number) => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await roleService.list(pageNum, PAGE_SIZE);
      if (response.success && response.data) {
        setRecords(response.data.results);
        setTotalPages(response.data.pagination?.total_pages ?? 1);
        setTotalRecords(response.data.pagination?.total_records ?? response.data.results.length);
      } else {
        setLoadError(response.message || "Could not load roles.");
      }
    } catch (error: any) {
      setLoadError(
        error?.response?.data?.message || "Could not load roles. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch whenever the page number changes (including the first load).
  useEffect(() => {
    fetchList(page);
  }, [page]);

  // Note: search filters only the current page's loaded records, since
  // the backend list endpoint doesn't support a search parameter yet.
  const visibleRecords = search.trim()
    ? records.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase())
      )
    : records;

  const openAddModal = () => {
    setEditingGuid(null);
    setRoleName("");
    setRoleDescription("");
    setStatus("Active");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (row: RoleRecord) => {
    setEditingGuid(row.guid);
    setRoleName(row.name);
    setRoleDescription(row.description);
    setStatus(row.is_active ? "Active" : "Inactive");
    setFormError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!roleName.trim()) {
      setFormError("Role Name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: roleName.trim(),
        description: roleDescription.trim(),
        is_active: status === "Active",
      };
      const response = editingGuid
        ? await roleService.update(editingGuid, payload)
        : await roleService.create(payload);

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

  const handleDelete = async (row: RoleRecord) => {
    if (!window.confirm(`Delete role "${row.name}"?`)) return;

    setDeletingGuid(row.guid);
    try {
      const response = await roleService.delete(row.guid);
      if (response.success) {
        // If this was the last record on the page (and not page 1), step back a page.
        if (records.length === 1 && page > 1) {
          setPage((p) => p - 1);
        } else {
          await fetchList(page);
        }
      } else {
        alert(response.message || "Could not delete this role.");
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Could not delete this role.");
    } finally {
      setDeletingGuid(null);
    }
  };

  const columns: TableColumn<RoleRecord>[] = [
    { key: "name", header: "Role Name" },
    { key: "description", header: "Description" },
    {
      key: "is_active",
      header: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "neutral"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
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
        title="Role Creation"
        description="Define user roles available across the system."
        actions={
          <Button icon={<Plus size={16} />} onClick={openAddModal}>
            Add Role
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
              <p className="text-sm">Loading roles...</p>
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
        title={editingGuid ? "Edit Role" : "Add Role"}
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
            label="Role Name"
            placeholder="e.g. Security Guard"
            required
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Description"
            placeholder="Short description of role"
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            disabled={isSubmitting}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
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

export default RoleCreation;