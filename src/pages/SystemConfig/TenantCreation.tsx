// import { useEffect, useState } from "react";

// import { CrudPage } from "@/components/common";
// import type { FormField, FilterField } from "@/components/common";
// import type { TableColumn } from "@/types";

// import { userService } from "@/service/usercreationservices";
// import type { SiteDropdownItem } from "@/service/usercreationservices";
// import { userStorage } from "@/utils/storage";

// interface TenantRecord {
//   id: string;
//   first_name: string;
//   last_name: string;
//   contact: string;
//   email: string;
//   location_name: string;
//   block: string;
//   floor: string;
//   unit: string;
//   site_guid: string;
//   site_name: string;
// }

// const columns: TableColumn<TenantRecord>[] = [
//   { key: "id", header: "ID" },
//   {
//     key: "first_name",
//     header: "Tenant",
//     render: (row) => (
//       <div>
//         <p className="font-medium text-slate-700">
//           {row.first_name} {row.last_name}
//         </p>
//         <p className="text-xs text-slate-400">{row.email}</p>
//       </div>
//     ),
//   },
//   { key: "contact", header: "Contact" },
//   { key: "location_name", header: "Location" },
//   {
//     key: "block",
//     header: "Block / Floor / Unit",
//     render: (row) => `${row.block} / ${row.floor} / ${row.unit}`,
//   },
//   { key: "site_name", header: "Site" },
// ];

// const getLoggedInSiteName = (): string => {
//   const user = userStorage.getUser<{ site?: string }>();
//   return user?.site || "";
// };

// const TenantCreation = () => {
//   const [sites, setSites] = useState<SiteDropdownItem[]>([]);
//   const [isLoadingSites, setIsLoadingSites] = useState(true);
//   const [siteError, setSiteError] = useState("");
//   const [loggedInSiteName] = useState<string>(() => getLoggedInSiteName());

//   useEffect(() => {
//     const loadSites = async () => {
//       setIsLoadingSites(true);
//       setSiteError("");

//       try {
//         const siteRes = await userService.siteDropdown();

//         if (siteRes.success && siteRes.data) {
//           setSites(siteRes.data.results ?? []);
//         } else {
//           setSiteError(siteRes.message || "Could not load sites.");
//         }
//       } catch (error: any) {
//         setSiteError(
//           error?.response?.data?.message ||
//             "Could not load sites. Please try again."
//         );
//       } finally {
//         setIsLoadingSites(false);
//       }
//     };

//     loadSites();
//   }, []);

//   const siteLabel = (s: SiteDropdownItem) =>
//     `${s.site_name} (${s.site_model.name})`;

//   const formFields: FormField[] = [
//     { name: "first_name", label: "First Name", required: true, placeholder: "Enter first name" },
//     { name: "last_name", label: "Last Name", required: true, placeholder: "Enter last name" },
//     { name: "contact", label: "Contact", required: true, placeholder: "Enter contact number" },
//     { name: "email", label: "Email", required: true, placeholder: "Enter email address" },
//     { name: "Tenant_name", label: "Tenant Name", required: true, placeholder: "Enter Tenant name" },
//     { name: "block", label: "Block", required: true, placeholder: "e.g., A" },
//     { name: "floor", label: "Floor", required: true, placeholder: "e.g., 1" },
//     { name: "unit", label: "Unit", required: true, placeholder: "e.g., 101" },
//     {
//       name: "site",
//       label: "Site Name",
//       required: true,
//       type: "select",
//       placeholder: isLoadingSites ? "Loading sites..." : "Select site",
//       disabled: isLoadingSites,
//       options: sites.map((s) => ({ label: siteLabel(s), value: s.guid })),
//     },
//   ];

//   const matchedSite = loggedInSiteName
//     ? sites.find(
//         (s) => s.site_name.toLowerCase() === loggedInSiteName.toLowerCase()
//       )
//     : undefined;

//   const siteOptionsForFilter = matchedSite ? [matchedSite] : sites;

//   const filters: FilterField[] = [
//     {
//       key: "site_guid",
//       label: "Site",
//       placeholder: isLoadingSites ? "Loading sites..." : "All Sites",
//       disabled: isLoadingSites || !!matchedSite,
//       options: siteOptionsForFilter.map((s) => ({
//         label: siteLabel(s),
//         value: s.guid,
//       })),
//     },
//   ];

