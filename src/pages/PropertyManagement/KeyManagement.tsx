// // // // // import { useNavigate } from "react-router-dom";
// // // // // import { Upload } from "lucide-react";
// // // // // import { Badge, Button } from "@/components/ui";
// // // // // import { CrudPage } from "@/components/common";
// // // // // import type { FormField } from "@/components/common";
// // // // // import type { TableColumn, BadgeVariant } from "@/types";

// // // // // interface KeyRecord {
// // // // //   id: string;
// // // // //   keyName: string;
// // // // //   site: string;
// // // // //   issuedTo: string;
// // // // //   status: string;
// // // // // }

// // // // // const statusVariant: Record<string, BadgeVariant> = {
// // // // //   Assigned: "warning",
// // // // //   Available: "success",
// // // // //   Lost: "neutral",
// // // // // };

// // // // // const columns: TableColumn<KeyRecord>[] = [
// // // // //   { key: "id", header: "Key Number" },
// // // // //   { key: "keyName", header: "Key Name" },
// // // // //   { key: "site", header: "Site" },
// // // // //   {
// // // // //     key: "status",
// // // // //     header: "Status",
// // // // //     render: (row) => <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>,
// // // // //   },
// // // // // ];

// // // // // const formFields: FormField[] = [
// // // // //   { name: "keyNo", label: "Key No", required: true, placeholder: "e.g. Server Room Key No" },
// // // // //   { name: "keyName", label: "Key Name", required: true, placeholder: "e.g. Server Room Key" },
// // // // //   { name: "site", label: "Site", required: true, placeholder: "e.g. Tower A" },
  
// // // // //   {
// // // // //     name: "status",
// // // // //     label: "Status",
// // // // //     type: "select",
// // // // //     options: [
// // // // //       { label: "Assigned", value: "Assigned" },
// // // // //       { label: "Available", value: "Available" },
// // // // //       { label: "Lost", value: "Lost" },
// // // // //     ],
// // // // //   },
// // // // // ];

// // // // // const initialData: KeyRecord[] = [
// // // // //   { id: "KY-001", keyName: "Server Room Key", site: "Tower A", issuedTo: "IT Admin", status: "Assigned" },
// // // // //   { id: "KY-002", keyName: "Main Gate Key", site: "Tower B", issuedTo: "-", status: "Available" },
// // // // //   { id: "KY-003", keyName: "Store Room Key", site: "Tower C", issuedTo: "Facility Mgr", status: "Lost" },
// // // // // ];

// // // // // const KeyManagement = () => {
// // // // //   const navigate = useNavigate();

// // // // //   return (
// // // // //     <CrudPage
// // // // //       title="Key"
// // // // //       description="Manage physical keys issued across all sites."
// // // // //       addLabel="Issue Key"
// // // // //       idPrefix="KY"
// // // // //       columns={columns}
// // // // //       formFields={formFields}
// // // // //       initialData={initialData}
// // // // //       searchPlaceholder="Search keys..."
// // // // //       extraActions={
// // // // //         <Button
// // // // //           variant="outline"
// // // // //           icon={<Upload size={16} />}
// // // // //           onClick={() => navigate("/property-management/key/bulk-upload")}
// // // // //         >
// // // // //           Bulk Upload
// // // // //         </Button>
// // // // //       }
// // // // //     />
// // // // //   );
// // // // // };

// // // // // export default KeyManagement;



// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Upload } from "lucide-react";
// import { Badge, Button } from "@/components/ui";
// import { CrudPage } from "@/components/common";
// import type { FormField, FilterField } from "@/components/common";
// import type { TableColumn, BadgeVariant } from "@/types";
// import { userService } from "@/service/usercreationservices";
// import type { SiteDropdownItem } from "@/service/usercreationservices";
// import { keyService } from "@/service/keycreationservices";
// import type { KeyItem, KeyStatus } from "@/service/keycreationservices";
// import { userStorage } from "@/utils/storage";

// // ---------- constants (mirror the Django serializer) ----------
// const KEY_STATUS = {
//   ASSIGNED: "Assigned",
//   AVAILABLE: "Available",
//   LOST: "Lost",
// } as const;

// const KEY_STATUS_OPTIONS = [
//   { label: "Available", value: KEY_STATUS.AVAILABLE },
//   { label: "Assigned", value: KEY_STATUS.ASSIGNED },
//   { label: "Lost", value: KEY_STATUS.LOST },
// ];

