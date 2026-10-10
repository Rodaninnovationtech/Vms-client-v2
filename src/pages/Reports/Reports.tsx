// // // import { useState } from "react";
// // // import { Download, FileText } from "lucide-react";
// // // import { Card, PageHeader, Select, Button, Table, Badge } from "@/components/ui";
// // // import type { TableColumn, BadgeVariant } from "@/types";

// // // interface ReportRow {
// // //   id: string;
// // //   date: string;
// // //   site: string;
// // //   totalVisitors: number;
// // //   totalContractors: number;
// // //   pendingApprovals: number;
// // //   status: string;
// // // }

// // // const statusVariant: Record<string, BadgeVariant> = { Generated: "success", Draft: "warning" };

// // // const columns: TableColumn<ReportRow>[] = [
// // //   { key: "date", header: "Date" },
// // //   { key: "site", header: "Site" },
// // //   { key: "totalVisitors", header: "Visitors" },
// // //   { key: "totalContractors", header: "Contractors" },
// // //   { key: "pendingApprovals", header: "Pending Approvals" },
// // //   {
// // //     key: "status",
// // //     header: "Status",
// // //     render: (row) => <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>,
// // //   },
// // // ];

// // // const data: ReportRow[] = [
// // //   { id: "1", date: "16-09-2026", site: "Tower A", totalVisitors: 112, totalContractors: 18, pendingApprovals: 2, status: "Generated" },
// // //   { id: "2", date: "16-09-2026", site: "Tower B", totalVisitors: 84, totalContractors: 9, pendingApprovals: 0, status: "Generated" },
// // //   { id: "3", date: "17-09-2026", site: "Tower C", totalVisitors: 63, totalContractors: 14, pendingApprovals: 4, status: "Draft" },
// // //   { id: "4", date: "17-09-2026", site: "Tower D", totalVisitors: 40, totalContractors: 5, pendingApprovals: 1, status: "Draft" },
// // // ];

// // // const reportTypes = [
// // //   { label: "Visitor Summary", value: "visitor_summary" },
// // //   { label: "Contractor Summary", value: "contractor_summary" },
// // //   { label: "Approval Log", value: "approval_log" },
// // //   { label: "Property Access Log", value: "property_access_log" },
// // // ];

// // // const siteOptions = [
// // //   { label: "All Sites", value: "all" },
// // //   { label: "Tower A", value: "Tower A" },
// // //   { label: "Tower B", value: "Tower B" },
// // //   { label: "Tower C", value: "Tower C" },
// // //   { label: "Tower D", value: "Tower D" },
// // // ];

// // // const Reports = () => {
// // //   const [reportType, setReportType] = useState("visitor_summary");
// // //   const [site, setSite] = useState("all");

// // //   return (
// // //     <div>
// // //       <PageHeader
// // //         title="Report"
// // //         description="Generate and export operational reports across sites."
// // //         actions={
// // //           <Button icon={<Download size={16} />} size="sm">
// // //             Export CSV
// // //           </Button>
// // //         }
// // //       />

// // //       <Card className="mb-5">
// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
// // //           <Select
// // //             label="Report Type"
// // //             options={reportTypes}
// // //             value={reportType}
// // //             onChange={(e) => setReportType(e.target.value)}
// // //           />
// // //           <Select label="Site" options={siteOptions} value={site} onChange={(e) => setSite(e.target.value)} />
// // //           <div className="flex flex-col gap-1.5">
// // //             <label className="text-sm font-medium text-slate-700">From Date</label>
// // //             <input
// // //               type="date"
// // //               className="rounded-lg border border-slate-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
// // //             />
// // //           </div>
// // //           <div className="flex flex-col gap-1.5">
// // //             <label className="text-sm font-medium text-slate-700">To Date</label>
// // //             <input
// // //               type="date"
// // //               className="rounded-lg border border-slate-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400"
// // //             />
// // //           </div>
// // //         </div>
// // //         <div className="mt-4 flex justify-end">
// // //           <Button icon={<FileText size={16} />}>Generate Report</Button>
// // //         </div>
// // //       </Card>

// // //       <Card title="Generated Reports" subtitle="Recent report snapshots" noPadding>
// // //         <div className="p-4 sm:p-5">
// // //           <Table columns={columns} data={data} keyField="id" />
// // //         </div>
// // //       </Card>
// // //     </div>
// // //   );
// // // };

// // // export default Reports;



// // import { useEffect, useMemo, useState } from "react";
// // import { Download, FileText, Search as SearchIcon, AlertCircle } from "lucide-react";
// // import {
// //   Card,
// //   PageHeader,
// //   Select,
// //   Button,
// //   Table,
// //   Badge,
// //   Input,
// //   Pagination,
// // } from "@/components/ui";
// // import type { TableColumn, BadgeVariant } from "@/types";
// // import { userService } from "@/service/usercreationservices";
// // import type { SiteDropdownItem } from "@/service/usercreationservices";
// // import { visitorTypeService } from "@/service/visitortypeservice";
// // import { apiErrorMessage } from "@/service/visitorservices";
// // // import { reportService } from "@/service/reportservices";
// // // import type { ReportRecord } from "@/service/reportservices";
// // import { userStorage } from "@/utils/storage";

