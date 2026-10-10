// // // // import { useState } from "react";
// // // // import { Check, X, Search } from "lucide-react";
// // // // import { Card, PageHeader, Table, Badge, Input, Button, Pagination } from "@/components/ui";
// // // // import type { TableColumn, BadgeVariant } from "@/types";

// // // // interface ApprovalRecord {
// // // //   id: string;
// // // //   requester: string;
// // // //   type: string;
// // // //   site: string;
// // // //   requestedOn: string;
// // // //   status: "Pending" | "Approved" | "Rejected";
// // // // }

// // // // const statusVariant: Record<ApprovalRecord["status"], BadgeVariant> = {
// // // //   Pending: "warning",
// // // //   Approved: "success",
// // // //   Rejected: "danger",
// // // // };

// // // // const seed: ApprovalRecord[] = [
// // // //   { id: "AP-001", requester: "Anita Rao", type: "Visitor Entry", site: "Tower A", requestedOn: "17-09-2026 09:10 AM", status: "Pending" },
// // // //   { id: "AP-002", requester: "ABC Electricals", type: "Contractor Access", site: "Tower C", requestedOn: "17-09-2026 08:45 AM", status: "Pending" },
// // // //   { id: "AP-003", requester: "Sri Logistics", type: "Delivery", site: "Tower D", requestedOn: "17-09-2026 08:30 AM", status: "Approved" },
// // // //   { id: "AP-004", requester: "Karan Mehta", type: "Key Access", site: "Tower A", requestedOn: "16-09-2026 05:20 PM", status: "Rejected" },
// // // //   { id: "AP-005", requester: "Priya Nair", type: "Visitor Entry", site: "Tower B", requestedOn: "16-09-2026 04:10 PM", status: "Pending" },
// // // // ];

// // // // const pageSize = 5;

// // // // const Approval = () => {
// // // //   const [records, setRecords] = useState<ApprovalRecord[]>(seed);
// // // //   const [search, setSearch] = useState("");
// // // //   const [page, setPage] = useState(1);

// // // //   const filtered = records.filter((r) =>
// // // //     Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
// // // //   );
// // // //   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
// // // //   const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

// // // //   const updateStatus = (id: string, status: ApprovalRecord["status"]) => {
// // // //     setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
// // // //   };

// // // //   const columns: TableColumn<ApprovalRecord>[] = [
// // // //     { key: "id", header: "Request ID" },
// // // //     { key: "requester", header: "Requester" },
// // // //     { key: "type", header: "Type" },
// // // //     { key: "site", header: "Site" },
// // // //     { key: "requestedOn", header: "Requested On" },
// // // //     {
// // // //       key: "status",
// // // //       header: "Status",
// // // //       render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
// // // //     },
// // // //     {
// // // //       key: "__actions",
// // // //       header: "Actions",
// // // //       render: (row) =>
// // // //         row.status === "Pending" ? (
// // // //           <div className="flex items-center gap-1.5">
// // // //             <button
// // // //               onClick={() => updateStatus(row.id, "Approved")}
// // // //               className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
// // // //             >
// // // //               <Check size={15} />
// // // //             </button>
// // // //             <button
// // // //               onClick={() => updateStatus(row.id, "Rejected")}
// // // //               className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
// // // //             >
// // // //               <X size={15} />
// // // //             </button>
// // // //           </div>
// // // //         ) : (
// // // //           <span className="text-xs text-slate-400">No action</span>
// // // //         ),
// // // //       width: "110px",
// // // //     },
// // // //   ];

// // // //   return (
// // // //     <div>
// // // //       <PageHeader
// // // //         title="Approval"
// // // //         description="Review and action pending visitor, contractor and access requests."
// // // //         actions={
// // // //           <Button variant="outline" size="sm">
// // // //             Export
// // // //           </Button>
// // // //         }
// // // //       />

// // // //       <Card noPadding>
// // // //         <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
// // // //           <div className="max-w-xs w-full">
// // // //             <Input
// // // //               placeholder="Search requests..."
// // // //               icon={<Search size={15} />}
// // // //               value={search}
// // // //               onChange={(e) => {
// // // //                 setSearch(e.target.value);
// // // //                 setPage(1);
// // // //               }}
// // // //             />
// // // //           </div>
// // // //           <div className="flex items-center gap-2">
// // // //             <Badge variant="warning">
// // // //               {records.filter((r) => r.status === "Pending").length} Pending
// // // //             </Badge>
// // // //           </div>
// // // //         </div>
// // // //         <div className="p-4 sm:p-5">
// // // //           <Table columns={columns} data={pageData} keyField="id" />
// // // //           <Pagination
// // // //             currentPage={page}
// // // //             totalPages={totalPages}
// // // //             onPageChange={setPage}
// // // //             totalRecords={filtered.length}
// // // //             pageSize={pageSize}
// // // //           />
// // // //         </div>
// // // //       </Card>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Approval;


///////////////////////////////////////////////////////////// correct code start ////////////////////////////////////

// import { useEffect, useState } from "react";
// import { Check, X, Search, AlertCircle } from "lucide-react";
// import { Card, PageHeader, Table, Badge, Input, Button, Pagination, Modal } from "@/components/ui";
// import type { TableColumn, BadgeVariant } from "@/types";
// import { userService } from "@/service/usercreationservices";
// import type { SiteDropdownItem } from "@/service/usercreationservices";
// import { visitorTypeService } from "@/service/visitortypeservice";
// import { approvalService } from "../../service/approvalservices";
// import type { ApprovalHistoryRecord, ApprovalRecord } from "../../service/approvalservices";
// import { apiErrorMessage } from "@/service/visitorservices";
// import { userStorage } from "@/utils/storage";

// const APPROVAL_MENU_KEY = "/approval"; // must match the backend APPROVAL_MENU_KEY
// const PAGE_SIZE = 10;

// interface SiteOption {
//   label: string;
//   value: string; // guid
// }

// interface SiteItem {
//   id?: number;
//   guid: string;
//   site_code?: string;
//   name: string;
// }

