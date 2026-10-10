// import { useEffect,useMemo, useState } from "react";
// import {
//   Card,
//   PageHeader,
//   Table,
//   Pagination,
//   Button,
//   Input,
//   Modal,
//   Select,
//   Badge,
// } from "@/components/ui";
// import type { TableColumn, BadgeVariant } from "@/types";
// import {
//   Search as SearchIcon,
//   LogIn,
//   LogOut,
//   AlertCircle,
//   ArrowLeft,
//   ChevronRight,
//   ChevronDown,
// } from "lucide-react";
// import { passService } from "@/service/passcreationservices";
// import { keyService } from "@/service/keycreationservices";
// import { visitorService, apiErrorMessage } from "@/service/visitorservices";
// import type { VisitKind } from "@/service/visitorservices";
// import { preRegApprovedService } from "@/service/preregistrationapprovedservices";
// import type {
//   PreRegApprovedRecord,
//   PreRegVisitStatus,
// } from "@/service/preregistrationapprovedservices";

// const PAGE_SIZE = 10;

// interface SiteOption {
//   label: string;
//   value: string;
// }

// // A record as returned by the API (bulk_id is set for bulk uploads)
// type ApprovedItem = PreRegApprovedRecord & { bulk_id?: string | null };

// // A table row: normal record, bulk group header, or a visitor inside an expanded bulk
// type DisplayRow = ApprovedItem & {
//   rowKey: string;
//   group?: { bulkId: string; items: ApprovedItem[] };
//   isChild?: boolean;
// };

// const fmtDate = (value?: string | null) => {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   return `${dd}-${mm}-${d.getFullYear()}`;
// };

// const fmtDateTime = (value?: string | null) => {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;
//   const hh = String(d.getHours()).padStart(2, "0");
//   const mi = String(d.getMinutes()).padStart(2, "0");
//   return `${fmtDate(value)} ${hh}:${mi}`;
// };

// const fmtTime = (value?: string | null) => (value ? value.slice(0, 5) : "");

// const statusVariant: Record<string, BadgeVariant> = {
//   "Checked In": "success",
//   "Checked Out": "neutral",
//   Pending: "warning",
// };

// const KIND_OPTIONS: SiteOption[] = [
//   { label: "All Types", value: "" },
//   { label: "Visitor", value: "Visitor" },
//   { label: "Contractor", value: "Contractor" },
// ];

// const STATUS_OPTIONS: SiteOption[] = [
//   { label: "All Status", value: "" },
//   { label: "Pending", value: "Pending" },
//   { label: "Checked In", value: "Checked In" },
//   { label: "Checked Out", value: "Checked Out" },
// ];

// const fieldClass =
//   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// const ErrorBox = ({ message }: { message: string }) => (
//   <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
//     <AlertCircle size={16} />
//     {message}
//   </div>
// );

// const Row = ({ label, value }: { label: string; value?: string | null }) => (
//   <div className="flex justify-between gap-4 text-sm">
//     <span className="text-slate-500">{label}</span>
//     <span className="text-slate-700 text-right">{value || "—"}</span>
//   </div>
// );

// function VisitDetails({ rec }: { rec: PreRegApprovedRecord }) {
//   const window_ =
//     `${fmtDate(rec.from_date)} ${fmtTime(rec.from_time)} → ` +
//     `${fmtDate(rec.to_date)} ${fmtTime(rec.to_time)}`;
//   return (
//     <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
//       <Row label="Name" value={rec.person.person_name} />
//       <Row label="Type" value={rec.kind} />
//       <Row label="Identity" value={`${rec.person.identity_type} · ${rec.person.identity_number}`} />
//       <Row label="Contact" value={rec.person.phone_number} />
//       <Row label="Email" value={rec.person.email} />
//       {rec.kind === "Contractor" && <Row label="Company" value={rec.company} />}
//       {rec.kind === "Contractor" && <Row label="Company Phone" value={rec.company_phone} />}
//       <Row label="Location" value={rec.location?.name} />
//       <Row label="Host Site" value={rec.site.name} />
//       <Row label="Visit Period" value={window_} />
//       <Row label="Approved By" value={rec.requester_email} />
//       <Row label="Remark" value={rec.remark} />
//     </div>
//   );
// }

// /* ---------------------------------------------------------------------- */
// /* Check-In modal (details + pass + key + vehicle)                         */
// /* ---------------------------------------------------------------------- */

// interface CheckInModalProps {
//   record: PreRegApprovedRecord | null;
//   onClose: () => void;
//   onDone: () => void;
// }

// function PreRegCheckInModal({ record, onClose, onDone }: CheckInModalProps) {
//   const [passNo, setPassNo] = useState("");
//   const [keyNo, setKeyNo] = useState("");
//   const [vehicle, setVehicle] = useState("");
//   const [passOptions, setPassOptions] = useState<SiteOption[]>([]);
//   const [keyOptions, setKeyOptions] = useState<SiteOption[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (!record) return;
//     let cancelled = false;

//     setPassNo(record.pass_no || "");
//     setKeyNo(record.key_no || "");
//     setVehicle(record.vehicle_number || "");
//     setError("");

//     (async () => {
//       setIsLoading(true);
//       try {
//         const [passRes, keyRes] = await Promise.all([
//           passService.list({
//             page: null,
//             page_size: null,
//             site_guid: record.site.guid,
//             status: "Active",
//           }),
//           keyService.list({
//             page: null,
//             page_size: null,
//             site_guid: record.site.guid,
//             status: "Available",
//           }),
//         ]);
//         if (cancelled) return;

//         setPassOptions(
//           passRes.success && passRes.data
//             ? passRes.data.results.map((p) => ({
//                 label: `${p.pass_no} - ${p.pass_name}`,
//                 value: p.pass_no,
//               }))
//             : []
//         );
//         setKeyOptions(
//           keyRes.success && keyRes.data
//             ? keyRes.data.results.map((k) => ({
//                 label: `${k.key_no} - ${k.key_name}`,
//                 value: k.key_no,
//               }))
//             : []
//         );
//         if (!passRes.success || !keyRes.success) {
//           setError("Could not load passes/keys for this site.");
//         }
//       } catch {
//         if (!cancelled) setError("Could not load passes/keys for this site.");
//       } finally {
//         if (!cancelled) setIsLoading(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [record]);

//   const handleSubmit = async () => {
//     if (!record) return;
//     setIsSubmitting(true);
//     setError("");
//     try {
//       const res = await preRegApprovedService.checkIn({
//         kind: record.kind,
//         guid: record.guid,
//         pass_no: passNo,
//         key_no: keyNo,
//         vehicle_number: vehicle.trim(),
//       });
//       if (res.success) onDone();
//       else setError(res.message || "Check-in failed.");
//     } catch (err) {
//       setError(apiErrorMessage(err, "Check-in failed. Please try again."));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Modal
//       isOpen={!!record}
//       onClose={onClose}
//       title="Check-In Pre-Registered Visitor"
//       footer={
//         <>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
//             {isSubmitting ? "Checking in..." : "Check In"}
//           </Button>
//         </>
//       }
//     >
//       {record && (
//         <div className="space-y-4">
//           <VisitDetails rec={record} />