// // /* ---------------------------------------------------------------------- */
// // /* Helpers                                                                 */
// // /* ---------------------------------------------------------------------- */

// // const fmtDate = (value?: string | null) => {
// //   if (!value) return "—";
// //   const d = new Date(value);
// //   if (Number.isNaN(d.getTime())) return value;
// //   const dd = String(d.getDate()).padStart(2, "0");
// //   const mm = String(d.getMonth() + 1).padStart(2, "0");
// //   return `${dd}-${mm}-${d.getFullYear()}`;
// // };

// // const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

// // /* ---------------------------------------------------------------------- */
// // /* Types / static data                                                     */
// // /* ---------------------------------------------------------------------- */

// // interface Option {
// //   label: string;
// //   value: string;
// // }

// // interface SiteItem {
// //   id?: number;
// //   guid: string;
// //   site_code?: string;
// //   name: string;
// // }

// // interface StoredUser {
// //   is_super_admin?: boolean;
// //   site_detail?: SiteItem | null;
// //   permissions?: {
// //     menu_key: string;
// //     view: boolean;
// //     enabled: boolean;
// //     subsites?: SiteItem[];
// //   }[];
// // }

// // const REPORT_MENU_KEY = "/reports"; // change to your actual menu key
// // const PAGE_SIZE = 10;

// // const statusVariant: Record<string, BadgeVariant> = {
// //   Approved: "success",
// //   Pending: "warning",
// //   Rejected: "danger",
// //   "Checked In": "success",
// //   "Checked Out": "neutral",
// // };

// // const reportTypes: Option[] = [
// //   { label: "Visitor Summary", value: "visitor_summary" },
// //   { label: "Contractor Summary", value: "contractor_summary" },
// //   { label: "Approval Log", value: "approval_log" },
// //   { label: "Property Access Log", value: "property_access_log" },
// // ];

// // const dateInputClass =
// //   "rounded-lg border border-slate-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400";

// // /* ---------------------------------------------------------------------- */
// // /* Page                                                                     */
// // /* ---------------------------------------------------------------------- */

// // const Reports = () => {
// //   // ---------- logged-in user ----------
// //   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
// //   const isSuperAdmin = storedUser?.is_super_admin === true;
// //   const ownSite = storedUser?.site_detail ?? null;

// //   const reportPermission = storedUser?.permissions?.find((p) => p.menu_key === REPORT_MENU_KEY);
// //   // subsites are listed only when the permission's view is true
// //   const subsiteOptions: SiteItem[] = reportPermission?.view
// //     ? reportPermission.subsites ?? []
// //     : [];

// //   // ---------- sites ----------
// //   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
// //   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
// //   const [siteError, setSiteError] = useState("");

// //   useEffect(() => {
// //     if (!isSuperAdmin) return;
// //     let cancelled = false;

// //     (async () => {
// //       try {
// //         const res = await userService.siteDropdown();
// //         if (cancelled) return;
// //         if (res.success && res.data) setAllSites(res.data.results ?? []);
// //         else setSiteError(res.message || "Could not load sites.");
// //       } catch {
// //         if (!cancelled) setSiteError("Could not load sites. Please try again.");
// //       } finally {
// //         if (!cancelled) setIsLoadingSites(false);
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [isSuperAdmin]);

// //   // sites this user is allowed to report on
// //   const siteChoices: SiteItem[] = useMemo(
// //     () =>
// //       isSuperAdmin
// //         ? allSites.map((s) => ({ guid: s.guid, name: s.site_name }))
// //         : ownSite
// //         ? [ownSite, ...subsiteOptions]
// //         : [],
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //     [isSuperAdmin, allSites, ownSite, reportPermission]
// //   );

// //   const siteOptions: Option[] = useMemo(() => {
// //     if (isSuperAdmin) {
// //       return [
// //         { label: "All Sites", value: "" },
// //         ...siteChoices.map((s) => ({ label: s.name, value: s.guid })),
// //       ];
// //     }
// //     const list = siteChoices.map((s) => ({
// //       label: s.guid === ownSite?.guid ? `${s.name} (Primary)` : `${s.name} (Other)`,
// //       value: s.guid,
// //     }));
// //     // more than one site -> let them choose "All My Sites"
// //     return list.length > 1 ? [{ label: "All My Sites", value: "" }, ...list] : list;
// //   }, [isSuperAdmin, siteChoices, ownSite]);

// //   // ---------- visitor types ----------
// //   const [visitorTypeOptions, setVisitorTypeOptions] = useState<Option[]>([]);
// //   const [isLoadingTypes, setIsLoadingTypes] = useState(false);

// //   useEffect(() => {
// //     let cancelled = false;

