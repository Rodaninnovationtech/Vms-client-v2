// // import { useNavigate } from "react-router-dom";
// // import { Upload } from "lucide-react";
// // import { Badge, Button } from "@/components/ui";
// // import { CrudPage } from "@/components/common";
// // import type { FormField } from "@/components/common";
// // import type { TableColumn, BadgeVariant } from "@/types";

// // interface PassRecord {
// //   id: string;
// //   passType: string;
// //   holderName: string;
// //   site: string;
// //   validTill: string;
// //   status: string;
// // }

// // const statusVariant: Record<string, BadgeVariant> = {
// //   Active: "success",
// //   Expired: "danger",
// // };

// // const columns: TableColumn<PassRecord>[] = [
// //   { key: "id", header: "Pass ID" },
// //   { key: "passType", header: "Pass Type" },
// //   { key: "holderName", header: "Holder Name" },
// //   { key: "site", header: "Site" },
// //   { key: "validTill", header: "Valid Till" },
// //   {
// //     key: "status",
// //     header: "Status",
// //     render: (row) => <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>,
// //   },
// // ];


// // const formFields: FormField[] = [
// //   {
// //     name: "passNumber",
// //     label: "Pass Number",
// //     required: true,
// //   },
// //   {
// //     name: "passType",
// //     label: "Pass Type",
// //     type: "select",
// //     required: true,
// //     options: [
// //       { label: "Visitor Pass", value: "Visitor Pass" },
// //       { label: "Contractor Pass", value: "Contractor Pass" },
// //       { label: "Parking Pass", value: "Parking Pass" },
// //     ],
// //   },
// //   {
// //     name: "status",
// //     label: "Status",
// //     type: "select",
// //     required: true,
// //     options: [
// //       { label: "Active", value: "Active" },
// //       { label: "Expired", value: "Expired" },
// //     ],
// //   },
// //   {
// //     name: "site",
// //     label: "Site",
// //     type: "select",
// //     required: true,
// //     options: [
// //       { label: "Tower A", value: "Tower A" },
// //       { label: "Tower B", value: "Tower B" },
// //       { label: "Tower C", value: "Tower C" },
// //     ],
// //   },
// // ];
// // const initialData: PassRecord[] = [
// //   { id: "PS-001", passType: "Visitor Pass", holderName: "Rohit Sharma", site: "Tower A", validTill: "17-09-2026", status: "Active" },
// //   { id: "PS-002", passType: "Contractor Pass", holderName: "ABC Electricals", site: "Tower C", validTill: "30-09-2026", status: "Active" },
// //   { id: "PS-003", passType: "Parking Pass", holderName: "Karan Mehta", site: "Tower A", validTill: "01-08-2026", status: "Expired" },
// // ];

// // const PassManagement = () => {
// //   const navigate = useNavigate();

// //   return (
// //     <CrudPage
// //       title="Pass"
// //       description="Manage access passes issued across all sites."
// //       addLabel="Issue Pass"
// //       idPrefix="PS"
// //       columns={columns}
// //       formFields={formFields}
// //       initialData={initialData}
// //       searchPlaceholder="Search passes..."
// //       extraActions={
// //         <Button
// //           variant="outline"
// //           icon={<Upload size={16} />}
// //           onClick={() => navigate("/property-management/pass/bulk-upload")}
// //         >
// //           Bulk Upload
// //         </Button>
// //       }
// //     />
// //   );
// // };

// // export default PassManagement;




// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Upload } from "lucide-react";
// import { Badge, Button } from "@/components/ui";
// import { CrudPage } from "@/components/common";
// import type { FormField, FilterField } from "@/components/common";
// import type { TableColumn, BadgeVariant } from "@/types";
// import { userService } from "@/service/usercreationservices";
// import type { SiteDropdownItem } from "@/service/usercreationservices";
// import { visitorTypeService } from "@/service/visitortypeservice";
// import type { VisitorTypeRecord } from "@/service/visitortypeservice";
// import { userStorage } from "@/utils/storage";

