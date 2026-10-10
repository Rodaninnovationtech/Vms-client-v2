// // // // // // import { Users, ClipboardCheck, Clock, Building2, ArrowUpRight } from "lucide-react";
// // // // // // import { Card, PageHeader, Table, Badge } from "@/components/ui";
// // // // // // import type { TableColumn, BadgeVariant } from "@/types";

// // // // // // interface RecentVisitor {
// // // // // //   id: string;
// // // // // //   name: string;
// // // // // //   purpose: string;
// // // // // //   site: string;
// // // // // //   time: string;
// // // // // //   status: "Checked In" | "Pending" | "Checked Out";
// // // // // // }

// // // // // // const stats = [
// // // // // //   { label: "Total Visitors Today", value: "128", icon: Users, change: "+12%" },
// // // // // //   { label: "Pending Approvals", value: "9", icon: ClipboardCheck, change: "-3%" },
// // // // // //   { label: "Currently On-Site", value: "42", icon: Clock, change: "+5%" },
// // // // // //   { label: "Active Sites", value: "6", icon: Building2, change: "0%" },
// // // // // // ];

// // // // // // const recentVisitors: RecentVisitor[] = [
// // // // // //   { id: "V-1042", name: "Rohit Sharma", purpose: "Meeting", site: "Tower A", time: "09:32 AM", status: "Checked In" },
// // // // // //   { id: "V-1041", name: "Meena Iyer", purpose: "Delivery", site: "Tower B", time: "09:15 AM", status: "Pending" },
// // // // // //   { id: "V-1040", name: "Contractor - ABC Elec.", purpose: "Maintenance", site: "Tower C", time: "08:50 AM", status: "Checked In" },
// // // // // //   { id: "V-1039", name: "Karan Mehta", purpose: "Interview", site: "Tower A", time: "08:20 AM", status: "Checked Out" },
// // // // // //   { id: "V-1038", name: "Priya Nair", purpose: "Meeting", site: "Tower B", time: "07:58 AM", status: "Checked Out" },
// // // // // // ];

// // // // // // const statusVariant: Record<RecentVisitor["status"], BadgeVariant> = {
// // // // // //   "Checked In": "success",
// // // // // //   Pending: "warning",
// // // // // //   "Checked Out": "neutral",
// // // // // // };

// // // // // // const columns: TableColumn<RecentVisitor>[] = [
// // // // // //   { key: "id", header: "Visitor ID" },
// // // // // //   { key: "name", header: "Name" },
// // // // // //   { key: "purpose", header: "Purpose" },
// // // // // //   { key: "site", header: "Site" },
// // // // // //   { key: "time", header: "Time" },
// // // // // //   {
// // // // // //     key: "status",
// // // // // //     header: "Status",
// // // // // //     render: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
// // // // // //   },
// // // // // // ];

// // // // // // const Dashboard = () => {
// // // // // //   return (
// // // // // //     <div>
// // // // // //       <PageHeader
// // // // // //         title="Dashboard"
// // // // // //         description="Overview of today's visitor and site activity."
// // // // // //       />

// // // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
// // // // // //         {stats.map((stat) => (
// // // // // //           <Card key={stat.label} className="!p-0">
// // // // // //             <div className="p-4 sm:p-5 flex items-start justify-between">
// // // // // //               <div>
// // // // // //                 <p className="text-xs text-slate-500 mb-1.5">{stat.label}</p>
// // // // // //                 <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
// // // // // //                 <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5">
// // // // // //                   <ArrowUpRight size={12} />
// // // // // //                   {stat.change} vs yesterday
// // // // // //                 </p>
// // // // // //               </div>
// // // // // //               <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
// // // // // //                 <stat.icon size={20} />
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </Card>
// // // // // //         ))}
// // // // // //       </div>

// // // // // //       <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
// // // // // //         <div className="xl:col-span-2">
// // // // // //           <Card title="Recent Visitor Activity" subtitle="Latest check-ins across all sites" noPadding>
// // // // // //             <div className="p-4 sm:p-5">
// // // // // //               <Table columns={columns} data={recentVisitors} keyField="id" />
// // // // // //             </div>
// // // // // //           </Card>
// // // // // //         </div>

// // // // // //         <Card title="Approvals Pending" subtitle="Awaiting your action">
// // // // // //           <div className="space-y-3">
// // // // // //             {["Vendor - Sri Logistics", "Contractor - ABC Elec.", "Guest - Anita Rao"].map((name) => (
// // // // // //               <div
// // // // // //                 key={name}
// // // // // //                 className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-primary-50/60"
// // // // // //               >
// // // // // //                 <div>
// // // // // //                   <p className="text-sm font-medium text-slate-800">{name}</p>
// // // // // //                   <p className="text-xs text-slate-500">Tower A · 10:00 AM</p>
// // // // // //                 </div>
// // // // // //                 <Badge variant="warning">Pending</Badge>
// // // // // //               </div>
// // // // // //             ))}
// // // // // //           </div>
// // // // // //         </Card>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default Dashboard;




// // // import { useEffect, useMemo, useState } from "react";
// // // import type { ComponentType } from "react";
// // // import {
// // //   Building2,
// // //   GitBranch,
// // //   MapPin,
// // //   Ticket,
// // //   KeyRound,
// // //   Users,
// // //   UserX,
// // //   Filter,
// // //   X,
// // //   LogIn,
// // //   LogOut,
// // //   Clock,
// // //   ChevronLeft,
// // //   ChevronRight,
// // // } from "lucide-react";
// // // import {
// // //   BarChart,
// // //   Bar,
// // //   XAxis,
// // //   YAxis,
// // //   CartesianGrid,
// // //   Tooltip,
// // //   Legend,
// // //   ResponsiveContainer,
// // // } from "recharts";
// // // import { Card, PageHeader } from "@/components/ui";
// // // import { userStorage } from "@/utils/storage";
// // // import { userService } from "@/service/usercreationservices";
// // // import type { SiteDropdownItem } from "@/service/usercreationservices";
// // // import { dashboardService } from "@/service/dashboardservices";
// // // import type {
// // //   DashboardSummary,
// // //   NotCheckedOutRecord,
// // //   VisitKind,
// // // } from "@/service/dashboardservices";

// // // /* -------------------------------------------------------------------------- */
// // // /*  Types & constants                                                         */
// // // /* -------------------------------------------------------------------------- */

// // // const SITE_MENU_KEY = "/dashboard";
// // // const PENDING_PAGE_SIZE = 10;

// // // interface SubsiteItem {
// // //   id?: number;
// // //   guid: string;
// // //   site_code?: string;
// // //   name: string;
// // // }

// // // interface StoredUser {
// // //   is_super_admin?: boolean;
// // //   site?: string;
// // //   site_detail?: SubsiteItem | null;
// // //   permissions?: {
// // //     menu_key: string;
// // //     view: boolean;
// // //     enabled: boolean;
// // //     subsites?: SubsiteItem[];
// // //   }[];
// // // }

// // // interface DropdownOption {
// // //   label: string;
// // //   value: string; // site guid ("" = All Sites, super admin only)
// // // }

// // // interface Filters {
// // //   site: string; // site guid, "" = all
// // //   from: string;
// // //   to: string;
// // // }

// // // /* -------------------------------------------------------------------------- */
// // // /*  Helpers                                                                   */
// // // /* -------------------------------------------------------------------------- */

// // // const formatShort = (iso: string) =>
// // //   new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
// // //     day: "2-digit",
// // //     month: "short",
// // //   });

// // // const formatDateTime = (iso: string) =>
// // //   new Date(iso).toLocaleString("en-IN", {
// // //     day: "2-digit",
// // //     month: "short",
// // //     hour: "2-digit",
// // //     minute: "2-digit",
// // //   });

// // // const num = (n: number | undefined) => (n ?? 0).toLocaleString("en-IN");

// // // const inputClass =
// // //   "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 " +
// // //   "focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 disabled:opacity-60";

// // // /* -------------------------------------------------------------------------- */
// // // /*  Stat card                                                                 */
// // // /* -------------------------------------------------------------------------- */

// // // interface StatCardProps {
// // //   label: string;
// // //   value: number;
// // //   icon: ComponentType<{ size?: number }>;
// // //   tone?: "default" | "danger" | "warning";
// // // }

// // // const toneClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
// // //   default: "bg-primary-100 text-primary-700",
// // //   danger: "bg-red-100 text-red-600",
// // //   warning: "bg-amber-100 text-amber-700",
// // // };

// // // const StatCard = ({ label, value, icon: Icon, tone = "default" }: StatCardProps) => (
// // //   <Card className="!p-0">
// // //     <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
// // //       <div>
// // //         <p className="text-xs text-slate-500 mb-1.5">{label}</p>
// // //         <p className="text-2xl font-bold text-slate-900">{num(value)}</p>
// // //       </div>
// // //       <div
// // //         className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${toneClass[tone]}`}
// // //       >
// // //         <Icon size={20} />
// // //       </div>
// // //     </div>
// // //   </Card>
// // // );

// // // /* -------------------------------------------------------------------------- */
// // // /*  Check-in / check-out chart                                                */
// // // /* -------------------------------------------------------------------------- */

// // // interface ActivityChartProps {
// // //   title: string;
// // //   subtitle: string;
// // //   data: { label: string; checkIn: number; checkOut: number }[];
// // // }

// // // const ActivityChart = ({ title, subtitle, data }: ActivityChartProps) => (
// // //   <Card title={title} subtitle={subtitle}>
// // //     {data.length === 0 ? (
// // //       <div className="h-72 flex items-center justify-center text-sm text-slate-500">
// // //         No data for this site and date range.
// // //       </div>
// // //     ) : (
// // //       <div className="h-72 w-full">
// // //         <ResponsiveContainer width="100%" height="100%">
// // //           <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
// // //             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
// // //             <XAxis
// // //               dataKey="label"
// // //               tick={{ fontSize: 11, fill: "#64748b" }}
// // //               tickLine={false}
// // //               axisLine={{ stroke: "#e2e8f0" }}
// // //               interval="preserveStartEnd"
// // //               minTickGap={16}
// // //             />
// // //             <YAxis
// // //               tick={{ fontSize: 11, fill: "#64748b" }}
// // //               tickLine={false}
// // //               axisLine={false}
// // //               allowDecimals={false}
// // //             />
// // //             <Tooltip
// // //               cursor={{ fill: "rgba(148,163,184,0.12)" }}
// // //               contentStyle={{
// // //                 borderRadius: 8,
// // //                 border: "1px solid #e2e8f0",
// // //                 fontSize: 12,
// // //                 boxShadow: "none",
// // //               }}
// // //             />
// // //             <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
// // //             <Bar dataKey="checkIn" name="Check-in" fill="#4f46e5" radius={[3, 3, 0, 0]} maxBarSize={14} />
// // //             <Bar dataKey="checkOut" name="Check-out" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={14} />
// // //           </BarChart>
// // //         </ResponsiveContainer>
// // //       </div>
// // //     )}
// // //   </Card>
// // // );

// // // /* -------------------------------------------------------------------------- */
// // // /*  Not-checked-out table                                                     */
// // // /* -------------------------------------------------------------------------- */