//           <Select
//             label="Pass Number"
//             placeholder={
//               isLoading
//                 ? "Loading passes..."
//                 : passOptions.length === 0
//                 ? "No passes available"
//                 : "Select Pass"
//             }
//             disabled={isLoading || passOptions.length === 0}
//             options={passOptions}
//             value={passNo}
//             onChange={(e) => setPassNo(e.target.value)}
//           />

//           <Select
//             label="Key"
//             placeholder={
//               isLoading
//                 ? "Loading keys..."
//                 : keyOptions.length === 0
//                 ? "No keys available"
//                 : "Select Key"
//             }
//             disabled={isLoading || keyOptions.length === 0}
//             options={keyOptions}
//             value={keyNo}
//             onChange={(e) => setKeyNo(e.target.value)}
//           />

//           <Input
//             label="Vehicle"
//             placeholder="Vehicle number (optional)"
//             value={vehicle}
//             onChange={(e) => setVehicle(e.target.value)}
//           />

//           {error && <ErrorBox message={error} />}
//         </div>
//       )}
//     </Modal>
//   );
// }

// /* ---------------------------------------------------------------------- */
// /* Check-Out modal: Site -> Pass (checked-in pre-registrations) -> Out     */
// /* ---------------------------------------------------------------------- */

// interface CheckOutModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onDone: () => void;
//   siteOptions: SiteOption[];
//   isLoadingSites: boolean;
// }

// function PreRegCheckOutModal({
//   isOpen,
//   onClose,
//   onDone,
//   siteOptions,
//   isLoadingSites,
// }: CheckOutModalProps) {
//   const [site, setSite] = useState("");
//   const [guid, setGuid] = useState("");
//   // const [records, setRecords] = useState<PreRegApprovedRecord[]>([]);
//     const [records, setRecords] = useState<ApprovedItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // single-site users: preselect
//   useEffect(() => {
//     if (isOpen && !isLoadingSites && siteOptions.length === 1 && !site) {
//       setSite(siteOptions[0].value);
//     }
//   }, [isOpen, isLoadingSites, siteOptions, site]);

//   // checked-in pre-registrations of the selected site
//   useEffect(() => {
//     if (!isOpen || !site) {
//       setRecords([]);
//       return;
//     }
//     let cancelled = false;

//     (async () => {
//       setIsLoading(true);
//       setError("");
//       try {
//         const res = await preRegApprovedService.list({
//           page: null,
//           page_size: null,
//           site_guid: site,
//           visit_status: "Checked In",
//         });
//         if (cancelled) return;
//         if (res.success && res.data) setRecords(res.data.results);
//         else {
//           setRecords([]);
//           setError(res.message || "Could not load checked-in visitors.");
//         }
//       } catch (err) {
//         if (!cancelled) {
//           setRecords([]);
//           setError(apiErrorMessage(err, "Could not load checked-in visitors."));
//         }
//       } finally {
//         if (!cancelled) setIsLoading(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [isOpen, site]);

//   const selected = records.find((r) => r.guid === guid) ?? null;

//   const passOptions: SiteOption[] = records.map((r) => ({
//     label: `${r.pass_no || "No pass"} — ${r.person.person_name}`,
//     value: r.guid,
//   }));

//   const reset = () => {
//     setSite("");
//     setGuid("");
//     setRecords([]);
//     setError("");
//   };

//   const handleClose = () => {
//     reset();
//     onClose();
//   };

//   const handleSubmit = async () => {
//     if (!selected) return;
//     setIsSubmitting(true);
//     setError("");
//     try {
//       const res = await visitorService.checkOut(selected.kind as VisitKind, selected.guid);
//       if (res.success) {
//         reset();
//         onDone();
//       } else setError(res.message || "Check-out failed.");
//     } catch (err) {
//       setError(apiErrorMessage(err, "Check-out failed. Please try again."));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={handleClose}
//       title="Check-Out Pre-Registered Visitor"
//       footer={
//         <>
//           <Button variant="outline" onClick={handleClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={!selected || isSubmitting}>
//             {isSubmitting ? "Checking out..." : "Check Out"}
//           </Button>
//         </>
//       }
//     >
//       <div className="space-y-4">
//         <Select
//           label="Site"
//           placeholder={isLoadingSites ? "Loading sites..." : "Select Site"}
//           required
//           disabled={isLoadingSites}
//           options={siteOptions}
//           value={site}
//           onChange={(e) => {
//             setSite(e.target.value);
//             setGuid("");
//           }}
//         />

//         <Select
//           label="Pass Number"
//           placeholder={
//             !site
//               ? "Select Site first"
//               : isLoading
//               ? "Loading..."
//               : passOptions.length === 0
//               ? "No checked-in visitors"
//               : "Select Pass"
//           }
//           required
//           disabled={!site || isLoading || passOptions.length === 0}
//           options={passOptions}
//           value={guid}
//           onChange={(e) => setGuid(e.target.value)}
//         />

//         {selected && (
//           <div className="space-y-2">
//             <VisitDetails rec={selected} />
//             <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
//               <Row label="Pass" value={selected.pass_no} />
//               <Row label="Key" value={selected.key_no} />
//               <Row label="Vehicle" value={selected.vehicle_number} />
//               <Row label="Checked In" value={fmtDateTime(selected.check_in)} />
//             </div>
//           </div>
//         )}

//         {error && <ErrorBox message={error} />}
//       </div>
//     </Modal>
//   );
// }

// /* ---------------------------------------------------------------------- */
// /* Page                                                                     */
// /* ---------------------------------------------------------------------- */

// interface PreRegistractionApprovedListProps {
//   onBack: () => void;
//   filterOptions: SiteOption[]; // site filter dropdown
//   siteOptions: SiteOption[]; // sites where the user can check in / out
//   isLoadingSites: boolean;
//   initialSite: string;
//   canAct: boolean; // false when viewing another (read-only) site
// }

// const PreRegistractionApprovedList = ({
//   onBack,
//   filterOptions,
//   siteOptions,
//   isLoadingSites,
//   initialSite,
//   canAct,
// }: PreRegistractionApprovedListProps) => {
//   const [records, setRecords] = useState<PreRegApprovedRecord[]>([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoadingList, setIsLoadingList] = useState(false);
//   const [listError, setListError] = useState("");
//   const [refreshKey, setRefreshKey] = useState(0);

//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [siteFilter, setSiteFilter] = useState(initialSite);
//   const [kindFilter, setKindFilter] = useState<VisitKind | "">("");
//   const [statusFilter, setStatusFilter] = useState<PreRegVisitStatus>("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [page, setPage] = useState(1);

//   const [checkInRecord, setCheckInRecord] = useState<PreRegApprovedRecord | null>(null);
//   const [isCheckOutOpen, setCheckOutOpen] = useState(false);

//   // which bulk groups are expanded
//   const [expandedBulks, setExpandedBulks] = useState<Set<string>>(new Set());

//   const toggleBulk = (bulkId: string) =>
//     setExpandedBulks((prev) => {
//       const next = new Set(prev);
//       if (next.has(bulkId)) next.delete(bulkId);
//       else next.add(bulkId);
//       return next;
//     });

//   // bulk records collapse into one row; normal records stay as they are
//   const displayRows: DisplayRow[] = useMemo(() => {
//     const rows: DisplayRow[] = [];
//     const seen = new Set<string>();