//   const defaultFilterValues = matchedSite
//     ? { site_guid: matchedSite.guid }
//     : undefined;

//   const initialData: TenantRecord[] = [];

//   const transformBeforeSave = (values: Record<string, string>) => {
//     const site = sites.find((s) => s.guid === values.site);
//     return {
//       ...values,
//       site_guid: values.site,
//       site_name: site?.site_name ?? "",
//     };
//   };

//   return (
//     <>
//       {siteError && (
//         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
//           {siteError}
//         </div>
//       )}

//       <CrudPage
//         title="Tenant Creation"
//         description="Manage tenants occupying each site."
//         addLabel="Add Tenant"
//         idPrefix="TN"
//         columns={columns}
//         formFields={formFields}
//         initialData={initialData}
//         searchPlaceholder="Search tenants..."
//         filters={filters}
//         defaultFilterValues={defaultFilterValues}
//         transformBeforeSave={transformBeforeSave}
//       />
//     </>
//   );
// };

// export default TenantCreation;





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
import { tenantService } from "@/service/tenantcreationservices";
import type { TenantRecord } from "@/service/tenantcreationservices";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { userStorage } from "@/utils/storage";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;
const TENANT_MENU_KEY = "/system-config/tenant";

interface SiteItem {
  id?: number;
  guid: string;
  site_code?: string;
  name: string;
}

interface StoredUser {
  is_super_admin?: boolean;
  site_detail?: SiteItem | null;
  permissions?: {
    menu_key: string;
    view: boolean;
    enabled: boolean;
    subsites?: SiteItem[];
  }[];
}

interface DropdownOption {
  label: string;
  value: string;
}

interface TenantForm {
  first_name: string;
  last_name: string;
  contact: string;
  email: string;
  tenant_name: string;
  block: string;
  floor: string;
  unit: string;
  site: string; // guid
}

const emptyForm: TenantForm = {
  first_name: "",
  last_name: "",
  contact: "",
  email: "",
  tenant_name: "",
  block: "",
  floor: "",
  unit: "",
  site: "",
};

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

const extractError = (error: any, fallback: string): string => {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.entries(data.errors)[0] as [string, string[]] | undefined;
    if (first) return `${first[0]}: ${first[1]?.[0] ?? fallback}`;
  }
  return data?.message || fallback;
};