// // // interface PendingTableProps {
// // //   site: string;
// // //   from: string;
// // //   to: string;
// // // }

// // // const KIND_TABS: { label: string; value: VisitKind | "" }[] = [
// // //   { label: "All", value: "" },
// // //   { label: "Visitors", value: "Visitor" },
// // //   { label: "Contractors", value: "Contractor" },
// // // ];

// // // const PendingTable = ({ site, from, to }: PendingTableProps) => {
// // //   const [kind, setKind] = useState<VisitKind | "">("");
// // //   const [page, setPage] = useState(1);
// // //   const [rows, setRows] = useState<NotCheckedOutRecord[]>([]);
// // //   const [totalPages, setTotalPages] = useState(1);
// // //   const [totalRecords, setTotalRecords] = useState(0);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [loadError, setLoadError] = useState("");

// // //   // new filters -> back to the first page
// // //   useEffect(() => {
// // //     setPage(1);
// // //   }, [site, from, to, kind]);

// // //   useEffect(() => {
// // //     let cancelled = false;

// // //     (async () => {
// // //       setIsLoading(true);
// // //       setLoadError("");
// // //       try {
// // //         const res = await dashboardService.notCheckedOut(
// // //           { site_guid: site || null, from_date: from || null, to_date: to || null },
// // //           page,
// // //           PENDING_PAGE_SIZE,
// // //           kind,
// // //           ""
// // //         );
// // //         if (cancelled) return;
// // //         if (res.success && res.data) {
// // //           setRows(res.data.results ?? []);
// // //           setTotalPages(res.data.pagination?.total_pages ?? 1);
// // //           setTotalRecords(res.data.pagination?.total_records ?? 0);
// // //         } else {
// // //           setRows([]);
// // //           setLoadError(res.message || "Could not load the list.");
// // //         }
// // //       } catch {
// // //         if (!cancelled) {
// // //           setRows([]);
// // //           setLoadError("Could not load the list.");
// // //         }
// // //       } finally {
// // //         if (!cancelled) setIsLoading(false);
// // //       }
// // //     })();

// // //     return () => {
// // //       cancelled = true;
// // //     };
// // //   }, [site, from, to, kind, page]);