//     for (const r of records) {
//       if (!r.bulk_id) {
//         rows.push({ ...r, rowKey: r.guid });
//         continue;
//       }
//       if (seen.has(r.bulk_id)) continue;
//       seen.add(r.bulk_id);

//       const items = records.filter((x) => x.bulk_id === r.bulk_id);
//       rows.push({ ...r, rowKey: `bulk-${r.bulk_id}`, group: { bulkId: r.bulk_id, items } });

//       if (expandedBulks.has(r.bulk_id)) {
//         items.forEach((i) => rows.push({ ...i, rowKey: i.guid, isChild: true }));
//       }
//     }
//     return rows;
//   }, [records, expandedBulks]);

//   useEffect(() => {
//     const t = setTimeout(() => {
//       setDebouncedSearch(search.trim());
//       setPage(1);
//     }, 400);
//     return () => clearTimeout(t);
//   }, [search]);

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       setIsLoadingList(true);
//       setListError("");
//       try {
//         const res = await preRegApprovedService.list({
//           page,
//           page_size: PAGE_SIZE,
//           search: debouncedSearch,
//           site_guid: siteFilter || null,
//           kind: kindFilter,
//           visit_status: statusFilter,
//           from_date: fromDate || null,
//           to_date: toDate || null,
//         });
//         if (cancelled) return;

//         if (res.success && res.data) {
//           setRecords(res.data.results);
//           setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
//           setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
//         } else {
//           setListError(res.message || "Could not load pre-registrations.");
//         }
//       } catch (err) {
//         if (!cancelled)
//           setListError(apiErrorMessage(err, "Could not load pre-registrations."));
//       } finally {
//         if (!cancelled) setIsLoadingList(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [page, debouncedSearch, siteFilter, kindFilter, statusFilter, fromDate, toDate, refreshKey]);

//   const clearFilters = () => {
//     setSearch("");
//     setDebouncedSearch("");
//     setKindFilter("");
//     setStatusFilter("");
//     setFromDate("");
//     setToDate("");
//     setSiteFilter(initialSite);
//     setPage(1);
//   };

//   // const columns: TableColumn<PreRegApprovedRecord>[] = [
//   //   { key: "name", header: "Name", render: (row) => row.person.person_name },
//   //   { key: "kind", header: "Type" },
//   const isBulkHeader = (row: DisplayRow) => !!row.group;
//    const columns: TableColumn<DisplayRow>[] = [
//     {
//       key: "name",
//       header: "Name",
//       render: (row) =>
//         row.group ? (
//           <button
//             onClick={() => toggleBulk(row.group!.bulkId)}
//             className="flex items-center gap-1.5 font-medium text-primary-700"
//           >
//             {/* marker used by the table wrapper to highlight this row */}
//             <span data-bulk-row className="hidden" />
//             {expandedBulks.has(row.group.bulkId) ? (
//               <ChevronDown size={15} />
//             ) : (
//               <ChevronRight size={15} />
//             )}
//             Bulk · {row.group.items.length} visitors
//             <span className="text-xs font-normal text-slate-400">({row.group.bulkId})</span>
//           </button>
//         ) : (
//           <div className={row.isChild ? "pl-6" : ""}>
//             {row.isChild && <span data-bulk-child className="hidden" />}
//             {row.person.person_name}
//           </div>
//         ),
//     },
//     { key: "kind", header: "Type", render: (row) => (row.group ? "—" : row.kind) },
//     // {
//     //   key: "identity",
//     //   header: "Identity",
//     //   render: (row) => `${row.person.identity_type} · ${row.person.identity_number}`,
//     // },
//     // { key: "contact", header: "Contact", render: (row) => row.person.phone_number || "—" },
//     // { key: "company", header: "Company", render: (row) => row.company || "—" },
//     // { key: "location", header: "Location", render: (row) => row.location?.name ?? "—" },
//         {
//       key: "identity",
//       header: "Identity",
//       render: (row) =>
//         isBulkHeader(row)
//           ? "—"
//           : `${row.person.identity_type} · ${row.person.identity_number}`,
//     },
//     {
//       key: "contact",
//       header: "Contact",
//       render: (row) => (isBulkHeader(row) ? "—" : row.person.phone_number || "—"),
//     },
//     {
//   key: "email",
//   header: "Email",
//   render: (row) => (isBulkHeader(row) ? "—" : row.person.email || "—"),
// },
//     {
//       key: "company",
//       header: "Company",
//       render: (row) => (isBulkHeader(row) ? "—" : row.company || "—"),
//     },
//     {
//   key: "company_phone",
//   header: "Company Phone",
//   render: (row) => (isBulkHeader(row) ? "—" : row.company_phone || "—"),
// },
//     {
//       key: "location",
//       header: "Location",
//       render: (row) => (isBulkHeader(row) ? "—" : row.location?.name ?? "—"),
//     },
//     // { key: "site", header: "Host Site", render: (row) => row.site.name },
//     // {
//     //   key: "visit",
//     //   header: "Visit Date",
//     //   render: (row) =>
//     //     row.from_date === row.to_date || !row.to_date
//     //       ? fmtDate(row.from_date)
//     //       : `${fmtDate(row.from_date)} → ${fmtDate(row.to_date)}`,
//     // },
//     {
//   key: "site",
//   header: "Host Site",
//   render: (row) => (isBulkHeader(row) ? "—" : row.site.name),
// },
// {
//   key: "visit",
//   header: "Visit Date",
//   render: (row) => {
//     if (isBulkHeader(row)) return "—";
//     return row.from_date === row.to_date || !row.to_date
//       ? fmtDate(row.from_date)
//       : `${fmtDate(row.from_date)} → ${fmtDate(row.to_date)}`;
//   },
// },
//     // { key: "pass_no", header: "Pass", render: (row) => row.pass_no || "—" },
//     // { key: "vehicle", header: "Vehicle", render: (row) => row.vehicle_number || "—" },
//     // { key: "check_in", header: "Check In", render: (row) => fmtDateTime(row.check_in) },
//     // { key: "check_out", header: "Check Out", render: (row) => fmtDateTime(row.check_out) },
//     { key: "pass_no", header: "Pass", render: (row) => (isBulkHeader(row) ? "—" : row.pass_no || "—") },
//     {
//   key: "key_no",
//   header: "Key",
//   render: (row) =>
//     isBulkHeader(row)
//       ? "—"
//       : row.key_no
//       ? `${row.key_no}${row.key_name ? ` - ${row.key_name}` : ""}`
//       : "—",
// },
//     { key: "vehicle", header: "Vehicle", render: (row) => (isBulkHeader(row) ? "—" : row.vehicle_number || "—") },
//     { key: "check_in", header: "Check In", render: (row) => (isBulkHeader(row) ? "—" : fmtDateTime(row.check_in)) },
//     { key: "check_out", header: "Check Out", render: (row) => (isBulkHeader(row) ? "—" : fmtDateTime(row.check_out)) },