// //     (async () => {
// //       setIsLoadingTypes(true);
// //       try {
// //         const res = await visitorTypeService.list(1, 100, "");
// //         if (cancelled) return;
// //         if (res.success && res.data) {
// //           setVisitorTypeOptions([
// //             { label: "All Visitor Types", value: "" },
// //             ...res.data.results
// //               .filter((t) => t.is_active)
// //               .map((t) => ({ label: t.name, value: t.guid })),
// //           ]);
// //         }
// //       } catch {
// //         /* leave empty */
// //       } finally {
// //         if (!cancelled) setIsLoadingTypes(false);
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, []);

// //   // ---------- filters ----------
// //   const [reportType, setReportType] = useState("visitor_summary");
// //   const [siteFilter, setSiteFilter] = useState<string>(isSuperAdmin ? "" : ownSite?.guid ?? "");
// //   const [visitorTypeFilter, setVisitorTypeFilter] = useState("");
// //   const [fromDate, setFromDate] = useState("");
// //   const [toDate, setToDate] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [debouncedSearch, setDebouncedSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [refreshKey, setRefreshKey] = useState(0);

// //   useEffect(() => {
// //     const t = setTimeout(() => {
// //       setDebouncedSearch(search.trim());
// //       setPage(1);
// //     }, 400);
// //     return () => clearTimeout(t);
// //   }, [search]);

// //   const handleFromDateChange = (value: string) => {
// //     setFromDate(value);
// //     if (value && toDate && toDate < value) setToDate(value);
// //     setPage(1);
// //   };

// //   const handleToDateChange = (value: string) => {
// //     setToDate(value);
// //     if (value && fromDate && value < fromDate) setFromDate(value);
// //     setPage(1);
// //   };

// //   const clearFilters = () => {
// //     setReportType("visitor_summary");
// //     setSiteFilter(isSuperAdmin ? "" : ownSite?.guid ?? "");
// //     setVisitorTypeFilter("");
// //     setFromDate("");
// //     setToDate("");
// //     setSearch("");
// //     setDebouncedSearch("");
// //     setPage(1);
// //   };

// //   // ---------- data ----------
// //   const [records, setRecords] = useState<ReportRecord[]>([]);
// //   const [totalRecords, setTotalRecords] = useState(0);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [isLoadingList, setIsLoadingList] = useState(false);
// //   const [listError, setListError] = useState("");

// //   // for non-admins, "All My Sites" = send only the sites they are allowed to see
// //   const allowedSiteGuids = useMemo(() => siteChoices.map((s) => s.guid), [siteChoices]);

// //   useEffect(() => {
// //     // wait until the site list is ready
// //     if (isLoadingSites) return;
// //     if (!isSuperAdmin && allowedSiteGuids.length === 0) return;

// //     let cancelled = false;

// //     (async () => {
// //       setIsLoadingList(true);
// //       setListError("");
// //       try {
// //         const res = await reportService.list({
// //           page,
// //           page_size: PAGE_SIZE,
// //           report_type: reportType,
// //           search: debouncedSearch,
// //           site_guid: siteFilter || null,
// //           site_guids: !isSuperAdmin && !siteFilter ? allowedSiteGuids : null,
// //           visitor_type_guid: visitorTypeFilter || null,
// //           from_date: fromDate || null,
// //           to_date: toDate || null,
// //         });
// //         if (cancelled) return;