// // //   return (
// // //     <Card
// // //       title="Not checked out"
// // //       subtitle={`${num(totalRecords)} checked in during the selected period and still inside`}
// // //     >
// // //       <div className="flex gap-2 mb-4">
// // //         {KIND_TABS.map((t) => (
// // //           <button
// // //             key={t.label}
// // //             type="button"
// // //             onClick={() => setKind(t.value)}
// // //             className={`h-8 px-3 rounded-lg text-xs font-medium border transition-colors ${
// // //               kind === t.value
// // //                 ? "bg-primary-600 text-white border-primary-600"
// // //                 : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
// // //             }`}
// // //           >
// // //             {t.label}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {loadError ? (
// // //         <p role="alert" className="text-sm text-red-600 py-6 text-center">
// // //           {loadError}
// // //         </p>
// // //       ) : (
// // //         <div className="overflow-x-auto">
// // //           <table className="w-full text-sm text-left">
// // //             <thead>
// // //               <tr className="text-xs text-slate-500 border-b border-slate-200">
// // //                 <th className="py-2 pr-4 font-medium">Type</th>
// // //                 <th className="py-2 pr-4 font-medium">Name</th>
// // //                 <th className="py-2 pr-4 font-medium">Identity no.</th>
// // //                 <th className="py-2 pr-4 font-medium">Phone</th>
// // //                 <th className="py-2 pr-4 font-medium">Company</th>
// // //                 <th className="py-2 pr-4 font-medium">Site</th>
// // //                 <th className="py-2 pr-4 font-medium">Location</th>
// // //                 <th className="py-2 pr-4 font-medium">Pass</th>
// // //                 <th className="py-2 font-medium">Check-in</th>
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {isLoading ? (
// // //                 <tr>
// // //                   <td colSpan={9} className="py-8 text-center text-slate-500">
// // //                     Loading…
// // //                   </td>
// // //                 </tr>
// // //               ) : rows.length === 0 ? (
// // //                 <tr>
// // //                   <td colSpan={9} className="py-8 text-center text-slate-500">
// // //                     Everyone has checked out for this period.
// // //                   </td>
// // //                 </tr>
// // //               ) : (
// // //                 rows.map((r) => (
// // //                   <tr key={`${r.kind}-${r.guid}`} className="border-b border-slate-100 last:border-0">
// // //                     <td className="py-2.5 pr-4">
// // //                       <span
// // //                         className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
// // //                           r.kind === "Visitor"
// // //                             ? "bg-indigo-50 text-indigo-700"
// // //                             : "bg-amber-50 text-amber-700"
// // //                         }`}
// // //                       >
// // //                         {r.kind}
// // //                       </span>
// // //                     </td>
// // //                     <td className="py-2.5 pr-4 text-slate-900 whitespace-nowrap">{r.person_name}</td>
// // //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.identity_number || "-"}</td>
// // //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.phone_number || "-"}</td>
// // //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.company || "-"}</td>
// // //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.site_name}</td>
// // //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.location || "-"}</td>
// // //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.pass_no || "-"}</td>
// // //                     <td className="py-2.5 whitespace-nowrap">{formatDateTime(r.check_in)}</td>
// // //                   </tr>
// // //                 ))
// // //               )}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       )}

// // //       {totalPages > 1 && (
// // //         <div className="flex items-center justify-end gap-2 mt-4">
// // //           <span className="text-xs text-slate-500 mr-2">
// // //             Page {page} of {totalPages}
// // //           </span>
// // //           <button
// // //             type="button"
// // //             aria-label="Previous page"
// // //             disabled={page <= 1 || isLoading}
// // //             onClick={() => setPage((p) => p - 1)}
// // //             className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
// // //           >
// // //             <ChevronLeft size={16} />
// // //           </button>
// // //           <button
// // //             type="button"
// // //             aria-label="Next page"
// // //             disabled={page >= totalPages || isLoading}
// // //             onClick={() => setPage((p) => p + 1)}
// // //             className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
// // //           >
// // //             <ChevronRight size={16} />
// // //           </button>
// // //         </div>
// // //       )}
// // //     </Card>
// // //   );
// // // };

// // // /* -------------------------------------------------------------------------- */
// // // /*  Dashboard                                                                 */
// // // /* -------------------------------------------------------------------------- */

// // // const Dashboard = () => {
// // //   /* ---------- who is logged in (same source as SiteCreation) ---------- */
// // //   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
// // //   const isSuperAdmin = storedUser?.is_super_admin === true;
// // //   const ownSite = storedUser?.site_detail ?? null;
// // //   // const subsiteOptions: SubsiteItem[] =
// // //   //   storedUser?.permissions?.find((p) => p.menu_key === SITE_MENU_KEY)?.subsites ?? [];

// // //   // // Normal login: own site first, then the subsites they have access to
// // //   // const siteChoices: SubsiteItem[] = ownSite ? [ownSite, ...subsiteOptions] : subsiteOptions;
// // //   const dashboardPermission = storedUser?.permissions?.find(
// // //   (p) => p.menu_key === DASHBOARD_MENU_KEY
// // // );

// // // // show subsites only when view is true
// // // const subsiteOptions: SubsiteItem[] = dashboardPermission?.view
// // //   ? dashboardPermission.subsites ?? []
// // //   : [];

// // // // Normal login: own site first, then the subsites they have access to
// // // const siteChoices: SubsiteItem[] = ownSite
// // //   ? [ownSite, ...subsiteOptions.filter((s) => s.guid !== ownSite.guid)]
// // //   : subsiteOptions;

// // //   /* ---------- super admin: full site list for the dropdown ---------- */
// // //   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
// // //   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);

// // //   useEffect(() => {
// // //     if (!isSuperAdmin) return;
// // //     let cancelled = false;

// // //     (async () => {
// // //       setIsLoadingSites(true);
// // //       try {
// // //         const res = await userService.siteDropdown();
// // //         if (cancelled) return;
// // //         if (res.success && res.data) setAllSites(res.data.results ?? []);
// // //       } catch {
// // //         // leave list empty; the dropdown will just show "All Sites"
// // //       } finally {
// // //         if (!cancelled) setIsLoadingSites(false);
// // //       }
// // //     })();

// // //     return () => {
// // //       cancelled = true;
// // //     };
// // //   }, [isSuperAdmin]);

// // //   /* ---------- dropdown options ---------- */
// // //   const filterOptions: DropdownOption[] = isSuperAdmin
// // //     ? [
// // //         { label: "All Sites", value: "" },
// // //         ...allSites.map((s) => ({ label: s.site_name, value: s.guid })),
// // //       ]
// // //     : siteChoices.map((s) => ({
// // //     label:
// // //       s.guid === ownSite?.guid
// // //         ? `${s.name} (Primary)`
// // //         : `${s.name} (others)`,
// // //     value: s.guid,
// // //   }));

// // //   const defaultFilters: Filters = {
// // //     site: isSuperAdmin ? "" : ownSite?.guid ?? "",
// // //     from: "",
// // //     to: "",
// // //   };

// // //   const [draft, setDraft] = useState<Filters>(defaultFilters);
// // //   const [applied, setApplied] = useState<Filters>(defaultFilters);
// // //   const [error, setError] = useState("");

// // //   /* ---------- summary from the backend ---------- */
// // //   const [summary, setSummary] = useState<DashboardSummary | null>(null);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [loadError, setLoadError] = useState("");

// // //   useEffect(() => {
// // //     let cancelled = false;

// // //     (async () => {
// // //       setIsLoading(true);
// // //       setLoadError("");
// // //       try {
// // //         const res = await dashboardService.summary({
// // //           site_guid: applied.site || null,
// // //           from_date: applied.from || null,
// // //           to_date: applied.to || null,
// // //         });
// // //         if (cancelled) return;
// // //         if (res.success && res.data) {
// // //           setSummary(res.data);
// // //         } else {
// // //           setSummary(null);
// // //           setLoadError(res.message || "Could not load the dashboard.");
// // //         }
// // //       } catch {
// // //         if (!cancelled) {
// // //           setSummary(null);
// // //           setLoadError("Could not load the dashboard.");
// // //         }
// // //       } finally {
// // //         if (!cancelled) setIsLoading(false);
// // //       }
// // //     })();

// // //     return () => {
// // //       cancelled = true;
// // //     };
// // //   }, [applied]);

// // //   /* ---------- chart series ---------- */
// // //   const { visitorChart, contractorChart } = useMemo(() => {
// // //     const daily = summary?.daily ?? [];
// // //     return {
// // //       visitorChart: daily.map((d) => ({
// // //         label: formatShort(d.date),
// // //         checkIn: d.visitor_check_in,
// // //         checkOut: d.visitor_check_out,
// // //       })),
// // //       contractorChart: daily.map((d) => ({
// // //         label: formatShort(d.date),
// // //         checkIn: d.contractor_check_in,
// // //         checkOut: d.contractor_check_out,
// // //       })),
// // //     };
// // //   }, [summary]);

// // //   /* ---------- filter actions ---------- */
// // //   const handleApply = () => {
// // //     if (draft.from && draft.to && draft.from > draft.to) {
// // //       setError("From date can't be after To date.");
// // //       return;
// // //     }
// // //     setError("");
// // //     setApplied(draft);
// // //   };

// // //   const handleClear = () => {
// // //     setError("");
// // //     setDraft(defaultFilters);
// // //     setApplied(defaultFilters);
// // //   };

// // //   const isDefault = (f: Filters) =>
// // //     f.site === defaultFilters.site && f.from === "" && f.to === "";
// // //   const clearDisabled = isDefault(draft) && isDefault(applied);

// // //   // const selectedSiteName =
// // //   //   filterOptions
// // //   //     .find((o) => o.value === applied.site)
// // //   //     ?.label.replace(/ \((My Site|[^)]*)\)$/, "") ?? "";
// // //   const selectedSiteName =
// // //   applied.site === ""
// // //     ? isSuperAdmin
// // //       ? "All Sites"
// // //       : ""
// // //     : siteChoices.find((s) => s.guid === applied.site)?.name ??
// // //       allSites.find((s) => s.guid === applied.site)?.site_name ??
// // //       "";

// // //   const periodText = summary
// // //     ? ` · ${formatShort(summary.from_date)} to ${formatShort(summary.to_date)}`
// // //     : "";

// // //   const a = summary?.activity;
// // //   const t = summary?.totals;
// // //   const s = summary?.sites;

// // //   return (
// // //     <div>
// // //       <PageHeader
// // //         title="Dashboard"
// // //         description={`Overview for ${selectedSiteName || "your sites"}${periodText}.`}
// // //       />

// // //       {/* ------------------------------ Filters ------------------------------ */}
// // //       <Card className="mb-6">
// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] gap-3 items-end">
// // //           <div>
// // //             <label htmlFor="dash-site" className="block text-xs font-medium text-slate-600 mb-1.5">
// // //               Site
// // //             </label>
// // //             <select
// // //               id="dash-site"
// // //               className={inputClass}
// // //               value={draft.site}
// // //               disabled={isLoadingSites}
// // //               onChange={(e) => setDraft({ ...draft, site: e.target.value })}
// // //             >
// // //               {filterOptions.map((o) => (
// // //                 <option key={o.value} value={o.value}>
// // //                   {o.label}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </div>

// // //           <div>
// // //             <label htmlFor="dash-from" className="block text-xs font-medium text-slate-600 mb-1.5">
// // //               From date
// // //             </label>
// // //             <input
// // //               id="dash-from"
// // //               type="date"
// // //               className={inputClass}
// // //               value={draft.from}
// // //               max={draft.to || undefined}
// // //               onChange={(e) => setDraft({ ...draft, from: e.target.value })}
// // //             />
// // //           </div>

// // //           <div>
// // //             <label htmlFor="dash-to" className="block text-xs font-medium text-slate-600 mb-1.5">
// // //               To date
// // //             </label>
// // //             <input
// // //               id="dash-to"
// // //               type="date"
// // //               className={inputClass}
// // //               value={draft.to}
// // //               min={draft.from || undefined}
// // //               onChange={(e) => setDraft({ ...draft, to: e.target.value })}
// // //             />
// // //           </div>

// // //           <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
// // //             <button
// // //               type="button"
// // //               onClick={handleApply}
// // //               className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
// // //             >
// // //               <Filter size={15} />
// // //               Apply
// // //             </button>
// // //             <button
// // //               type="button"
// // //               onClick={handleClear}
// // //               disabled={clearDisabled}
// // //               className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
// // //             >
// // //               <X size={15} />
// // //               Clear
// // //             </button>
// // //           </div>
// // //         </div>
// // //         {error && (
// // //           <p role="alert" className="text-xs text-red-600 mt-2.5">
// // //             {error}
// // //           </p>
// // //         )}
// // //         {!applied.from && !applied.to && (
// // //           <p className="text-xs text-slate-500 mt-2.5">
// // //             No dates selected: check-in / check-out figures cover the last 30 days.
// // //           </p>
// // //         )}
// // //       </Card>

// // //       {loadError && (
// // //         <p role="alert" className="text-sm text-red-600 mb-4">
// // //           {loadError}
// // //         </p>
// // //       )}

// // //       {/* ------------------- Site counts (super admin only) ------------------- */}
// // //       {isSuperAdmin && (
// // //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// // //           <StatCard label="Parent sites" value={s?.parent ?? 0} icon={Building2} />
// // //           <StatCard label="Sub-sites" value={s?.sub ?? 0} icon={GitBranch} />
// // //           <StatCard label="Individual sites" value={s?.individual ?? 0} icon={MapPin} />
// // //         </div>
// // //       )}

// // //       {/* ----------------- Pass / Key / Tenant / Banned cards ----------------- */}
// // //       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
// // //         <StatCard label="Passes" value={t?.passes ?? 0} icon={Ticket} />
// // //         <StatCard label="Keys" value={t?.keys ?? 0} icon={KeyRound} />
// // //         <StatCard label="Tenants" value={t?.tenants ?? 0} icon={Users} />
// // //         <StatCard label="Banned persons" value={t?.banned ?? 0} icon={UserX} tone="danger" />
// // //       </div>

// // //       {/* ------------- Check-in / check-out / not checked out cards ------------- */}
// // //       {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
// // //         <StatCard label="Visitor check-ins" value={a?.visitor_check_in ?? 0} icon={LogIn} />
// // //         <StatCard label="Visitor check-outs" value={a?.visitor_check_out ?? 0} icon={LogOut} />
// // //         <StatCard
// // //           label="Visitors not checked out"
// // //           value={a?.visitor_not_checked_out ?? 0}
// // //           icon={Clock}
// // //           tone="warning"
// // //         />
// // //         <StatCard label="Contractor check-ins" value={a?.contractor_check_in ?? 0} icon={LogIn} />
// // //         <StatCard label="Contractor check-outs" value={a?.contractor_check_out ?? 0} icon={LogOut} />
// // //         <StatCard
// // //           label="Contractors not checked out"
// // //           value={a?.contractor_not_checked_out ?? 0}
// // //           icon={Clock}
// // //           tone="warning"
// // //         />
// // //       </div> */}

// // //       {/* ------------------------------- Charts ------------------------------- */}
// // //       <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
// // //         <ActivityChart
// // //           title="Visitors"
// // //           subtitle={`${num(a?.visitor_check_in)} check-ins · ${num(a?.visitor_check_out)} check-outs`}
// // //           data={isLoading ? [] : visitorChart}
// // //         />
// // //         <ActivityChart
// // //           title="Contractors"
// // //           subtitle={`${num(a?.contractor_check_in)} check-ins · ${num(a?.contractor_check_out)} check-outs`}
// // //           data={isLoading ? [] : contractorChart}
// // //         />
// // //       </div>

// // //       {/* ------------------------- Not checked out list ------------------------- */}
// // //       <PendingTable site={applied.site} from={applied.from} to={applied.to} />
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;



// // import { useEffect, useMemo, useState } from "react";
// // import type { ComponentType } from "react";
// // import {
// //   Building2,
// //   GitBranch,
// //   MapPin,
// //   Ticket,
// //   KeyRound,
// //   Users,
// //   UserX,
// //   Filter,
// //   X,
// //   ChevronLeft,
// //   ChevronRight,
// // } from "lucide-react";
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts";
// // import { Card, PageHeader } from "@/components/ui";
// // import { userStorage } from "@/utils/storage";
// // import { userService } from "@/service/usercreationservices";
// // import type { SiteDropdownItem } from "@/service/usercreationservices";
// // import { dashboardService } from "@/service/dashboardservices";
// // import type {
// //   DashboardSummary,
// //   NotCheckedOutRecord,
// //   VisitKind,
// // } from "@/service/dashboardservices";

// // /* -------------------------------------------------------------------------- */
// // /*  Types & constants                                                         */
// // /* -------------------------------------------------------------------------- */

// // const DASHBOARD_MENU_KEY = "/dashboard";
// // const PENDING_PAGE_SIZE = 10;

// // interface SubsiteItem {
// //   id?: number;
// //   guid: string;
// //   site_code?: string;
// //   name: string;
// // }

// // interface StoredUser {
// //   is_super_admin?: boolean;
// //   site_detail?: SubsiteItem | null;
// //   permissions?: {
// //     menu_key: string;
// //     view: boolean;
// //     enabled: boolean;
// //     subsites?: SubsiteItem[];
// //   }[];
// // }

// // interface DropdownOption {
// //   label: string;
// //   value: string; // site guid ("" = All Sites, super admin only)
// // }

// // interface Filters {
// //   site: string; // site guid, "" = all
// //   from: string;
// //   to: string;
// // }

// // /* -------------------------------------------------------------------------- */
// // /*  Helpers                                                                   */
// // /* -------------------------------------------------------------------------- */

// // const formatShort = (iso: string) =>
// //   new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
// //     day: "2-digit",
// //     month: "short",
// //   });

// // const formatDateTime = (iso: string) =>
// //   new Date(iso).toLocaleString("en-IN", {
// //     day: "2-digit",
// //     month: "short",
// //     hour: "2-digit",
// //     minute: "2-digit",
// //   });

// // const num = (n: number | undefined) => (n ?? 0).toLocaleString("en-IN");

// // const inputClass =
// //   "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 " +
// //   "focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 disabled:opacity-60";

// // /* -------------------------------------------------------------------------- */
// // /*  Stat card                                                                 */
// // /* -------------------------------------------------------------------------- */

// // interface StatCardProps {
// //   label: string;
// //   value: number;
// //   icon: ComponentType<{ size?: number }>;
// //   tone?: "default" | "danger";
// // }

// // const toneClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
// //   default: "bg-primary-100 text-primary-700",
// //   danger: "bg-red-100 text-red-600",
// // };

// // const StatCard = ({ label, value, icon: Icon, tone = "default" }: StatCardProps) => (
// //   <Card className="!p-0">
// //     <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
// //       <div>
// //         <p className="text-xs text-slate-500 mb-1.5">{label}</p>
// //         <p className="text-2xl font-bold text-slate-900">{num(value)}</p>
// //       </div>
// //       <div
// //         className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${toneClass[tone]}`}
// //       >
// //         <Icon size={20} />
// //       </div>
// //     </div>
// //   </Card>
// // );

// // /* -------------------------------------------------------------------------- */
// // /*  Check-in / check-out chart                                                */
// // /* -------------------------------------------------------------------------- */

// // interface ActivityChartProps {
// //   title: string;
// //   subtitle: string;
// //   data: { label: string; checkIn: number; checkOut: number }[] | null; // null = not loaded yet
// // }

// // const ActivityChart = ({ title, subtitle, data }: ActivityChartProps) => (
// //   <Card title={title} subtitle={subtitle}>
// //     {data === null ? (
// //       <div className="h-72" />
// //     ) : data.length === 0 ? (
// //       <div className="h-72 flex items-center justify-center text-sm text-slate-500">
// //         No data for this site and date range.
// //       </div>
// //     ) : (
// //       <div className="h-72 w-full">
// //         <ResponsiveContainer width="100%" height="100%">
// //           <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
// //             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
// //             <XAxis
// //               dataKey="label"
// //               tick={{ fontSize: 11, fill: "#64748b" }}
// //               tickLine={false}
// //               axisLine={{ stroke: "#e2e8f0" }}
// //               interval="preserveStartEnd"
// //               minTickGap={16}
// //             />
// //             <YAxis
// //               tick={{ fontSize: 11, fill: "#64748b" }}
// //               tickLine={false}
// //               axisLine={false}
// //               allowDecimals={false}
// //             />
// //             <Tooltip
// //               cursor={{ fill: "rgba(148,163,184,0.12)" }}
// //               contentStyle={{
// //                 borderRadius: 8,
// //                 border: "1px solid #e2e8f0",
// //                 fontSize: 12,
// //                 boxShadow: "none",
// //               }}
// //             />
// //             <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
// //             <Bar dataKey="checkIn" name="Check-in" fill="#4f46e5" radius={[3, 3, 0, 0]} maxBarSize={14} />
// //             <Bar dataKey="checkOut" name="Check-out" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={14} />
// //           </BarChart>
// //         </ResponsiveContainer>
// //       </div>
// //     )}
// //   </Card>
// // );

// // /* -------------------------------------------------------------------------- */
// // /*  Not-checked-out table                                                     */
// // /* -------------------------------------------------------------------------- */

// // interface PendingTableProps {
// //   site: string;
// //   from: string;
// //   to: string;
// // }

// // const KIND_TABS: { label: string; value: VisitKind | "" }[] = [
// //   { label: "All", value: "" },
// //   { label: "Visitors", value: "Visitor" },
// //   { label: "Contractors", value: "Contractor" },
// // ];

// // const PendingTable = ({ site, from, to }: PendingTableProps) => {
// //   const [kind, setKind] = useState<VisitKind | "">("");
// //   const [page, setPage] = useState(1);
// //   const [rows, setRows] = useState<NotCheckedOutRecord[] | null>(null); // null = not loaded yet
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [totalRecords, setTotalRecords] = useState(0);
// //   const [loadError, setLoadError] = useState("");

// //   // New site / date filters -> back to page 1.
// //   // Done during render so only ONE request is sent (no fetch with the stale page).
// //   const filterKey = `${site}|${from}|${to}`;
// //   const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
// //   if (prevFilterKey !== filterKey) {
// //     setPrevFilterKey(filterKey);
// //     setPage(1);
// //   }

// //   const changeKind = (value: VisitKind | "") => {
// //     setKind(value);
// //     setPage(1);
// //   };

// //   useEffect(() => {
// //     let cancelled = false;

// //     (async () => {
// //       setLoadError("");
// //       try {
// //         const res = await dashboardService.notCheckedOut(
// //           { site_guid: site || null, from_date: from || null, to_date: to || null },
// //           page,
// //           PENDING_PAGE_SIZE,
// //           kind,
// //           ""
// //         );
// //         if (cancelled) return;
// //         if (res.success && res.data) {
// //           setRows(res.data.results ?? []);
// //           setTotalPages(res.data.pagination?.total_pages ?? 1);
// //           setTotalRecords(res.data.pagination?.total_records ?? 0);
// //         } else {
// //           setRows([]);
// //           setLoadError(res.message || "Could not load the list.");
// //         }
// //       } catch {
// //         if (!cancelled) {
// //           setRows([]);
// //           setLoadError("Could not load the list.");
// //         }
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [site, from, to, kind, page]);

// //   return (
// //     <Card
// //       title="Not checked out"
// //       subtitle={`${num(totalRecords)} checked in during the selected period and still inside`}
// //     >
// //       <div className="flex gap-2 mb-4">
// //         {KIND_TABS.map((t) => (
// //           <button
// //             key={t.label}
// //             type="button"
// //             onClick={() => changeKind(t.value)}
// //             className={`h-8 px-3 rounded-lg text-xs font-medium border transition-colors ${
// //               kind === t.value
// //                 ? "bg-primary-600 text-white border-primary-600"
// //                 : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
// //             }`}
// //           >
// //             {t.label}
// //           </button>
// //         ))}
// //       </div>

// //       {loadError ? (
// //         <p role="alert" className="text-sm text-red-600 py-6 text-center">
// //           {loadError}
// //         </p>
// //       ) : (
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-sm text-left">
// //             <thead>
// //               <tr className="text-xs text-slate-500 border-b border-slate-200">
// //                 <th className="py-2 pr-4 font-medium">Type</th>
// //                 <th className="py-2 pr-4 font-medium">Name</th>
// //                 <th className="py-2 pr-4 font-medium">Identity no.</th>
// //                 <th className="py-2 pr-4 font-medium">Phone</th>
// //                 <th className="py-2 pr-4 font-medium">Company</th>
// //                 <th className="py-2 pr-4 font-medium">Site</th>
// //                 <th className="py-2 pr-4 font-medium">Location</th>
// //                 <th className="py-2 pr-4 font-medium">Pass</th>
// //                 <th className="py-2 font-medium">Check-in</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {rows !== null && rows.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={9} className="py-8 text-center text-slate-500">
// //                     Everyone has checked out for this period.
// //                   </td>
// //                 </tr>
// //               ) : (
// //                 (rows ?? []).map((r) => (
// //                   <tr key={`${r.kind}-${r.guid}`} className="border-b border-slate-100 last:border-0">
// //                     <td className="py-2.5 pr-4">
// //                       <span
// //                         className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
// //                           r.kind === "Visitor"
// //                             ? "bg-indigo-50 text-indigo-700"
// //                             : "bg-amber-50 text-amber-700"
// //                         }`}
// //                       >
// //                         {r.kind}
// //                       </span>
// //                     </td>
// //                     <td className="py-2.5 pr-4 text-slate-900 whitespace-nowrap">{r.person_name}</td>
// //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.identity_number || "-"}</td>
// //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.phone_number || "-"}</td>
// //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.company || "-"}</td>
// //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.site_name}</td>
// //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.location || "-"}</td>
// //                     <td className="py-2.5 pr-4 whitespace-nowrap">{r.pass_no || "-"}</td>
// //                     <td className="py-2.5 whitespace-nowrap">{formatDateTime(r.check_in)}</td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}

// //       {totalPages > 1 && (
// //         <div className="flex items-center justify-end gap-2 mt-4">
// //           <span className="text-xs text-slate-500 mr-2">
// //             Page {page} of {totalPages}
// //           </span>
// //           <button
// //             type="button"
// //             aria-label="Previous page"
// //             disabled={page <= 1}
// //             onClick={() => setPage((p) => p - 1)}
// //             className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             <ChevronLeft size={16} />
// //           </button>
// //           <button
// //             type="button"
// //             aria-label="Next page"
// //             disabled={page >= totalPages}
// //             onClick={() => setPage((p) => p + 1)}
// //             className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //           >
// //             <ChevronRight size={16} />
// //           </button>
// //         </div>
// //       )}
// //     </Card>
// //   );
// // };

// // /* -------------------------------------------------------------------------- */
// // /*  Dashboard                                                                 */
// // /* -------------------------------------------------------------------------- */

// // const Dashboard = () => {
// //   /* ---------- who is logged in ---------- */
// //   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
// //   const isSuperAdmin = storedUser?.is_super_admin === true;
// //   const ownSite = storedUser?.site_detail ?? null;

// //   // Subsites are shown only when the Dashboard permission has view = true
// //   const dashboardPermission = storedUser?.permissions?.find(
// //     (p) => p.menu_key === DASHBOARD_MENU_KEY
// //   );
// //   const subsiteOptions: SubsiteItem[] = dashboardPermission?.view
// //     ? dashboardPermission.subsites ?? []
// //     : [];

// //   // Normal login: own site first, then the subsites they can view
// //   const siteChoices: SubsiteItem[] = ownSite
// //     ? [ownSite, ...subsiteOptions.filter((s) => s.guid !== ownSite.guid)]
// //     : subsiteOptions;

// //   /* ---------- super admin only: full site list for the dropdown ---------- */
// //   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);

// //   useEffect(() => {
// //     if (!isSuperAdmin) return;
// //     let cancelled = false;

// //     (async () => {
// //       try {
// //         const res = await userService.siteDropdown();
// //         if (cancelled) return;
// //         if (res.success && res.data) setAllSites(res.data.results ?? []);
// //       } catch {
// //         // leave list empty; the dropdown will just show "All Sites"
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [isSuperAdmin]);