//     // {
//     //   key: "status",
//     //   header: "Status",
//     //   render: (row) => (
//     //     <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>
//     //   ),
//     // },
//         {
//       key: "status",
//       header: "Status",
//       render: (row) => (
//         <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>
//       ),
//     },
//     // {
//     //   key: "__actions",
//     //   header: "Action",
//     //   render: (row) =>
//     //     canAct && row.can_check_in ? (
//     //       <button
//     //         onClick={() => setCheckInRecord(row)}
//     //         className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-primary-700 hover:bg-primary-50"
//     //         title="Check in"
//     //       >
//     //         <LogIn size={14} />
//     //         Check In
//     //       </button>
//     //     ) : null,
//     //   width: "120px",
//     // },

//         {
//       key: "__actions",
//       header: "Action",
//       render: (row) => {
//         // child visitors inside an expanded bulk: no action button
//         if (row.isChild) return null;

//         return canAct && row.can_check_in ? (
//           <button
//             onClick={() => setCheckInRecord(row)}
//             className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-primary-700 hover:bg-primary-50"
//             title={row.group ? "Check in all visitors" : "Check in"}
//           >
//             <LogIn size={14} />
//             {row.group ? "Check In All" : "Check In"}
//           </button>
//         ) : null;
//       },
//       width: "120px",
//     },
//   ];

//   //   const columns: TableColumn<DisplayRow>[] = [
//   //   {
//   //     key: "name",
//   //     header: "Name",
//   //     render: (row) =>
//   //       row.group ? (
//   //         <button
//   //           onClick={() => toggleBulk(row.group!.bulkId)}
//   //           className="flex items-center gap-1.5 font-medium text-primary-700"
//   //         >
//   //           {/* marker used by the table wrapper to highlight this row */}
//   //           <span data-bulk-row className="hidden" />
//   //           {expandedBulks.has(row.group.bulkId) ? (
//   //             <ChevronDown size={15} />
//   //           ) : (
//   //             <ChevronRight size={15} />
//   //           )}
//   //           Bulk · {row.group.items.length} visitors
//   //           <span className="text-xs font-normal text-slate-400">({row.group.bulkId})</span>
//   //         </button>
//   //       ) : (
//   //         <div className={row.isChild ? "pl-6" : ""}>
//   //           {row.isChild && <span data-bulk-child className="hidden" />}
//   //           {row.person.person_name}
//   //         </div>
//   //       ),
//   //   },
//   //   { key: "kind", header: "Type", render: (row) => (row.group ? "—" : row.kind) },
//   //   {
//   //     key: "identity",
//   //     header: "Identity",
//   //     render: (row) =>
//   //       row.group ? "—" : `${row.person.identity_type} · ${row.person.identity_number}`,
//   //   },
//   //   {
//   //     key: "contact",
//   //     header: "Contact",
//   //     render: (row) => (row.group ? "—" : row.person.phone_number || "—"),
//   //   },
//   //   {
//   //     key: "company",
//   //     header: "Company",
//   //     render: (row) => (row.group ? "—" : row.company || "—"),
//   //   },
//   //   {
//   //     key: "location",
//   //     header: "Location",
//   //     render: (row) => (row.group ? "—" : row.location?.name ?? "—"),
//   //   },
//   //   {
//   //     key: "site",
//   //     header: "Host Site",
//   //     render: (row) => (row.group ? "—" : row.site.name),
//   //   },
//   //   {
//   //     key: "visit",
//   //     header: "Visit Date",
//   //     render: (row) =>
//   //       row.group
//   //         ? "—"
//   //         : row.from_date === row.to_date || !row.to_date
//   //         ? fmtDate(row.from_date)
//   //         : `${fmtDate(row.from_date)} → ${fmtDate(row.to_date)}`,
//   //   },
//   //   {
//   //     key: "pass_no",
//   //     header: "Pass",
//   //     render: (row) => (row.group ? "—" : row.pass_no || "—"),
//   //   },
//   //   {
//   //     key: "vehicle",
//   //     header: "Vehicle",
//   //     render: (row) => (row.group ? "—" : row.vehicle_number || "—"),
//   //   },
//   //   {
//   //     key: "check_in",
//   //     header: "Check In",
//   //     render: (row) => (row.group ? "—" : fmtDateTime(row.check_in)),
//   //   },
//   //   {
//   //     key: "check_out",
//   //     header: "Check Out",
//   //     render: (row) => (row.group ? "—" : fmtDateTime(row.check_out)),
//   //   },
//   //   {
//   //     key: "status",
//   //     header: "Status",
//   //     render: (row) =>
//   //       row.group ? (
//   //         "—"
//   //       ) : (
//   //         <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>
//   //       ),
//   //   },
//   //   {
//   //     key: "__actions",
//   //     header: "Action",
//   //     render: (row) =>
//   //       !row.group && canAct && row.can_check_in ? (
//   //         <button
//   //           onClick={() => setCheckInRecord(row)}
//   //           className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-primary-700 hover:bg-primary-50"
//   //           title="Check in"
//   //         >
//   //           <LogIn size={14} />
//   //           Check In
//   //         </button>
//   //       ) : null,
//   //     width: "120px",
//   //   },
//   // ];
//   return (
//     <div>
//       <PageHeader
//         title="Pre-Registration Approved List"
//         description="Check in and check out approved pre-registered visitors."
//         actions={
//           <div className="flex items-center gap-2">
//             <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={onBack}>
//               Back
//             </Button>
//             {canAct && (
//               <Button icon={<LogOut size={16} />} onClick={() => setCheckOutOpen(true)}>
//                 Check-Out Visitor
//               </Button>
//             )}
//           </div>
//         }
//       />

//       {listError && (
//         <div className="mb-4">
//           <ErrorBox message={listError} />
//         </div>
//       )}

//       <Card noPadding>
//         <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-end gap-3">
//           <div className="w-full sm:w-72">
//             <Input
//               placeholder="Search name, identity no, contact, location, vehicle, company..."
//               icon={<SearchIcon size={15} />}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>

//           {filterOptions.length > 0 && (
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
//               {filterOptions.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//           )}

//           <select
//             value={kindFilter}
//             onChange={(e) => {
//               setKindFilter(e.target.value as VisitKind | "");
//               setPage(1);
//             }}
//             className={`${fieldClass} max-w-[10rem]`}
//             aria-label="Filter by type"
//           >
//             {KIND_OPTIONS.map((o) => (
//               <option key={o.value} value={o.value}>
//                 {o.label}
//               </option>
//             ))}
//           </select>

//           <select
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value as PreRegVisitStatus);
//               setPage(1);
//             }}
//             className={`${fieldClass} max-w-[10rem]`}
//             aria-label="Filter by status"
//           >
//             {STATUS_OPTIONS.map((o) => (
//               <option key={o.value} value={o.value}>
//                 {o.label}
//               </option>
//             ))}
//           </select>

//           <label className="text-xs text-slate-500">
//             From
//             <input
//               type="date"
//               value={fromDate}
//               max={toDate || undefined}
//               onChange={(e) => {
//                 setFromDate(e.target.value);
//                 setPage(1);
//               }}
//               className={`${fieldClass} mt-1`}
//             />
//           </label>

//           <label className="text-xs text-slate-500">
//             To
//             <input
//               type="date"
//               value={toDate}
//               min={fromDate || undefined}
//               onChange={(e) => {
//                 setToDate(e.target.value);
//                 setPage(1);
//               }}
//               className={`${fieldClass} mt-1`}
//             />
//           </label>

//           <Button variant="outline" onClick={clearFilters}>
//             Clear
//           </Button>
//         </div>