// //         if (res.success && res.data) {
// //           setRecords(res.data.results);
// //           setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
// //           setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
// //         } else {
// //           setListError(res.message || "Could not load the report.");
// //         }
// //       } catch (err) {
// //         if (!cancelled) setListError(apiErrorMessage(err, "Could not load the report."));
// //       } finally {
// //         if (!cancelled) setIsLoadingList(false);
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [
// //     page,
// //     reportType,
// //     debouncedSearch,
// //     siteFilter,
// //     visitorTypeFilter,
// //     fromDate,
// //     toDate,
// //     refreshKey,
// //     isLoadingSites,
// //     allowedSiteGuids.join(","),
// //   ]);

// //   // ---------- CSV export (rows currently loaded) ----------
// //   const handleExport = () => {
// //     const headers = [
// //       "Visitor Name",
// //       "Visitor Type",
// //       "Identity Type",
// //       "Identity Number",
// //       "Contact",
// //       "Company",
// //       "Site",
// //       "Date",
// //       "Status",
// //     ];
// //     const lines = records.map((r) =>
// //       [
// //         r.person_name,
// //         r.visitor_type_name,
// //         r.identity_type,
// //         r.identity_number,
// //         r.phone_number,
// //         r.company,
// //         r.site_name,
// //         fmtDate(r.date),
// //         r.status,
// //       ]
// //         .map(csvCell)
// //         .join(",")
// //     );
// //     const csv = [headers.map(csvCell).join(","), ...lines].join("\n");
// //     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement("a");
// //     a.href = url;
// //     a.download = `${reportType}_${new Date().toISOString().slice(0, 10)}.csv`;
// //     a.click();
// //     URL.revokeObjectURL(url);
// //   };

// //   // ---------- table ----------
// //   const columns: TableColumn<ReportRecord>[] = [
// //     { key: "person_name", header: "Visitor Name", render: (r) => r.person_name || "—" },
// //     { key: "visitor_type_name", header: "Visitor Type", render: (r) => r.visitor_type_name || "—" },
// //     {
// //       key: "identity",
// //       header: "Identity",
// //       render: (r) => `${r.identity_type || "—"} · ${r.identity_number || "—"}`,
// //     },
// //     { key: "phone_number", header: "Contact", render: (r) => r.phone_number || "—" },
// //     { key: "company", header: "Company", render: (r) => r.company || "—" },
// //     { key: "site_name", header: "Site", render: (r) => r.site_name || "—" },
// //     { key: "date", header: "Date", render: (r) => fmtDate(r.date) },
// //     {
// //       key: "status",
// //       header: "Status",
// //       render: (r) => <Badge variant={statusVariant[r.status] || "neutral"}>{r.status}</Badge>,
// //     },
// //   ];

// //   return (
// //     <div>
// //       <PageHeader
// //         title="Report"
// //         description="Generate and export operational reports across sites."
// //         actions={
// //           <Button
// //             icon={<Download size={16} />}
// //             size="sm"
// //             onClick={handleExport}
// //             disabled={records.length === 0}
// //           >
// //             Export CSV
// //           </Button>
// //         }
// //       />

// //       {(siteError || listError) && (
// //         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
// //           <AlertCircle size={16} />
// //           {siteError || listError}
// //         </div>
// //       )}

// //       <Card className="mb-5">
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
// //           {/* <Select
// //             label="Report Type"
// //             options={reportTypes}
// //             value={reportType}
// //             onChange={(e) => {
// //               setReportType(e.target.value);
// //               setPage(1);
// //             }}
// //           /> */}

// //           <Select
// //             label="Site"
// //             placeholder={isLoadingSites ? "Loading sites..." : undefined}
// //             disabled={isLoadingSites}
// //             options={siteOptions}
// //             value={siteFilter}
// //             onChange={(e) => {
// //               setSiteFilter(e.target.value);
// //               setPage(1);
// //             }}
// //           />

// //           <Select
// //             label="Visitor Type"
// //             placeholder={isLoadingTypes ? "Loading..." : undefined}
// //             disabled={isLoadingTypes}
// //             options={visitorTypeOptions}
// //             value={visitorTypeFilter}
// //             onChange={(e) => {
// //               setVisitorTypeFilter(e.target.value);
// //               setPage(1);
// //             }}
// //           />

// //           <div className="flex flex-col gap-1.5">
// //             <label className="text-sm font-medium text-slate-700">From Date</label>
// //             <input
// //               type="date"
// //               value={fromDate}
// //               max={toDate || undefined}
// //               onChange={(e) => handleFromDateChange(e.target.value)}
// //               className={dateInputClass}
// //             />
// //           </div>

// //           <div className="flex flex-col gap-1.5">
// //             <label className="text-sm font-medium text-slate-700">To Date</label>
// //             <input
// //               type="date"
// //               value={toDate}
// //               min={fromDate || undefined}
// //               onChange={(e) => handleToDateChange(e.target.value)}
// //               className={dateInputClass}
// //             />
// //           </div>

// //           <div className="flex flex-col gap-1.5">
// //             <label className="text-sm font-medium text-slate-700">Search</label>
// //             <Input
// //               placeholder="Name, phone, company, identity no..."
// //               icon={<SearchIcon size={15} />}
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //             />
// //           </div>
// //         </div>

// //         <div className="mt-4 flex justify-end gap-2">
// //           <Button variant="outline" onClick={clearFilters}>
// //             Clear
// //           </Button>
// //           <Button
// //             icon={<FileText size={16} />}
// //             onClick={() => {
// //               setPage(1);
// //               setRefreshKey((k) => k + 1);
// //             }}
// //           >
// //             Generate Report
// //           </Button>
// //         </div>
// //       </Card>

// //       <Card title="Generated Reports" subtitle="Results for the selected filters" noPadding>
// //         <div className="p-4 sm:p-5">
// //           {isLoadingList && records.length === 0 ? (
// //             <p className="text-sm text-slate-500 py-6 text-center">Loading...</p>
// //           ) : (
// //             <Table columns={columns} data={records} keyField="guid" />
// //           )}
// //           <Pagination
// //             currentPage={page}
// //             totalPages={totalPages}
// //             onPageChange={setPage}
// //             totalRecords={totalRecords}
// //             pageSize={PAGE_SIZE}
// //           />
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default Reports;





// import { useEffect, useMemo, useState } from "react";
// import { Download, Search as SearchIcon, AlertCircle } from "lucide-react";
// import {
//   Card,
//   PageHeader,
//   Select,
//   Button,
//   Table,
//   Badge,
//   Input,
//   Pagination,
// } from "@/components/ui";
// import type { TableColumn, BadgeVariant } from "@/types";
// import { userService } from "@/service/usercreationservices";
// import type { SiteDropdownItem } from "@/service/usercreationservices";
// import { visitorTypeService } from "@/service/visitortypeservice";
// import { apiErrorMessage } from "@/service/visitorservices";
// import { reportService } from "@/service/reportservices";
// import type { ReportRecord } from "@/service/reportservices";
// import { userStorage } from "@/utils/storage";

// /* ---------------------------------------------------------------------- */
// /* Helpers                                                                 */
// /* ---------------------------------------------------------------------- */

// // ISO datetime -> dd-mm-yyyy hh:mm AM/PM
// const fmtDateTime = (value?: string | null) => {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const h = d.getHours();
//   const min = String(d.getMinutes()).padStart(2, "0");
//   return `${dd}-${mm}-${d.getFullYear()} ${String(h % 12 || 12).padStart(2, "0")}:${min} ${
//     h >= 12 ? "PM" : "AM"
//   }`;
// };

// const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

// /* ---------------------------------------------------------------------- */
// /* Types / static data                                                     */
// /* ---------------------------------------------------------------------- */

// interface Option {
//   label: string;
//   value: string;
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

// // must match the menu_key used for the Reports page (backend REPORT_MENU_KEY too)
// const REPORT_MENU_KEY = "/report";
// const PAGE_SIZE = 10;

// const statusVariant: Record<string, BadgeVariant> = {
//   "Checked In": "success",
//   "Checked Out": "neutral",
// };

// const dateInputClass =
//   "rounded-lg border border-slate-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400";

// /* ---------------------------------------------------------------------- */
// /* Page                                                                     */
// /* ---------------------------------------------------------------------- */

// const Reports = () => {
//   // ---------- logged-in user ----------
//   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
//   const isSuperAdmin = storedUser?.is_super_admin === true;
//   const ownSite = storedUser?.site_detail ?? null;

//   const reportPermission = storedUser?.permissions?.find((p) => p.menu_key === REPORT_MENU_KEY);
//   // sub-sites are shown only when "view" is true
//   const subsiteOptions: SiteItem[] = reportPermission?.view
//     ? reportPermission.subsites ?? []
//     : [];

//   // ---------- sites ----------
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

//   const siteOptions: Option[] = useMemo(() => {
//     if (isSuperAdmin) {
//       return [
//         { label: "All Sites", value: "" },
//         ...allSites.map((s) => ({ label: s.site_name, value: s.guid })),
//       ];
//     }
//     const choices: SiteItem[] = ownSite ? [ownSite, ...subsiteOptions] : [];
//     const list = choices.map((s) => ({
//       label: s.guid === ownSite?.guid ? `${s.name} (Primary)` : `${s.name} (Other)`,
//       value: s.guid,
//     }));
//     // "All My Sites" = blank; the backend limits it to the sites this user may see
//     return list.length > 1 ? [{ label: "All My Sites", value: "" }, ...list] : list;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isSuperAdmin, allSites, ownSite, reportPermission]);

//   // ---------- visitor types ----------
//   const [visitorTypeOptions, setVisitorTypeOptions] = useState<Option[]>([
//     { label: "All Visitor Types", value: "" },
//   ]);
//   const [isLoadingTypes, setIsLoadingTypes] = useState(false);

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       setIsLoadingTypes(true);
//       try {
//         const res = await visitorTypeService.list(1, 100, "");
//         if (cancelled) return;
//         if (res.success && res.data) {
//           setVisitorTypeOptions([
//             { label: "All Visitor Types", value: "" },
//             ...res.data.results
//               .filter((t) => t.is_active)
//               .map((t) => ({ label: t.name, value: t.guid })),
//           ]);
//         }
//       } catch {
//         /* keep "All Visitor Types" only */
//       } finally {
//         if (!cancelled) setIsLoadingTypes(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   // ---------- filters ----------
//   // non-admin with a single site: that site; otherwise blank (= all allowed sites)
//   const [siteFilter, setSiteFilter] = useState<string>(isSuperAdmin ? "" : ownSite?.guid ?? "");
//   const [visitorTypeFilter, setVisitorTypeFilter] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [refreshKey, setRefreshKey] = useState(0);

//   useEffect(() => {
//     const t = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(t);
//   }, [search]);

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
//     setSiteFilter(isSuperAdmin ? "" : ownSite?.guid ?? "");
//     setVisitorTypeFilter("");
//     setFromDate("");
//     setToDate("");
//     setSearch("");
//     setDebouncedSearch("");
//     setPage(1);
//     setRefreshKey((k) => k + 1);
//   };

//   // ---------- data ----------
//   const [records, setRecords] = useState<ReportRecord[]>([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoadingList, setIsLoadingList] = useState(false);
//   const [listError, setListError] = useState("");
//   const [isExporting, setIsExporting] = useState(false);

//   useEffect(() => {
//     if (isLoadingSites) return; // wait until the site list is ready
//     let cancelled = false;

//     (async () => {
//       setIsLoadingList(true);
//       setListError("");
//       try {
//         const res = await reportService.list({
//           page,
//           page_size: PAGE_SIZE,
//           search: debouncedSearch,
//           site_guid: siteFilter || null,
//           visitor_type_guid: visitorTypeFilter || null,
//           from_date: fromDate || null,
//           to_date: toDate || null,
//         });
//         if (cancelled) return;

//         if (res.success && res.data) {
//           setRecords(res.data.results);
//           setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
//           setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
//         } else {
//           setListError(res.message || "Could not load the report.");
//         }
//       } catch (err) {
//         if (!cancelled) setListError(apiErrorMessage(err, "Could not load the report."));
//       } finally {
//         if (!cancelled) setIsLoadingList(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [page, debouncedSearch, siteFilter, visitorTypeFilter, fromDate, toDate, refreshKey, isLoadingSites]);

//   // ---------- CSV export: ALL rows matching the filters ----------
//   const handleExport = async () => {
//     setIsExporting(true);
//     setListError("");
//     try {
//       const res = await reportService.list({
//         page: null,
//         page_size: null,
//         search: debouncedSearch,
//         site_guid: siteFilter || null,
//         visitor_type_guid: visitorTypeFilter || null,
//         from_date: fromDate || null,
//         to_date: toDate || null,
//       });
//       if (!res.success || !res.data) {
//         setListError(res.message || "Could not export the report.");
//         return;
//       }

//       const headers = [
//         "Visitor Name",
//         "Visitor Type",
//         "Identity Type",
//         "Identity Number",
//         "Contact",
//         "Email",
//         "Company",
//         "Company Phone",
//         "Site",
//         "Location",
//         "Pass No",
//         "Key No",
//         "Vehicle",
//         "Check In",
//         "Check Out",
//         "Status",
//       ];
//       const lines = res.data.results.map((r) =>
//         [
//           r.person_name,
//           r.visitor_type_name,
//           r.identity_type,
//           r.identity_number,
//           r.phone_number,
//           r.email,
//           r.company,
//           r.company_phone,
//           r.site_name,
//           r.location,
//           r.pass_no,
//           r.key_no,
//           r.vehicle_number,
//           fmtDateTime(r.check_in),
//           fmtDateTime(r.check_out),
//           r.status,
//         ]
//           .map(csvCell)
//           .join(",")
//       );
//       const csv = [headers.map(csvCell).join(","), ...lines].join("\n");
//       const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `visitor_report_${new Date().toISOString().slice(0, 10)}.csv`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (err) {
//       setListError(apiErrorMessage(err, "Could not export the report."));
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   // ---------- table ----------
//   const columns: TableColumn<ReportRecord>[] = [
//     { key: "person_name", header: "Visitor Name", render: (r) => r.person_name || "—" },
//     { key: "visitor_type_name", header: "Visitor Type", render: (r) => r.visitor_type_name || "—" },
//     {
//       key: "identity",
//       header: "Identity",
//       render: (r) => `${r.identity_type || "—"} · ${r.identity_number || "—"}`,
//     },
//     { key: "phone_number", header: "Contact", render: (r) => r.phone_number || "—" },
//     { key: "email", header: "Email", render: (r) => r.email || "—" },
//     { key: "company", header: "Company", render: (r) => r.company || "—" },
//     { key: "site_name", header: "Site", render: (r) => r.site_name || "—" },
//     { key: "location", header: "Location", render: (r) => r.location || "—" },
//     { key: "check_in", header: "Check In", render: (r) => fmtDateTime(r.check_in) },
//     { key: "check_out", header: "Check Out", render: (r) => fmtDateTime(r.check_out) },
//     {
//       key: "status",
//       header: "Status",
//       render: (r) => <Badge variant={statusVariant[r.status] || "neutral"}>{r.status}</Badge>,
//     },
//   ];

//   return (
//     <div>
//       <PageHeader
//         title="Report"
//         description="Check-in and check-out records of visitors and contractors across sites."
//         actions={
//           <Button
//             icon={<Download size={16} />}
//             size="sm"
//             onClick={handleExport}
//             disabled={isExporting || totalRecords === 0}
//           >
//             {isExporting ? "Exporting..." : "Export CSV"}
//           </Button>
//         }
//       />

//       {(siteError || listError) && (
//         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
//           <AlertCircle size={16} />
//           {siteError || listError}
//         </div>
//       )}

//       <Card className="mb-5">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
//           <Select
//             label="Site"
//             placeholder={isLoadingSites ? "Loading sites..." : undefined}
//             disabled={isLoadingSites}
//             options={siteOptions}
//             value={siteFilter}
//             onChange={(e) => {
//               setSiteFilter(e.target.value);
//               setPage(1);
//             }}
//           />

//           <Select
//             label="Visitor Type"
//             placeholder={isLoadingTypes ? "Loading..." : undefined}
//             disabled={isLoadingTypes}
//             options={visitorTypeOptions}
//             value={visitorTypeFilter}
//             onChange={(e) => {
//               setVisitorTypeFilter(e.target.value);
//               setPage(1);
//             }}
//           />

//           <div className="flex flex-col gap-1.5">
//             <label className="text-sm font-medium text-slate-700">Search</label>
//             <Input
//               placeholder="Name, phone, company, identity no, email..."
//               icon={<SearchIcon size={15} />}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           <div className="flex flex-col gap-1.5">
//             <label className="text-sm font-medium text-slate-700">From Date</label>
//             <input
//               type="date"
//               value={fromDate}
//               max={toDate || undefined}
//               onChange={(e) => handleFromDateChange(e.target.value)}
//               className={dateInputClass}
//             />
//           </div>

//           <div className="flex flex-col gap-1.5">
//             <label className="text-sm font-medium text-slate-700">To Date</label>
//             <input
//               type="date"
//               value={toDate}
//               min={fromDate || undefined}
//               onChange={(e) => handleToDateChange(e.target.value)}
//               className={dateInputClass}
//             />
//           </div>

//           <div className="flex justify-end">
//             <Button variant="outline" onClick={clearFilters}>
//               Clear
//             </Button>
//           </div>
//         </div>
//         <p className="mt-3 text-xs text-slate-500">Dates filter on the check-in date.</p>
//       </Card>

//       <Card title="Check-in / Check-out Records" subtitle="Results for the selected filters" noPadding>
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
//     </div>
//   );
// };

// export default Reports;


import { useEffect, useMemo, useRef, useState } from "react";
import {
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  Search as SearchIcon,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  PageHeader,
  Select,
  Button,
  Table,
  Badge,
  Input,
  Pagination,
} from "@/components/ui";
import type { TableColumn, BadgeVariant } from "@/types";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { visitorTypeService } from "@/service/visitortypeservice";
import { apiErrorMessage } from "@/service/visitorservices";
import { reportService, exportErrorMessage } from "@/service/reportservices";
import type { ReportRecord } from "@/service/reportservices";
import { userStorage } from "@/utils/storage";

/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */

// ISO datetime -> dd-mm-yyyy hh:mm AM/PM
const fmtDateTime = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const h = d.getHours();
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()} ${String(h % 12 || 12).padStart(2, "0")}:${min} ${
    h >= 12 ? "PM" : "AM"
  }`;
};

/* ---------------------------------------------------------------------- */
/* Types / static data                                                     */
/* ---------------------------------------------------------------------- */

interface Option {
  label: string;
  value: string;
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

// must match the menu_key used for the Reports page (backend REPORT_MENU_KEY too)
const REPORT_MENU_KEY = "/report";
const PAGE_SIZE = 10;

const statusVariant: Record<string, BadgeVariant> = {
  "Checked In": "success",
  "Checked Out": "neutral",
};

const dateInputClass =
  "rounded-lg border border-slate-200 text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400";

/* ---------------------------------------------------------------------- */
/* Page                                                                     */
/* ---------------------------------------------------------------------- */

const Reports = () => {
  // ---------- logged-in user ----------
  const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;

  const reportPermission = storedUser?.permissions?.find((p) => p.menu_key === REPORT_MENU_KEY);
  // sub-sites are shown only when "view" is true
  const subsiteOptions: SiteItem[] = reportPermission?.view
    ? reportPermission.subsites ?? []
    : [];

  // ---------- sites ----------
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

  const siteOptions: Option[] = useMemo(() => {
    if (isSuperAdmin) {
      return [
        { label: "All Sites", value: "" },
        ...allSites.map((s) => ({ label: s.site_name, value: s.guid })),
      ];
    }
    const choices: SiteItem[] = ownSite ? [ownSite, ...subsiteOptions] : [];
    const list = choices.map((s) => ({
      label: s.guid === ownSite?.guid ? `${s.name} (Primary)` : `${s.name} (Other)`,
      value: s.guid,
    }));
    // "All My Sites" = blank; the backend limits it to the sites this user may see
    return list.length > 1 ? [{ label: "All My Sites", value: "" }, ...list] : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin, allSites, ownSite, reportPermission]);

  // ---------- visitor types ----------
  const [visitorTypeOptions, setVisitorTypeOptions] = useState<Option[]>([
    { label: "All Visitor Types", value: "" },
  ]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoadingTypes(true);
      try {
        const res = await visitorTypeService.list(1, 100, "");
        if (cancelled) return;
        if (res.success && res.data) {
          setVisitorTypeOptions([
            { label: "All Visitor Types", value: "" },
            ...res.data.results
              .filter((t) => t.is_active)
              .map((t) => ({ label: t.name, value: t.guid })),
          ]);
        }
      } catch {
        /* keep "All Visitor Types" only */
      } finally {
        if (!cancelled) setIsLoadingTypes(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- filters ----------
  // non-admin with a single site: that site; otherwise blank (= all allowed sites)
  const [siteFilter, setSiteFilter] = useState<string>(isSuperAdmin ? "" : ownSite?.guid ?? "");
  const [visitorTypeFilter, setVisitorTypeFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

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
    setSiteFilter(isSuperAdmin ? "" : ownSite?.guid ?? "");
    setVisitorTypeFilter("");
    setFromDate("");
    setToDate("");
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
    setRefreshKey((k) => k + 1);
  };

  // ---------- data ----------
  const [records, setRecords] = useState<ReportRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState("");

  useEffect(() => {
    if (isLoadingSites) return; // wait until the site list is ready
    let cancelled = false;

    (async () => {
      setIsLoadingList(true);
      setListError("");
      try {
        const res = await reportService.list({
          page,
          page_size: PAGE_SIZE,
          search: debouncedSearch,
          site_guid: siteFilter || null,
          visitor_type_guid: visitorTypeFilter || null,
          from_date: fromDate || null,
          to_date: toDate || null,
        });
        if (cancelled) return;

        if (res.success && res.data) {
          setRecords(res.data.results);
          setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
          setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
        } else {
          setListError(res.message || "Could not load the report.");
        }
      } catch (err) {
        if (!cancelled) setListError(apiErrorMessage(err, "Could not load the report."));
      } finally {
        if (!cancelled) setIsLoadingList(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, siteFilter, visitorTypeFilter, fromDate, toDate, refreshKey, isLoadingSites]);

  // ---------- export (Excel / PDF) ----------
  const [isExporting, setIsExporting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // close the menu when clicking outside it
  useEffect(() => {
    if (!exportOpen) return;
    const onClick = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [exportOpen]);

  // isExcel true -> .xlsx , false -> .pdf  (sent to the server as `isexcel`)
  const handleExport = async (isExcel: boolean) => {
    setExportOpen(false);
    setIsExporting(true);
    setListError("");
    try {
      const blob = await reportService.exportFile({
        page: null,
        page_size: null,
        search: debouncedSearch,
        site_guid: siteFilter || null,
        visitor_type_guid: visitorTypeFilter || null,
        from_date: fromDate || null,
        to_date: toDate || null,
        isexcel: isExcel,
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `visitor_report_${new Date().toISOString().slice(0, 10)}.${
        isExcel ? "xlsx" : "pdf"
      }`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setListError(await exportErrorMessage(err, "Could not export the report."));
    } finally {
      setIsExporting(false);
    }
  };

  // ---------- table ----------
  const columns: TableColumn<ReportRecord>[] = [
    { key: "person_name", header: "Visitor Name", render: (r) => r.person_name || "—" },
    { key: "visitor_type_name", header: "Visitor Type", render: (r) => r.visitor_type_name || "—" },
    {
      key: "identity",
      header: "Identity",
      render: (r) => `${r.identity_type || "—"} · ${r.identity_number || "—"}`,
    },
    { key: "phone_number", header: "Contact", render: (r) => r.phone_number || "—" },
    { key: "email", header: "Email", render: (r) => r.email || "—" },
    { key: "company", header: "Company", render: (r) => r.company || "—" },
    { key: "site_name", header: "Site", render: (r) => r.site_name || "—" },
    { key: "location", header: "Location", render: (r) => r.location || "—" },
    { key: "check_in", header: "Check In", render: (r) => fmtDateTime(r.check_in) },
    { key: "check_out", header: "Check Out", render: (r) => fmtDateTime(r.check_out) },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge variant={statusVariant[r.status] || "neutral"}>{r.status}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Report"
        description="Check-in and check-out records of visitors and contractors across sites."
        actions={
          <div className="relative" ref={exportMenuRef}>
            <Button
              icon={<Download size={16} />}
              size="sm"
              onClick={() => setExportOpen((o) => !o)}
              disabled={isExporting || totalRecords === 0}
            >
              {isExporting ? (
                "Exporting..."
              ) : (
                <span className="inline-flex items-center gap-1">
                  Export <ChevronDown size={14} />
                </span>
              )}
            </Button>

            {exportOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
                <button
                  type="button"
                  onClick={() => handleExport(true)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <FileSpreadsheet size={16} className="text-green-600" />
                  Excel (.xlsx)
                </button>
                <button
                  type="button"
                  onClick={() => handleExport(false)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <FileText size={16} className="text-red-600" />
                  PDF (.pdf)
                </button>
              </div>
            )}
          </div>
        }
      />

      {(siteError || listError) && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
          <AlertCircle size={16} />
          {siteError || listError}
        </div>
      )}

      <Card className="mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <Select
            label="Site"
            placeholder={isLoadingSites ? "Loading sites..." : undefined}
            disabled={isLoadingSites}
            options={siteOptions}
            value={siteFilter}
            onChange={(e) => {
              setSiteFilter(e.target.value);
              setPage(1);
            }}
          />

          <Select
            label="Visitor Type"
            placeholder={isLoadingTypes ? "Loading..." : undefined}
            disabled={isLoadingTypes}
            options={visitorTypeOptions}
            value={visitorTypeFilter}
            onChange={(e) => {
              setVisitorTypeFilter(e.target.value);
              setPage(1);
            }}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Search</label>
            <Input
              placeholder="Name, phone, company, identity no, email..."
              icon={<SearchIcon size={15} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">From Date</label>
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => handleFromDateChange(e.target.value)}
              className={dateInputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">To Date</label>
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => handleToDateChange(e.target.value)}
              className={dateInputClass}
            />
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">Dates filter on the check-in date.</p>
      </Card>

      <Card title="Check-in / Check-out Records" subtitle="Results for the selected filters" noPadding>
        <div className="p-4 sm:p-5">
          {isLoadingList && records.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">Loading...</p>
          ) : (
            <Table columns={columns} data={records} keyField="guid" />
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
    </div>
  );
};

export default Reports;