// //   /* ---------- dropdown options ---------- */
// //   const filterOptions: DropdownOption[] = isSuperAdmin
// //     ? [
// //         { label: "All Sites", value: "" },
// //         ...allSites.map((s) => ({ label: s.site_name, value: s.guid })),
// //       ]
// //     : siteChoices.map((s) => ({
// //         label: s.guid === ownSite?.guid ? `${s.name} (Primary)` : `${s.name} (others)`,
// //         value: s.guid,
// //       }));

// //   const defaultFilters: Filters = {
// //     site: isSuperAdmin ? "" : ownSite?.guid ?? siteChoices[0]?.guid ?? "",
// //     from: "",
// //     to: "",
// //   };

// //   const [draft, setDraft] = useState<Filters>(defaultFilters);
// //   const [applied, setApplied] = useState<Filters>(defaultFilters);
// //   const [error, setError] = useState("");

// //   /* ---------- summary from the backend ---------- */
// //   const [summary, setSummary] = useState<DashboardSummary | null>(null);
// //   const [loadError, setLoadError] = useState("");

// //   useEffect(() => {
// //     let cancelled = false;

// //     (async () => {
// //       setLoadError("");
// //       try {
// //         const res = await dashboardService.summary({
// //           site_guid: applied.site || null,
// //           from_date: applied.from || null,
// //           to_date: applied.to || null,
// //         });
// //         if (cancelled) return;
// //         if (res.success && res.data) {
// //           setSummary(res.data);
// //         } else {
// //           setSummary(null);
// //           setLoadError(res.message || "Could not load the dashboard.");
// //         }
// //       } catch {
// //         if (!cancelled) {
// //           setSummary(null);
// //           setLoadError("Could not load the dashboard.");
// //         }
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [applied]);

// //   /* ---------- chart series ---------- */
// //   const { visitorChart, contractorChart } = useMemo(() => {
// //     const daily = summary?.daily ?? [];
// //     return {
// //       visitorChart: daily.map((d) => ({
// //         label: formatShort(d.date),
// //         checkIn: d.visitor_check_in,
// //         checkOut: d.visitor_check_out,
// //       })),
// //       contractorChart: daily.map((d) => ({
// //         label: formatShort(d.date),
// //         checkIn: d.contractor_check_in,
// //         checkOut: d.contractor_check_out,
// //       })),
// //     };
// //   }, [summary]);

// //   /* ---------- filter actions ---------- */
// //   const handleApply = () => {
// //     if (draft.from && draft.to && draft.from > draft.to) {
// //       setError("From date can't be after To date.");
// //       return;
// //     }
// //     setError("");

// //     // same filters as already applied -> no need to call the API again
// //     if (
// //       draft.site === applied.site &&
// //       draft.from === applied.from &&
// //       draft.to === applied.to
// //     ) {
// //       return;
// //     }
// //     setApplied(draft);
// //   };

