import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Plus, Search, Pencil, Trash2, AlertCircle } from "lucide-react";
import {
  Card,
  PageHeader,
  Table,
  Pagination,
  Button,
  Input,
  Select,
  Modal,
  Spinner,
} from "@/components/ui";
import type { TableColumn } from "@/types";

export interface FormField {
  name: string;
  label: string;
  type?: "number" | "select" | "text" | "email" | "file" | "textarea";
  required?: boolean;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
  disabled?: boolean;
}

export interface FilterField {
  key: string;
  label: string;
  placeholder?: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
}

interface CrudPageProps<T> {
  title: string;
  description?: string;
  addLabel: string;
  columns: TableColumn<T>[];
  formFields: FormField[];
  searchPlaceholder?: string;
  extraActions?: ReactNode;
  filters?: FilterField[];
  defaultFilterValues?: Record<string, string>;
  filterValues?: Record<string, string>; 
  onFilterChange?: (key: string, value: string) => void;
  transformBeforeSave?: (values: Record<string, string>) => Record<string, any>;

  // ---------- local mode (old behaviour) ----------
  idPrefix?: string;
  initialData?: T[];

  // ---------- server mode (API) ----------
  keyField?: string;
  data?: T[];
  isLoading?: boolean;
  error?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  // each returns an error message on failure, or "" on success
  onCreate?: (values: Record<string, any>) => Promise<string>;
  onUpdate?: (row: T, values: Record<string, any>) => Promise<string>;
  onDelete?: (row: T) => Promise<string>;

  pageSize?: number;
}