// interface StoredUser {
//   is_super_admin?: boolean;
//   site_detail?: SiteItem | null;
//   permissions?: {
//     menu_key: string;
//     view: boolean;
//     enabled: boolean;
//     subsites?: SiteItem[];
//   }[];
// }

// const statusVariant: Record<string, BadgeVariant> = {
//   Pending: "warning",
//   Approved: "success",
//   Rejected: "danger",
// };

// type Tab = "pending" | "history";

// const DECISION_OPTIONS: SiteOption[] = [
//   { label: "Approved & Rejected", value: "" },
//   { label: "Approved", value: "Approved" },
//   { label: "Rejected", value: "Rejected" },
// ];

// const fieldClass =
//   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// // YYYY-MM-DD -> dd-mm-yyyy
// const fmtDate = (value?: string | null) => {
//   if (!value) return "—";
//   const [yyyy, mm, dd] = value.slice(0, 10).split("-");
//   return yyyy && mm && dd ? `${dd}-${mm}-${yyyy}` : value;
// };

// // HH:MM:SS -> hh:mm AM/PM
// const fmtTime = (value?: string | null) => {
//   if (!value) return "";
//   const [h, m] = value.split(":");
//   const hour = Number(h);
//   if (Number.isNaN(hour)) return value;
//   return `${String(hour % 12 || 12).padStart(2, "0")}:${m} ${hour >= 12 ? "PM" : "AM"}`;
// };

// // ISO datetime -> dd-mm-yyyy hh:mm AM/PM
// const fmtDateTime = (value?: string | null) => {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const hour = d.getHours();
//   const min = String(d.getMinutes()).padStart(2, "0");
//   return `${dd}-${mm}-${d.getFullYear()} ${String(hour % 12 || 12).padStart(2, "0")}:${min} ${
//     hour >= 12 ? "PM" : "AM"
//   }`;
// };

// const fmtPeriod = (row: ApprovalRecord) => {
//   const from = `${fmtDate(row.from_date)}${row.from_time ? ` ${fmtTime(row.from_time)}` : ""}`;
//   const to = `${fmtDate(row.to_date)}${row.to_time ? ` ${fmtTime(row.to_time)}` : ""}`;
//   return `${from} to ${to}`;
// };

// const Approval = () => {
//   const [tab, setTab] = useState<Tab>("pending");
//   const [records, setRecords] = useState<ApprovalHistoryRecord[]>([]);
//   const [historyCounts, setHistoryCounts] = useState({ approved: 0, rejected: 0 });
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [pendingCount, setPendingCount] = useState(0);
//   const [isLoadingList, setIsLoadingList] = useState(false);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const [loadError, setLoadError] = useState("");
//   const [actionError, setActionError] = useState("");

//   // filters
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState(""); // visitor type guid
//   const [decisionFilter, setDecisionFilter] = useState(""); // history tab only
//   // Pending tab: visit period. History tab: day approved / rejected.
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [page, setPage] = useState(1);

//   // approve / reject in progress
//   const [actingGuid, setActingGuid] = useState<string | null>(null);
//   const [rejectTarget, setRejectTarget] = useState<ApprovalRecord | null>(null);
//   const [rejectReason, setRejectReason] = useState("");
//   const [rejectError, setRejectError] = useState("");

//   // ---------- logged-in user (admin vs my-site) ----------
//   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
//   const isSuperAdmin = storedUser?.is_super_admin === true;
//   const ownSite = storedUser?.site_detail ?? null;
//   // const subsiteOptions: SiteItem[] =
//   //   storedUser?.permissions?.find((p) => p.menu_key === APPROVAL_MENU_KEY)?.subsites ?? [];

//    const approvalPermission = storedUser?.permissions?.find(
//     (p) => p.menu_key === APPROVAL_MENU_KEY
//   );

//   // subsites appear in the dropdown only when view = true
//   const subsiteOptions: SiteItem[] = approvalPermission?.view
//     ? approvalPermission.subsites ?? []
//     : [];

//   // ----- sites: only super admin calls the API; everyone else uses their own -----
//   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
//   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
//   const [siteError, setSiteError] = useState("");

//   useEffect(() => {
//     if (!isSuperAdmin) return;
//     let cancelled = false;

//     (async () => {
//       try {
//         const res = await userService.siteDropdown();
//         if (cancelled) return;
//         if (res.success && res.data) setAllSites(res.data.results ?? []);
//         else setSiteError(res.message || "Could not load sites.");
//       } catch {
//         if (!cancelled) setSiteError("Could not load sites. Please try again.");
//       } finally {
//         if (!cancelled) setIsLoadingSites(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [isSuperAdmin]);

//   const siteChoices: SiteItem[] = isSuperAdmin
//     ? allSites.map((s) => ({ guid: s.guid, name: s.site_name }))
//     : ownSite
//     ? [ownSite, ...subsiteOptions]
//     : [];

//   // "" = All Sites (super admin only)
//   const [siteFilter, setSiteFilter] = useState<string>(isSuperAdmin ? "" : ownSite?.guid ?? "");

//     // non-admin viewing a site other than their own = read-only
//   const isReadOnlySite =
//     !isSuperAdmin && !!siteFilter && siteFilter !== ownSite?.guid;

//   const siteFilterOptions: SiteOption[] = isSuperAdmin
//     ? [
//         { label: "All Sites", value: "" },
//         ...siteChoices.map((s) => ({ label: s.name, value: s.guid })),
//       ]
//     // : siteChoices.map((s) => ({
//     //     label:
//     //       s.guid === ownSite?.guid
//     //         ? `${s.name} (My Site)`
//     //         : `${s.name}${s.site_code ? ` (${s.site_code})` : ""}`,
//     //     value: s.guid,
//     //   }));