// //   const handleClear = () => {
// //     setError("");
// //     setDraft(defaultFilters);
// //     setApplied(defaultFilters);
// //   };

// //   const isDefault = (f: Filters) =>
// //     f.site === defaultFilters.site && f.from === "" && f.to === "";
// //   const clearDisabled = isDefault(draft) && isDefault(applied);

// //   const selectedSiteName =
// //     applied.site === ""
// //       ? isSuperAdmin
// //         ? "All Sites"
// //         : ""
// //       : siteChoices.find((s) => s.guid === applied.site)?.name ??
// //         allSites.find((s) => s.guid === applied.site)?.site_name ??
// //         "";

// //   const periodText = summary
// //     ? ` · ${formatShort(summary.from_date)} to ${formatShort(summary.to_date)}`
// //     : "";

// //   const a = summary?.activity;
// //   const t = summary?.totals;
// //   const s = summary?.sites;

// //   return (
// //     <div>
// //       <PageHeader
// //         title="Dashboard"
// //         description={`Overview for ${selectedSiteName || "your sites"}${periodText}.`}
// //       />

// //       {/* ------------------------------ Filters ------------------------------ */}
// //       <Card className="mb-6">
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] gap-3 items-end">
// //           <div>
// //             <label htmlFor="dash-site" className="block text-xs font-medium text-slate-600 mb-1.5">
// //               Site
// //             </label>
// //             <select
// //               id="dash-site"
// //               className={inputClass}
// //               value={draft.site}
// //               onChange={(e) => setDraft({ ...draft, site: e.target.value })}
// //             >
// //               {filterOptions.map((o) => (
// //                 <option key={o.value} value={o.value}>
// //                   {o.label}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div>
// //             <label htmlFor="dash-from" className="block text-xs font-medium text-slate-600 mb-1.5">
// //               From date
// //             </label>
// //             <input
// //               id="dash-from"
// //               type="date"
// //               className={inputClass}
// //               value={draft.from}
// //               max={draft.to || undefined}
// //               onChange={(e) => setDraft({ ...draft, from: e.target.value })}
// //             />
// //           </div>

// //           <div>
// //             <label htmlFor="dash-to" className="block text-xs font-medium text-slate-600 mb-1.5">
// //               To date
// //             </label>
// //             <input
// //               id="dash-to"
// //               type="date"
// //               className={inputClass}
// //               value={draft.to}
// //               min={draft.from || undefined}
// //               onChange={(e) => setDraft({ ...draft, to: e.target.value })}
// //             />
// //           </div>

// //           <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
// //             <button
// //               type="button"
// //               onClick={handleApply}
// //               className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
// //             >
// //               <Filter size={15} />
// //               Apply
// //             </button>
// //             <button
// //               type="button"
// //               onClick={handleClear}
// //               disabled={clearDisabled}
// //               className="h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
// //             >
// //               <X size={15} />
// //               Clear
// //             </button>
// //           </div>
// //         </div>
// //         {error && (
// //           <p role="alert" className="text-xs text-red-600 mt-2.5">
// //             {error}
// //           </p>
// //         )}
// //         {!applied.from && !applied.to && (
// //           <p className="text-xs text-slate-500 mt-2.5">
// //             No dates selected: check-in / check-out figures cover the last 30 days.
// //           </p>
// //         )}
// //       </Card>

// //       {loadError && (
// //         <p role="alert" className="text-sm text-red-600 mb-4">
// //           {loadError}
// //         </p>
// //       )}

// //       {/* ------------------- Site counts (super admin only) ------------------- */}
// //       {isSuperAdmin && (
// //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
// //           <StatCard label="Parent sites" value={s?.parent ?? 0} icon={Building2} />
// //           <StatCard label="Sub-sites" value={s?.sub ?? 0} icon={GitBranch} />
// //           <StatCard label="Individual sites" value={s?.individual ?? 0} icon={MapPin} />
// //         </div>
// //       )}

// //       {/* ----------------- Pass / Key / Tenant / Banned cards ----------------- */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
// //         <StatCard label="Passes" value={t?.passes ?? 0} icon={Ticket} />
// //         <StatCard label="Keys" value={t?.keys ?? 0} icon={KeyRound} />
// //         <StatCard label="Tenants" value={t?.tenants ?? 0} icon={Users} />
// //         <StatCard label="Banned persons" value={t?.banned ?? 0} icon={UserX} tone="danger" />
// //       </div>

// //       {/* ------------------------------- Charts ------------------------------- */}
// //       <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
// //         <ActivityChart
// //           title="Visitors"
// //           subtitle={`${num(a?.visitor_check_in)} check-ins · ${num(a?.visitor_check_out)} check-outs`}
// //           data={summary ? visitorChart : null}
// //         />
// //         <ActivityChart
// //           title="Contractors"
// //           subtitle={`${num(a?.contractor_check_in)} check-ins · ${num(a?.contractor_check_out)} check-outs`}
// //           data={summary ? contractorChart : null}
// //         />
// //       </div>

// //       {/* ------------------------- Not checked out list ------------------------- */}
// //       <PendingTable site={applied.site} from={applied.from} to={applied.to} />
// //     </div>
// //   );
// // };

// // export default Dashboard;



// import { useEffect, useMemo, useState } from "react";
// import type { ComponentType } from "react";
// import {
//   Building2,
//   GitBranch,
//   MapPin,
//   Ticket,
//   KeyRound,
//   Users,
//   UserX,
//   Filter,
//   X,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { Card, PageHeader } from "@/components/ui";
// import { userStorage } from "@/utils/storage";
// import { userService } from "@/service/usercreationservices";
// import type { SiteDropdownItem } from "@/service/usercreationservices";
// import { dashboardService } from "@/service/dashboardservices";
// import type {
//   DashboardSummary,
//   NotCheckedOutRecord,
//   VisitKind,
// } from "@/service/dashboardservices";

// /* -------------------------------------------------------------------------- */
// /*  Types & constants                                                         */
// /* -------------------------------------------------------------------------- */

// const DASHBOARD_MENU_KEY = "/dashboard";
// const PENDING_PAGE_SIZE = 10;

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

// interface DropdownOption {
//   label: string;
//   value: string; // site guid ("" = All Sites, super admin only)
// }

// interface Filters {
//   site: string; // site guid, "" = all
//   from: string;
//   to: string;
// }

// /* -------------------------------------------------------------------------- */
// /*  Helpers                                                                   */
// /* -------------------------------------------------------------------------- */

// const formatShort = (iso: string) =>
//   new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//   });

// const formatDateTime = (iso: string) =>
//   new Date(iso).toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// const num = (n: number | undefined) => (n ?? 0).toLocaleString("en-IN");

// const inputClass =
//   "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 " +
//   "focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 disabled:opacity-60";

// /* -------------------------------------------------------------------------- */
// /*  Stat card                                                                 */
// /* -------------------------------------------------------------------------- */

// interface StatCardProps {
//   label: string;
//   value: number;
//   icon: ComponentType<{ size?: number }>;
//   tone?: "default" | "danger";
// }

// const toneClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
//   default: "bg-primary-100 text-primary-700",
//   danger: "bg-red-100 text-red-600",
// };

// const StatCard = ({ label, value, icon: Icon, tone = "default" }: StatCardProps) => (
//   <Card className="!p-0">
//     <div className="p-3 sm:p-4 xl:p-5 flex items-center justify-between gap-2 sm:gap-3">
//       <div className="min-w-0">
//         <p className="text-[11px] sm:text-xs text-slate-500 mb-1 sm:mb-1.5 truncate">{label}</p>
//         <p className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{num(value)}</p>
//       </div>
//       <div
//         className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${toneClass[tone]}`}
//       >
//         <Icon size={18} />
//       </div>
//     </div>
//   </Card>
// );

// /* -------------------------------------------------------------------------- */
// /*  Check-in / check-out chart                                                */
// /* -------------------------------------------------------------------------- */

// interface ActivityChartProps {
//   title: string;
//   subtitle: string;
//   data: { label: string; checkIn: number; checkOut: number }[] | null; // null = not loaded yet
// }

// const ActivityChart = ({ title, subtitle, data }: ActivityChartProps) => (
//   <Card title={title} subtitle={subtitle}>
//     {data === null ? (
//       <div className="h-60 sm:h-72" />
//     ) : data.length === 0 ? (
//       <div className="h-60 sm:h-72 flex items-center justify-center text-sm text-slate-500 text-center px-4">
//         No data for this site and date range.
//       </div>
//     ) : (
//       <div className="h-60 sm:h-72 w-full">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
//             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
//             <XAxis
//               dataKey="label"
//               tick={{ fontSize: 11, fill: "#64748b" }}
//               tickLine={false}
//               axisLine={{ stroke: "#e2e8f0" }}
//               interval="preserveStartEnd"
//               minTickGap={16}
//             />
//             <YAxis
//               tick={{ fontSize: 11, fill: "#64748b" }}
//               tickLine={false}
//               axisLine={false}
//               allowDecimals={false}
//             />
//             <Tooltip
//               cursor={{ fill: "rgba(148,163,184,0.12)" }}
//               contentStyle={{
//                 borderRadius: 8,
//                 border: "1px solid #e2e8f0",
//                 fontSize: 12,
//                 boxShadow: "none",
//               }}
//             />
//             <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
//             <Bar dataKey="checkIn" name="Check-in" fill="#4f46e5" radius={[3, 3, 0, 0]} maxBarSize={14} />
//             <Bar dataKey="checkOut" name="Check-out" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={14} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     )}
//   </Card>
// );

// /* -------------------------------------------------------------------------- */
// /*  Not-checked-out table                                                     */
// /* -------------------------------------------------------------------------- */

// interface PendingTableProps {
//   site: string;
//   from: string;
//   to: string;
// }

// const KIND_TABS: { label: string; value: VisitKind | "" }[] = [
//   { label: "All", value: "" },
//   { label: "Visitors", value: "Visitor" },
//   { label: "Contractors", value: "Contractor" },
// ];

// const kindBadgeClass = (kind: string) =>
//   kind === "Visitor" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700";

// const PendingTable = ({ site, from, to }: PendingTableProps) => {
//   const [kind, setKind] = useState<VisitKind | "">("");
//   const [page, setPage] = useState(1);
//   const [rows, setRows] = useState<NotCheckedOutRecord[] | null>(null); // null = not loaded yet
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [loadError, setLoadError] = useState("");

//   // New site / date filters -> back to page 1.
//   // Done during render so only ONE request is sent (no fetch with the stale page).
//   const filterKey = `${site}|${from}|${to}`;
//   const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
//   if (prevFilterKey !== filterKey) {
//     setPrevFilterKey(filterKey);
//     setPage(1);
//   }