// const KEY_STATUS_VARIANT: Record<KeyStatus, BadgeVariant> = {
//   Assigned: "warning",
//   Available: "success",
//   Lost: "neutral",
// };

// const KEY_NO_MAX_LENGTH = 50;
// const KEY_NAME_MAX_LENGTH = 150;
// const KEY_PAGE_SIZE = 10;
// const KEY_BULK_UPLOAD_ROUTE = "/property-management/key/bulk-upload";

// // ---------- types ----------
// interface SiteItem {
//   guid: string;
//   name: string;
// }
// interface StoredUser {
//   is_super_admin?: boolean;
//   site_detail?: SiteItem | null;
// }

// // CrudPage's table/form work on flat fields, so `site` (guid, for the edit
// // form) and `site_name` (for the column) are split out from the nested API shape.
// interface KeyRow {
//   guid: string;
//   key_no: string;
//   key_name: string;
//   site: string;
//   site_name: string;
//   status: KeyStatus;
// }

// const toRow = (item: KeyItem): KeyRow => ({
//   guid: item.guid,
//   key_no: item.key_no,
//   key_name: item.key_name,
//   site: item.site.guid,
//   site_name: item.site.name,
//   status: item.status,
// });

// const buildPayload = (values: Record<string, string>) => ({
//   key_no: (values.key_no || "").trim(),
//   key_name: (values.key_name || "").trim(),
//   site: values.site,
//   status: (values.status || KEY_STATUS.AVAILABLE) as KeyStatus,
// });

// const validatePayload = (payload: ReturnType<typeof buildPayload>): string => {
//   if (!payload.key_no) return "Key number is required";
//   if (payload.key_no.length > KEY_NO_MAX_LENGTH)
//     return `Key number must be ${KEY_NO_MAX_LENGTH} characters or fewer`;
//   if (!payload.key_name) return "Key name is required";
//   if (payload.key_name.length > KEY_NAME_MAX_LENGTH)
//     return `Key name must be ${KEY_NAME_MAX_LENGTH} characters or fewer`;
//   if (!payload.site) return "Select a site";
//   return "";
// };

// const flattenErrors = (errors?: Record<string, string[] | string>): string => {
//   if (!errors) return "";
//   return Object.values(errors)
//     .map((v) => (Array.isArray(v) ? v.join(" ") : String(v)))
//     .join(" ");
// };

// const KeyCreation = () => {
//   const navigate = useNavigate();

//   // ----- logged-in user / site scope -----
//   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());

//   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
//   const [isLoadingSites, setIsLoadingSites] = useState(true);

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       setIsLoadingSites(true);
//       try {
//         const res = await userService.siteDropdown();
//         if (!cancelled && res.success && res.data) {
//           setAllSites(res.data.results ?? []);
//         }
//       } finally {
//         if (!cancelled) setIsLoadingSites(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // All users see every site the API returns.
//   const siteOptions = useMemo(
//     () =>
//       allSites.map((s) => ({
//         label: `${s.site_name} (${s.site_model.name})`,
//         value: s.guid,
//       })),
//     [allSites]
//   );

//   // ----- server-driven list state -----
//   const [rows, setRows] = useState<KeyRow[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [listError, setListError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [siteFilter, setSiteFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [refreshIndex, setRefreshIndex] = useState(0);
//   const refresh = () => setRefreshIndex((n) => n + 1);

//   // debounce search box
//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
//     return () => clearTimeout(t);
//   }, [search]);

//   // reset to page 1 whenever a filter/search changes
//   useEffect(() => {
//     setPage(1);
//   }, [debouncedSearch, siteFilter, statusFilter]);

//   // ignore stale responses if requests race
//   const loadKeys = useCallback(async () => {
//     setIsLoading(true);
//     setListError("");

//     const res = await keyService.list({
//       page,
//       page_size: KEY_PAGE_SIZE,
//       search: debouncedSearch,
//       site_guid: siteFilter || null,
//       status: (statusFilter || "") as KeyStatus | "",
//     });

//     if (res.success && res.data) {
//       setRows(res.data.results.map(toRow));
//       setTotalPages(res.data.pagination?.total_pages ?? 1);
//       setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
//     } else {
//       setRows([]);
//       setTotalPages(1);
//       setTotalRecords(0);
//       setListError(res.message);
//     }