function CrudPage<T extends Record<string, any>>({
  title,
  description,
  addLabel,
  columns,
  formFields,
  searchPlaceholder = "Search...",
  extraActions,
  filters,
  defaultFilterValues,
  transformBeforeSave,
  idPrefix = "ID",
  initialData = [],
  keyField = "id",
  data,
  isLoading = false,
  error = "",
  search: serverSearch,
  onSearchChange,
  page: serverPage,
  totalPages: serverTotalPages,
  totalRecords: serverTotalRecords,
  onPageChange,
  onCreate,
  onUpdate,
  onDelete,
  pageSize = 5,
  filterValues: controlledFilterValues,
  onFilterChange,
}: CrudPageProps<T>) {
  const isServer = data !== undefined;
  const isFilterControlled = controlledFilterValues !== undefined;

  const [localFilterValues, setLocalFilterValues] = useState<Record<string, string>>(
    defaultFilterValues || {}
  );

  const filterValues = isFilterControlled ? controlledFilterValues! : localFilterValues;

  const setFilterValue = (key: string, value: string) => {
    if (isFilterControlled) {
      onFilterChange?.(key, value);
    } else {
      setLocalFilterValues((prev) => ({ ...prev, [key]: value }));
      setLocalPage(1);
    }
  };

  // ---------- local state ----------
  const [records, setRecords] = useState<T[]>(initialData);
  const [localSearch, setLocalSearch] = useState("");
  const [localPage, setLocalPage] = useState(1);

  // ---------- shared state ----------
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  

  const search = isServer ? serverSearch ?? "" : localSearch;
  const page = isServer ? serverPage ?? 1 : localPage;
  const setPage = (p: number) => (isServer ? onPageChange?.(p) : setLocalPage(p));


  useEffect(() => {
  if (defaultFilterValues) setLocalFilterValues(defaultFilterValues);
}, [defaultFilterValues]);

  // ---------- local filtering ----------
  const filtered = useMemo(() => {
    if (isServer) return data ?? [];

    let rows = records;

    if (filters?.length) {
      rows = rows.filter((row) =>
        filters.every((f) => {
          const selected = filterValues[f.key];
          if (!selected) return true;
          return String(row[f.key] ?? "") === selected;
        })
      );
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      rows = rows.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(term))
      );
    }

    return rows;
  }, [isServer, data, records, search, filterValues, filters]);

  const totalPages = isServer
    ? serverTotalPages ?? 1
    : Math.max(1, Math.ceil(filtered.length / pageSize));
  const totalRecords = isServer ? serverTotalRecords ?? filtered.length : filtered.length;
  const pageData = isServer
    ? filtered
    : filtered.slice((page - 1) * pageSize, page * pageSize);

  // ---------- handlers ----------
  const handleSearch = (value: string) => {
    if (isServer) onSearchChange?.(value);
    else {
      setLocalSearch(value);
      setLocalPage(1);
    }
  };

  const openAddModal = () => {
    setEditingRow(null);
    setFormError("");

    const defaults: Record<string, string> = {};
    if (defaultFilterValues?.site_guid) {
      defaults.site = defaultFilterValues.site_guid;
    }
    formFields.forEach((f) => {
      if (f.type === "select" && f.options?.length && f.required && !(f.name in defaults)) {
        defaults[f.name] = f.options[0].value;
      }
    });

    setFormValues(defaults);
    setModalOpen(true);
  };

  const openEditModal = (row: T) => {
    setEditingRow(row);
    setFormError("");
    const values: Record<string, string> = {};
    formFields.forEach((f) => (values[f.name] = String(row[f.name] ?? "")));
    setFormValues(values);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!isSubmitting) setModalOpen(false);
  };

  const handleDelete = async (row: T) => {
    if (isServer) {
      if (!window.confirm("Are you sure you want to delete this record?")) return;
      const key = String(row[keyField]);
      setDeletingKey(key);
      try {
        const message = (await onDelete?.(row)) || "";
        if (message) alert(message);
      } finally {
        setDeletingKey(null);
      }
    } else {
      setRecords((prev) => prev.filter((r) => r[keyField] !== row[keyField]));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const values = transformBeforeSave ? transformBeforeSave(formValues) : formValues;

    if (isServer) {
      setFormError("");
      setIsSubmitting(true);
      try {
        const message = editingRow
          ? await onUpdate?.(editingRow, values)
          : await onCreate?.(values);
        if (message) setFormError(message);
        else setModalOpen(false);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // local mode
    if (editingRow) {
      setRecords((prev) =>
        prev.map((r) =>
          r[keyField] === editingRow[keyField] ? ({ ...r, ...values } as T) : r
        )
      );
    } else {
      const newId = `${idPrefix}-${String(records.length + 1).padStart(3, "0")}`;
      setRecords((prev) => [{ [keyField]: newId, ...values } as unknown as T, ...prev]);
    }
    setModalOpen(false);
  };

  // ---------- columns ----------

  
  // const fullColumns: TableColumn<T>[] = [
  //   ...columns,
  //   {
  //     key: "__actions",
  //     header: "Actions",
  //     render: (row) => {
  //       const isDeleting = deletingKey === String(row[keyField]);
  //       return (
  //         <div className="flex items-center gap-1.5">
  //           <button
  //             onClick={() => openEditModal(row)}
  //             disabled={isDeleting}
  //             className="p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40"
  //           >
  //             <Pencil size={15} />
  //           </button>
  //           <button
  //             onClick={() => handleDelete(row)}
  //             disabled={isDeleting}
  //             className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
  //           >
  //             {isDeleting ? <Spinner size={15} /> : <Trash2 size={15} />}
  //           </button>
  //         </div>
  //       );
  //     },
  //     width: "90px",
  //   },
  // ];

    // ---------- columns ----------
  // In server mode, only show the Actions column when the parent actually
  // gave us onUpdate/onDelete (KeyCreation omits both in read-only mode).
  // In local mode, edit/delete are always available, so always show it.
  const showActionsColumn = !isServer || !!onUpdate || !!onDelete;

  const fullColumns: TableColumn<T>[] = showActionsColumn
    ? [
        ...columns,
        {
          key: "__actions",
          header: "Actions",
          render: (row) => {
            const isDeleting = deletingKey === String(row[keyField]);
            return (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(row)}
                  disabled={isDeleting}
                  className="p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  disabled={isDeleting}
                  className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                >
                  {isDeleting ? <Spinner size={15} /> : <Trash2 size={15} />}
                </button>
              </div>
            );
          },
          width: "90px",
        },
      ]
    : columns;

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex items-center gap-2">
            {extraActions}
            {addLabel && (
            <Button icon={<Plus size={16} />} onClick={openAddModal}>
              {addLabel}
            </Button>
            )}
          </div>
        }
      />

      <Card noPadding>
        <div className="p-4 sm:p-5 border-b border-primary-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="max-w-xs w-full">
              <Input
                placeholder={searchPlaceholder}
                icon={<Search size={15} />}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={isServer && isLoading}
              />
            </div>

            {filters?.map((f) => (
              <div key={f.key} className="max-w-[220px] w-full">
                <Select
                  placeholder={f.placeholder || `All ${f.label}`}
                  options={f.options}
                  disabled={f.disabled}
                  value={filterValues[f.key] || ""}
                  onChange={(e) => setFilterValue(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {isServer && isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Spinner size={28} className="text-primary-500" />
              <p className="text-sm">Loading...</p>
            </div>
          ) : (
            <>
              <Table columns={fullColumns} data={pageData} keyField={keyField} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalRecords={totalRecords}
                pageSize={pageSize}
              />
            </>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRow ? `Edit ${title}` : addLabel}
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size={16} />
                  {editingRow ? "Saving..." : "Creating..."}
                </>
              ) : editingRow ? (
                "Save Changes"
              ) : (
                "Create"
              )}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formFields.map((field) =>
            field.type === "select" ? (
              <Select
                key={field.name}
                label={field.label}
                placeholder={field.placeholder || `Select ${field.label}`}
                options={field.options || []}
                required={field.required}
                disabled={field.disabled || isSubmitting}
                value={formValues[field.name] || ""}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
              />
            ) : (
              <Input
                key={field.name}
                label={field.label}
                type={field.type || "text"}
                placeholder={field.placeholder}
                required={field.required}
                disabled={field.disabled || isSubmitting}
                value={formValues[field.name] || ""}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
              />
            )
          )}

          {formError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}

export default CrudPage;