// // TODO: adjust this import to wherever your actual pass service lives.
// // Assumed to mirror keyService's shape: list/create/update/remove,
// // paginated, filterable by site_guid + status.
// // import { passService } from "@/service/passcreationservices";
// // import type { PassItem, PassStatus } from "@/service/passcreationservices";

// // ---------- constants ----------
// const PASS_STATUS = {
//   ACTIVE: "Active",
//   Assign: "Assigned",
// } as const;

// const PASS_STATUS_OPTIONS = [
//   { label: "Active", value: PASS_STATUS.ACTIVE },
//   { label: "Assign", value: PASS_STATUS.Assigned },
//   { label: "Lost", value: PASS_STATUS.Lost },
// ];

// const PASS_STATUS_VARIANT: Record<PassStatus, BadgeVariant> = {
//   Active: "success",
//   Assign: "danger",
//   Lost: "neutral"
// };



// const PASS_NO_MAX_LENGTH = 50;
// const PASS_PAGE_SIZE = 10;
// const PASS_BULK_UPLOAD_ROUTE = "/property-management/pass/bulk-upload";
// // Must match what the backend sends back in storedUser.permissions[].menu_key
// const PASS_MENU_KEY = "/property-management/pass";

// // ---------- types ----------
// interface SubsiteItem {
//   id?: number;
//   guid: string;
//   site_code?: string;
//   name: string;
// }

// interface StoredUser {
//   is_super_admin?: boolean;
//   site_detail?: SubsiteItem | null;
//   permissions?: {
//     menu_key: string;
//     view: boolean;
//     enabled: boolean;
//     subsites?: SubsiteItem[];
//   }[];
// }

// // Flattened for CrudPage's table/form; site + visitor_type split into
// // guid (form) / name (column) the same way Key does for site.
// interface PassRow {
//   guid: string;
//   pass_no: string;
//   pass_type: string;
//   site: string;
//   site_name: string;
//   visitor_type: string;
//   visitor_type_name: string;
//   status: PassStatus;
// }

// const toRow = (item: PassItem): PassRow => ({
//   guid: item.guid,
//   pass_no: item.pass_no,
//   pass_type: item.pass_type,
//   site: item.site.guid,
//   site_name: item.site.name,
//   visitor_type: item.visitor_type?.guid ?? "",
//   visitor_type_name: item.visitor_type?.name ?? "",
//   status: item.status,
// });

// const buildPayload = (values: Record<string, string>) => ({
//   pass_no: (values.pass_no || "").trim(),
//   pass_type: values.pass_type,
//   site: values.site,
//   visitor_type: values.visitor_type,
//   status: (values.status || PASS_STATUS.ACTIVE) as PassStatus,
// });

// const validatePayload = (payload: ReturnType<typeof buildPayload>): string => {
//   if (!payload.pass_no) return "Pass number is required";
//   if (payload.pass_no.length > PASS_NO_MAX_LENGTH)
//     return `Pass number must be ${PASS_NO_MAX_LENGTH} characters or fewer`;
//   if (!payload.site) return "Select a site";
//   if (!payload.visitor_type) return "Select a visitor type";
//   return "";
// };

// const flattenErrors = (errors?: unknown): string => {
//   if (!errors) return "";

//   if (Array.isArray(errors)) {
//     return errors
//       .map((e, i) => {
//         if (!e) return "";
//         if (typeof e === "string") return e;
//         if (typeof e === "object" && "message" in e) {
//           const { pass_no, message } = e as { pass_no?: string; message: string };
//           return pass_no ? `Pass No ${pass_no}: ${message}` : message;
//         }
//         return Object.keys(e).length ? `Row ${i + 1}: ${flattenErrors(e)}` : "";
//       })
//       .filter(Boolean)
//       .join(" ");
//   }

//   return Object.values(errors as Record<string, string[] | string>)
//     .map((v) => (Array.isArray(v) ? v.join(" ") : String(v)))
//     .join(" ");
// };