//     setIsLoading(false);
//   }, [page, debouncedSearch, siteFilter, statusFilter]);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       await loadKeys();
//       if (cancelled) return;
//     })();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [loadKeys, refreshIndex]);

//   // ----- create -----
//   const handleCreate = async (values: Record<string, string>): Promise<string> => {
//     const payload = buildPayload(values);
//     const validationError = validatePayload(payload);
//     if (validationError) return validationError;

//     const res = await keyService.create(payload);
//     if (!res.success) return flattenErrors(res.errors) || res.message;

//     // new records surface first — jump to page 1, or just reload if already there
//     if (page !== 1) setPage(1);
//     else refresh();
//     return "";
//   };

//   // ----- update -----
//   const handleUpdate = async (row: KeyRow, values: Record<string, string>): Promise<string> => {
//     const payload = buildPayload(values);
//     const validationError = validatePayload(payload);
//     if (validationError) return validationError;

//     const res = await keyService.update({ guid: row.guid, ...payload });
//     if (!res.success) return flattenErrors(res.errors) || res.message;

//     refresh();
//     return "";
//   };

//   // ----- delete -----
//   const handleDelete = async (row: KeyRow): Promise<string> => {
//     const res = await keyService.remove(row.guid);
//     if (!res.success) return res.message;

//     // deleting the last row on a page steps back one page instead of showing empty
//     if (rows.length === 1 && page > 1) setPage(page - 1);
//     else refresh();
//     return "";
//   };

//   // ----- table / form / filter config -----
//   const columns: TableColumn<KeyRow>[] = [
//     { key: "key_no", header: "Key Number" },
//     { key: "key_name", header: "Key Name" },
//     { key: "site_name", header: "Site" },
//     {
//       key: "status",
//       header: "Status",
//       render: (row) => (
//         <Badge variant={KEY_STATUS_VARIANT[row.status] || "neutral"}>{row.status}</Badge>
//       ),
//     },
//   ];

//   const formFields: FormField[] = useMemo(
//     () => [
//       { name: "key_no", label: "Key No", required: true, placeholder: "e.g. KY-001" },
//       { name: "key_name", label: "Key Name", required: true, placeholder: "e.g. Server Room Key" },
//       {
//         name: "site",
//         label: "Site",
//         type: "select",
//         required: true,
//         placeholder: isLoadingSites ? "Loading sites..." : "Select site",
//         options: siteOptions,
//         disabled: isLoadingSites,
//       },
//       { name: "status", label: "Status", type: "select", options: KEY_STATUS_OPTIONS },
//     ],
//     [siteOptions, isLoadingSites]
//   );

//   const filters: FilterField[] = useMemo(
//     () => [
//       {
//         key: "site",
//         label: "Site",
//         placeholder: isLoadingSites ? "Loading sites..." : "All sites",
//         options: siteOptions,
//       },
//       {
//         key: "status",
//         label: "Status",
//         placeholder: "All statuses",
//         options: KEY_STATUS_OPTIONS,
//       },
//     ],
//     [siteOptions, isLoadingSites]
//   );

//   return (
//     <CrudPage<KeyRow>
//       title="Key"
//       description="Manage physical keys issued across all sites."
//       addLabel="Issue Key"
//       keyField="guid"
//       columns={columns}
//       formFields={formFields}
//       searchPlaceholder="Search keys..."
//       extraActions={
//         <Button
//           variant="outline"
//           icon={<Upload size={16} />}
//           onClick={() => navigate(KEY_BULK_UPLOAD_ROUTE)}
//         >
//           Bulk Upload
//         </Button>
//       }
//       filters={filters}
//       filterValues={{ site: siteFilter, status: statusFilter }}
//       onFilterChange={(key, value) => {
//         if (key === "site") setSiteFilter(value);
//         if (key === "status") setStatusFilter(value);
//       }}
//       data={rows}
//       isLoading={isLoading}
//       error={listError}
//       search={search}
//       onSearchChange={setSearch}
//       page={page}
//       totalPages={totalPages}
//       totalRecords={totalRecords}
//       onPageChange={setPage}
//       onCreate={handleCreate}
//       onUpdate={handleUpdate}
//       onDelete={handleDelete}
//       pageSize={KEY_PAGE_SIZE}
//     />
//   );
// };