//   const changeKind = (value: VisitKind | "") => {
//     setKind(value);
//     setPage(1);
//   };

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       setLoadError("");
//       try {
//         const res = await dashboardService.notCheckedOut(
//           { site_guid: site || null, from_date: from || null, to_date: to || null },
//           page,
//           PENDING_PAGE_SIZE,
//           kind,
//           ""
//         );
//         if (cancelled) return;
//         if (res.success && res.data) {
//           setRows(res.data.results ?? []);
//           setTotalPages(res.data.pagination?.total_pages ?? 1);
//           setTotalRecords(res.data.pagination?.total_records ?? 0);
//         } else {
//           setRows([]);
//           setLoadError(res.message || "Could not load the list.");
//         }
//       } catch {
//         if (!cancelled) {
//           setRows([]);
//           setLoadError("Could not load the list.");
//         }
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [site, from, to, kind, page]);

//   const isEmpty = rows !== null && rows.length === 0;

//   return (
//     <Card
//       title="Not checked out"
//       subtitle={`${num(totalRecords)} checked in during the selected period and still inside`}
//     >
//       {/* Kind tabs (scrollable on very small screens) */}
//       <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
//         {KIND_TABS.map((t) => (
//           <button
//             key={t.label}
//             type="button"
//             onClick={() => changeKind(t.value)}
//             className={`h-8 px-3 shrink-0 rounded-lg text-xs font-medium border transition-colors ${
//               kind === t.value
//                 ? "bg-primary-600 text-white border-primary-600"
//                 : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
//             }`}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {loadError ? (
//         <p role="alert" className="text-sm text-red-600 py-6 text-center">
//           {loadError}
//         </p>
//       ) : (
//         <>
//           {/* ---------------- Mobile (below md): card list ---------------- */}
//           <div className="md:hidden space-y-3">
//             {isEmpty ? (
//               <p className="py-8 text-center text-sm text-slate-500">
//                 Everyone has checked out for this period.
//               </p>
//             ) : (
//               (rows ?? []).map((r) => (
//                 <div
//                   key={`${r.kind}-${r.guid}`}
//                   className="rounded-lg border border-slate-200 bg-white p-3.5"
//                 >
//                   <div className="flex items-start justify-between gap-2">
//                     <div className="min-w-0">
//                       <p className="text-sm font-medium text-slate-900 truncate">{r.person_name}</p>
//                       <p className="text-xs text-slate-500 mt-0.5">{formatDateTime(r.check_in)}</p>
//                     </div>
//                     <span
//                       className={`shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${kindBadgeClass(
//                         r.kind
//                       )}`}
//                     >
//                       {r.kind}
//                     </span>
//                   </div>

//                   <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
//                     <div className="min-w-0">
//                       <dt className="text-slate-500">Identity no.</dt>
//                       <dd className="text-slate-800 break-words">{r.identity_number || "-"}</dd>
//                     </div>
//                     <div className="min-w-0">
//                       <dt className="text-slate-500">Phone</dt>
//                       <dd className="text-slate-800 break-words">{r.phone_number || "-"}</dd>
//                     </div>
//                     <div className="min-w-0">
//                       <dt className="text-slate-500">Company</dt>
//                       <dd className="text-slate-800 break-words">{r.company || "-"}</dd>
//                     </div>
//                     <div className="min-w-0">
//                       <dt className="text-slate-500">Site</dt>
//                       <dd className="text-slate-800 break-words">{r.site_name}</dd>
//                     </div>
//                     <div className="min-w-0">
//                       <dt className="text-slate-500">Location</dt>
//                       <dd className="text-slate-800 break-words">{r.location || "-"}</dd>
//                     </div>
//                     <div className="min-w-0">
//                       <dt className="text-slate-500">Pass</dt>
//                       <dd className="text-slate-800 break-words">{r.pass_no || "-"}</dd>
//                     </div>
//                   </dl>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* ---------------- md and up: table ---------------- */}
//           <div className="hidden md:block overflow-x-auto">
//             <table className="w-full text-sm text-left">
//               <thead>
//                 <tr className="text-xs text-slate-500 border-b border-slate-200">
//                   <th className="py-2 pr-4 font-medium">Type</th>
//                   <th className="py-2 pr-4 font-medium">Name</th>
//                   <th className="py-2 pr-4 font-medium hidden xl:table-cell">Identity no.</th>
//                   <th className="py-2 pr-4 font-medium hidden xl:table-cell">Phone</th>
//                   <th className="py-2 pr-4 font-medium hidden lg:table-cell">Company</th>
//                   <th className="py-2 pr-4 font-medium">Site</th>
//                   <th className="py-2 pr-4 font-medium hidden lg:table-cell">Location</th>
//                   <th className="py-2 pr-4 font-medium">Pass</th>
//                   <th className="py-2 font-medium">Check-in</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isEmpty ? (
//                   <tr>
//                     <td colSpan={9} className="py-8 text-center text-slate-500">
//                       Everyone has checked out for this period.
//                     </td>
//                   </tr>
//                 ) : (
//                   (rows ?? []).map((r) => (
//                     <tr
//                       key={`${r.kind}-${r.guid}`}
//                       className="border-b border-slate-100 last:border-0"
//                     >
//                       <td className="py-2.5 pr-4">
//                         <span
//                           className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${kindBadgeClass(
//                             r.kind
//                           )}`}
//                         >
//                           {r.kind}
//                         </span>
//                       </td>
//                       <td className="py-2.5 pr-4 text-slate-900">
//                         <div className="whitespace-nowrap">{r.person_name}</div>
//                         {/* identity / phone / company folded under the name until their own columns appear */}
//                         <div className="xl:hidden text-xs text-slate-500 whitespace-nowrap">
//                           {[r.identity_number, r.phone_number].filter(Boolean).join(" · ") || "-"}
//                         </div>
//                         <div className="lg:hidden text-xs text-slate-500 whitespace-nowrap">
//                           {r.company || ""}
//                         </div>
//                       </td>
//                       <td className="py-2.5 pr-4 whitespace-nowrap hidden xl:table-cell">
//                         {r.identity_number || "-"}
//                       </td>
//                       <td className="py-2.5 pr-4 whitespace-nowrap hidden xl:table-cell">
//                         {r.phone_number || "-"}
//                       </td>
//                       <td className="py-2.5 pr-4 whitespace-nowrap hidden lg:table-cell">
//                         {r.company || "-"}
//                       </td>
//                       <td className="py-2.5 pr-4 whitespace-nowrap">{r.site_name}</td>
//                       <td className="py-2.5 pr-4 whitespace-nowrap hidden lg:table-cell">
//                         {r.location || "-"}
//                       </td>
//                       <td className="py-2.5 pr-4 whitespace-nowrap">{r.pass_no || "-"}</td>
//                       <td className="py-2.5 whitespace-nowrap">{formatDateTime(r.check_in)}</td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//       {totalPages > 1 && (
//         <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 mt-4">
//           <span className="text-xs text-slate-500 sm:mr-2">
//             Page {page} of {totalPages}
//           </span>
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               aria-label="Previous page"
//               disabled={page <= 1}
//               onClick={() => setPage((p) => p - 1)}
//               className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft size={16} />
//             </button>
//             <button
//               type="button"
//               aria-label="Next page"
//               disabled={page >= totalPages}
//               onClick={() => setPage((p) => p + 1)}
//               className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </Card>
//   );
// };

// /* -------------------------------------------------------------------------- */
// /*  Dashboard                                                                 */
// /* -------------------------------------------------------------------------- */

// const Dashboard = () => {
//   /* ---------- who is logged in ---------- */
//   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
//   const isSuperAdmin = storedUser?.is_super_admin === true;
//   const ownSite = storedUser?.site_detail ?? null;

//   // Subsites are shown only when the Dashboard permission has view = true
//   const dashboardPermission = storedUser?.permissions?.find(
//     (p) => p.menu_key === DASHBOARD_MENU_KEY
//   );
//   const subsiteOptions: SubsiteItem[] = dashboardPermission?.view
//     ? dashboardPermission.subsites ?? []
//     : [];

//   // Normal login: own site first, then the subsites they can view
//   const siteChoices: SubsiteItem[] = ownSite
//     ? [ownSite, ...subsiteOptions.filter((s) => s.guid !== ownSite.guid)]
//     : subsiteOptions;

//   /* ---------- super admin only: full site list for the dropdown ---------- */
//   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);

//   useEffect(() => {
//     if (!isSuperAdmin) return;
//     let cancelled = false;

//     (async () => {
//       try {
//         const res = await userService.siteDropdown();
//         if (cancelled) return;
//         if (res.success && res.data) setAllSites(res.data.results ?? []);
//       } catch {
//         // leave list empty; the dropdown will just show "All Sites"
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [isSuperAdmin]);

//   /* ---------- dropdown options ---------- */
//   const filterOptions: DropdownOption[] = isSuperAdmin
//     ? [
//         { label: "All Sites", value: "" },
//         ...allSites.map((s) => ({ label: s.site_name, value: s.guid })),
//       ]
//     : siteChoices.map((s) => ({
//         label: s.guid === ownSite?.guid ? `${s.name} (Primary)` : `${s.name} (others)`,
//         value: s.guid,
//       }));

//   const defaultFilters: Filters = {
//     site: isSuperAdmin ? "" : ownSite?.guid ?? siteChoices[0]?.guid ?? "",
//     from: "",
//     to: "",
//   };

//   const [draft, setDraft] = useState<Filters>(defaultFilters);
//   const [applied, setApplied] = useState<Filters>(defaultFilters);
//   const [error, setError] = useState("");

//   /* ---------- summary from the backend ---------- */
//   const [summary, setSummary] = useState<DashboardSummary | null>(null);
//   const [loadError, setLoadError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       setLoadError("");
//       try {
//         const res = await dashboardService.summary({
//           site_guid: applied.site || null,
//           from_date: applied.from || null,
//           to_date: applied.to || null,
//         });
//         if (cancelled) return;
//         if (res.success && res.data) {
//           setSummary(res.data);
//         } else {
//           setSummary(null);
//           setLoadError(res.message || "Could not load the dashboard.");
//         }
//       } catch {
//         if (!cancelled) {
//           setSummary(null);
//           setLoadError("Could not load the dashboard.");
//         }
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [applied]);

//   /* ---------- chart series ---------- */
//   const { visitorChart, contractorChart } = useMemo(() => {
//     const daily = summary?.daily ?? [];
//     return {
//       visitorChart: daily.map((d) => ({
//         label: formatShort(d.date),
//         checkIn: d.visitor_check_in,
//         checkOut: d.visitor_check_out,
//       })),
//       contractorChart: daily.map((d) => ({
//         label: formatShort(d.date),
//         checkIn: d.contractor_check_in,
//         checkOut: d.contractor_check_out,
//       })),
//     };
//   }, [summary]);

//   /* ---------- filter actions ---------- */
//   const handleApply = () => {
//     if (draft.from && draft.to && draft.from > draft.to) {
//       setError("From date can't be after To date.");
//       return;
//     }
//     setError("");

//     // same filters as already applied -> no need to call the API again
//     if (
//       draft.site === applied.site &&
//       draft.from === applied.from &&
//       draft.to === applied.to
//     ) {
//       return;
//     }
//     setApplied(draft);
//   };

//   const handleClear = () => {
//     setError("");
//     setDraft(defaultFilters);
//     setApplied(defaultFilters);
//   };