// const PassManagement = () => {
//   const navigate = useNavigate();

//   // ----- logged-in user / site scope -----
//   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
//   const isSuperAdmin = storedUser?.is_super_admin === true;
//   const ownSite = storedUser?.site_detail ?? null;
//   const subsiteOptions: SubsiteItem[] =
//     storedUser?.permissions?.find((p) => p.menu_key === PASS_MENU_KEY)?.subsites ?? [];

//   // Every site a non-admin can see/manage (their own site first, then granted subsites)
//   const siteChoices: SubsiteItem[] = ownSite ? [ownSite, ...subsiteOptions] : subsiteOptions;

//   // ----- full site list (super admin only) -----
//   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
//   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);

//   useEffect(() => {
//     if (!isSuperAdmin) return; // non-admins are scoped via siteChoices, no API call needed
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
//   }, [isSuperAdmin]);

//   // Sites offered in the Add/Edit "Site" field: all sites for admins,
//   // own site only for everyone else (same rule as Key).
//   const siteOptions = useMemo(
//     () =>
//       isSuperAdmin
//         ? allSites.map((s) => ({
//             label: `${s.site_name} (${s.site_model.name})`,
//             value: s.guid,
//           }))
//         : ownSite
//         ? [{ label: `${ownSite.name} (My Site)`, value: ownSite.guid }]
//         : [],
//     [isSuperAdmin, allSites, ownSite]
//   );

//   // ----- site filter (narrows the pass list; also drives read-only mode) -----
//   const [siteFilter, setSiteFilter] = useState<string>(isSuperAdmin ? "" : ownSite?.guid ?? "");
//   const selectedSite = siteChoices.find((s) => s.guid === siteFilter);
//   // Read-only only when a non-admin is viewing a subsite that isn't their own.
//   const isReadOnly = !isSuperAdmin && !!selectedSite && selectedSite.guid !== ownSite?.guid;

//   const siteFilterOptions = isSuperAdmin
//     ? [{ label: "All Sites", value: "" }, ...siteOptions]
//     : siteChoices.map((s) => ({
//         label:
//           s.guid === ownSite?.guid
//             ? `${s.name} (My Site)`
//             : `${s.name}${s.site_code ? ` (${s.site_code})` : ""}`,
//         value: s.guid,
//       }));

//   // ----- visitor type dropdown (populated from the visitor type list) -----
//   const [visitorTypes, setVisitorTypes] = useState<VisitorTypeRecord[]>([]);
//   const [isLoadingVisitorTypes, setIsLoadingVisitorTypes] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       setIsLoadingVisitorTypes(true);
//       try {
//         // NOTE: visitorTypeService.list is paginated (list/search style), not a
//         // dedicated dropdown endpoint. A large page_size is used here to pull
//         // "all" active visitor types; swap for a real dropdown endpoint if one
//         // exists, the same way Key uses userService.siteDropdown().
//         const res = await visitorTypeService.list(1, 100, "");
//         if (!cancelled && res.success && res.data) {
//           setVisitorTypes((res.data.results ?? []).filter((v) => v.is_active !== false));
//         }
//       } finally {
//         if (!cancelled) setIsLoadingVisitorTypes(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const visitorTypeOptions = useMemo(
//     () => visitorTypes.map((v) => ({ label: v.name, value: v.guid })),
//     [visitorTypes]
//   );

//   // ----- server-driven list state -----
//   const [rows, setRows] = useState<PassRow[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [listError, setListError] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);

//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [refreshIndex, setRefreshIndex] = useState(0);
//   const refresh = () => setRefreshIndex((n) => n + 1);

//   useEffect(() => {
//     const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
//     return () => clearTimeout(t);
//   }, [search]);

//   useEffect(() => {
//     setPage(1);
//   }, [debouncedSearch, siteFilter, statusFilter]);

//   const loadPasses = useCallback(async () => {
//     setIsLoading(true);
//     setListError("");