//         <div className="p-4 sm:p-5">
//           {/* {isLoadingList && records.length === 0 ? (
//             <p className="text-sm text-slate-500 py-6 text-center">Loading...</p>
//           ) : (
//             <Table columns={columns} data={records} keyField="guid" />
//           )} */}
//                     {isLoadingList && records.length === 0 ? (
//             <p className="text-sm text-slate-500 py-6 text-center">Loading...</p>
//           ) : (
//             <div
//               className="
//                 [&_tbody_tr]:!bg-white [&_tbody_tr>td]:!bg-white
//                 [&_tbody_tr:has([data-bulk-row])]:!bg-primary-100
//                 [&_tbody_tr:has([data-bulk-row])>td]:!bg-primary-100
//                 [&_tbody_tr:has([data-bulk-child])]:!bg-primary-50
//                 [&_tbody_tr:has([data-bulk-child])>td]:!bg-primary-50
//               "
//             >
//               <Table columns={columns} data={displayRows} keyField="rowKey" />
//             </div>
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

//       <PreRegCheckInModal
//         record={checkInRecord}
//         onClose={() => setCheckInRecord(null)}
//         onDone={() => {
//           setCheckInRecord(null);
//           setRefreshKey((k) => k + 1);
//         }}
//       />

//       <PreRegCheckOutModal
//         isOpen={isCheckOutOpen}
//         onClose={() => setCheckOutOpen(false)}
//         onDone={() => {
//           setCheckOutOpen(false);
//           setRefreshKey((k) => k + 1);
//         }}
//         siteOptions={siteOptions}
//         isLoadingSites={isLoadingSites}
//       />
//     </div>
//   );
// };

// export default PreRegistractionApprovedList;


////////////////////////////////////////////////////////// CORRECT CODE END //////////////////////////////////////////////////////////////////////


import { useEffect,useMemo, useState } from "react";
import {
  Card,
  PageHeader,
  Table,
  Pagination,
  Button,
  Input,
  Modal,
  Select,
  Badge,
} from "@/components/ui";
import type { TableColumn, BadgeVariant } from "@/types";
import {
  Search as SearchIcon,
  LogIn,
  LogOut,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { passService } from "@/service/passcreationservices";
import { keyService } from "@/service/keycreationservices";
import { visitorService, apiErrorMessage } from "@/service/visitorservices";
import type { VisitKind } from "@/service/visitorservices";
import { preRegApprovedService } from "@/service/preregistrationapprovedservices";
import type {
  PreRegApprovedRecord,
  PreRegVisitStatus,
} from "@/service/preregistrationapprovedservices";

const PAGE_SIZE = 10;

interface SiteOption {
  label: string;
  value: string;
}

// A record as returned by the API (bulk_id is set for bulk uploads)
type ApprovedItem = PreRegApprovedRecord & { bulk_id?: string | null };

// A table row: normal record, bulk group header, or a visitor inside an expanded bulk
type DisplayRow = ApprovedItem & {
  rowKey: string;
  group?: { bulkId: string; items: ApprovedItem[] };
  isChild?: boolean;
};

const fmtDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
};