//   const isDefault = (f: Filters) =>
//     f.site === defaultFilters.site && f.from === "" && f.to === "";
//   const clearDisabled = isDefault(draft) && isDefault(applied);

//   const selectedSiteName =
//     applied.site === ""
//       ? isSuperAdmin
//         ? "All Sites"
//         : ""
//       : siteChoices.find((s) => s.guid === applied.site)?.name ??
//         allSites.find((s) => s.guid === applied.site)?.site_name ??
//         "";

//   const periodText = summary
//     ? ` · ${formatShort(summary.from_date)} to ${formatShort(summary.to_date)}`
//     : "";

//   const a = summary?.activity;
//   const t = summary?.totals;
//   const s = summary?.sites;

//   return (
//     <div>
//       <PageHeader
//         title="Dashboard"
//         description={`Overview for ${selectedSiteName || "your sites"}${periodText}.`}
//       />

//       {/* ------------------------------ Filters ------------------------------ */}
//       {/* base: 1 col · sm/md: 2 cols · lg+: single row */}
//       <Card className="mb-4 sm:mb-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] gap-3 items-end">
//           <div className="sm:col-span-2 lg:col-span-1 min-w-0">
//             <label htmlFor="dash-site" className="block text-xs font-medium text-slate-600 mb-1.5">
//               Site
//             </label>
//             <select
//               id="dash-site"
//               className={inputClass}
//               value={draft.site}
//               onChange={(e) => setDraft({ ...draft, site: e.target.value })}
//             >
//               {filterOptions.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="min-w-0">
//             <label htmlFor="dash-from" className="block text-xs font-medium text-slate-600 mb-1.5">
//               From date
//             </label>
//             <input
//               id="dash-from"
//               type="date"
//               className={inputClass}
//               value={draft.from}
//               max={draft.to || undefined}
//               onChange={(e) => setDraft({ ...draft, from: e.target.value })}
//             />
//           </div>

//           <div className="min-w-0">
//             <label htmlFor="dash-to" className="block text-xs font-medium text-slate-600 mb-1.5">
//               To date
//             </label>
//             <input
//               id="dash-to"
//               type="date"
//               className={inputClass}
//               value={draft.to}
//               min={draft.from || undefined}
//               onChange={(e) => setDraft({ ...draft, to: e.target.value })}
//             />
//           </div>

//           <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
//             <button
//               type="button"
//               onClick={handleApply}
//               className="h-10 px-4 flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
//             >
//               <Filter size={15} />
//               Apply
//             </button>
//             <button
//               type="button"
//               onClick={handleClear}
//               disabled={clearDisabled}
//               className="h-10 px-4 flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
//             >
//               <X size={15} />
//               Clear
//             </button>
//           </div>
//         </div>
//         {error && (
//           <p role="alert" className="text-xs text-red-600 mt-2.5">
//             {error}
//           </p>
//         )}
//         {!applied.from && !applied.to && (
//           <p className="text-xs text-slate-500 mt-2.5">
//             No dates selected: check-in / check-out figures cover the last 30 days.
//           </p>
//         )}
//       </Card>

//       {loadError && (
//         <p role="alert" className="text-sm text-red-600 mb-4">
//           {loadError}
//         </p>
//       )}

//       {/* ------------------- Site counts (super admin only) ------------------- */}
//       {isSuperAdmin && (
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
//           <StatCard label="Parent sites" value={s?.parent ?? 0} icon={Building2} />
//           <StatCard label="Sub-sites" value={s?.sub ?? 0} icon={GitBranch} />
//           <StatCard label="Individual sites" value={s?.individual ?? 0} icon={MapPin} />
//         </div>
//       )}

//       {/* ----------------- Pass / Key / Tenant / Banned cards ----------------- */}
//       {/* base/sm/md: 2 per row · lg+: 4 per row */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
//         <StatCard label="Passes" value={t?.passes ?? 0} icon={Ticket} />
//         <StatCard label="Keys" value={t?.keys ?? 0} icon={KeyRound} />
//         <StatCard label="Tenants" value={t?.tenants ?? 0} icon={Users} />
//         <StatCard label="Banned persons" value={t?.banned ?? 0} icon={UserX} tone="danger" />
//       </div>

//       {/* ------------------------------- Charts ------------------------------- */}
//       {/* stacked until xl, side by side on xl */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
//         <ActivityChart
//           title="Visitors"
//           subtitle={`${num(a?.visitor_check_in)} check-ins · ${num(a?.visitor_check_out)} check-outs`}
//           data={summary ? visitorChart : null}
//         />
//         <ActivityChart
//           title="Contractors"
//           subtitle={`${num(a?.contractor_check_in)} check-ins · ${num(a?.contractor_check_out)} check-outs`}
//           data={summary ? contractorChart : null}
//         />
//       </div>

//       {/* ------------------------- Not checked out list ------------------------- */}
//       <PendingTable site={applied.site} from={applied.from} to={applied.to} />
//     </div>
//   );
// };

// export default Dashboard;


import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  Building2,
  GitBranch,
  MapPin,
  Ticket,
  KeyRound,
  Users,
  UserX,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, PageHeader } from "@/components/ui";
import { userStorage } from "@/utils/storage";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { dashboardService } from "@/service/dashboardservices";
import type {
  DashboardSummary,
  NotCheckedOutRecord,
  VisitKind,
} from "@/service/dashboardservices";

/* -------------------------------------------------------------------------- */
/*  Types & constants                                                         */
/* -------------------------------------------------------------------------- */

const DASHBOARD_MENU_KEY = "/dashboard";
const PENDING_PAGE_SIZE = 10;

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

interface DropdownOption {
  label: string;
  value: string; // site guid ("" = All Sites, super admin only)
}

interface Filters {
  site: string; // site guid, "" = all
  from: string;
  to: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const formatShort = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const num = (n: number | undefined) => (n ?? 0).toLocaleString("en-IN");

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 " +
  "focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 disabled:opacity-60";

/* -------------------------------------------------------------------------- */
/*  Stat card                                                                 */
/* -------------------------------------------------------------------------- */

interface StatCardProps {
  label: string;
  value: number;
  icon: ComponentType<{ size?: number }>;
  tone?: "default" | "danger";
}

const toneClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-primary-100 text-primary-700",
  danger: "bg-red-100 text-red-600",
};