//     : siteChoices.map((s) => ({
//         label:
//           s.guid === ownSite?.guid
//             ? `${s.name} (Primary)`
//             : `${s.name} (Other)`,
//         value: s.guid,
//       }));
//   // ----- visitor types -----
//   const [visitorTypes, setVisitorTypes] = useState<SiteOption[]>([]);
//   const [isLoadingTypes, setIsLoadingTypes] = useState(true);

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       try {
//         const res = await visitorTypeService.list(1, 100, "");
//         if (cancelled) return;
//         if (res.success && res.data) {
//           setVisitorTypes(
//             res.data.results
//               .filter((t) => t.is_active)
//               .map((t) => ({ label: t.name, value: t.guid }))
//           );
//         } else {
//           setSiteError(res.message || "Could not load visitor types.");
//         }
//       } catch {
//         if (!cancelled) setSiteError("Could not load visitor types. Please try again.");
//       } finally {
//         if (!cancelled) setIsLoadingTypes(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const typeFilterOptions: SiteOption[] = [
//     { label: "All Visitor Types", value: "" },
//     ...visitorTypes,
//   ];

//   // ----- debounce the search box -----
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(t);
//   }, [search]);

//   // ----- load the active tab from the API (site wise) -----
//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       setIsLoadingList(true);
//       setLoadError("");
//       try {
//         if (tab === "pending") {
//           const res = await approvalService.list({
//             page,
//             page_size: PAGE_SIZE,
//             search: debouncedSearch,
//             site_guid: siteFilter || null,
//             visitor_type_guid: typeFilter || null,
//             from_date: fromDate || null,
//             to_date: toDate || null,
//           });
//           if (cancelled) return;

//           if (res.success && res.data) {
//             setRecords(res.data.results as ApprovalHistoryRecord[]);
//             setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
//             setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
//             setPendingCount(res.data.summary?.pending ?? 0);
//           } else {
//             setLoadError(res.message || "Could not load approval requests.");
//           }
//         } else {
//           const res = await approvalService.history({
//             page,
//             page_size: PAGE_SIZE,
//             search: debouncedSearch,
//             site_guid: siteFilter || null,
//             visitor_type_guid: typeFilter || null,
//             decision: decisionFilter,
//             decided_from: fromDate || null,
//             decided_to: toDate || null,
//           });
//           if (cancelled) return;

//           if (res.success && res.data) {
//             setRecords(res.data.results);
//             setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
//             setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
//             setPendingCount(res.data.summary?.pending ?? 0);
//             setHistoryCounts({
//               approved: res.data.summary?.approved ?? 0,
//               rejected: res.data.summary?.rejected ?? 0,
//             });
//           } else {
//             setLoadError(res.message || "Could not load approval history.");
//           }
//         }
//       } catch (err) {
//         if (!cancelled) setLoadError(apiErrorMessage(err, "Could not load the list."));
//       } finally {
//         if (!cancelled) setIsLoadingList(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [tab, page, debouncedSearch, siteFilter, typeFilter, decisionFilter, fromDate, toDate, refreshKey]);

//   // Switching tabs: date filters mean different things, so start clean.
//   const switchTab = (next: Tab) => {
//     if (next === tab) return;
//     setTab(next);
//     setRecords([]);
//     setFromDate("");
//     setToDate("");
//     setDecisionFilter("");
//     setActionError("");
//     setPage(1);
//   };

//   // ----- approve / reject -----
//   const handleApprove = async (row: ApprovalRecord) => {
//     setActingGuid(row.guid);
//     setActionError("");
//     try {
//       const res = await approvalService.act(row.guid, "APPROVE");
//       if (res.success) setRefreshKey((k) => k + 1);
//       else setActionError(res.message || "Could not approve this request.");
//     } catch (err) {
//       setActionError(apiErrorMessage(err, "Could not approve this request."));
//     } finally {
//       setActingGuid(null);
//     }
//   };

//   const openReject = (row: ApprovalRecord) => {
//     setRejectTarget(row);
//     setRejectReason("");
//     setRejectError("");
//   };

//   const closeReject = () => {
//     if (actingGuid) return;
//     setRejectTarget(null);
//     setRejectReason("");
//     setRejectError("");
//   };

//   const handleReject = async () => {
//     if (!rejectTarget) return;
//     if (!rejectReason.trim()) {
//       setRejectError("Please enter a reason for rejecting.");
//       return;
//     }
//     setActingGuid(rejectTarget.guid);
//     setRejectError("");
//     try {
//       const res = await approvalService.act(rejectTarget.guid, "REJECT", rejectReason.trim());
//       if (res.success) {
//         setRejectTarget(null);
//         setRejectReason("");
//         setRefreshKey((k) => k + 1);
//       } else {
//         setRejectError(res.message || "Could not reject this request.");
//       }
//     } catch (err) {
//       setRejectError(apiErrorMessage(err, "Could not reject this request."));
//     } finally {
//       setActingGuid(null);
//     }
//   };

//   // ----- filter handlers -----
//   const handleFromDateChange = (value: string) => {
//     setFromDate(value);
//     if (value && toDate && toDate < value) setToDate(value);
//     setPage(1);
//   };

//   const handleToDateChange = (value: string) => {
//     setToDate(value);
//     if (value && fromDate && value < fromDate) setFromDate(value);
//     setPage(1);
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setDebouncedSearch("");
//     setSiteFilter(isSuperAdmin ? "" : ownSite?.guid ?? "");
//     setTypeFilter("");
//     setDecisionFilter("");
//     setFromDate("");
//     setToDate("");
//     setPage(1);
//   };

//   const baseColumns: TableColumn<ApprovalHistoryRecord>[] = [
//     {
//       key: "person",
//       header: "Visitor",
//       render: (row) => (
//         <div>
//           <div className="font-medium text-slate-700">{row.person.person_name}</div>
//           <div className="text-xs text-slate-500">
//             {row.person.identity_type} · {row.person.identity_number}
//           </div>
//         </div>
//       ),
//     },
//     {
//       key: "visitor_type",
//       header: "Visitor Type",
//       render: (row) => row.visitor_type?.name ?? row.kind,
//     },
//     {
//       key: "company",
//       header: "Company",
//       render: (row) => row.company || "—",
//     },
//     {
//       key: "location",
//       header: "Location",
//       render: (row) => row.location?.name ?? "—",
//     },
//     {
//       key: "site",
//       header: "Site",
//       render: (row) => row.site.name,
//     },
//     {
//       key: "period",
//       header: "Visit Period",
//       render: (row) => fmtPeriod(row),
//     },
//     {
//       key: "requester_email",
//       header: "Requested By",
//       render: (row) => row.requester_email || "—",
//     },
//     {
//       key: "created_at",
//       header: "Requested On",
//       render: (row) => fmtDateTime(row.created_at),
//     },
//   ];

//   const pendingColumns: TableColumn<ApprovalHistoryRecord>[] = [
//     ...baseColumns,
//     {
//       key: "__actions",
//       header: "Actions",
//       render: (row) =>
//         row.can_act ? (
//           <div className="flex items-center gap-1.5">
//             <button
//               onClick={() => handleApprove(row)}
//               disabled={actingGuid === row.guid}
//               className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
//               aria-label="Approve"
//             >
//               <Check size={15} />
//             </button>
//             <button
//               onClick={() => openReject(row)}
//               disabled={actingGuid === row.guid}
//               className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
//               aria-label="Reject"
//             >
//               <X size={15} />
//             </button>
//           </div>
//         ) : (
//           <span className="text-xs text-slate-400">No action</span>
//         ),
//       width: "110px",
//     },
//   ];

//   const historyColumns: TableColumn<ApprovalHistoryRecord>[] = [
//     ...baseColumns,
//     {
//       key: "status",
//       header: "Decision",
//       render: (row) => (
//         <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>
//       ),
//     },
//     {
//       key: "approved_by",
//       header: "Decided By",
//       render: (row) => row.approved_by_name || row.approved_by || "—",
//     },
//     {
//       key: "approved_at",
//       header: "Decided On",
//       render: (row) => fmtDateTime(row.approved_at),
//     },
//     {
//       key: "decision_remark",
//       header: "Reason",
//       render: (row) => row.decision_remark || "—",
//     },
//   ];

//   // const columns = tab === "pending" ? pendingColumns : historyColumns;

//     const visiblePendingColumns = isReadOnlySite
//     ? pendingColumns.filter((c) => c.key !== "__actions")
//     : pendingColumns;

//   const columns = tab === "pending" ? visiblePendingColumns : historyColumns;
  
//   const errorMessage = siteError || loadError || actionError;

//   return (
//     <div>
//       <PageHeader
//         title="Approval"
//         description="Approve or reject pre-registration requests of your site, and review past decisions in History."
//       />

//       {errorMessage && (
//         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
//           <AlertCircle size={16} />
//           {errorMessage}
//         </div>
//       )}

//       <div className="flex gap-1 border-b border-slate-200 mb-4" role="tablist">
//         {(
//           [
//             { key: "pending", label: `Pending (${pendingCount})` },
//             { key: "history", label: "History" },
//           ] as { key: Tab; label: string }[]
//         ).map((t) => (
//           <button
//             key={t.key}
//             role="tab"
//             aria-selected={tab === t.key}
//             onClick={() => switchTab(t.key)}
//             className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${
//               tab === t.key
//                 ? "border-primary-600 text-primary-700"
//                 : "border-transparent text-slate-500 hover:text-slate-700"
//             }`}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       <Card noPadding>
//         <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-end gap-3">
//           <div className="w-full sm:w-72">
//             <Input
//               placeholder="Search name, identity no, contact, location, company..."
//               icon={<Search size={15} />}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           {siteFilterOptions.length > 0 && (
//             <select
//               value={siteFilter}
//               onChange={(e) => {
//                 setSiteFilter(e.target.value);
//                 setPage(1);
//               }}
//               disabled={isLoadingSites}
//               className={`${fieldClass} max-w-[12rem]`}
//               aria-label="Filter by site"
//             >
//               {siteFilterOptions.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//           )}

//           <select
//             value={typeFilter}
//             onChange={(e) => {
//               setTypeFilter(e.target.value);
//               setPage(1);
//             }}
//             disabled={isLoadingTypes}
//             className={`${fieldClass} max-w-[12rem]`}
//             aria-label="Filter by visitor type"
//           >
//             {typeFilterOptions.map((o) => (
//               <option key={o.value} value={o.value}>
//                 {o.label}
//               </option>
//             ))}
//           </select>

//           {tab === "history" && (
//             <select
//               value={decisionFilter}
//               onChange={(e) => {
//                 setDecisionFilter(e.target.value);
//                 setPage(1);
//               }}
//               className={`${fieldClass} max-w-[12rem]`}
//               aria-label="Filter by decision"
//             >
//               {DECISION_OPTIONS.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//           )}

//           <label className="text-xs text-slate-500">
//             {tab === "pending" ? "Visit from" : "Decided from"}
//             <input
//               type="date"
//               value={fromDate}
//               max={toDate || undefined}
//               onChange={(e) => handleFromDateChange(e.target.value)}
//               className={`${fieldClass} mt-1`}
//             />
//           </label>

//           <label className="text-xs text-slate-500">
//             {tab === "pending" ? "Visit to" : "Decided to"}
//             <input
//               type="date"
//               value={toDate}
//               min={fromDate || undefined}
//               onChange={(e) => handleToDateChange(e.target.value)}
//               className={`${fieldClass} mt-1`}
//             />
//           </label>

//           <Button variant="outline" onClick={clearFilters}>
//             Clear
//           </Button>

//           <div className="ml-auto flex items-center gap-2">
//             {tab === "pending" ? (
//               <Badge variant="warning">{pendingCount} Pending</Badge>
//             ) : (
//               <>
//                 <Badge variant="success">{historyCounts.approved} Approved</Badge>
//                 <Badge variant="danger">{historyCounts.rejected} Rejected</Badge>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="p-4 sm:p-5">
//           {isLoadingList && records.length === 0 ? (
//             <p className="text-sm text-slate-500 py-6 text-center">Loading...</p>
//           ) : (
//             <Table columns={columns} data={records} keyField="guid" />
//           )}
//           <Pagination
//             currentPage={page}
//             totalPages={totalPages}
//             onPageChange={setPage}
//             totalRecords={totalRecords}
//             pageSize={PAGE_SIZE}
//           />
//         </div>
//       </Card>

//       <Modal
//         isOpen={!!rejectTarget}
//         onClose={closeReject}
//         title="Reject request"
//         footer={
//           <>
//             <Button variant="outline" onClick={closeReject}>
//               Cancel
//             </Button>
//             <Button onClick={handleReject} disabled={!!actingGuid || !rejectReason.trim()}>
//               {actingGuid ? "Rejecting..." : "Reject"}
//             </Button>
//           </>
//         }
//       >
//         <div className="space-y-4">
//           <p className="text-sm text-slate-600">
//             Rejecting the request for{" "}
//             <span className="font-medium">{rejectTarget?.person.person_name}</span>. The
//             requester will see this reason.
//           </p>
//           <Input
//             label="Reason"
//             type="textarea"
//             placeholder="Why is this request being rejected?"
//             required
//             value={rejectReason}
//             onChange={(e) => setRejectReason(e.target.value)}
//           />
//           {rejectError && (
//             <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
//               <AlertCircle size={16} />
//               {rejectError}
//             </div>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Approval;



///////////////////////////////////////////////////////////// correct code end ////////////////////////////////////



import { useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  Search,
  AlertCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Card, PageHeader, Table, Badge, Input, Button, Pagination, Modal } from "@/components/ui";
import type { TableColumn, BadgeVariant } from "@/types";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { visitorTypeService } from "@/service/visitortypeservice";
import { approvalService } from "../../service/approvalservices";
import type { ApprovalHistoryRecord, ApprovalRecord } from "../../service/approvalservices";
import { apiErrorMessage } from "@/service/visitorservices";
import { userStorage } from "@/utils/storage";

const APPROVAL_MENU_KEY = "/approval"; // must match the backend APPROVAL_MENU_KEY
const PAGE_SIZE = 10;

interface SiteOption {
  label: string;
  value: string; // guid
}

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

// A record as returned by the API (bulk_id is set for bulk uploads)
type ApprovalItem = ApprovalHistoryRecord & { bulk_id?: string | null };

// A table row: normal record, bulk group header, or a visitor inside an expanded bulk
type DisplayRow = ApprovalItem & {
  rowKey: string;
  group?: { bulkId: string; items: ApprovalItem[] };
  isChild?: boolean;
};

type RejectTarget =
  | { type: "single"; record: ApprovalRecord }
  | { type: "bulk"; bulkId: string; items: ApprovalItem[] };

const statusVariant: Record<string, BadgeVariant> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

type Tab = "pending" | "history";

const DECISION_OPTIONS: SiteOption[] = [
  { label: "Approved & Rejected", value: "" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// YYYY-MM-DD -> dd-mm-yyyy
const fmtDate = (value?: string | null) => {
  if (!value) return "—";
  const [yyyy, mm, dd] = value.slice(0, 10).split("-");
  return yyyy && mm && dd ? `${dd}-${mm}-${yyyy}` : value;
};

// HH:MM:SS -> hh:mm AM/PM
const fmtTime = (value?: string | null) => {
  if (!value) return "";
  const [h, m] = value.split(":");
  const hour = Number(h);
  if (Number.isNaN(hour)) return value;
  return `${String(hour % 12 || 12).padStart(2, "0")}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

// ISO datetime -> dd-mm-yyyy hh:mm AM/PM
const fmtDateTime = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hour = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()} ${String(hour % 12 || 12).padStart(2, "0")}:${min} ${
    hour >= 12 ? "PM" : "AM"
  }`;
};

const fmtPeriod = (row: ApprovalRecord) => {
  const from = `${fmtDate(row.from_date)}${row.from_time ? ` ${fmtTime(row.from_time)}` : ""}`;
  const to = `${fmtDate(row.to_date)}${row.to_time ? ` ${fmtTime(row.to_time)}` : ""}`;
  return `${from} to ${to}`;
};

const Approval = () => {
  const [tab, setTab] = useState<Tab>("pending");
  const [records, setRecords] = useState<ApprovalItem[]>([]);
  const [historyCounts, setHistoryCounts] = useState({ approved: 0, rejected: 0 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");

  // filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(""); // visitor type guid
  const [decisionFilter, setDecisionFilter] = useState(""); // history tab only
  // Pending tab: visit period. History tab: day approved / rejected.
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  // approve / reject in progress (record guid, or "bulk-<id>" for a whole bulk)
  const [actingGuid, setActingGuid] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  // which bulk groups are expanded
  const [expandedBulks, setExpandedBulks] = useState<Set<string>>(new Set());

  const toggleBulk = (bulkId: string) =>
    setExpandedBulks((prev) => {
      const next = new Set(prev);
      if (next.has(bulkId)) next.delete(bulkId);
      else next.add(bulkId);
      return next;
    });

  // ---------- logged-in user (admin vs my-site) ----------
  const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;
  // const subsiteOptions: SiteItem[] =
  //   storedUser?.permissions?.find((p) => p.menu_key === APPROVAL_MENU_KEY)?.subsites ?? [];

   const approvalPermission = storedUser?.permissions?.find(
    (p) => p.menu_key === APPROVAL_MENU_KEY
  );

  // subsites appear in the dropdown only when view = true
  const subsiteOptions: SiteItem[] = approvalPermission?.view
    ? approvalPermission.subsites ?? []
    : [];

  // ----- sites: only super admin calls the API; everyone else uses their own -----
  const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
  const [siteError, setSiteError] = useState("");

  useEffect(() => {
    if (!isSuperAdmin) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await userService.siteDropdown();
        if (cancelled) return;
        if (res.success && res.data) setAllSites(res.data.results ?? []);
        else setSiteError(res.message || "Could not load sites.");
      } catch {
        if (!cancelled) setSiteError("Could not load sites. Please try again.");
      } finally {
        if (!cancelled) setIsLoadingSites(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin]);

  const siteChoices: SiteItem[] = isSuperAdmin
    ? allSites.map((s) => ({ guid: s.guid, name: s.site_name }))
    : ownSite
    ? [ownSite, ...subsiteOptions]
    : [];

  // "" = All Sites (super admin only)
  const [siteFilter, setSiteFilter] = useState<string>(isSuperAdmin ? "" : ownSite?.guid ?? "");

    // non-admin viewing a site other than their own = read-only
  const isReadOnlySite =
    !isSuperAdmin && !!siteFilter && siteFilter !== ownSite?.guid;

  const siteFilterOptions: SiteOption[] = isSuperAdmin
    ? [
        { label: "All Sites", value: "" },
        ...siteChoices.map((s) => ({ label: s.name, value: s.guid })),
      ]
    // : siteChoices.map((s) => ({
    //     label:
    //       s.guid === ownSite?.guid
    //         ? `${s.name} (My Site)`
    //         : `${s.name}${s.site_code ? ` (${s.site_code})` : ""}`,
    //     value: s.guid,
    //   }));

    : siteChoices.map((s) => ({
        label:
          s.guid === ownSite?.guid
            ? `${s.name} (Primary)`
            : `${s.name} (Other)`,
        value: s.guid,
      }));
  // ----- visitor types -----
  const [visitorTypes, setVisitorTypes] = useState<SiteOption[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await visitorTypeService.list(1, 100, "");
        if (cancelled) return;
        if (res.success && res.data) {
          setVisitorTypes(
            res.data.results
              .filter((t) => t.is_active)
              .map((t) => ({ label: t.name, value: t.guid }))
          );
        } else {
          setSiteError(res.message || "Could not load visitor types.");
        }
      } catch {
        if (!cancelled) setSiteError("Could not load visitor types. Please try again.");
      } finally {
        if (!cancelled) setIsLoadingTypes(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const typeFilterOptions: SiteOption[] = [
    { label: "All Visitor Types", value: "" },
    ...visitorTypes,
  ];

  // ----- debounce the search box -----
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // ----- load the active tab from the API (site wise) -----
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoadingList(true);
      setLoadError("");
      try {
        if (tab === "pending") {
          const res = await approvalService.list({
            page,
            page_size: PAGE_SIZE,
            search: debouncedSearch,
            site_guid: siteFilter || null,
            visitor_type_guid: typeFilter || null,
            from_date: fromDate || null,
            to_date: toDate || null,
          });
          if (cancelled) return;

          if (res.success && res.data) {
            setRecords(res.data.results as ApprovalItem[]);
            setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
            setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
            setPendingCount(res.data.summary?.pending ?? 0);
          } else {
            setLoadError(res.message || "Could not load approval requests.");
          }
        } else {
          const res = await approvalService.history({
            page,
            page_size: PAGE_SIZE,
            search: debouncedSearch,
            site_guid: siteFilter || null,
            visitor_type_guid: typeFilter || null,
            decision: decisionFilter,
            decided_from: fromDate || null,
            decided_to: toDate || null,
          });
          if (cancelled) return;

          if (res.success && res.data) {
            setRecords(res.data.results as ApprovalItem[]);
            setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
            setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
            setPendingCount(res.data.summary?.pending ?? 0);
            setHistoryCounts({
              approved: res.data.summary?.approved ?? 0,
              rejected: res.data.summary?.rejected ?? 0,
            });
          } else {
            setLoadError(res.message || "Could not load approval history.");
          }
        }
      } catch (err) {
        if (!cancelled) setLoadError(apiErrorMessage(err, "Could not load the list."));
      } finally {
        if (!cancelled) setIsLoadingList(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tab, page, debouncedSearch, siteFilter, typeFilter, decisionFilter, fromDate, toDate, refreshKey]);

  // Switching tabs: date filters mean different things, so start clean.
  const switchTab = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    setRecords([]);
    setFromDate("");
    setToDate("");
    setDecisionFilter("");
    setActionError("");
    setPage(1);
  };

  // ----- approve / reject -----
  const handleApprove = async (row: ApprovalRecord) => {
    setActingGuid(row.guid);
    setActionError("");
    try {
      const res = await approvalService.act(row.guid, "APPROVE");
      if (res.success) setRefreshKey((k) => k + 1);
      else setActionError(res.message || "Could not approve this request.");
    } catch (err) {
      setActionError(apiErrorMessage(err, "Could not approve this request."));
    } finally {
      setActingGuid(null);
    }
  };

  // Approve every actionable visitor of a bulk
  // const handleApproveBulk = async (bulkId: string, items: ApprovalItem[]) => {
  //   setActingGuid(`bulk-${bulkId}`);
  //   setActionError("");
  //   try {
  //     const targets = items.filter((i) => i.can_act);
  //     const results = await Promise.all(targets.map((i) => approvalService.act(i.guid, "APPROVE")));
  //     const failed = results.filter((r) => !r.success).length;
  //     if (failed) {
  //       setActionError(`${failed} of ${results.length} requests could not be approved.`);
  //     }
  //     setRefreshKey((k) => k + 1);
  //   } catch (err) {
  //     setActionError(apiErrorMessage(err, "Could not approve this bulk."));
  //     setRefreshKey((k) => k + 1);
  //   } finally {
  //     setActingGuid(null);
  //   }
  // };

    const handleApproveBulk = async (bulkId: string) => {
    setActingGuid(`bulk-${bulkId}`);
    setActionError("");
    try {
      const res = await approvalService.actBulk(bulkId, "APPROVE");
      if (!res.success) {
        setActionError(res.message || "Could not approve this bulk.");
      } else if (res.data?.skipped.length) {
        setActionError(
          `${res.data.processed} approved, ${res.data.skipped.length} skipped: ` +
            res.data.skipped.map((s) => `${s.person_name} (${s.reason})`).join(", ")
        );
      }
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setActionError(apiErrorMessage(err, "Could not approve this bulk."));
      setRefreshKey((k) => k + 1);
    } finally {
      setActingGuid(null);
    }
  };

  const openReject = (target: RejectTarget) => {
    setRejectTarget(target);
    setRejectReason("");
    setRejectError("");
  };

  const closeReject = () => {
    if (actingGuid) return;
    setRejectTarget(null);
    setRejectReason("");
    setRejectError("");
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    const reason = rejectReason.trim();
    if (!reason) {
      setRejectError("Please enter a reason for rejecting.");
      return;
    }
    setActingGuid(
      rejectTarget.type === "bulk" ? `bulk-${rejectTarget.bulkId}` : rejectTarget.record.guid
    );
    setRejectError("");
    try {
      if (rejectTarget.type === "single") {
        const res = await approvalService.act(rejectTarget.record.guid, "REJECT", reason);
        if (!res.success) {
          setRejectError(res.message || "Could not reject this request.");
          return;
        }
      // } else {
      //   const targets = rejectTarget.items.filter((i) => i.can_act);
      //   const results = await Promise.all(
      //     targets.map((i) => approvalService.act(i.guid, "REJECT", reason))
      //   );
      //   const failed = results.filter((r) => !r.success).length;
      //   if (failed) {
      //     setRejectError(`${failed} of ${results.length} requests could not be rejected.`);
      //     setRefreshKey((k) => k + 1);
      //     return;
      //   }
      // }
            } else {
        const res = await approvalService.actBulk(rejectTarget.bulkId, "REJECT", reason);
        if (!res.success) {
          setRejectError(res.message || "Could not reject this bulk.");
          return;
        }
        if (res.data?.skipped.length) {
          setActionError(
            `${res.data.processed} rejected, ${res.data.skipped.length} skipped.`
          );
        }
      }
      setRejectTarget(null);
      setRejectReason("");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setRejectError(apiErrorMessage(err, "Could not reject this request."));
    } finally {
      setActingGuid(null);
    }
  };

  // ----- filter handlers -----
  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    if (value && toDate && toDate < value) setToDate(value);
    setPage(1);
  };

  const handleToDateChange = (value: string) => {
    setToDate(value);
    if (value && fromDate && value < fromDate) setFromDate(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSiteFilter(isSuperAdmin ? "" : ownSite?.guid ?? "");
    setTypeFilter("");
    setDecisionFilter("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  // ---------- grouped rows (bulk records collapse into one row) ----------
  const displayRows: DisplayRow[] = useMemo(() => {
    const rows: DisplayRow[] = [];
    const seen = new Set<string>();

    for (const r of records) {
      if (!r.bulk_id) {
        rows.push({ ...r, rowKey: r.guid });
        continue;
      }
      if (seen.has(r.bulk_id)) continue;
      seen.add(r.bulk_id);

      const items = records.filter((x) => x.bulk_id === r.bulk_id);
      rows.push({ ...r, rowKey: `bulk-${r.bulk_id}`, group: { bulkId: r.bulk_id, items } });

      if (expandedBulks.has(r.bulk_id)) {
        items.forEach((i) => rows.push({ ...i, rowKey: i.guid, isChild: true }));
      }
    }
    return rows;
  }, [records, expandedBulks]);

  const baseColumns: TableColumn<DisplayRow>[] = [
    {
      key: "person",
      header: "Visitor",
      render: (row) =>
        row.group ? (
          <button
            onClick={() => toggleBulk(row.group!.bulkId)}
            className="flex items-center gap-1.5 font-medium text-primary-700"
          >
            {/* marker used by the table wrapper to highlight this row */}
            <span data-bulk-row className="hidden" />
            {expandedBulks.has(row.group.bulkId) ? (
              <ChevronDown size={15} />
            ) : (
              <ChevronRight size={15} />
            )}
            Bulk · {row.group.items.length} visitors
            <span className="text-xs font-normal text-slate-400">({row.group.bulkId})</span>
          </button>
        ) : (
          <div className={row.isChild ? "pl-6" : ""}>
            {row.isChild && <span data-bulk-child className="hidden" />}
            <div className="font-medium text-slate-700">{row.person.person_name}</div>
            <div className="text-xs text-slate-500">
              {row.person.identity_type} · {row.person.identity_number}
            </div>
          </div>
        ),
    },
    {
      key: "visitor_type",
      header: "Visitor Type",
      render: (row) => (row.group ? "—" : row.visitor_type?.name ?? row.kind),
    },
    {
      key: "company",
      header: "Company",
      render: (row) => (row.group ? "—" : row.company || "—"),
    },
    {
      key: "location",
      header: "Location",
      render: (row) => (row.group ? "—" : row.location?.name ?? "—"),
    },
    {
      key: "site",
      header: "Site",
      render: (row) => (row.group ? "—" : row.site.name),
    },
    {
      key: "period",
      header: "Visit Period",
      render: (row) => (row.group ? "—" : fmtPeriod(row)),
    },
    {
      key: "requester_email",
      header: "Requested By",
      render: (row) => (row.group ? "—" : row.requester_email || "—"),
    },
    {
      key: "created_at",
      header: "Requested On",
      render: (row) => (row.group ? "—" : fmtDateTime(row.created_at)),
    },
  ];

  const pendingColumns: TableColumn<DisplayRow>[] = [
    ...baseColumns,
    {
      key: "__actions",
      header: "Actions",
      render: (row) => {
        // visitors inside an expanded bulk: use the bulk row's actions
        if (row.isChild) return null;

        // bulk group: approve / reject the whole bulk
        if (row.group) {
          const { bulkId, items } = row.group;
          const busy = actingGuid === `bulk-${bulkId}`;
          return items.some((i) => i.can_act) ? (
            <div className="flex items-center gap-1.5">
              <button
                // onClick={() => handleApproveBulk(bulkId, items)}
                onClick={() => handleApproveBulk(bulkId)}
                disabled={busy}
                className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                aria-label="Approve bulk"
              >
                <Check size={15} />
              </button>
              <button
                onClick={() => openReject({ type: "bulk", bulkId, items })}
                disabled={busy}
                className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                aria-label="Reject bulk"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400">No action</span>
          );
        }

        // normal single request
        return row.can_act ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleApprove(row)}
              disabled={actingGuid === row.guid}
              className="p-1.5 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
              aria-label="Approve"
            >
              <Check size={15} />
            </button>
            <button
              onClick={() => openReject({ type: "single", record: row })}
              disabled={actingGuid === row.guid}
              className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
              aria-label="Reject"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">No action</span>
        );
      },
      width: "110px",
    },
  ];

  const historyColumns: TableColumn<DisplayRow>[] = [
    ...baseColumns,
    {
      key: "status",
      header: "Decision",
      render: (row) => {
        // visitors inside an expanded bulk: decision is shown on the bulk row
        if (row.isChild) return null;
        if (row.group) {
          const statuses = Array.from(new Set(row.group.items.map((i) => i.status)));
          if (statuses.length > 1) return <Badge variant="neutral">Mixed</Badge>;
        }
        return <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>;
      },
    },
    {
      key: "approved_by",
      header: "Decided By",
      render: (row) => (row.group ? "—" : row.approved_by_name || row.approved_by || "—"),
    },
    {
      key: "approved_at",
      header: "Decided On",
      render: (row) => (row.group ? "—" : fmtDateTime(row.approved_at)),
    },
    {
      key: "decision_remark",
      header: "Reason",
      render: (row) => (row.group ? "—" : row.decision_remark || "—"),
    },
  ];

  // const columns = tab === "pending" ? pendingColumns : historyColumns;

    const visiblePendingColumns = isReadOnlySite
    ? pendingColumns.filter((c) => c.key !== "__actions")
    : pendingColumns;

  const columns = tab === "pending" ? visiblePendingColumns : historyColumns;
  
  const errorMessage = siteError || loadError || actionError;

  return (
    <div>
      <PageHeader
        title="Approval"
        description="Approve or reject pre-registration requests of your site, and review past decisions in History."
      />

      {errorMessage && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}

      <div className="flex gap-1 border-b border-slate-200 mb-4" role="tablist">
        {(
          [
            { key: "pending", label: `Pending (${pendingCount})` },
            { key: "history", label: "History" },
          ] as { key: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => switchTab(t.key)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${
              tab === t.key
                ? "border-primary-600 text-primary-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card noPadding>
        <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search name, identity no, contact, location, company..."
              icon={<Search size={15} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {siteFilterOptions.length > 0 && (
            <select
              value={siteFilter}
              onChange={(e) => {
                setSiteFilter(e.target.value);
                setPage(1);
              }}
              disabled={isLoadingSites}
              className={`${fieldClass} max-w-[12rem]`}
              aria-label="Filter by site"
            >
              {siteFilterOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            disabled={isLoadingTypes}
            className={`${fieldClass} max-w-[12rem]`}
            aria-label="Filter by visitor type"
          >
            {typeFilterOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {tab === "history" && (
            <select
              value={decisionFilter}
              onChange={(e) => {
                setDecisionFilter(e.target.value);
                setPage(1);
              }}
              className={`${fieldClass} max-w-[12rem]`}
              aria-label="Filter by decision"
            >
              {DECISION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}

          <label className="text-xs text-slate-500">
            {tab === "pending" ? "Visit from" : "Decided from"}
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => handleFromDateChange(e.target.value)}
              className={`${fieldClass} mt-1`}
            />
          </label>

          <label className="text-xs text-slate-500">
            {tab === "pending" ? "Visit to" : "Decided to"}
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => handleToDateChange(e.target.value)}
              className={`${fieldClass} mt-1`}
            />
          </label>

          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>

          <div className="ml-auto flex items-center gap-2">
            {tab === "pending" ? (
              <Badge variant="warning">{pendingCount} Pending</Badge>
            ) : (
              <>
                <Badge variant="success">{historyCounts.approved} Approved</Badge>
                <Badge variant="danger">{historyCounts.rejected} Rejected</Badge>
              </>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {isLoadingList && records.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">Loading...</p>
          ) : (
            <div
              className="
                [&_tbody_tr]:!bg-white [&_tbody_tr>td]:!bg-white
                [&_tbody_tr:has([data-bulk-row])]:!bg-primary-100
                [&_tbody_tr:has([data-bulk-row])>td]:!bg-primary-100
                [&_tbody_tr:has([data-bulk-child])]:!bg-primary-50
                [&_tbody_tr:has([data-bulk-child])>td]:!bg-primary-50
              "
            >
              <Table columns={columns} data={displayRows} keyField="rowKey" />
            </div>
          )}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalRecords={totalRecords}
            pageSize={PAGE_SIZE}
          />
        </div>
      </Card>

      <Modal
        isOpen={!!rejectTarget}
        onClose={closeReject}
        title="Reject request"
        footer={
          <>
            <Button variant="outline" onClick={closeReject}>
              Cancel
            </Button>
            <Button onClick={handleReject} disabled={!!actingGuid || !rejectReason.trim()}>
              {actingGuid ? "Rejecting..." : "Reject"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {rejectTarget?.type === "bulk" ? (
              <>
                Rejecting all{" "}
                <span className="font-medium">
                  {rejectTarget.items.filter((i) => i.can_act).length}
                </span>{" "}
                requests in bulk <span className="font-medium">{rejectTarget.bulkId}</span>. The
                requester will see this reason.
              </>
            ) : (
              <>
                Rejecting the request for{" "}
                <span className="font-medium">{rejectTarget?.record.person.person_name}</span>. The
                requester will see this reason.
              </>
            )}
          </p>
          <Input
            label="Reason"
            type="textarea"
            placeholder="Why is this request being rejected?"
            required
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          {rejectError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
              <AlertCircle size={16} />
              {rejectError}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Approval;