const fmtDateTime = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${fmtDate(value)} ${hh}:${mi}`;
};

const fmtTime = (value?: string | null) => (value ? value.slice(0, 5) : "");

const statusVariant: Record<string, BadgeVariant> = {
  "Checked In": "success",
  "Checked Out": "neutral",
  Pending: "warning",
};

const KIND_OPTIONS: SiteOption[] = [
  { label: "All Types", value: "" },
  { label: "Visitor", value: "Visitor" },
  { label: "Contractor", value: "Contractor" },
];

const STATUS_OPTIONS: SiteOption[] = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Checked In", value: "Checked In" },
  { label: "Checked Out", value: "Checked Out" },
];

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

const ErrorBox = ({ message }: { message: string }) => (
  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
    <AlertCircle size={16} />
    {message}
  </div>
);

const Row = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="text-slate-700 text-right">{value || "—"}</span>
  </div>
);

function VisitDetails({ rec }: { rec: PreRegApprovedRecord }) {
  const window_ =
    `${fmtDate(rec.from_date)} ${fmtTime(rec.from_time)} → ` +
    `${fmtDate(rec.to_date)} ${fmtTime(rec.to_time)}`;
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
      <Row label="Name" value={rec.person.person_name} />
      <Row label="Type" value={rec.kind} />
      <Row label="Identity" value={`${rec.person.identity_type} · ${rec.person.identity_number}`} />
      <Row label="Contact" value={rec.person.phone_number} />
      <Row label="Email" value={rec.person.email} />
      {rec.kind === "Contractor" && <Row label="Company" value={rec.company} />}
      {rec.kind === "Contractor" && <Row label="Company Phone" value={rec.company_phone} />}
      <Row label="Location" value={rec.location?.name} />
      <Row label="Host Site" value={rec.site.name} />
      <Row label="Visit Period" value={window_} />
      <Row label="Approved By" value={rec.requester_email} />
      <Row label="Remark" value={rec.remark} />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Check-In modal (details + pass + key + vehicle)                         */
/* ---------------------------------------------------------------------- */

interface CheckInModalProps {
  // record: PreRegApprovedRecord | null;
  record: DisplayRow | null;
  onClose: () => void;
  onDone: () => void;
}

function PreRegCheckInModal({ record, onClose, onDone }: CheckInModalProps) {
  const [passNo, setPassNo] = useState("");
  const [keyNo, setKeyNo] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [passOptions, setPassOptions] = useState<SiteOption[]>([]);
  const [keyOptions, setKeyOptions] = useState<SiteOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!record) return;
    let cancelled = false;

    // setPassNo(record.pass_no || "");
    // setKeyNo(record.key_no || "");
    // setVehicle(record.vehicle_number || "");
        setPassNo(record.group ? "" : record.pass_no || "");
    setKeyNo(record.group ? "" : record.key_no || "");
    setVehicle(record.group ? "" : record.vehicle_number || "");
    setError("");

    (async () => {
      setIsLoading(true);
      try {
        const [passRes, keyRes] = await Promise.all([
          passService.list({
            page: null,
            page_size: null,
            site_guid: record.site.guid,
            status: "Active",
          }),
          keyService.list({
            page: null,
            page_size: null,
            site_guid: record.site.guid,
            status: "Available",
          }),
        ]);
        if (cancelled) return;

        setPassOptions(
          passRes.success && passRes.data
            ? passRes.data.results.map((p) => ({
                label: `${p.pass_no} - ${p.pass_name}`,
                value: p.pass_no,
              }))
            : []
        );
        setKeyOptions(
          keyRes.success && keyRes.data
            ? keyRes.data.results.map((k) => ({
                label: `${k.key_no} - ${k.key_name}`,
                value: k.key_no,
              }))
            : []
        );
        if (!passRes.success || !keyRes.success) {
          setError("Could not load passes/keys for this site.");
        }
      } catch {
        if (!cancelled) setError("Could not load passes/keys for this site.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [record]);

  const handleSubmit = async () => {
    if (!record) return;
    setIsSubmitting(true);
    setError("");
    // try {
    //   const res = await preRegApprovedService.checkIn({
    //     kind: record.kind,
    //     guid: record.guid,
    //     pass_no: passNo,
    //     key_no: keyNo,
    //     vehicle_number: vehicle.trim(),
    //   });
    //   if (res.success) onDone();
        try {
      const res = record.group
        ? await preRegApprovedService.bulkCheckIn({
            bulk_id: record.group.bulkId,
            pass_no: passNo,
            key_no: keyNo,
          })
        : await preRegApprovedService.checkIn({
            kind: record.kind,
            guid: record.guid,
            pass_no: passNo,
            key_no: keyNo,
            vehicle_number: vehicle.trim(),
          });
      if (res.success) onDone();
      else setError(res.message || "Check-in failed.");
    } catch (err) {
      setError(apiErrorMessage(err, "Check-in failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
    <Modal
      isOpen={!!record}
      onClose={onClose}
      title="Check-In Pre-Registered Visitor"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
            {isSubmitting ? "Checking in..." : "Check In"}
          </Button>
        </>
      }
    >
      {record && (
        <div className="space-y-4">
          {record.group ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-1.5">
              <p className="text-sm font-medium text-slate-700 mb-1">
                Bulk {record.group.bulkId} · {record.group.items.length} visitors
              </p>
              {record.group.items.map((i) => (
                <div key={i.guid} className="flex justify-between text-sm">
                  <span className="text-slate-700">{i.person.person_name}</span>
                  <span className="text-slate-500">{i.person.phone_number || "—"}</span>
                </div>
              ))}
              <p className="text-xs text-slate-500 pt-1">
                The selected pass and key will be assigned to all visitors in this bulk.
              </p>
            </div>
          ) : (
            <VisitDetails rec={record} />
          )}

          <Select
            label="Pass Number"
            placeholder={
              isLoading
                ? "Loading passes..."
                : passOptions.length === 0
                ? "No passes available"
                : "Select Pass"
            }
            disabled={isLoading || passOptions.length === 0}
            options={passOptions}
            value={passNo}
            onChange={(e) => setPassNo(e.target.value)}
          />

          <Select
            label="Key"
            placeholder={
              isLoading
                ? "Loading keys..."
                : keyOptions.length === 0
                ? "No keys available"
                : "Select Key"
            }
            disabled={isLoading || keyOptions.length === 0}
            options={keyOptions}
            value={keyNo}
            onChange={(e) => setKeyNo(e.target.value)}
          />

          {!record.group && (
            <Input
              label="Vehicle"
              placeholder="Vehicle number (optional)"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            />
          )}

          {error && <ErrorBox message={error} />}
        </div>
      )}
    </Modal>
  );
}

/* ---------------------------------------------------------------------- */
/* Check-Out modal: Site -> Pass (checked-in pre-registrations) -> Out     */
/* ---------------------------------------------------------------------- */

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
  siteOptions: SiteOption[];
  isLoadingSites: boolean;
}

function PreRegCheckOutModal({
  isOpen,
  onClose,
  onDone,
  siteOptions,
  isLoadingSites,
}: CheckOutModalProps) {
  const [site, setSite] = useState("");
  const [guid, setGuid] = useState("");
  // const [records, setRecords] = useState<PreRegApprovedRecord[]>([]);
    const [records, setRecords] = useState<ApprovedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // single-site users: preselect
  useEffect(() => {
    if (isOpen && !isLoadingSites && siteOptions.length === 1 && !site) {
      setSite(siteOptions[0].value);
    }
  }, [isOpen, isLoadingSites, siteOptions, site]);

  // checked-in pre-registrations of the selected site
  useEffect(() => {
    if (!isOpen || !site) {
      setRecords([]);
      return;
    }
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await preRegApprovedService.list({
          page: null,
          page_size: null,
          site_guid: site,
          visit_status: "Checked In",
        });
        if (cancelled) return;
        if (res.success && res.data) setRecords(res.data.results);
        else {
          setRecords([]);
          setError(res.message || "Could not load checked-in visitors.");
        }
      } catch (err) {
        if (!cancelled) {
          setRecords([]);
          setError(apiErrorMessage(err, "Could not load checked-in visitors."));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, site]);

  // const selected = records.find((r) => r.guid === guid) ?? null;

  // const passOptions: SiteOption[] = records.map((r) => ({
  //   label: `${r.pass_no || "No pass"} — ${r.person.person_name}`,
  //   value: r.guid,
  // }));

    const BULK_PREFIX = "bulk:";
  const isBulkSelected = guid.startsWith(BULK_PREFIX);
  const selectedBulkId = isBulkSelected ? guid.slice(BULK_PREFIX.length) : "";

  const bulkItems = isBulkSelected
    ? records.filter((r) => r.bulk_id === selectedBulkId)
    : [];
  const selected = !isBulkSelected ? records.find((r) => r.guid === guid) ?? null : null;

  // a bulk becomes ONE entry in the dropdown; normal records stay one-per-person
  const passOptions: SiteOption[] = useMemo(() => {
    const out: SiteOption[] = [];
    const seen = new Set<string>();
    for (const r of records) {
      if (r.bulk_id) {
        if (seen.has(r.bulk_id)) continue;
        seen.add(r.bulk_id);
        const count = records.filter((x) => x.bulk_id === r.bulk_id).length;
        out.push({
          label: `${r.pass_no || "No pass"} — Bulk · ${count} visitors`,
          value: `${BULK_PREFIX}${r.bulk_id}`,
        });
      } else {
        out.push({
          label: `${r.pass_no || "No pass"} — ${r.person.person_name}`,
          value: r.guid,
        });
      }
    }
    return out;
  }, [records]);

  const reset = () => {
    setSite("");
    setGuid("");
    setRecords([]);
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // const handleSubmit = async () => {
  //   if (!selected) return;
  //   setIsSubmitting(true);
  //   setError("");
  //   try {
  //     const res = await visitorService.checkOut(selected.kind as VisitKind, selected.guid);

    const handleSubmit = async () => {
    if (!selected && !isBulkSelected) return;
    setIsSubmitting(true);
    setError("");
    try {
      const res = isBulkSelected
        ? await preRegApprovedService.bulkCheckOut(selectedBulkId)
        : await visitorService.checkOut(selected!.kind as VisitKind, selected!.guid);
      if (res.success) {
        reset();
        onDone();
      } else setError(res.message || "Check-out failed.");
    } catch (err) {
      setError(apiErrorMessage(err, "Check-out failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Check-Out Pre-Registered Visitor"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {/* <Button onClick={handleSubmit} disabled={!selected || isSubmitting}>
            {isSubmitting ? "Checking out..." : "Check Out"}
          </Button> */}
                    <Button onClick={handleSubmit} disabled={(!selected && !isBulkSelected) || isSubmitting}>
            {isSubmitting ? "Checking out..." : isBulkSelected ? "Check Out All" : "Check Out"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Site"
          placeholder={isLoadingSites ? "Loading sites..." : "Select Site"}
          required
          disabled={isLoadingSites}
          options={siteOptions}
          value={site}
          onChange={(e) => {
            setSite(e.target.value);
            setGuid("");
          }}
        />

        <Select
          label="Pass Number"
          placeholder={
            !site
              ? "Select Site first"
              : isLoading
              ? "Loading..."
              : passOptions.length === 0
              ? "No checked-in visitors"
              : "Select Pass"
          }
          required
          disabled={!site || isLoading || passOptions.length === 0}
          options={passOptions}
          value={guid}
          onChange={(e) => setGuid(e.target.value)}
        />

        {selected && (
          <div className="space-y-2">
            <VisitDetails rec={selected} />
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
              <Row label="Pass" value={selected.pass_no} />
              <Row label="Key" value={selected.key_no} />
              <Row label="Vehicle" value={selected.vehicle_number} />
              <Row label="Checked In" value={fmtDateTime(selected.check_in)} />
            </div>
          </div>
        )}
                {isBulkSelected && bulkItems.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
            <Row label="Bulk ID" value={selectedBulkId} />
            <Row label="Pass" value={bulkItems[0].pass_no} />
            <Row label="Key" value={bulkItems[0].key_no} />
            <Row label="Checked In" value={fmtDateTime(bulkItems[0].check_in)} />
            <div className="border-t border-slate-200 pt-2 space-y-1">
              {bulkItems.map((i) => (
                <div key={i.guid} className="flex justify-between text-sm">
                  <span className="text-slate-700">{i.person.person_name}</span>
                  <span className="text-slate-500">{i.person.phone_number || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <ErrorBox message={error} />}
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------------- */
/* Page                                                                     */
/* ---------------------------------------------------------------------- */

interface PreRegistractionApprovedListProps {
  onBack: () => void;
  filterOptions: SiteOption[]; // site filter dropdown
  siteOptions: SiteOption[]; // sites where the user can check in / out
  isLoadingSites: boolean;
  initialSite: string;
  canAct: boolean; // false when viewing another (read-only) site
}

const PreRegistractionApprovedList = ({
  onBack,
  filterOptions,
  siteOptions,
  isLoadingSites,
  initialSite,
  canAct,
}: PreRegistractionApprovedListProps) => {
  const [records, setRecords] = useState<PreRegApprovedRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState(initialSite);
  const [kindFilter, setKindFilter] = useState<VisitKind | "">("");
  const [statusFilter, setStatusFilter] = useState<PreRegVisitStatus>("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  // const [checkInRecord, setCheckInRecord] = useState<PreRegApprovedRecord | null>(null);
    const [checkInRecord, setCheckInRecord] = useState<DisplayRow | null>(null);
  const [isCheckOutOpen, setCheckOutOpen] = useState(false);

  // which bulk groups are expanded
  const [expandedBulks, setExpandedBulks] = useState<Set<string>>(new Set());

  const toggleBulk = (bulkId: string) =>
    setExpandedBulks((prev) => {
      const next = new Set(prev);
      if (next.has(bulkId)) next.delete(bulkId);
      else next.add(bulkId);
      return next;
    });

  // bulk records collapse into one row; normal records stay as they are
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

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoadingList(true);
      setListError("");
      try {
        const res = await preRegApprovedService.list({
          page,
          page_size: PAGE_SIZE,
          search: debouncedSearch,
          site_guid: siteFilter || null,
          kind: kindFilter,
          visit_status: statusFilter,
          from_date: fromDate || null,
          to_date: toDate || null,
        });
        if (cancelled) return;

        if (res.success && res.data) {
          setRecords(res.data.results);
          setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
          setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
        } else {
          setListError(res.message || "Could not load pre-registrations.");
        }
      } catch (err) {
        if (!cancelled)
          setListError(apiErrorMessage(err, "Could not load pre-registrations."));
      } finally {
        if (!cancelled) setIsLoadingList(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, siteFilter, kindFilter, statusFilter, fromDate, toDate, refreshKey]);

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setKindFilter("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setSiteFilter(initialSite);
    setPage(1);
  };

  // const columns: TableColumn<PreRegApprovedRecord>[] = [
  //   { key: "name", header: "Name", render: (row) => row.person.person_name },
  //   { key: "kind", header: "Type" },
  const isBulkHeader = (row: DisplayRow) => !!row.group;
   const columns: TableColumn<DisplayRow>[] = [
    {
      key: "name",
      header: "Name",
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
            {row.person.person_name}
          </div>
        ),
    },
    { key: "kind", header: "Type", render: (row) => (row.group ? "—" : row.kind) },
    // {
    //   key: "identity",
    //   header: "Identity",
    //   render: (row) => `${row.person.identity_type} · ${row.person.identity_number}`,
    // },
    // { key: "contact", header: "Contact", render: (row) => row.person.phone_number || "—" },
    // { key: "company", header: "Company", render: (row) => row.company || "—" },
    // { key: "location", header: "Location", render: (row) => row.location?.name ?? "—" },
        {
      key: "identity",
      header: "Identity",
      render: (row) =>
        isBulkHeader(row)
          ? "—"
          : `${row.person.identity_type} · ${row.person.identity_number}`,
    },
    {
      key: "contact",
      header: "Contact",
      render: (row) => (isBulkHeader(row) ? "—" : row.person.phone_number || "—"),
    },
    {
  key: "email",
  header: "Email",
  render: (row) => (isBulkHeader(row) ? "—" : row.person.email || "—"),
},
    {
      key: "company",
      header: "Company",
      render: (row) => (isBulkHeader(row) ? "—" : row.company || "—"),
    },
    {
  key: "company_phone",
  header: "Company Phone",
  render: (row) => (isBulkHeader(row) ? "—" : row.company_phone || "—"),
},
    {
      key: "location",
      header: "Location",
      render: (row) => (isBulkHeader(row) ? "—" : row.location?.name ?? "—"),
    },
    // { key: "site", header: "Host Site", render: (row) => row.site.name },
    // {
    //   key: "visit",
    //   header: "Visit Date",
    //   render: (row) =>
    //     row.from_date === row.to_date || !row.to_date
    //       ? fmtDate(row.from_date)
    //       : `${fmtDate(row.from_date)} → ${fmtDate(row.to_date)}`,
    // },
    {
  key: "site",
  header: "Host Site",
  render: (row) => (isBulkHeader(row) ? "—" : row.site.name),
},
{
  key: "visit",
  header: "Visit Date",
  render: (row) => {
    if (isBulkHeader(row)) return "—";
    return row.from_date === row.to_date || !row.to_date
      ? fmtDate(row.from_date)
      : `${fmtDate(row.from_date)} → ${fmtDate(row.to_date)}`;
  },
},
    // { key: "pass_no", header: "Pass", render: (row) => row.pass_no || "—" },
    // { key: "vehicle", header: "Vehicle", render: (row) => row.vehicle_number || "—" },
    // { key: "check_in", header: "Check In", render: (row) => fmtDateTime(row.check_in) },
    // { key: "check_out", header: "Check Out", render: (row) => fmtDateTime(row.check_out) },
    { key: "pass_no", header: "Pass", render: (row) => (isBulkHeader(row) ? "—" : row.pass_no || "—") },
    {
  key: "key_no",
  header: "Key",
  render: (row) =>
    isBulkHeader(row)
      ? "—"
      : row.key_no
      ? `${row.key_no}${row.key_name ? ` - ${row.key_name}` : ""}`
      : "—",
},
    { key: "vehicle", header: "Vehicle", render: (row) => (isBulkHeader(row) ? "—" : row.vehicle_number || "—") },
    { key: "check_in", header: "Check In", render: (row) => (isBulkHeader(row) ? "—" : fmtDateTime(row.check_in)) },
    { key: "check_out", header: "Check Out", render: (row) => (isBulkHeader(row) ? "—" : fmtDateTime(row.check_out)) },

    // {
    //   key: "status",
    //   header: "Status",
    //   render: (row) => (
    //     <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>
    //   ),
    // },
        {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>
      ),
    },
    // {
    //   key: "__actions",
    //   header: "Action",
    //   render: (row) =>
    //     canAct && row.can_check_in ? (
    //       <button
    //         onClick={() => setCheckInRecord(row)}
    //         className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-primary-700 hover:bg-primary-50"
    //         title="Check in"
    //       >
    //         <LogIn size={14} />
    //         Check In
    //       </button>
    //     ) : null,
    //   width: "120px",
    // },

        {
      key: "__actions",
      header: "Action",
      render: (row) => {
        // child visitors inside an expanded bulk: no action button
        if (row.isChild) return null;

        // return canAct && row.can_check_in ? (
                const allowed = row.group
          ? row.group.items.some((i) => i.can_check_in)
          : row.can_check_in;

        return canAct && allowed ? (
          <button
            onClick={() => setCheckInRecord(row)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-primary-700 hover:bg-primary-50"
            title={row.group ? "Check in all visitors" : "Check in"}
          >
            <LogIn size={14} />
            {row.group ? "Check In All" : "Check In"}
          </button>
        ) : null;
      },
      width: "120px",
    },
  ];

  //   const columns: TableColumn<DisplayRow>[] = [
  //   {
  //     key: "name",
  //     header: "Name",
  //     render: (row) =>
  //       row.group ? (
  //         <button
  //           onClick={() => toggleBulk(row.group!.bulkId)}
  //           className="flex items-center gap-1.5 font-medium text-primary-700"
  //         >
  //           {/* marker used by the table wrapper to highlight this row */}
  //           <span data-bulk-row className="hidden" />
  //           {expandedBulks.has(row.group.bulkId) ? (
  //             <ChevronDown size={15} />
  //           ) : (
  //             <ChevronRight size={15} />
  //           )}
  //           Bulk · {row.group.items.length} visitors
  //           <span className="text-xs font-normal text-slate-400">({row.group.bulkId})</span>
  //         </button>
  //       ) : (
  //         <div className={row.isChild ? "pl-6" : ""}>
  //           {row.isChild && <span data-bulk-child className="hidden" />}
  //           {row.person.person_name}
  //         </div>
  //       ),
  //   },
  //   { key: "kind", header: "Type", render: (row) => (row.group ? "—" : row.kind) },
  //   {
  //     key: "identity",
  //     header: "Identity",
  //     render: (row) =>
  //       row.group ? "—" : `${row.person.identity_type} · ${row.person.identity_number}`,
  //   },
  //   {
  //     key: "contact",
  //     header: "Contact",
  //     render: (row) => (row.group ? "—" : row.person.phone_number || "—"),
  //   },
  //   {
  //     key: "company",
  //     header: "Company",
  //     render: (row) => (row.group ? "—" : row.company || "—"),
  //   },
  //   {
  //     key: "location",
  //     header: "Location",
  //     render: (row) => (row.group ? "—" : row.location?.name ?? "—"),
  //   },
  //   {
  //     key: "site",
  //     header: "Host Site",
  //     render: (row) => (row.group ? "—" : row.site.name),
  //   },
  //   {
  //     key: "visit",
  //     header: "Visit Date",
  //     render: (row) =>
  //       row.group
  //         ? "—"
  //         : row.from_date === row.to_date || !row.to_date
  //         ? fmtDate(row.from_date)
  //         : `${fmtDate(row.from_date)} → ${fmtDate(row.to_date)}`,
  //   },
  //   {
  //     key: "pass_no",
  //     header: "Pass",
  //     render: (row) => (row.group ? "—" : row.pass_no || "—"),
  //   },
  //   {
  //     key: "vehicle",
  //     header: "Vehicle",
  //     render: (row) => (row.group ? "—" : row.vehicle_number || "—"),
  //   },
  //   {
  //     key: "check_in",
  //     header: "Check In",
  //     render: (row) => (row.group ? "—" : fmtDateTime(row.check_in)),
  //   },
  //   {
  //     key: "check_out",
  //     header: "Check Out",
  //     render: (row) => (row.group ? "—" : fmtDateTime(row.check_out)),
  //   },
  //   {
  //     key: "status",
  //     header: "Status",
  //     render: (row) =>
  //       row.group ? (
  //         "—"
  //       ) : (
  //         <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>
  //       ),
  //   },
  //   {
  //     key: "__actions",
  //     header: "Action",
  //     render: (row) =>
  //       !row.group && canAct && row.can_check_in ? (
  //         <button
  //           onClick={() => setCheckInRecord(row)}
  //           className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-primary-700 hover:bg-primary-50"
  //           title="Check in"
  //         >
  //           <LogIn size={14} />
  //           Check In
  //         </button>
  //       ) : null,
  //     width: "120px",
  //   },
  // ];
  return (
    <div>
      <PageHeader
        title="Pre-Registration Approved List"
        description="Check in and check out approved pre-registered visitors."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" icon={<ArrowLeft size={16} />} onClick={onBack}>
              Back
            </Button>
            {canAct && (
              <Button icon={<LogOut size={16} />} onClick={() => setCheckOutOpen(true)}>
                Check-Out Visitor
              </Button>
            )}
          </div>
        }
      />

      {listError && (
        <div className="mb-4">
          <ErrorBox message={listError} />
        </div>
      )}

      <Card noPadding>
        <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search name, identity no, contact, location, vehicle, company..."
              icon={<SearchIcon size={15} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filterOptions.length > 0 && (
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
              {filterOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}

          <select
            value={kindFilter}
            onChange={(e) => {
              setKindFilter(e.target.value as VisitKind | "");
              setPage(1);
            }}
            className={`${fieldClass} max-w-[10rem]`}
            aria-label="Filter by type"
          >
            {KIND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as PreRegVisitStatus);
              setPage(1);
            }}
            className={`${fieldClass} max-w-[10rem]`}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <label className="text-xs text-slate-500">
            From
            <input
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className={`${fieldClass} mt-1`}
            />
          </label>

          <label className="text-xs text-slate-500">
            To
            <input
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className={`${fieldClass} mt-1`}
            />
          </label>

          <Button variant="outline" onClick={clearFilters}>
            Clear
          </Button>
        </div>

        <div className="p-4 sm:p-5">
          {/* {isLoadingList && records.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">Loading...</p>
          ) : (
            <Table columns={columns} data={records} keyField="guid" />
          )} */}
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

      <PreRegCheckInModal
        record={checkInRecord}
        onClose={() => setCheckInRecord(null)}
        onDone={() => {
          setCheckInRecord(null);
          setRefreshKey((k) => k + 1);
        }}
      />

      <PreRegCheckOutModal
        isOpen={isCheckOutOpen}
        onClose={() => setCheckOutOpen(false)}
        onDone={() => {
          setCheckOutOpen(false);
          setRefreshKey((k) => k + 1);
        }}
        siteOptions={siteOptions}
        isLoadingSites={isLoadingSites}
      />
    </div>
  );
};

export default PreRegistractionApprovedList;