const StatCard = ({ label, value, icon: Icon, tone = "default" }: StatCardProps) => (
  // min-w-0: lets the card shrink inside the grid instead of forcing the page wider
  <Card className="!p-0 min-w-0">
    <div className="p-3 sm:p-4 xl:p-5 flex items-center justify-between gap-2 sm:gap-3">
      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs text-slate-500 mb-1 sm:mb-1.5 truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{num(value)}</p>
      </div>
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${toneClass[tone]}`}
      >
        <Icon size={18} />
      </div>
    </div>
  </Card>
);

/* -------------------------------------------------------------------------- */
/*  Check-in / check-out chart                                                */
/* -------------------------------------------------------------------------- */

interface ActivityChartProps {
  title: string;
  subtitle: string;
  data: { label: string; checkIn: number; checkOut: number }[] | null; // null = not loaded yet
}

const ActivityChart = ({ title, subtitle, data }: ActivityChartProps) => (
  <Card title={title} subtitle={subtitle} className="min-w-0 max-w-full overflow-hidden">
    {data === null ? (
      <div className="h-60 sm:h-72" />
    ) : data.length === 0 ? (
      <div className="h-60 sm:h-72 flex items-center justify-center text-sm text-slate-500 text-center px-4">
        No data for this site and date range.
      </div>
    ) : (
      // min-w-0 + overflow-hidden: ResponsiveContainer can shrink back and the
      // absolutely positioned tooltip can't create horizontal scroll
      <div className="h-60 sm:h-72 w-full min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              interval="preserveStartEnd"
              minTickGap={16}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(148,163,184,0.12)" }}
              // keep the tooltip inside the chart area
              allowEscapeViewBox={{ x: false, y: false }}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 12,
                boxShadow: "none",
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="checkIn" name="Check-in" fill="#4f46e5" radius={[3, 3, 0, 0]} maxBarSize={14} />
            <Bar dataKey="checkOut" name="Check-out" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </Card>
);

/* -------------------------------------------------------------------------- */
/*  Not-checked-out table                                                     */
/* -------------------------------------------------------------------------- */

interface PendingTableProps {
  site: string;
  from: string;
  to: string;
}

const KIND_TABS: { label: string; value: VisitKind | "" }[] = [
  { label: "All", value: "" },
  { label: "Visitors", value: "Visitor" },
  { label: "Contractors", value: "Contractor" },
];

const kindBadgeClass = (kind: string) =>
  kind === "Visitor" ? "bg-indigo-50 text-indigo-700" : "bg-amber-50 text-amber-700";

const PendingTable = ({ site, from, to }: PendingTableProps) => {
  const [kind, setKind] = useState<VisitKind | "">("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<NotCheckedOutRecord[] | null>(null); // null = not loaded yet
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadError, setLoadError] = useState("");

  // New site / date filters -> back to page 1.
  // Done during render so only ONE request is sent (no fetch with the stale page).
  const filterKey = `${site}|${from}|${to}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const changeKind = (value: VisitKind | "") => {
    setKind(value);
    setPage(1);
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadError("");
      try {
        const res = await dashboardService.notCheckedOut(
          { site_guid: site || null, from_date: from || null, to_date: to || null },
          page,
          PENDING_PAGE_SIZE,
          kind,
          ""
        );
        if (cancelled) return;
        if (res.success && res.data) {
          setRows(res.data.results ?? []);
          setTotalPages(res.data.pagination?.total_pages ?? 1);
          setTotalRecords(res.data.pagination?.total_records ?? 0);
        } else {
          setRows([]);
          setLoadError(res.message || "Could not load the list.");
        }
      } catch {
        if (!cancelled) {
          setRows([]);
          setLoadError("Could not load the list.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [site, from, to, kind, page]);

  const isEmpty = rows !== null && rows.length === 0;

  return (
    <Card
      title="Not checked out"
      subtitle={`${num(totalRecords)} checked in during the selected period and still inside`}
      className="min-w-0 max-w-full"
    >
      {/* Kind tabs (scrollable on very small screens) */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
        {KIND_TABS.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => changeKind(t.value)}
            className={`h-8 px-3 shrink-0 rounded-lg text-xs font-medium border transition-colors ${
              kind === t.value
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loadError ? (
        <p role="alert" className="text-sm text-red-600 py-6 text-center">
          {loadError}
        </p>
      ) : (
        <>
          {/* ---------------- Mobile (below md): card list ---------------- */}
          <div className="md:hidden space-y-3">
            {isEmpty ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Everyone has checked out for this period.
              </p>
            ) : (
              (rows ?? []).map((r) => (
                <div
                  key={`${r.kind}-${r.guid}`}
                  className="rounded-lg border border-slate-200 bg-white p-3.5 min-w-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{r.person_name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{formatDateTime(r.check_in)}</p>
                    </div>
                    <span
                      className={`shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${kindBadgeClass(
                        r.kind
                      )}`}
                    >
                      {r.kind}
                    </span>
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    <div className="min-w-0">
                      <dt className="text-slate-500">Identity no.</dt>
                      <dd className="text-slate-800 break-words">{r.identity_number || "-"}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-slate-500">Phone</dt>
                      <dd className="text-slate-800 break-words">{r.phone_number || "-"}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-slate-500">Company</dt>
                      <dd className="text-slate-800 break-words">{r.company || "-"}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-slate-500">Site</dt>
                      <dd className="text-slate-800 break-words">{r.site_name}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-slate-500">Location</dt>
                      <dd className="text-slate-800 break-words">{r.location || "-"}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-slate-500">Pass</dt>
                      <dd className="text-slate-800 break-words">{r.pass_no || "-"}</dd>
                    </div>
                  </dl>
                </div>
              ))
            )}
          </div>

          {/* ---------------- md and up: table ---------------- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium hidden xl:table-cell">Identity no.</th>
                  <th className="py-2 pr-4 font-medium hidden xl:table-cell">Phone</th>
                  <th className="py-2 pr-4 font-medium hidden lg:table-cell">Company</th>
                  <th className="py-2 pr-4 font-medium">Site</th>
                  <th className="py-2 pr-4 font-medium hidden lg:table-cell">Location</th>
                  <th className="py-2 pr-4 font-medium">Pass</th>
                  <th className="py-2 font-medium">Check-in</th>
                </tr>
              </thead>
              <tbody>
                {isEmpty ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500">
                      Everyone has checked out for this period.
                    </td>
                  </tr>
                ) : (
                  (rows ?? []).map((r) => (
                    <tr
                      key={`${r.kind}-${r.guid}`}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-2.5 pr-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${kindBadgeClass(
                            r.kind
                          )}`}
                        >
                          {r.kind}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-900">
                        <div className="whitespace-nowrap">{r.person_name}</div>
                        {/* identity / phone / company folded under the name until their own columns appear */}
                        <div className="xl:hidden text-xs text-slate-500 whitespace-nowrap">
                          {[r.identity_number, r.phone_number].filter(Boolean).join(" · ") || "-"}
                        </div>
                        <div className="lg:hidden text-xs text-slate-500 whitespace-nowrap">
                          {r.company || ""}
                        </div>
                      </td>
                      <td className="py-2.5 pr-4 whitespace-nowrap hidden xl:table-cell">
                        {r.identity_number || "-"}
                      </td>
                      <td className="py-2.5 pr-4 whitespace-nowrap hidden xl:table-cell">
                        {r.phone_number || "-"}
                      </td>
                      <td className="py-2.5 pr-4 whitespace-nowrap hidden lg:table-cell">
                        {r.company || "-"}
                      </td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">{r.site_name}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap hidden lg:table-cell">
                        {r.location || "-"}
                      </td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">{r.pass_no || "-"}</td>
                      <td className="py-2.5 whitespace-nowrap">{formatDateTime(r.check_in)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 mt-4">
          <span className="text-xs text-slate-500 sm:mr-2">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              aria-label="Next page"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

/* -------------------------------------------------------------------------- */
/*  Dashboard                                                                 */
/* -------------------------------------------------------------------------- */

const Dashboard = () => {
  /* ---------- who is logged in ---------- */
  const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;

  // Subsites are shown only when the Dashboard permission has view = true
  const dashboardPermission = storedUser?.permissions?.find(
    (p) => p.menu_key === DASHBOARD_MENU_KEY
  );
  const subsiteOptions: SubsiteItem[] = dashboardPermission?.view
    ? dashboardPermission.subsites ?? []
    : [];

  // Normal login: own site first, then the subsites they can view
  const siteChoices: SubsiteItem[] = ownSite
    ? [ownSite, ...subsiteOptions.filter((s) => s.guid !== ownSite.guid)]
    : subsiteOptions;

  /* ---------- super admin only: full site list for the dropdown ---------- */
  const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await userService.siteDropdown();
        if (cancelled) return;
        if (res.success && res.data) setAllSites(res.data.results ?? []);
      } catch {
        // leave list empty; the dropdown will just show "All Sites"
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin]);

  /* ---------- dropdown options ---------- */
  const filterOptions: DropdownOption[] = isSuperAdmin
    ? [
        { label: "All Sites", value: "" },
        ...allSites.map((s) => ({ label: s.site_name, value: s.guid })),
      ]
    : siteChoices.map((s) => ({
        label: s.guid === ownSite?.guid ? `${s.name} (Primary)` : `${s.name} (others)`,
        value: s.guid,
      }));

  const defaultFilters: Filters = {
    site: isSuperAdmin ? "" : ownSite?.guid ?? siteChoices[0]?.guid ?? "",
    from: "",
    to: "",
  };

  const [draft, setDraft] = useState<Filters>(defaultFilters);
  const [applied, setApplied] = useState<Filters>(defaultFilters);
  const [error, setError] = useState("");

  /* ---------- summary from the backend ---------- */
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadError("");
      try {
        const res = await dashboardService.summary({
          site_guid: applied.site || null,
          from_date: applied.from || null,
          to_date: applied.to || null,
        });
        if (cancelled) return;
        if (res.success && res.data) {
          setSummary(res.data);
        } else {
          setSummary(null);
          setLoadError(res.message || "Could not load the dashboard.");
        }
      } catch {
        if (!cancelled) {
          setSummary(null);
          setLoadError("Could not load the dashboard.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applied]);

  /* ---------- chart series ---------- */
  const { visitorChart, contractorChart } = useMemo(() => {
    const daily = summary?.daily ?? [];
    return {
      visitorChart: daily.map((d) => ({
        label: formatShort(d.date),
        checkIn: d.visitor_check_in,
        checkOut: d.visitor_check_out,
      })),
      contractorChart: daily.map((d) => ({
        label: formatShort(d.date),
        checkIn: d.contractor_check_in,
        checkOut: d.contractor_check_out,
      })),
    };
  }, [summary]);

  /* ---------- filter actions ---------- */
  const handleApply = () => {
    if (draft.from && draft.to && draft.from > draft.to) {
      setError("From date can't be after To date.");
      return;
    }
    setError("");

    // same filters as already applied -> no need to call the API again
    if (
      draft.site === applied.site &&
      draft.from === applied.from &&
      draft.to === applied.to
    ) {
      return;
    }
    setApplied(draft);
  };

  const handleClear = () => {
    setError("");
    setDraft(defaultFilters);
    setApplied(defaultFilters);
  };

  const isDefault = (f: Filters) =>
    f.site === defaultFilters.site && f.from === "" && f.to === "";
  const clearDisabled = isDefault(draft) && isDefault(applied);

  const selectedSiteName =
    applied.site === ""
      ? isSuperAdmin
        ? "All Sites"
        : ""
      : siteChoices.find((s) => s.guid === applied.site)?.name ??
        allSites.find((s) => s.guid === applied.site)?.site_name ??
        "";

  const periodText = summary
    ? ` · ${formatShort(summary.from_date)} to ${formatShort(summary.to_date)}`
    : "";

  const a = summary?.activity;
  const t = summary?.totals;
  const s = summary?.sites;

  return (
    // min-w-0 + max-w-full + overflow-x-hidden: nothing inside can push the page wider than the screen
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <PageHeader
        title="Dashboard"
        description={`Overview for ${selectedSiteName || "your sites"}${periodText}.`}
      />

      {/* ------------------------------ Filters ------------------------------ */}
      {/* base: 1 col · sm/md: 2 cols · lg+: single row */}
      <Card className="mb-4 sm:mb-6 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] gap-3 items-end">
          <div className="sm:col-span-2 lg:col-span-1 min-w-0">
            <label htmlFor="dash-site" className="block text-xs font-medium text-slate-600 mb-1.5">
              Site
            </label>
            <select
              id="dash-site"
              className={inputClass}
              value={draft.site}
              onChange={(e) => setDraft({ ...draft, site: e.target.value })}
            >
              {filterOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="min-w-0">
            <label htmlFor="dash-from" className="block text-xs font-medium text-slate-600 mb-1.5">
              From date
            </label>
            <input
              id="dash-from"
              type="date"
              className={inputClass}
              value={draft.from}
              max={draft.to || undefined}
              onChange={(e) => setDraft({ ...draft, from: e.target.value })}
            />
          </div>

          <div className="min-w-0">
            <label htmlFor="dash-to" className="block text-xs font-medium text-slate-600 mb-1.5">
              To date
            </label>
            <input
              id="dash-to"
              type="date"
              className={inputClass}
              value={draft.to}
              min={draft.from || undefined}
              onChange={(e) => setDraft({ ...draft, to: e.target.value })}
            />
          </div>

          <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <button
              type="button"
              onClick={handleApply}
              className="h-10 px-4 flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
            >
              <Filter size={15} />
              Apply
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={clearDisabled}
              className="h-10 px-4 flex-1 lg:flex-none inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
            >
              <X size={15} />
              Clear
            </button>
          </div>
        </div>
        {error && (
          <p role="alert" className="text-xs text-red-600 mt-2.5">
            {error}
          </p>
        )}
        {/* {!applied.from && !applied.to && (
          <p className="text-xs text-slate-500 mt-2.5">
            No dates selected: check-in / check-out figures cover the last 30 days.
          </p>
        )} */}
      </Card>

      {loadError && (
        <p role="alert" className="text-sm text-red-600 mb-4">
          {loadError}
        </p>
      )}

      {/* ------------------- Site counts (super admin only) ------------------- */}
      {isSuperAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4 min-w-0">
          <StatCard label="Parent sites" value={s?.parent ?? 0} icon={Building2} />
          <StatCard label="Sub-sites" value={s?.sub ?? 0} icon={GitBranch} />
          <StatCard label="Individual sites" value={s?.individual ?? 0} icon={MapPin} />
        </div>
      )}

      {/* ----------------- Pass / Key / Tenant / Banned cards ----------------- */}
      {/* base/sm/md: 2 per row · lg+: 4 per row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4 min-w-0">
        <StatCard label="Passes" value={t?.passes ?? 0} icon={Ticket} />
        <StatCard label="Keys" value={t?.keys ?? 0} icon={KeyRound} />
        <StatCard label="Tenants" value={t?.tenants ?? 0} icon={Users} />
        <StatCard label="Banned persons" value={t?.banned ?? 0} icon={UserX} tone="danger" />
      </div>

      {/* ------------------------------- Charts ------------------------------- */}
      {/* stacked until xl, side by side on xl */}
      {/* grid-cols-[minmax(0,1fr)] stops a wide chart from stretching the single column */}
      <div className="grid grid-cols-[minmax(0,1fr)] xl:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 min-w-0">
        <ActivityChart
          title="Visitors"
          subtitle={`${num(a?.visitor_check_in)} check-ins · ${num(a?.visitor_check_out)} check-outs`}
          data={summary ? visitorChart : null}
        />
        <ActivityChart
          title="Contractors"
          subtitle={`${num(a?.contractor_check_in)} check-ins · ${num(a?.contractor_check_out)} check-outs`}
          data={summary ? contractorChart : null}
        />
      </div>

      {/* ------------------------- Not checked out list ------------------------- */}
      <PendingTable site={applied.site} from={applied.from} to={applied.to} />
    </div>
  );
};

export default Dashboard;