//     const res = await passService.list({
//       page,
//       page_size: PASS_PAGE_SIZE,
//       search: debouncedSearch,
//       site_guid: siteFilter || null,
//       status: (statusFilter || "") as PassStatus | "",
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
//       await loadPasses();
//       if (cancelled) return;
//     })();
//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [loadPasses, refreshIndex]);

//   // ----- create -----
//   const handleCreate = async (values: Record<string, string>): Promise<string> => {
//     if (isReadOnly) return "You don't have permission to issue passes for this site.";

//     const payload = buildPayload(values);
//     const validationError = validatePayload(payload);
//     if (validationError) return validationError;

//     const res = await passService.create(payload);
//     if (!res.success) return flattenErrors(res.errors) || res.message;

//     if (page !== 1) setPage(1);
//     else refresh();
//     return "";
//   };

//   // ----- update -----
//   const handleUpdate = async (row: PassRow, values: Record<string, string>): Promise<string> => {
//     if (isReadOnly) return "You don't have permission to edit passes for this site.";

//     const payload = buildPayload(values);
//     const validationError = validatePayload(payload);
//     if (validationError) return validationError;

//     const res = await passService.update({ guid: row.guid, ...payload });
//     if (!res.success) return flattenErrors(res.errors) || res.message;

//     refresh();
//     return "";
//   };

//   // ----- delete -----
//   const handleDelete = async (row: PassRow): Promise<string> => {
//     if (isReadOnly) return "You don't have permission to delete passes for this site.";

//     const res = await passService.remove(row.guid);
//     if (!res.success) return res.message;

//     if (rows.length === 1 && page > 1) setPage(page - 1);
//     else refresh();
//     return "";
//   };

//   // ----- table / form / filter config -----
//   const columns: TableColumn<PassRow>[] = [
//     { key: "pass_no", header: "Pass Number" },
//     { key: "visitor_type_name", header: "Visitor Type" },
//     { key: "site_name", header: "Site" },
//     {
//       key: "status",
//       header: "Status",
//       render: (row) => (
//         <Badge variant={PASS_STATUS_VARIANT[row.status] || "neutral"}>{row.status}</Badge>
//       ),
//     },
//   ];

//   const formFields: FormField[] = useMemo(
//     () => [
//       { name: "pass_no", label: "Pass Number", required: true, placeholder: "e.g. PS-001" },
      
//       {
//         name: "visitor_type",
//         label: "Visitor Type",
//         type: "select",
//         required: true,
//         placeholder: isLoadingVisitorTypes ? "Loading visitor types..." : "Select visitor type",
//         options: visitorTypeOptions,
//         disabled: isLoadingVisitorTypes,
//       },
//       {
//         name: "site",
//         label: "Site",
//         type: "select",
//         required: true,
//         placeholder: isLoadingSites ? "Loading sites..." : "Select site",
//         options: siteOptions,
//         disabled: isLoadingSites,
//       },
//       { name: "status", label: "Status", type: "select", options: PASS_STATUS_OPTIONS },
//     ],
//     [siteOptions, isLoadingSites, visitorTypeOptions, isLoadingVisitorTypes]
//   );

//   const filters: FilterField[] = useMemo(
//     () => [
//       {
//         key: "site",
//         label: "Site",
//         placeholder: isLoadingSites ? "Loading sites..." : "All sites",
//         options: siteFilterOptions,
//       },
//       {
//         key: "status",
//         label: "Status",
//         placeholder: "All statuses",
//         options: PASS_STATUS_OPTIONS,
//       },
//     ],
//     [siteFilterOptions, isLoadingSites]
//   );