const TenantCreation = () => {
  // ---------- logged-in user ----------
  const [storedUser] = useState<StoredUser | null>(() =>
    userStorage.getUser<StoredUser>()
  );
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;
  const subsiteOptions: SiteItem[] =
    storedUser?.permissions?.find((p) => p.menu_key === TENANT_MENU_KEY)
      ?.subsites ?? [];

  // ---------- table ----------
  const [records, setRecords] = useState<TenantRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // ---------- sites (super admin only: all sites) ----------
  const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
  const [siteError, setSiteError] = useState("");

  // ---------- modal / form ----------
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingGuid, setEditingGuid] = useState<string | null>(null);
  const [form, setForm] = useState<TenantForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingGuid, setDeletingGuid] = useState<string | null>(null);

  const setField = (key: keyof TenantForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // ---------- site choices ----------
  // Sites the user can pick in the list filter
  const siteChoices: SiteItem[] = isSuperAdmin
    ? allSites.map((s) => ({ guid: s.guid, name: s.site_name }))
    : ownSite
    ? [ownSite, ...subsiteOptions]
    : [];

  // Sites the user can pick in Add / Update Tenant:
  // super admin = every site, others = ONLY their own site
  const formSiteOptions: DropdownOption[] = isSuperAdmin
    ? allSites.map((s) => ({
        label: `${s.site_name} (${s.site_model.name})`,
        value: s.guid,
      }))
    : ownSite
    ? [{ label: ownSite.name, value: ownSite.guid }]
    : [];

  // "" = All Sites (super admin only)
  const [siteFilter, setSiteFilter] = useState<string>(
    isSuperAdmin ? "" : ownSite?.guid ?? ""
  );
  const selectedSite = siteChoices.find((s) => s.guid === siteFilter);

  // View-only when one of the subsites is selected
  const isReadOnly =
    !isSuperAdmin && !!siteFilter && siteFilter !== ownSite?.guid;

  const filterOptions: DropdownOption[] = isSuperAdmin
    ? [
        { label: "All Sites", value: "" },
        ...siteChoices.map((s) => ({ label: s.name, value: s.guid })),
      ]
    : siteChoices.map((s) => ({
        label:
          s.guid === ownSite?.guid
            ? `${s.name} (My Site)`
            : `${s.name}${s.site_code ? ` (${s.site_code})` : ""}`,
        value: s.guid,
      }));

  // Edit / Delete only for the user's own site (or any site for super admin)
  const canManageRow = (row: TenantRecord) =>
    isSuperAdmin || row.site.guid === ownSite?.guid;

  // ---------- data loading ----------
  const fetchList = async (pageNum: number, searchTerm: string) => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await tenantService.list(
        pageNum,
        PAGE_SIZE,
        searchTerm,
        selectedSite
          ? { site_guid: selectedSite.guid, site_name: selectedSite.name }
          : undefined
      );
      if (response.success && response.data) {
        setRecords(response.data.results);
        setTotalPages(response.data.pagination?.total_pages ?? 1);
        setTotalRecords(
          response.data.pagination?.total_records ?? response.data.results.length
        );
      } else {
        setLoadError(response.message || "Could not load tenants.");
      }
    } catch (error: any) {
      setLoadError(extractError(error, "Could not load tenants. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  // One effect: page, search and site filter all re-fetch.
  // Changing search / filter resets the page to 1 in their handlers.
  useEffect(() => {
    const timer = setTimeout(
      () => fetchList(page, search),
      search ? SEARCH_DEBOUNCE_MS : 0
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, siteFilter, allSites]);

  // Super admin: load every site for the dropdowns
  useEffect(() => {
    if (!isSuperAdmin) return;

    const loadSites = async () => {
      setIsLoadingSites(true);
      setSiteError("");
      try {
        const res = await userService.siteDropdown();
        if (res.success && res.data) {
          setAllSites(res.data.results ?? []);
        } else {
          setSiteError(res.message || "Could not load sites.");
        }
      } catch (error: any) {
        setSiteError(extractError(error, "Could not load sites. Please try again."));
      } finally {
        setIsLoadingSites(false);
      }
    };

    loadSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- modal helpers ----------
  const openAddModal = () => {
    setEditingGuid(null);
    setFormError("");
    setForm({
      ...emptyForm,
      // normal users only have their own site, so preselect it
      site: !isSuperAdmin && ownSite ? ownSite.guid : "",
    });
    setModalOpen(true);
  };

  const openEditModal = (row: TenantRecord) => {
    setEditingGuid(row.guid);
    setFormError("");
    setForm({
      first_name: row.first_name,
      last_name: row.last_name,
      contact: row.contact,
      email: row.email,
      tenant_name: row.tenant_name,
      block: row.block,
      floor: row.floor,
      unit: row.unit,
      site: row.site.guid,
    });
    setModalOpen(true);
  };

  const validate = (): string => {
    if (!form.first_name.trim()) return "First Name is required";
    if (!form.last_name.trim()) return "Last Name is required";
    if (!form.contact.trim()) return "Contact is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Enter a valid email";
    if (!form.tenant_name.trim()) return "Tenant Location Name is required";
    if (!form.block.trim()) return "Block is required";
    if (!form.floor.trim()) return "Floor is required";
    if (!form.unit.trim()) return "Unit is required";
    if (!form.site) return "Site is required";
    return "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const message = validate();
    if (message) {
      setFormError(message);
      return;
    }
    setFormError("");

    setIsSubmitting(true);
    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        contact: form.contact.trim(),
        email: form.email.trim(),
        tenant_name: form.tenant_name.trim(),
        block: form.block.trim(),
        floor: form.floor.trim(),
        unit: form.unit.trim(),
        site: form.site,
      };

      const response = editingGuid
        ? await tenantService.update(editingGuid, payload)
        : await tenantService.create(payload);

      if (response.success) {
        setModalOpen(false);
        await fetchList(page, search);
      } else {
        setFormError(response.message || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      setFormError(extractError(error, "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (row: TenantRecord) => {
    if (!window.confirm(`Delete tenant "${row.tenant_name}" (${row.unit})?`)) return;

    setDeletingGuid(row.guid);
    try {
      const response = await tenantService.delete(row.guid);
      if (response.success) {
        if (records.length === 1 && page > 1) {
          setPage((p) => p - 1);
        } else {
          await fetchList(page, search);
        }
      } else {
        alert(response.message || "Could not delete this tenant.");
      }
    } catch (error: any) {
      alert(extractError(error, "Could not delete this tenant."));
    } finally {
      setDeletingGuid(null);
    }
  };

  // ---------- table columns ----------
  const columns: TableColumn<TenantRecord>[] = [
    {
      key: "first_name",
      header: "Tenant",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-700">
            {row.first_name} {row.last_name}
          </p>
          <p className="text-xs text-slate-400">{row.email}</p>
        </div>
      ),
    },
    { key: "tenant_name", header: "TenantLocation Name" },
    { key: "contact", header: "Contact" },
    {
      key: "block",
      header: "Block / Floor / Unit",
      render: (row) => `${row.block} / ${row.floor} / ${row.unit}`,
    },
    {
      key: "site",
      header: "Site",
      render: (row) => row.site.name,
    },
    {
      key: "site_model",
      header: "Site Model",
      render: (row) => row.site.site_model.name,
    },
    {
      key: "parent",
      header: "Parent Site",
      render: (row) =>
        row.site.parent ? row.site.parent.name : <span className="text-slate-400">—</span>,
    },
    {
      key: "__actions",
      header: "Actions",
      render: (row) =>
        canManageRow(row) ? (
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
        ) : (
          <span className="text-slate-400">—</span>
        ),
      width: "90px",
    },
  ];

  const visibleColumns = isReadOnly
    ? columns.filter((c) => c.key !== "__actions")
    : columns;

  return (
    <div>
      <PageHeader
        title="Tenant Creation"
        description="Manage tenants occupying each site."
        actions={
          isReadOnly ? null : (
            <Button icon={<Plus size={16} />} onClick={openAddModal}>
              Add Tenant
            </Button>
          )
        }
      />

      {siteError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
          <AlertCircle size={16} />
          {siteError}
        </div>
      )}

      <Card noPadding>
        <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-center gap-3">
          <div className="max-w-xs">
            <Input
              placeholder="Search tenants..."
              icon={<Search size={15} />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              disabled={isLoading}
            />
          </div>

          {filterOptions.length > 0 && (
            <select
              value={siteFilter}
              onChange={(e) => {
                setSiteFilter(e.target.value);
                setPage(1);
              }}
              disabled={isLoading || isLoadingSites}
              className={`${fieldClass} max-w-xs`}
            >
              {filterOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}

          {isReadOnly && <span className="text-xs text-slate-500">View only</span>}
        </div>

        <div className="p-4 sm:p-5">
          {loadError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
              <AlertCircle size={16} />
              {loadError}
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <Spinner size={28} className="text-primary-500" />
              <p className="text-sm">Loading tenants...</p>
            </div>
          ) : (
            <>
              <Table columns={visibleColumns} data={records} keyField="guid" />
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
        title={editingGuid ? "Edit Tenant" : "Add Tenant"}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={isSubmitting}
            >
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
            label="First Name"
            placeholder="Enter first name"
            required
            value={form.first_name}
            onChange={(e) => setField("first_name", e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Last Name"
            placeholder="Enter last name"
            required
            value={form.last_name}
            onChange={(e) => setField("last_name", e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Contact"
            placeholder="Enter contact number"
            required
            value={form.contact}
            onChange={(e) => setField("contact", e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Email"
            placeholder="Enter email address"
            required
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Tenant Location Name"
            placeholder="Enter Tenant Location name"
            required
            value={form.tenant_name}
            onChange={(e) => setField("tenant_name", e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Block"
            placeholder="e.g., A"
            required
            value={form.block}
            onChange={(e) => setField("block", e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Floor"
            placeholder="e.g., 1"
            required
            value={form.floor}
            onChange={(e) => setField("floor", e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Unit"
            placeholder="e.g., 101"
            required
            value={form.unit}
            onChange={(e) => setField("unit", e.target.value)}
            disabled={isSubmitting}
          />

          <div>
            <label className={labelClass}>
              Site Name <span className="text-red-500">*</span>
            </label>
            <select
              value={form.site}
              onChange={(e) => setField("site", e.target.value)}
              disabled={isSubmitting || isLoadingSites}
              className={fieldClass}
            >
              <option value="">
                {isLoadingSites ? "Loading sites..." : "Select site"}
              </option>
              {formSiteOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
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

export default TenantCreation;