// export default KeyCreation;



import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { CrudPage } from "@/components/common";
import type { FormField, FilterField } from "@/components/common";
import type { TableColumn, BadgeVariant } from "@/types";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { keyService } from "@/service/keycreationservices";
import type { KeyItem, KeyStatus } from "@/service/keycreationservices";
import { userStorage } from "@/utils/storage";

// ---------- constants (mirror the Django serializer) ----------
const KEY_STATUS = {
  ASSIGNED: "Assigned",
  AVAILABLE: "Available",
  LOST: "Lost",
} as const;

const KEY_STATUS_OPTIONS = [
  { label: "Available", value: KEY_STATUS.AVAILABLE },
  { label: "Assigned", value: KEY_STATUS.ASSIGNED },
  { label: "Lost", value: KEY_STATUS.LOST },
];

const KEY_STATUS_VARIANT: Record<KeyStatus, BadgeVariant> = {
  Assigned: "warning",
  Available: "success",
  Lost: "neutral",
};

const KEY_NO_MAX_LENGTH = 50;
const KEY_NAME_MAX_LENGTH = 150;
const KEY_PAGE_SIZE = 10;
const KEY_BULK_UPLOAD_ROUTE = "/property-management/key/bulk-upload";
// Menu key this screen is registered under — must match what the backend
// sends back in storedUser.permissions[].menu_key for the subsites list.
const KEY_MENU_KEY = "/property-management/key";

// ---------- types ----------
interface SubsiteItem {
  id?: number;
  guid: string;
  site_code?: string;
  name: string;
}

interface StoredUser {
  is_super_admin?: boolean;
  site_detail?: SubsiteItem | null;
  permissions?: {
    menu_key: string;
    view: boolean;
    enabled: boolean;
    subsites?: SubsiteItem[];
  }[];
}

// CrudPage's table/form work on flat fields, so `site` (guid, for the edit
// form) and `site_name` (for the column) are split out from the nested API shape.
interface KeyRow {
  guid: string;
  key_no: string;
  key_name: string;
  site: string;
  site_name: string;
  status: KeyStatus;
}

const toRow = (item: KeyItem): KeyRow => ({
  guid: item.guid,
  key_no: item.key_no,
  key_name: item.key_name,
  site: item.site.guid,
  site_name: item.site.name,
  status: item.status,
});

const buildPayload = (values: Record<string, string>) => ({
  key_no: (values.key_no || "").trim(),
  key_name: (values.key_name || "").trim(),
  site: values.site,
  status: (values.status || KEY_STATUS.AVAILABLE) as KeyStatus,
});

const validatePayload = (payload: ReturnType<typeof buildPayload>): string => {
  if (!payload.key_no) return "Key number is required";
  if (payload.key_no.length > KEY_NO_MAX_LENGTH)
    return `Key number must be ${KEY_NO_MAX_LENGTH} characters or fewer`;
  if (!payload.key_name) return "Key name is required";
  if (payload.key_name.length > KEY_NAME_MAX_LENGTH)
    return `Key name must be ${KEY_NAME_MAX_LENGTH} characters or fewer`;
  if (!payload.site) return "Select a site";
  return "";
};

// const flattenErrors = (errors?: Record<string, string[] | string>): string => {
//   if (!errors) return "";
//   return Object.values(errors)
//     .map((v) => (Array.isArray(v) ? v.join(" ") : String(v)))
//     .join(" ");
// };


const flattenErrors = (errors?: unknown): string => {
  if (!errors) return "";

  if (Array.isArray(errors)) {
    return errors
      .map((e, i) => {
        if (!e) return "";
        if (typeof e === "string") return e;
        // backend per-row error: { row, key_no, message }
        if (typeof e === "object" && "message" in e) {
          const { key_no, message } = e as { key_no?: string; message: string };
          return key_no ? `Key No ${key_no}: ${message}` : message;
        }
        return Object.keys(e).length ? `Row ${i + 1}: ${flattenErrors(e)}` : "";
      })
      .filter(Boolean)
      .join(" ");
  }

  return Object.values(errors as Record<string, string[] | string>)
    .map((v) => (Array.isArray(v) ? v.join(" ") : String(v)))
    .join(" ");
};