//   return (
//     <CrudPage<PassRow>
//       title="Pass"
//       description="Manage access passes issued across all sites."
//       addLabel={isReadOnly ? undefined : "Issue Pass"}
//       keyField="guid"
//       columns={columns}
//       formFields={formFields}
//       searchPlaceholder="Search passes..."
//       extraActions={
//         isReadOnly ? (
//           <span className="text-xs text-slate-500">View only</span>
//         ) : (
//           <Button
//             variant="outline"
//             icon={<Upload size={16} />}
//             onClick={() => navigate(PASS_BULK_UPLOAD_ROUTE)}
//           >
//             Bulk Upload
//           </Button>
//         )
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
//       onCreate={isReadOnly ? undefined : handleCreate}
//       onUpdate={isReadOnly ? undefined : handleUpdate}
//       onDelete={isReadOnly ? undefined : handleDelete}
//       pageSize={PASS_PAGE_SIZE}
//     />
//   );
// };

// export default PassManagement;


import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { CrudPage } from "@/components/common";
import type { FormField, FilterField } from "@/components/common";
import type { TableColumn, BadgeVariant } from "@/types";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { visitorTypeService } from "@/service/visitortypeservice";
import type { VisitorTypeRecord } from "@/service/visitortypeservice";
import { passService } from "@/service/passcreationservices";
import type { PassItem, PassStatus } from "@/service/passcreationservices";
import { userStorage } from "@/utils/storage";

// ---------- constants ----------
const PASS_STATUS = {
  ACTIVE: "Active",
  ASSIGNED: "Assigned",
  LOST: "Lost",
} as const;

const PASS_STATUS_OPTIONS = [
  { label: "Active", value: PASS_STATUS.ACTIVE },
  { label: "Assigned", value: PASS_STATUS.ASSIGNED },
  { label: "Lost", value: PASS_STATUS.LOST },
];

const PASS_STATUS_VARIANT: Record<PassStatus, BadgeVariant> = {
  Active: "success",
  Assigned: "warning",
  Lost: "neutral",
};

const PASS_NO_MAX_LENGTH = 50;
const PASS_NAME_MAX_LENGTH = 150;
const PASS_PAGE_SIZE = 10;
const PASS_BULK_UPLOAD_ROUTE = "/property-management/pass/bulk-upload";
// Must match what the backend sends back in storedUser.permissions[].menu_key
const PASS_MENU_KEY = "/property-management/pass";

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

// Flattened for CrudPage's table/form; site + visitor_type split into
// guid (form) / name (column) the same way Key does for site.
interface PassRow {
  guid: string;
  pass_no: string;
  pass_name: string;
  site: string;
  site_name: string;
  visitor_type: string;
  visitor_type_name: string;
  status: PassStatus;
}

const toRow = (item: PassItem): PassRow => ({
  guid: item.guid,
  pass_no: item.pass_no,
  pass_name: item.pass_name,
  site: item.site.guid,
  site_name: item.site.name,
  visitor_type: item.visitor_type?.guid ?? "",
  visitor_type_name: item.visitor_type?.name ?? "",
  status: item.status,
});

const buildPayload = (values: Record<string, string>) => ({
  pass_no: (values.pass_no || "").trim(),
  pass_name: (values.pass_name || "").trim(),
  site: values.site,
  visitor_type: values.visitor_type,
  status: (values.status || PASS_STATUS.ACTIVE) as PassStatus,
});

const validatePayload = (payload: ReturnType<typeof buildPayload>): string => {
  if (!payload.pass_no) return "Pass number is required";
  if (payload.pass_no.length > PASS_NO_MAX_LENGTH)
    return `Pass number must be ${PASS_NO_MAX_LENGTH} characters or fewer`;
  if (!payload.pass_name) return "Pass name is required";
  if (payload.pass_name.length > PASS_NAME_MAX_LENGTH)
    return `Pass name must be ${PASS_NAME_MAX_LENGTH} characters or fewer`;
  if (!payload.site) return "Select a site";
  if (!payload.visitor_type) return "Select a visitor type";
  return "";
};

const flattenErrors = (errors?: unknown): string => {
  if (!errors) return "";

  if (Array.isArray(errors)) {
    return errors
      .map((e, i) => {
        if (!e) return "";
        if (typeof e === "string") return e;
        if (typeof e === "object" && "message" in e) {
          const { pass_no, message } = e as { pass_no?: string; message: string };
          return pass_no ? `Pass No ${pass_no}: ${message}` : message;
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

const PassManagement = () => {
  const navigate = useNavigate();

  // ----- logged-in user / site scope -----
  const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;
  const subsiteOptions: SubsiteItem[] =
    storedUser?.permissions?.find((p) => p.menu_key === PASS_MENU_KEY)?.subsites ?? [];

  // Every site a non-admin can see/manage (their own site first, then granted subsites)
  const siteChoices: SubsiteItem[] = ownSite ? [ownSite, ...subsiteOptions] : subsiteOptions;

  // ----- full site list (super admin only) -----
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
  // own site only for everyone else (same rule as Key).
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

  // ----- site filter (narrows the pass list; also drives read-only mode) -----
  const [siteFilter, setSiteFilter] = useState<string>(isSuperAdmin ? "" : ownSite?.guid ?? "");
  const selectedSite = siteChoices.find((s) => s.guid === siteFilter);
  // Read-only only when a non-admin is viewing a subsite that isn't their own.
  const isReadOnly = !isSuperAdmin && !!selectedSite && selectedSite.guid !== ownSite?.guid;

  const siteFilterOptions = isSuperAdmin
    ? [{ label: "All Sites", value: "" }, ...siteOptions]
    : siteChoices.map((s) => ({
        label:
          s.guid === ownSite?.guid
            ? `${s.name} (My Site)`
            : `${s.name}${s.site_code ? ` (${s.site_code})` : ""}`,
        value: s.guid,
      }));

  // ----- visitor type dropdown (populated from the visitor type list) -----
  const [visitorTypes, setVisitorTypes] = useState<VisitorTypeRecord[]>([]);
  const [isLoadingVisitorTypes, setIsLoadingVisitorTypes] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoadingVisitorTypes(true);
      try {
        // NOTE: visitorTypeService.list is paginated (list/search style), not a
        // dedicated dropdown endpoint. A large page_size is used here to pull
        // "all" active visitor types; swap for a real dropdown endpoint if one
        // exists, the same way Key uses userService.siteDropdown().
        const res = await visitorTypeService.list(1, 100, "");
        if (!cancelled && res.success && res.data) {
          setVisitorTypes((res.data.results ?? []).filter((v) => v.is_active !== false));
        }
      } finally {
        if (!cancelled) setIsLoadingVisitorTypes(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visitorTypeOptions = useMemo(
    () => visitorTypes.map((v) => ({ label: v.name, value: v.guid })),
    [visitorTypes]
  );

  // ----- server-driven list state -----
  const [rows, setRows] = useState<PassRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visitorTypeFilter, setVisitorTypeFilter] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);
  const refresh = () => setRefreshIndex((n) => n + 1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, siteFilter, statusFilter, visitorTypeFilter]);

  const loadPasses = useCallback(async () => {
    setIsLoading(true);
    setListError("");

    const res = await passService.list({
      page,
      page_size: PASS_PAGE_SIZE,
      search: debouncedSearch,
      site_guid: siteFilter || null,
      status: (statusFilter || "") as PassStatus | "",
      visitor_type_guid: visitorTypeFilter || null,
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
  }, [page, debouncedSearch, siteFilter, statusFilter, visitorTypeFilter]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadPasses();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPasses, refreshIndex]);

  // ----- create -----
  const handleCreate = async (values: Record<string, string>): Promise<string> => {
    if (isReadOnly) return "You don't have permission to issue passes for this site.";

    const payload = buildPayload(values);
    const validationError = validatePayload(payload);
    if (validationError) return validationError;

    const res = await passService.create([payload]);
    if (!res.success) return flattenErrors(res.errors) || res.message;

    if (page !== 1) setPage(1);
    else refresh();
    return "";
  };

  // ----- update -----
  const handleUpdate = async (row: PassRow, values: Record<string, string>): Promise<string> => {
    if (isReadOnly) return "You don't have permission to edit passes for this site.";

    const payload = buildPayload(values);
    const validationError = validatePayload(payload);
    if (validationError) return validationError;

    const res = await passService.update({ guid: row.guid, ...payload });
    if (!res.success) return flattenErrors(res.errors) || res.message;

    refresh();
    return "";
  };

  // ----- delete -----
  const handleDelete = async (row: PassRow): Promise<string> => {
    if (isReadOnly) return "You don't have permission to delete passes for this site.";

    const res = await passService.remove(row.guid);
    if (!res.success) return res.message;

    if (rows.length === 1 && page > 1) setPage(page - 1);
    else refresh();
    return "";
  };

  // ----- table / form / filter config -----
  const columns: TableColumn<PassRow>[] = [
    { key: "pass_no", header: "Pass Number" },
    { key: "pass_name", header: "Pass Name" },
    { key: "visitor_type_name", header: "Visitor Type" },
    { key: "site_name", header: "Site" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={PASS_STATUS_VARIANT[row.status] || "neutral"}>{row.status}</Badge>
      ),
    },
  ];

  const formFields: FormField[] = useMemo(
    () => [
      { name: "pass_no", label: "Pass Number", required: true, placeholder: "e.g. PS-001" },
      { name: "pass_name", label: "Pass Name", required: true, placeholder: "e.g. Visitor Pass" },
      {
        name: "visitor_type",
        label: "Visitor Type",
        type: "select",
        required: true,
        placeholder: isLoadingVisitorTypes ? "Loading visitor types..." : "Select visitor type",
        options: visitorTypeOptions,
        disabled: isLoadingVisitorTypes,
      },
      {
        name: "site",
        label: "Site",
        type: "select",
        required: true,
        placeholder: isLoadingSites ? "Loading sites..." : "Select site",
        options: siteOptions,
        disabled: isLoadingSites,
      },
      { name: "status", label: "Status", type: "select", options: PASS_STATUS_OPTIONS },
    ],
    [siteOptions, isLoadingSites, visitorTypeOptions, isLoadingVisitorTypes]
  );

  const filters: FilterField[] = useMemo(
    () => [
      {
        key: "site",
        label: "Site",
        placeholder: isLoadingSites ? "Loading sites..." : "All sites",
        options: siteFilterOptions,
      },
  //     {
  //       key: "status",
  //       label: "Status",
  //       placeholder: "All statuses",
  //       options: PASS_STATUS_OPTIONS,
  //     },
  //   ],
  //   [siteFilterOptions, isLoadingSites]
  // );
   {
        key: "visitor_type",
        label: "Visitor Type",
        placeholder: isLoadingVisitorTypes ? "Loading visitor types..." : "All visitor types",
        options: visitorTypeOptions,
      },
      {
        key: "status",
        label: "Status",
        placeholder: "All statuses",
        options: PASS_STATUS_OPTIONS,
      },
    ],
    [siteFilterOptions, isLoadingSites, visitorTypeOptions, isLoadingVisitorTypes]
  );

  return (
    <CrudPage<PassRow>
      title="Pass"
      description="Manage access passes issued across all sites."
      addLabel={isReadOnly ? undefined : "Issue Pass"}
      keyField="guid"
      columns={columns}
      formFields={formFields}
      searchPlaceholder="Search passes..."
      extraActions={
        isReadOnly ? (
          <span className="text-xs text-slate-500">View only</span>
        ) : (
          <Button
            variant="outline"
            icon={<Upload size={16} />}
            onClick={() => navigate(PASS_BULK_UPLOAD_ROUTE)}
          >
            Bulk Upload
          </Button>
        )
      }
      filters={filters}
      filterValues={{ site: siteFilter, visitor_type: visitorTypeFilter, status: statusFilter }}
      onFilterChange={(key, value) => {
        if (key === "site") setSiteFilter(value);
        if (key === "visitor_type") setVisitorTypeFilter(value);
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
      pageSize={PASS_PAGE_SIZE}
    />
  );
};

export default PassManagement;