const KeyCreation = () => {
  const navigate = useNavigate();

  // ----- logged-in user / site scope -----
  const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;
  const subsiteOptions: SubsiteItem[] =
    storedUser?.permissions?.find((p) => p.menu_key === KEY_MENU_KEY)?.subsites ?? [];

  // Every site a non-admin can see/manage (their own site first, then granted subsites)
  const siteChoices: SubsiteItem[] = ownSite ? [ownSite, ...subsiteOptions] : subsiteOptions;

  // ----- full site list (super admin only — used for filter + form "Site" field) -----
  const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);

  useEffect(() => {
    if (!isSuperAdmin) return; // non-admins are scoped via siteChoices, no API call needed
    let cancelled = false;

    (async () => {
      setIsLoadingSites(true);
      try {
        const res = await userService.siteDropdown();
        if (!cancelled && res.success && res.data) {
          setAllSites(res.data.results ?? []);
        }
      } finally {
        if (!cancelled) setIsLoadingSites(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin]);

  // Sites offered in the Add/Edit "Site" field: all sites for admins,
  // own site + granted subsites for everyone else.
  // const siteOptions = useMemo(
  //   () =>
  //     isSuperAdmin
  //       ? allSites.map((s) => ({
  //           label: `${s.site_name} (${s.site_model.name})`,
  //           value: s.guid,
  //         }))
  //       : siteChoices.map((s) => ({
  //           label:
  //             s.guid === ownSite?.guid
  //               ? `${s.name} (My Site)`
  //               : `${s.name}${s.site_code ? ` (${s.site_code})` : ""}`,
  //           value: s.guid,
  //         })),
  //   [isSuperAdmin, allSites, siteChoices, ownSite]
  const siteOptions = useMemo(
    () =>
      isSuperAdmin
        ? allSites.map((s) => ({
            label: `${s.site_name} (${s.site_model.name})`,
            value: s.guid,
          }))
        : ownSite
        ? [{ label: `${ownSite.name} (My Site)`, value: ownSite.guid }]
        : [],
    [isSuperAdmin, allSites, ownSite]
  
  );

  // ----- site filter (narrows the key list; also drives read-only mode) -----
  // Admin defaults to "All Sites" (""); everyone else defaults to their own site.
  const [siteFilter, setSiteFilter] = useState<string>(isSuperAdmin ? "" : ownSite?.guid ?? "");
  const selectedSite = siteChoices.find((s) => s.guid === siteFilter);
  // Read-only only when a non-admin is viewing a subsite that isn't their own.
  const isReadOnly = !isSuperAdmin && !!selectedSite && selectedSite.guid !== ownSite?.guid;

  // Filter dropdown options: admin gets "All Sites" + every site; everyone
  // else only gets their own site plus whatever subsites they're granted.
  const siteFilterOptions = isSuperAdmin
    ? [{ label: "All Sites", value: "" }, ...siteOptions]
    : siteChoices.map((s) => ({
        label:
          s.guid === ownSite?.guid
            ? `${s.name} (My Site)`
            : `${s.name}${s.site_code ? ` (${s.site_code})` : ""}`,
        value: s.guid,
      }));

  // ----- server-driven list state -----
  const [rows, setRows] = useState<KeyRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);
  const refresh = () => setRefreshIndex((n) => n + 1);

  // debounce search box
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  // reset to page 1 whenever a filter/search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, siteFilter, statusFilter]);

  // ignore stale responses if requests race
  const loadKeys = useCallback(async () => {
    setIsLoading(true);
    setListError("");

    const res = await keyService.list({
      page,
      page_size: KEY_PAGE_SIZE,
      search: debouncedSearch,
      site_guid: siteFilter || null,
      status: (statusFilter || "") as KeyStatus | "",
    });

    if (res.success && res.data) {
      setRows(res.data.results.map(toRow));
      setTotalPages(res.data.pagination?.total_pages ?? 1);
      setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
    } else {
      setRows([]);
      setTotalPages(1);
      setTotalRecords(0);
      setListError(res.message);
    }

    setIsLoading(false);
  }, [page, debouncedSearch, siteFilter, statusFilter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadKeys();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadKeys, refreshIndex]);

  // ----- create -----
  const handleCreate = async (values: Record<string, string>): Promise<string> => {
    if (isReadOnly) return "You don't have permission to add keys for this site.";

    const payload = buildPayload(values);
    const validationError = validatePayload(payload);
    if (validationError) return validationError;

    const res = await keyService.create(payload);
    if (!res.success) return flattenErrors(res.errors) || res.message;

    // new records surface first — jump to page 1, or just reload if already there
    if (page !== 1) setPage(1);
    else refresh();
    return "";
  };

  // ----- update -----
  const handleUpdate = async (row: KeyRow, values: Record<string, string>): Promise<string> => {
    if (isReadOnly) return "You don't have permission to edit keys for this site.";

    const payload = buildPayload(values);
    const validationError = validatePayload(payload);
    if (validationError) return validationError;

    const res = await keyService.update({ guid: row.guid, ...payload });
    if (!res.success) return flattenErrors(res.errors) || res.message;

    refresh();
    return "";
  };

  // ----- delete -----
  const handleDelete = async (row: KeyRow): Promise<string> => {
    if (isReadOnly) return "You don't have permission to delete keys for this site.";

    const res = await keyService.remove(row.guid);
    if (!res.success) return res.message;

    // deleting the last row on a page steps back one page instead of showing empty
    if (rows.length === 1 && page > 1) setPage(page - 1);
    else refresh();
    return "";
  };

  // ----- table / form / filter config -----
  const baseColumns: TableColumn<KeyRow>[] = [
    { key: "key_no", header: "Key Number" },
    { key: "key_name", header: "Key Name" },
    { key: "site_name", header: "Site" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={KEY_STATUS_VARIANT[row.status] || "neutral"}>{row.status}</Badge>
      ),
    },
  ];

  // Drop the actions column entirely while read-only, same as SiteCreation.
  // const columns: TableColumn<KeyRow>[] = isReadOnly
  //   ? baseColumns.filter((c) => c.key !== "__actions")
  //   : baseColumns;

  const columns: TableColumn<KeyRow>[] = baseColumns;
  const formFields: FormField[] = useMemo(
    () => [
      { name: "key_no", label: "Key No", required: true, placeholder: "e.g. KY-001" },
      { name: "key_name", label: "Key Name", required: true, placeholder: "e.g. Server Room Key" },
      {
        name: "site",
        label: "Site",
        type: "select",
        required: true,
        placeholder: isLoadingSites ? "Loading sites..." : "Select site",
        options: siteOptions,
        disabled: isLoadingSites,
      },
      { name: "status", label: "Status", type: "select", options: KEY_STATUS_OPTIONS },
    ],
    [siteOptions, isLoadingSites]
  );

  const filters: FilterField[] = useMemo(
    () => [
      {
        key: "site",
        label: "Site",
        placeholder: isLoadingSites ? "Loading sites..." : "All sites",
        options: siteFilterOptions,
      },
      {
        key: "status",
        label: "Status",
        placeholder: "All statuses",
        options: KEY_STATUS_OPTIONS,
      },
    ],
    [siteFilterOptions, isLoadingSites]
  );

  return (
    <CrudPage<KeyRow>
      title="Key"
      description="Manage physical keys issued across all sites."
      // Hide "Issue Key" while viewing a subsite in read-only mode.
      addLabel={isReadOnly ? undefined : "Issue Key"}
      keyField="guid"
      columns={columns}
      formFields={formFields}
      searchPlaceholder="Search keys..."
      extraActions={
        isReadOnly ? (
          <span className="text-xs text-slate-500">View only</span>
        ) : (
          <Button
            variant="outline"
            icon={<Upload size={16} />}
            onClick={() => navigate(KEY_BULK_UPLOAD_ROUTE)}
          >
            Bulk Upload
          </Button>
        )
      }
      filters={filters}
      filterValues={{ site: siteFilter, status: statusFilter }}
      onFilterChange={(key, value) => {
        console.log("filter changed:", key, value);
        if (key === "site") setSiteFilter(value);
        if (key === "status") setStatusFilter(value);
      }}
      data={rows}
      isLoading={isLoading}
      error={listError}
      search={search}
      onSearchChange={setSearch}
      page={page}
      totalPages={totalPages}
      totalRecords={totalRecords}
      onPageChange={setPage}
      onCreate={isReadOnly ? undefined : handleCreate}
      onUpdate={isReadOnly ? undefined : handleUpdate}
      onDelete={isReadOnly ? undefined : handleDelete}
      pageSize={KEY_PAGE_SIZE}
    />
  );
};

export default KeyCreation;