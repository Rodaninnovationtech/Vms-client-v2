// // // // // import { Badge } from "@/components/ui";
// // // // // import { CrudPage } from "@/components/common";
// // // // // import type { FormField } from "@/components/common";
// // // // // import type { TableColumn, BadgeVariant } from "@/types";

// // // // // interface TenantNotificationRecord {
// // // // //   id: string;
// // // // //   visitorName: string;
// // // // //   hostName: string;
// // // // //   site: string;
// // // // //   visitDate: string;
// // // // //   status: string;
// // // // // }



// // // // // const columns: TableColumn<TenantNotificationRecord>[] = [
// // // // //   { key: "id", header: "ID" },
// // // // //   { key: "visitorName", header: "Visitor Name" },
// // // // //   { key: "hostName", header: "Host Name" },
// // // // //   { key: "site", header: "Site" },
// // // // //   { key: "visitDate", header: "Visit Date" },
  
// // // // // ];

// // // // // const formFields: FormField[] = [
// // // // //   { name: "visitorName", label: "Visitor Name", required: true },
// // // // //   { name: "hostName", label: "Host Name", required: true },
// // // // //   { name: "site", label: "Site", required: true, placeholder: "e.g. Tower A" },
// // // // //   { name: "visitDate", label: "Visit Date", type: "text", placeholder: "DD-MM-YYYY" },
// // // // //   {
// // // // //     name: "status",
// // // // //     label: "Status",
// // // // //     type: "select",
// // // // //     options: [
// // // // //       { label: "Pending", value: "Pending" },
// // // // //       { label: "Approved", value: "Approved" },
// // // // //       { label: "Rejected", value: "Rejected" },
// // // // //     ],
// // // // //   },
// // // // // ];

// // // // // const initialData: TenantNotificationRecord[] = [
// // // // //   { id: "PR-001", visitorName: "Anita Rao", hostName: "Suresh Kumar", site: "Tower A", visitDate: "18-09-2026", status: "Pending" },
// // // // //   { id: "PR-002", visitorName: "Vikram Singh", hostName: "Neha Gupta", site: "Tower B", visitDate: "19-09-2026", status: "Approved" },
// // // // //   { id: "PR-003", visitorName: "Divya Patel", hostName: "Amit Shah", site: "Tower C", visitDate: "20-09-2026", status: "Rejected" },
// // // // //   { id: "PR-004", visitorName: "Ravi Verma", hostName: "Pooja Menon", site: "Tower A", visitDate: "21-09-2026", status: "Approved" },
// // // // // ];

// // // // // const TenantNotification = () => {
// // // // //   return (
// // // // //     <CrudPage
// // // // //       title="Tenant Notification"
// // // // //       description="Schedule and manage upcoming visitor TenantNotification."
// // // // //       addLabel="New Tenant Notification"
// // // // //       idPrefix="PR"
// // // // //       columns={columns}
// // // // //       formFields={formFields}
// // // // //       initialData={initialData}
// // // // //       searchPlaceholder="Search by ..."
// // // // //     />
// // // // //   );
// // // // // };

// // // // // export default TenantNotification;



// // // // import { useEffect, useState } from "react";
// // // // import type { FormEvent } from "react";
// // // // import { Plus, Search, Pencil, Trash2, AlertCircle } from "lucide-react";
// // // // import {
// // // //   Card,
// // // //   PageHeader,
// // // //   Table,
// // // //   Pagination,
// // // //   Button,
// // // //   Input,
// // // //   Modal,
// // // //   Spinner,
// // // // } from "@/components/ui";
// // // // import type { TableColumn } from "@/types";
// // // // import { tenantService } from "@/service/tenantcreationservices";
// // // // import { userService } from "@/service/usercreationservices";
// // // // import type { SiteDropdownItem } from "@/service/usercreationservices";
// // // // import { userStorage } from "@/utils/storage";

// // // // const PAGE_SIZE = 10;
// // // // const TENANT_MENU_KEY = "/system-config/tenant";

// // // // interface SiteItem {
// // // //   id?: number;
// // // //   guid: string;
// // // //   site_code?: string;
// // // //   name: string;
// // // // }

// // // // interface StoredUser {
// // // //   is_super_admin?: boolean;
// // // //   site_detail?: SiteItem | null;
// // // //   permissions?: {
// // // //     menu_key: string;
// // // //     view: boolean;
// // // //     enabled: boolean;
// // // //     subsites?: SiteItem[];
// // // //   }[];
// // // // }

// // // // interface DropdownOption {
// // // //   label: string;
// // // //   value: string;
// // // // }

// // // // interface NotificationForm {
// // // //   site: string; // site guid
// // // //   site_name: string;
// // // //   location: string; // tenant guid (used as "location")
// // // //   location_name: string;
// // // //   from_date: string;
// // // //   to_date: string;
// // // //   message: string;
// // // // }

// // // // interface TenantNotificationRecord {
// // // //   guid: string;
// // // //   site: { guid: string; name: string };
// // // //   location_name: string;
// // // //   from_date: string;
// // // //   to_date: string;
// // // //   message: string;
// // // // }

// // // // const emptyForm: NotificationForm = {
// // // //   site: "",
// // // //   site_name: "",
// // // //   location: "",
// // // //   location_name: "",
// // // //   from_date: "",
// // // //   to_date: "",
// // // //   message: "",
// // // // };

// // // // const fieldClass =
// // // //   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// // // // const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

// // // // const extractError = (error: any, fallback: string): string => {
// // // //   const data = error?.response?.data;
// // // //   if (data?.errors) {
// // // //     const first = Object.entries(data.errors)[0] as [string, string[]] | undefined;
// // // //     if (first) return `${first[0]}: ${first[1]?.[0] ?? fallback}`;
// // // //   }
// // // //   return data?.message || fallback;
// // // // };

// // // // const todayStr = () => new Date().toISOString().slice(0, 10);

// // // // const statusFor = (fromDate: string, toDate: string): "Upcoming" | "Active" | "Ended" => {
// // // //   const today = todayStr();
// // // //   if (fromDate > today) return "Upcoming";
// // // //   if (toDate < today) return "Ended";
// // // //   return "Active";
// // // // };

// // // // const statusBadgeClass: Record<string, string> = {
// // // //   Upcoming: "bg-amber-50 text-amber-700 border-amber-100",
// // // //   Active: "bg-green-50 text-green-700 border-green-100",
// // // //   Ended: "bg-slate-100 text-slate-500 border-slate-200",
// // // // };

// // // // const TenantNotification = () => {
// // // //   // ---------- logged-in user ----------
// // // //   const [storedUser] = useState<StoredUser | null>(() =>
// // // //     userStorage.getUser<StoredUser>()
// // // //   );
// // // //   const isSuperAdmin = storedUser?.is_super_admin === true;
// // // //   const ownSite = storedUser?.site_detail ?? null;
// // // //   const subsiteOptions: SiteItem[] =
// // // //     storedUser?.permissions?.find((p) => p.menu_key === TENANT_MENU_KEY)
// // // //       ?.subsites ?? [];

// // // //   // ---------- sites ----------
// // // //   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
// // // //   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
// // // //   const [siteError, setSiteError] = useState("");

// // // //   const siteOptions: DropdownOption[] = isSuperAdmin
// // // //     ? allSites.map((s) => ({
// // // //         label: `${s.site_name} (${s.site_model.name})`,
// // // //         value: s.guid,
// // // //       }))
// // // //     : ownSite
// // // //     ? [ownSite, ...subsiteOptions].map((s) => ({ label: s.name, value: s.guid }))
// // // //     : [];

// // // //   const siteNameByGuid = (guid: string): string =>
// // // //     siteOptions.find((s) => s.value === guid)?.label.replace(/\s*\(.*\)$/, "") ?? "";

// // // //   useEffect(() => {
// // // //     if (!isSuperAdmin) return;
// // // //     const loadSites = async () => {
// // // //       setIsLoadingSites(true);
// // // //       setSiteError("");
// // // //       try {
// // // //         const res = await userService.siteDropdown();
// // // //         if (res.success && res.data) {
// // // //           setAllSites(res.data.results ?? []);
// // // //         } else {
// // // //           setSiteError(res.message || "Could not load sites.");
// // // //         }
// // // //       } catch (error: any) {
// // // //         setSiteError(extractError(error, "Could not load sites. Please try again."));
// // // //       } finally {
// // // //         setIsLoadingSites(false);
// // // //       }
// // // //     };
// // // //     loadSites();
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, []);

// // // //   // ---------- table / local records ----------
// // // //   const [records, setRecords] = useState<TenantNotificationRecord[]>([
// // // //     {
// // // //       guid: "TN-001",
// // // //       site: { guid: "site-a", name: "Tower A" },
// // // //       location_name: "Anita Rao - A-101",
// // // //       from_date: "2026-09-28",
// // // //       to_date: "2026-09-30",
// // // //       message: "Water supply will be interrupted from 9 AM to 1 PM for maintenance.",
// // // //     },
// // // //     {
// // // //       guid: "TN-002",
// // // //       site: { guid: "site-b", name: "Tower B" },
// // // //       location_name: "Vikram Singh - B-204",
// // // //       from_date: "2026-09-20",
// // // //       to_date: "2026-09-22",
// // // //       message: "Fire drill scheduled in the block. Please cooperate with the wardens.",
// // // //     },
// // // //   ]);
// // // //   const [search, setSearch] = useState("");
// // // //   const [page, setPage] = useState(1);

// // // //   const filteredRecords = records.filter((r) => {
// // // //     const q = search.trim().toLowerCase();
// // // //     if (!q) return true;
// // // //     return (
// // // //       r.site.name.toLowerCase().includes(q) ||
// // // //       r.location_name.toLowerCase().includes(q) ||
// // // //       r.message.toLowerCase().includes(q)
// // // //     );
// // // //   });
// // // //   const totalRecords = filteredRecords.length;
// // // //   const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
// // // //   const pagedRecords = filteredRecords.slice(
// // // //     (page - 1) * PAGE_SIZE,
// // // //     page * PAGE_SIZE
// // // //   );

// // // //   // ---------- modal / form ----------
// // // //   const [isModalOpen, setModalOpen] = useState(false);
// // // //   const [editingGuid, setEditingGuid] = useState<string | null>(null);
// // // //   const [form, setForm] = useState<NotificationForm>(emptyForm);
// // // //   const [formError, setFormError] = useState("");
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const [deletingGuid, setDeletingGuid] = useState<string | null>(null);

// // // //   const setField = <K extends keyof NotificationForm>(key: K, value: NotificationForm[K]) =>
// // // //     setForm((f) => ({ ...f, [key]: value }));

// // // //   // ---------- location dropdown (depends on selected site) ----------
// // // //   const [locationOptions, setLocationOptions] = useState<DropdownOption[]>([]);
// // // //   const [isLoadingLocations, setIsLoadingLocations] = useState(false);
// // // //   const [locationError, setLocationError] = useState("");

// // // //   const loadLocationsForSite = async (siteGuid: string, siteName: string) => {
// // // //     if (!siteGuid) {
// // // //       setLocationOptions([]);
// // // //       return;
// // // //     }
// // // //     setIsLoadingLocations(true);
// // // //     setLocationError("");
// // // //     try {
// // // //       const response = await tenantService.list(1, 100, "", {
// // // //         site_guid: siteGuid,
// // // //         site_name: siteName,
// // // //       });
// // // //       if (response.success && response.data) {
// // // //         setLocationOptions(
// // // //           response.data.results.map((t) => ({
// // // //             label: `${t.tenant_name} (${t.block}/${t.floor}/${t.unit})`,
// // // //             value: t.guid,
// // // //           }))
// // // //         );
// // // //       } else {
// // // //         setLocationError(response.message || "Could not load locations.");
// // // //         setLocationOptions([]);
// // // //       }
// // // //     } catch (error: any) {
// // // //       setLocationError(extractError(error, "Could not load locations."));
// // // //       setLocationOptions([]);
// // // //     } finally {
// // // //       setIsLoadingLocations(false);
// // // //     }
// // // //   };

// // // //   const handleSiteChange = (guid: string) => {
// // // //     const name = siteNameByGuid(guid);
// // // //     setForm((f) => ({
// // // //       ...f,
// // // //       site: guid,
// // // //       site_name: name,
// // // //       location: "",
// // // //       location_name: "",
// // // //     }));
// // // //     loadLocationsForSite(guid, name);
// // // //   };

// // // //   const handleLocationChange = (guid: string) => {
// // // //     const label = locationOptions.find((o) => o.value === guid)?.label ?? "";
// // // //     setField("location", guid);
// // // //     setField("location_name", label);
// // // //   };

// // // //   // ---------- modal helpers ----------
// // // //   const openAddModal = () => {
// // // //     setEditingGuid(null);
// // // //     setFormError("");
// // // //     setLocationOptions([]);
// // // //     setForm(emptyForm);
// // // //     setModalOpen(true);
// // // //   };

// // // //   const openEditModal = (row: TenantNotificationRecord) => {
// // // //     setEditingGuid(row.guid);
// // // //     setFormError("");
// // // //     setForm({
// // // //       site: row.site.guid,
// // // //       site_name: row.site.name,
// // // //       location: "",
// // // //       location_name: row.location_name,
// // // //       from_date: row.from_date,
// // // //       to_date: row.to_date,
// // // //       message: row.message,
// // // //     });
// // // //     loadLocationsForSite(row.site.guid, row.site.name);
// // // //     setModalOpen(true);
// // // //   };

// // // //   const validate = (): string => {
// // // //     if (!form.site) return "Site is required";
// // // //     if (!form.location && !form.location_name) return "Location is required";
// // // //     if (!form.from_date) return "From Date is required";
// // // //     if (!form.to_date) return "To Date is required";
// // // //     if (form.to_date < form.from_date) return "To Date cannot be before From Date";
// // // //     if (!form.message.trim()) return "Message is required";
// // // //     return "";
// // // //   };

// // // //   const handleSubmit = async (e: FormEvent) => {
// // // //     e.preventDefault();

// // // //     const message = validate();
// // // //     if (message) {
// // // //       setFormError(message);
// // // //       return;
// // // //     }
// // // //     setFormError("");
// // // //     setIsSubmitting(true);

// // // //     try {
// // // //       const record: TenantNotificationRecord = {
// // // //         guid: editingGuid ?? `TN-${Date.now()}`,
// // // //         site: { guid: form.site, name: form.site_name },
// // // //         location_name:
// // // //           locationOptions.find((o) => o.value === form.location)?.label ??
// // // //           form.location_name,
// // // //         from_date: form.from_date,
// // // //         to_date: form.to_date,
// // // //         message: form.message.trim(),
// // // //       };

// // // //       setRecords((prev) =>
// // // //         editingGuid
// // // //           ? prev.map((r) => (r.guid === editingGuid ? record : r))
// // // //           : [record, ...prev]
// // // //       );
// // // //       setModalOpen(false);
// // // //     } catch (error: any) {
// // // //       setFormError(extractError(error, "Something went wrong. Please try again."));
// // // //     } finally {
// // // //       setIsSubmitting(false);
// // // //     }
// // // //   };

// // // //   const handleDelete = async (row: TenantNotificationRecord) => {
// // // //     if (!window.confirm(`Delete this notification for "${row.location_name}"?`)) return;
// // // //     setDeletingGuid(row.guid);
// // // //     try {
// // // //       setRecords((prev) => prev.filter((r) => r.guid !== row.guid));
// // // //       if (pagedRecords.length === 1 && page > 1) setPage((p) => p - 1);
// // // //     } finally {
// // // //       setDeletingGuid(null);
// // // //     }
// // // //   };

// // // //   // ---------- table columns ----------
// // // //   const columns: TableColumn<TenantNotificationRecord>[] = [
// // // //     { key: "site", header: "Site", render: (row) => row.site.name },
// // // //     { key: "location_name", header: "Location" },
// // // //     { key: "from_date", header: "From Date" },
// // // //     { key: "to_date", header: "To Date" },
// // // //     {
// // // //       key: "message",
// // // //       header: "Message",
// // // //       render: (row) => (
// // // //         <span className="line-clamp-1 max-w-xs inline-block" title={row.message}>
// // // //           {row.message}
// // // //         </span>
// // // //       ),
// // // //     },
// // // //     {
// // // //       key: "status",
// // // //       header: "Status",
// // // //       render: (row) => {
// // // //         const status = statusFor(row.from_date, row.to_date);
// // // //         return (
// // // //           <span
// // // //             className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusBadgeClass[status]}`}
// // // //           >
// // // //             {status}
// // // //           </span>
// // // //         );
// // // //       },
// // // //     },
// // // //     {
// // // //       key: "__actions",
// // // //       header: "Actions",
// // // //       render: (row) => (
// // // //         <div className="flex items-center gap-1.5">
// // // //           <button
// // // //             onClick={() => openEditModal(row)}
// // // //             disabled={deletingGuid === row.guid}
// // // //             className="p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40"
// // // //           >
// // // //             <Pencil size={15} />
// // // //           </button>
// // // //           <button
// // // //             onClick={() => handleDelete(row)}
// // // //             disabled={deletingGuid === row.guid}
// // // //             className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
// // // //           >
// // // //             {deletingGuid === row.guid ? <Spinner size={15} /> : <Trash2 size={15} />}
// // // //           </button>
// // // //         </div>
// // // //       ),
// // // //       width: "90px",
// // // //     },
// // // //   ];

// // // //   return (
// // // //     <div>
// // // //       <PageHeader
// // // //         title="Tenant Notification"
// // // //         description="Schedule and manage notifications sent to tenants by site and location."
// // // //         actions={
// // // //           <Button icon={<Plus size={16} />} onClick={openAddModal}>
// // // //             New Tenant Notification
// // // //           </Button>
// // // //         }
// // // //       />

// // // //       {siteError && (
// // // //         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
// // // //           <AlertCircle size={16} />
// // // //           {siteError}
// // // //         </div>
// // // //       )}

// // // //       <Card noPadding>
// // // //         <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-center gap-3">
// // // //           <div className="max-w-xs">
// // // //             <Input
// // // //               placeholder="Search by site, location or message..."
// // // //               icon={<Search size={15} />}
// // // //               value={search}
// // // //               onChange={(e) => {
// // // //                 setSearch(e.target.value);
// // // //                 setPage(1);
// // // //               }}
// // // //             />
// // // //           </div>
// // // //         </div>

// // // //         <div className="p-4 sm:p-5">
// // // //           <Table columns={columns} data={pagedRecords} keyField="guid" />
// // // //           <Pagination
// // // //             currentPage={page}
// // // //             totalPages={totalPages}
// // // //             onPageChange={setPage}
// // // //             totalRecords={totalRecords}
// // // //             pageSize={PAGE_SIZE}
// // // //           />
// // // //         </div>
// // // //       </Card>

// // // //       <Modal
// // // //         isOpen={isModalOpen}
// // // //         onClose={() => !isSubmitting && setModalOpen(false)}
// // // //         title={editingGuid ? "Edit Tenant Notification" : "New Tenant Notification"}
// // // //         footer={
// // // //           <>
// // // //             <Button
// // // //               variant="outline"
// // // //               onClick={() => setModalOpen(false)}
// // // //               disabled={isSubmitting}
// // // //             >
// // // //               Cancel
// // // //             </Button>
// // // //             <Button onClick={handleSubmit} disabled={isSubmitting}>
// // // //               {isSubmitting ? (
// // // //                 <>
// // // //                   <Spinner size={16} />
// // // //                   {editingGuid ? "Saving..." : "Creating..."}
// // // //                 </>
// // // //               ) : editingGuid ? (
// // // //                 "Save Changes"
// // // //               ) : (
// // // //                 "Create"
// // // //               )}
// // // //             </Button>
// // // //           </>
// // // //         }
// // // //       >
// // // //         <form onSubmit={handleSubmit} className="space-y-4">
// // // //           <div>
// // // //             <label className={labelClass}>
// // // //               Site <span className="text-red-500">*</span>
// // // //             </label>
// // // //             <select
// // // //               value={form.site}
// // // //               onChange={(e) => handleSiteChange(e.target.value)}
// // // //               disabled={isSubmitting || isLoadingSites}
// // // //               className={fieldClass}
// // // //             >
// // // //               <option value="">
// // // //                 {isLoadingSites ? "Loading sites..." : "Select site"}
// // // //               </option>
// // // //               {siteOptions.map((o) => (
// // // //                 <option key={o.value} value={o.value}>
// // // //                   {o.label}
// // // //                 </option>
// // // //               ))}
// // // //             </select>
// // // //           </div>

// // // //           <div>
// // // //             <label className={labelClass}>
// // // //               Location <span className="text-red-500">*</span>
// // // //             </label>
// // // //             <select
// // // //               value={form.location}
// // // //               onChange={(e) => handleLocationChange(e.target.value)}
// // // //               disabled={isSubmitting || !form.site || isLoadingLocations}
// // // //               className={fieldClass}
// // // //             >
// // // //               <option value="">
// // // //                 {!form.site
// // // //                   ? "Select a site first"
// // // //                   : isLoadingLocations
// // // //                   ? "Loading locations..."
// // // //                   : "Select location"}
// // // //               </option>
// // // //               {locationOptions.map((o) => (
// // // //                 <option key={o.value} value={o.value}>
// // // //                   {o.label}
// // // //                 </option>
// // // //               ))}
// // // //             </select>
// // // //             {locationError && (
// // // //               <p className="text-xs text-red-600 mt-1">{locationError}</p>
// // // //             )}
// // // //           </div>

// // // //           <div className="grid grid-cols-2 gap-4">
// // // //             <Input
// // // //               label="From Date"
// // // //               type="date"
// // // //               required
// // // //               value={form.from_date}
// // // //               onChange={(e) => setField("from_date", e.target.value)}
// // // //               disabled={isSubmitting}
// // // //             />
// // // //             <Input
// // // //               label="To Date"
// // // //               type="date"
// // // //               required
// // // //               value={form.to_date}
// // // //               min={form.from_date || undefined}
// // // //               onChange={(e) => setField("to_date", e.target.value)}
// // // //               disabled={isSubmitting}
// // // //             />
// // // //           </div>

// // // //           <div>
// // // //             <label className={labelClass}>
// // // //               Message <span className="text-red-500">*</span>
// // // //             </label>
// // // //             <textarea
// // // //               placeholder="Enter notification message for tenants"
// // // //               required
// // // //               rows={4}
// // // //               value={form.message}
// // // //               onChange={(e) => setField("message", e.target.value)}
// // // //               disabled={isSubmitting}
// // // //               className={fieldClass}
// // // //             />
// // // //           </div>

// // // //           {formError && (
// // // //             <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
// // // //               {formError}
// // // //             </p>
// // // //           )}
// // // //         </form>
// // // //       </Modal>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default TenantNotification;



// // // import { useEffect, useState } from "react";
// // // import type { FormEvent } from "react";
// // // import { Plus, Search, Pencil, Trash2, AlertCircle } from "lucide-react";
// // // import {
// // //   Card,
// // //   PageHeader,
// // //   Table,
// // //   Pagination,
// // //   Button,
// // //   Input,
// // //   Modal,
// // //   Spinner,
// // // } from "@/components/ui";
// // // import type { TableColumn } from "@/types";
// // // import { tenantService } from "@/service/tenantcreationservices";
// // // import { userService } from "@/service/usercreationservices";
// // // import type { SiteDropdownItem } from "@/service/usercreationservices";
// // // import { userStorage } from "@/utils/storage";

// // // const PAGE_SIZE = 10;
// // // const TENANT_MENU_KEY = "/system-config/tenant";

// // // interface SiteItem {
// // //   id?: number;
// // //   guid: string;
// // //   site_code?: string;
// // //   name: string;
// // // }

// // // interface StoredUser {
// // //   is_super_admin?: boolean;
// // //   site_detail?: SiteItem | null;
// // //   permissions?: {
// // //     menu_key: string;
// // //     view: boolean;
// // //     enabled: boolean;
// // //     subsites?: SiteItem[];
// // //   }[];
// // // }

// // // interface DropdownOption {
// // //   label: string;
// // //   value: string;
// // // }

// // // interface NotificationForm {
// // //   site: string; // site guid
// // //   site_name: string;
// // //   location: string; // tenant guid (used as "location")
// // //   location_name: string;
// // //   from_date: string;
// // //   to_date: string;
// // //   message: string;
// // // }

// // // interface TenantNotificationRecord {
// // //   guid: string;
// // //   site: { guid: string; name: string };
// // //   location_name: string;
// // //   from_date: string;
// // //   to_date: string;
// // //   message: string;
// // // }

// // // const emptyForm: NotificationForm = {
// // //   site: "",
// // //   site_name: "",
// // //   location: "",
// // //   location_name: "",
// // //   from_date: "",
// // //   to_date: "",
// // //   message: "",
// // // };

// // // const fieldClass =
// // //   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// // // const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

// // // const extractError = (error: any, fallback: string): string => {
// // //   const data = error?.response?.data;
// // //   if (data?.errors) {
// // //     const first = Object.entries(data.errors)[0] as [string, string[]] | undefined;
// // //     if (first) return `${first[0]}: ${first[1]?.[0] ?? fallback}`;
// // //   }
// // //   return data?.message || fallback;
// // // };

// // // const todayStr = () => new Date().toISOString().slice(0, 10);

// // // const statusFor = (fromDate: string, toDate: string): "Upcoming" | "Active" | "Ended" => {
// // //   const today = todayStr();
// // //   if (fromDate > today) return "Upcoming";
// // //   if (toDate < today) return "Ended";
// // //   return "Active";
// // // };

// // // const statusBadgeClass: Record<string, string> = {
// // //   Upcoming: "bg-amber-50 text-amber-700 border-amber-100",
// // //   Active: "bg-green-50 text-green-700 border-green-100",
// // //   Ended: "bg-slate-100 text-slate-500 border-slate-200",
// // // };

// // // const TenantNotification = () => {
// // //   // ---------- logged-in user ----------
// // //   const [storedUser] = useState<StoredUser | null>(() =>
// // //     userStorage.getUser<StoredUser>()
// // //   );
// // //   const isSuperAdmin = storedUser?.is_super_admin === true;
// // //   const ownSite = storedUser?.site_detail ?? null;
// // //   const subsiteOptions: SiteItem[] =
// // //     storedUser?.permissions?.find((p) => p.menu_key === TENANT_MENU_KEY)
// // //       ?.subsites ?? [];

// // //   // ---------- sites ----------
// // //   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
// // //   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
// // //   const [siteError, setSiteError] = useState("");

// // //   const siteOptions: DropdownOption[] = isSuperAdmin
// // //     ? allSites.map((s) => ({
// // //         label: `${s.site_name} (${s.site_model.name})`,
// // //         value: s.guid,
// // //       }))
// // //     : ownSite
// // //     ? [ownSite, ...subsiteOptions].map((s) => ({ label: s.name, value: s.guid }))
// // //     : [];

// // //   const siteNameByGuid = (guid: string): string =>
// // //     siteOptions.find((s) => s.value === guid)?.label.replace(/\s*\(.*\)$/, "") ?? "";

// // //   useEffect(() => {
// // //     if (!isSuperAdmin) return;
// // //     const loadSites = async () => {
// // //       setIsLoadingSites(true);
// // //       setSiteError("");
// // //       try {
// // //         const res = await userService.siteDropdown();
// // //         if (res.success && res.data) {
// // //           setAllSites(res.data.results ?? []);
// // //         } else {
// // //           setSiteError(res.message || "Could not load sites.");
// // //         }
// // //       } catch (error: any) {
// // //         setSiteError(extractError(error, "Could not load sites. Please try again."));
// // //       } finally {
// // //         setIsLoadingSites(false);
// // //       }
// // //     };
// // //     loadSites();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   // ---------- table / local records ----------
// // //   const [records, setRecords] = useState<TenantNotificationRecord[]>([
// // //     {
// // //       guid: "TN-001",
// // //       site: { guid: "site-a", name: "Tower A" },
// // //       location_name: "Anita Rao - A-101",
// // //       from_date: "2026-09-28",
// // //       to_date: "2026-09-30",
// // //       message: "Water supply will be interrupted from 9 AM to 1 PM for maintenance.",
// // //     },
// // //     {
// // //       guid: "TN-002",
// // //       site: { guid: "site-b", name: "Tower B" },
// // //       location_name: "Vikram Singh - B-204",
// // //       from_date: "2026-09-20",
// // //       to_date: "2026-09-22",
// // //       message: "Fire drill scheduled in the block. Please cooperate with the wardens.",
// // //     },
// // //   ]);
// // //   const [search, setSearch] = useState("");
// // //   const [page, setPage] = useState(1);
// // //   const [siteFilter, setSiteFilter] = useState<string>(""); // "" = All Sites

// // //   // Filter dropdown options for the table (All Sites + every site the user can see)
// // //   const tableSiteOptions: DropdownOption[] = [
// // //     { label: "All Sites", value: "" },
// // //     ...siteOptions,
// // //   ];

// // //   const filteredRecords = records.filter((r) => {
// // //     if (siteFilter && r.site.guid !== siteFilter) return false;
// // //     const q = search.trim().toLowerCase();
// // //     if (!q) return true;
// // //     return (
// // //       r.site.name.toLowerCase().includes(q) ||
// // //       r.location_name.toLowerCase().includes(q) ||
// // //       r.message.toLowerCase().includes(q)
// // //     );
// // //   });
// // //   const totalRecords = filteredRecords.length;
// // //   const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
// // //   const pagedRecords = filteredRecords.slice(
// // //     (page - 1) * PAGE_SIZE,
// // //     page * PAGE_SIZE
// // //   );

// // //   // ---------- modal / form ----------
// // //   const [isModalOpen, setModalOpen] = useState(false);
// // //   const [editingGuid, setEditingGuid] = useState<string | null>(null);
// // //   const [form, setForm] = useState<NotificationForm>(emptyForm);
// // //   const [formError, setFormError] = useState("");
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [deletingGuid, setDeletingGuid] = useState<string | null>(null);

// // //   const setField = <K extends keyof NotificationForm>(key: K, value: NotificationForm[K]) =>
// // //     setForm((f) => ({ ...f, [key]: value }));

// // //   // ---------- location dropdown (depends on selected site) ----------
// // //   const [locationOptions, setLocationOptions] = useState<DropdownOption[]>([]);
// // //   const [isLoadingLocations, setIsLoadingLocations] = useState(false);
// // //   const [locationError, setLocationError] = useState("");

// // //   const loadLocationsForSite = async (siteGuid: string, siteName: string) => {
// // //     if (!siteGuid) {
// // //       setLocationOptions([]);
// // //       return;
// // //     }
// // //     setIsLoadingLocations(true);
// // //     setLocationError("");
// // //     try {
// // //       const response = await tenantService.list(1, 100, "", {
// // //         site_guid: siteGuid,
// // //         site_name: siteName,
// // //       });
// // //       if (response.success && response.data) {
// // //         setLocationOptions(
// // //           response.data.results.map((t) => ({
// // //             label: `${t.tenant_name} (${t.block}/${t.floor}/${t.unit})`,
// // //             value: t.guid,
// // //           }))
// // //         );
// // //       } else {
// // //         setLocationError(response.message || "Could not load locations.");
// // //         setLocationOptions([]);
// // //       }
// // //     } catch (error: any) {
// // //       setLocationError(extractError(error, "Could not load locations."));
// // //       setLocationOptions([]);
// // //     } finally {
// // //       setIsLoadingLocations(false);
// // //     }
// // //   };

// // //   const handleSiteChange = (guid: string) => {
// // //     const name = siteNameByGuid(guid);
// // //     setForm((f) => ({
// // //       ...f,
// // //       site: guid,
// // //       site_name: name,
// // //       location: "",
// // //       location_name: "",
// // //     }));
// // //     loadLocationsForSite(guid, name);
// // //   };

// // //   const handleLocationChange = (guid: string) => {
// // //     const label = locationOptions.find((o) => o.value === guid)?.label ?? "";
// // //     setField("location", guid);
// // //     setField("location_name", label);
// // //   };

// // //   // ---------- modal helpers ----------
// // //   const openAddModal = () => {
// // //     setEditingGuid(null);
// // //     setFormError("");
// // //     setLocationOptions([]);
// // //     setForm(emptyForm);
// // //     setModalOpen(true);
// // //   };

// // //   const openEditModal = (row: TenantNotificationRecord) => {
// // //     setEditingGuid(row.guid);
// // //     setFormError("");
// // //     setForm({
// // //       site: row.site.guid,
// // //       site_name: row.site.name,
// // //       location: "",
// // //       location_name: row.location_name,
// // //       from_date: row.from_date,
// // //       to_date: row.to_date,
// // //       message: row.message,
// // //     });
// // //     loadLocationsForSite(row.site.guid, row.site.name);
// // //     setModalOpen(true);
// // //   };

// // //   const validate = (): string => {
// // //     if (!form.site) return "Site is required";
// // //     if (!form.location && !form.location_name) return "Location is required";
// // //     if (!form.from_date) return "From Date is required";
// // //     if (!form.to_date) return "To Date is required";
// // //     if (form.to_date < form.from_date) return "To Date cannot be before From Date";
// // //     if (!form.message.trim()) return "Message is required";
// // //     return "";
// // //   };

// // //   const handleSubmit = async (e: FormEvent) => {
// // //     e.preventDefault();

// // //     const message = validate();
// // //     if (message) {
// // //       setFormError(message);
// // //       return;
// // //     }
// // //     setFormError("");
// // //     setIsSubmitting(true);

// // //     try {
// // //       const record: TenantNotificationRecord = {
// // //         guid: editingGuid ?? `TN-${Date.now()}`,
// // //         site: { guid: form.site, name: form.site_name },
// // //         location_name:
// // //           locationOptions.find((o) => o.value === form.location)?.label ??
// // //           form.location_name,
// // //         from_date: form.from_date,
// // //         to_date: form.to_date,
// // //         message: form.message.trim(),
// // //       };

// // //       setRecords((prev) =>
// // //         editingGuid
// // //           ? prev.map((r) => (r.guid === editingGuid ? record : r))
// // //           : [record, ...prev]
// // //       );
// // //       setModalOpen(false);
// // //     } catch (error: any) {
// // //       setFormError(extractError(error, "Something went wrong. Please try again."));
// // //     } finally {
// // //       setIsSubmitting(false);
// // //     }
// // //   };

// // //   const handleDelete = async (row: TenantNotificationRecord) => {
// // //     if (!window.confirm(`Delete this notification for "${row.location_name}"?`)) return;
// // //     setDeletingGuid(row.guid);
// // //     try {
// // //       setRecords((prev) => prev.filter((r) => r.guid !== row.guid));
// // //       if (pagedRecords.length === 1 && page > 1) setPage((p) => p - 1);
// // //     } finally {
// // //       setDeletingGuid(null);
// // //     }
// // //   };

// // //   // ---------- table columns ----------
// // //   const columns: TableColumn<TenantNotificationRecord>[] = [
// // //     { key: "site", header: "Site", render: (row) => row.site.name },
// // //     { key: "location_name", header: "Location" },
// // //     { key: "from_date", header: "From Date" },
// // //     { key: "to_date", header: "To Date" },
// // //     {
// // //       key: "message",
// // //       header: "Message",
// // //       render: (row) => (
// // //         <span className="line-clamp-1 max-w-xs inline-block" title={row.message}>
// // //           {row.message}
// // //         </span>
// // //       ),
// // //     },
// // //     {
// // //       key: "status",
// // //       header: "Status",
// // //       render: (row) => {
// // //         const status = statusFor(row.from_date, row.to_date);
// // //         return (
// // //           <span
// // //             className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusBadgeClass[status]}`}
// // //           >
// // //             {status}
// // //           </span>
// // //         );
// // //       },
// // //     },
// // //     {
// // //       key: "__actions",
// // //       header: "Actions",
// // //       render: (row) => (
// // //         <div className="flex items-center gap-1.5">
// // //           <button
// // //             onClick={() => openEditModal(row)}
// // //             disabled={deletingGuid === row.guid}
// // //             className="p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40"
// // //           >
// // //             <Pencil size={15} />
// // //           </button>
// // //           <button
// // //             onClick={() => handleDelete(row)}
// // //             disabled={deletingGuid === row.guid}
// // //             className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
// // //           >
// // //             {deletingGuid === row.guid ? <Spinner size={15} /> : <Trash2 size={15} />}
// // //           </button>
// // //         </div>
// // //       ),
// // //       width: "90px",
// // //     },
// // //   ];

// // //   return (
// // //     <div>
// // //       <PageHeader
// // //         title="Tenant Notification"
// // //         description="Schedule and manage notifications sent to tenants by site and location."
// // //         actions={
// // //           <Button icon={<Plus size={16} />} onClick={openAddModal}>
// // //             New Tenant Notification
// // //           </Button>
// // //         }
// // //       />

// // //       {siteError && (
// // //         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
// // //           <AlertCircle size={16} />
// // //           {siteError}
// // //         </div>
// // //       )}

// // //       <Card noPadding>
// // //         <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-center gap-3">
// // //           <div className="max-w-xs">
// // //             <Input
// // //               placeholder="Search by site, location or message..."
// // //               icon={<Search size={15} />}
// // //               value={search}
// // //               onChange={(e) => {
// // //                 setSearch(e.target.value);
// // //                 setPage(1);
// // //               }}
// // //             />
// // //           </div>

// // //           <select
// // //             value={siteFilter}
// // //             onChange={(e) => {
// // //               setSiteFilter(e.target.value);
// // //               setPage(1);
// // //             }}
// // //             disabled={isLoadingSites}
// // //             className={`${fieldClass} max-w-xs`}
// // //           >
// // //             {tableSiteOptions.map((o) => (
// // //               <option key={o.value} value={o.value}>
// // //                 {o.label}
// // //               </option>
// // //             ))}
// // //           </select>
// // //         </div>

// // //         <div className="p-4 sm:p-5">
// // //           <Table columns={columns} data={pagedRecords} keyField="guid" />
// // //           <Pagination
// // //             currentPage={page}
// // //             totalPages={totalPages}
// // //             onPageChange={setPage}
// // //             totalRecords={totalRecords}
// // //             pageSize={PAGE_SIZE}
// // //           />
// // //         </div>
// // //       </Card>

// // //       <Modal
// // //         isOpen={isModalOpen}
// // //         onClose={() => !isSubmitting && setModalOpen(false)}
// // //         title={editingGuid ? "Edit Tenant Notification" : "New Tenant Notification"}
// // //         footer={
// // //           <>
// // //             <Button
// // //               variant="outline"
// // //               onClick={() => setModalOpen(false)}
// // //               disabled={isSubmitting}
// // //             >
// // //               Cancel
// // //             </Button>
// // //             <Button onClick={handleSubmit} disabled={isSubmitting}>
// // //               {isSubmitting ? (
// // //                 <>
// // //                   <Spinner size={16} />
// // //                   {editingGuid ? "Saving..." : "Creating..."}
// // //                 </>
// // //               ) : editingGuid ? (
// // //                 "Save Changes"
// // //               ) : (
// // //                 "Create"
// // //               )}
// // //             </Button>
// // //           </>
// // //         }
// // //       >
// // //         <form onSubmit={handleSubmit} className="space-y-4">
// // //           <div>
// // //             <label className={labelClass}>
// // //               Site <span className="text-red-500">*</span>
// // //             </label>
// // //             <select
// // //               value={form.site}
// // //               onChange={(e) => handleSiteChange(e.target.value)}
// // //               disabled={isSubmitting || isLoadingSites}
// // //               className={fieldClass}
// // //             >
// // //               <option value="">
// // //                 {isLoadingSites ? "Loading sites..." : "Select site"}
// // //               </option>
// // //               {siteOptions.map((o) => (
// // //                 <option key={o.value} value={o.value}>
// // //                   {o.label}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //           </div>

// // //           <div>
// // //             <label className={labelClass}>
// // //               Location <span className="text-red-500">*</span>
// // //             </label>
// // //             <select
// // //               value={form.location}
// // //               onChange={(e) => handleLocationChange(e.target.value)}
// // //               disabled={isSubmitting || !form.site || isLoadingLocations}
// // //               className={fieldClass}
// // //             >
// // //               <option value="">
// // //                 {!form.site
// // //                   ? "Select a site first"
// // //                   : isLoadingLocations
// // //                   ? "Loading locations..."
// // //                   : "Select location"}
// // //               </option>
// // //               {locationOptions.map((o) => (
// // //                 <option key={o.value} value={o.value}>
// // //                   {o.label}
// // //                 </option>
// // //               ))}
// // //             </select>
// // //             {locationError && (
// // //               <p className="text-xs text-red-600 mt-1">{locationError}</p>
// // //             )}
// // //           </div>

// // //           <div className="grid grid-cols-2 gap-4">
// // //             <Input
// // //               label="From Date"
// // //               type="date"
// // //               required
// // //               value={form.from_date}
// // //               onChange={(e) => setField("from_date", e.target.value)}
// // //               disabled={isSubmitting}
// // //             />
// // //             <Input
// // //               label="To Date"
// // //               type="date"
// // //               required
// // //               value={form.to_date}
// // //               min={form.from_date || undefined}
// // //               onChange={(e) => setField("to_date", e.target.value)}
// // //               disabled={isSubmitting}
// // //             />
// // //           </div>

// // //           <div>
// // //             <label className={labelClass}>
// // //               Message <span className="text-red-500">*</span>
// // //             </label>
// // //             <textarea
// // //               placeholder="Enter notification message for tenants"
// // //               required
// // //               rows={4}
// // //               value={form.message}
// // //               onChange={(e) => setField("message", e.target.value)}
// // //               disabled={isSubmitting}
// // //               className={fieldClass}
// // //             />
// // //           </div>

// // //           {formError && (
// // //             <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
// // //               {formError}
// // //             </p>
// // //           )}
// // //         </form>
// // //       </Modal>
// // //     </div>
// // //   );
// // // };

// // // export default TenantNotification;


// // import { useEffect, useState } from "react";
// // import type { FormEvent } from "react";
// // import { Plus, Search, Pencil, Trash2, AlertCircle } from "lucide-react";
// // import {
// //   Card,
// //   PageHeader,
// //   Table,
// //   Pagination,
// //   Button,
// //   Input,
// //   Modal,
// //   Spinner,
// // } from "@/components/ui";
// // import type { TableColumn } from "@/types";
// // import { tenantService } from "@/service/tenantcreationservices";
// // import {
// //   tenantNotificationService,
// //   type TenantNotificationRecord,
// // } from "../../service/tenantnotificationservices";
// // import { userService } from "@/service/usercreationservices";
// // import type { SiteDropdownItem } from "@/service/usercreationservices";
// // import { userStorage } from "@/utils/storage";

// // const PAGE_SIZE = 10;
// // const TENANT_MENU_KEY = "/system-config/tenant";

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

// // interface DropdownOption {
// //   label: string;
// //   value: string;
// // }

// // interface NotificationForm {
// //   site: string; // site guid
// //   site_name: string;
// //   location: string; // tenant guid (used as "location")
// //   location_name: string;
// //   from_date: string;
// //   to_date: string;
// //   message: string;
// // }

// // const emptyForm: NotificationForm = {
// //   site: "",
// //   site_name: "",
// //   location: "",
// //   location_name: "",
// //   from_date: "",
// //   to_date: "",
// //   message: "",
// // };

// // const fieldClass =
// //   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// // const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

// // const extractError = (error: any, fallback: string): string => {
// //   const data = error?.response?.data;
// //   if (data?.errors) {
// //     const first = Object.entries(data.errors)[0] as [string, string[]] | undefined;
// //     if (first) return `${first[0]}: ${first[1]?.[0] ?? fallback}`;
// //   }
// //   return data?.message || fallback;
// // };

// // const statusBadgeClass: Record<string, string> = {
// //   Upcoming: "bg-amber-50 text-amber-700 border-amber-100",
// //   Active: "bg-green-50 text-green-700 border-green-100",
// //   Ended: "bg-slate-100 text-slate-500 border-slate-200",
// // };

// // const TenantNotification = () => {
// //   // ---------- logged-in user ----------
// //   const [storedUser] = useState<StoredUser | null>(() =>
// //     userStorage.getUser<StoredUser>()
// //   );
// //   const isSuperAdmin = storedUser?.is_super_admin === true;
// //   const ownSite = storedUser?.site_detail ?? null;
// //   const subsiteOptions: SiteItem[] =
// //     storedUser?.permissions?.find((p) => p.menu_key === TENANT_MENU_KEY)
// //       ?.subsites ?? [];

// //   // ---------- sites ----------
// //   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
// //   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
// //   const [siteError, setSiteError] = useState("");

// //   const siteOptions: DropdownOption[] = isSuperAdmin
// //     ? allSites.map((s) => ({
// //         label: `${s.site_name} (${s.site_model.name})`,
// //         value: s.guid,
// //       }))
// //     : ownSite
// //     ? [ownSite, ...subsiteOptions].map((s) => ({ label: s.name, value: s.guid }))
// //     : [];

// //   const siteNameByGuid = (guid: string): string =>
// //     siteOptions.find((s) => s.value === guid)?.label.replace(/\s*\(.*\)$/, "") ?? "";

// //   useEffect(() => {
// //     if (!isSuperAdmin) return;
// //     const loadSites = async () => {
// //       setIsLoadingSites(true);
// //       setSiteError("");
// //       try {
// //         const res = await userService.siteDropdown();
// //         if (res.success && res.data) {
// //           setAllSites(res.data.results ?? []);
// //         } else {
// //           setSiteError(res.message || "Could not load sites.");
// //         }
// //       } catch (error: any) {
// //         setSiteError(extractError(error, "Could not load sites. Please try again."));
// //       } finally {
// //         setIsLoadingSites(false);
// //       }
// //     };
// //     loadSites();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // ---------- table / records (from API) ----------
// //   const [records, setRecords] = useState<TenantNotificationRecord[]>([]);
// //   const [totalRecords, setTotalRecords] = useState(0);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [isLoadingRecords, setIsLoadingRecords] = useState(true);
// //   const [listError, setListError] = useState("");

// //   const [search, setSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [siteFilter, setSiteFilter] = useState<string>(""); // "" = All Sites

// //   const tableSiteOptions: DropdownOption[] = [
// //     { label: "All Sites", value: "" },
// //     ...siteOptions,
// //   ];

// //   const loadRecords = async () => {
// //     setIsLoadingRecords(true);
// //     setListError("");
// //     try {
// //       const res = await tenantNotificationService.list(page, PAGE_SIZE, search, siteFilter);
// //       if (res.success && res.data) {
// //         setRecords(res.data.results);
// //         setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
// //         setTotalPages(res.data.pagination?.total_pages ?? 1);
// //       } else {
// //         setListError(res.message || "Could not load tenant notifications.");
// //         setRecords([]);
// //         setTotalRecords(0);
// //         setTotalPages(1);
// //       }
// //     } catch (error: any) {
// //       setListError(extractError(error, "Could not load tenant notifications."));
// //       setRecords([]);
// //       setTotalRecords(0);
// //       setTotalPages(1);
// //     } finally {
// //       setIsLoadingRecords(false);
// //     }
// //   };

// //   // reload whenever page or site filter changes
// //   useEffect(() => {
// //     loadRecords();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [page, siteFilter]);

// //   // debounce search, reset to page 1
// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       if (page !== 1) {
// //         setPage(1);
// //       } else {
// //         loadRecords();
// //       }
// //     }, 350);
// //     return () => clearTimeout(timer);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [search]);

// //   // ---------- modal / form ----------
// //   const [isModalOpen, setModalOpen] = useState(false);
// //   const [editingGuid, setEditingGuid] = useState<string | null>(null);
// //   const [form, setForm] = useState<NotificationForm>(emptyForm);
// //   const [formError, setFormError] = useState("");
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [deletingGuid, setDeletingGuid] = useState<string | null>(null);

// //   const setField = <K extends keyof NotificationForm>(key: K, value: NotificationForm[K]) =>
// //     setForm((f) => ({ ...f, [key]: value }));

// //   // ---------- location dropdown (depends on selected site) ----------
// //   const [locationOptions, setLocationOptions] = useState<DropdownOption[]>([]);
// //   const [isLoadingLocations, setIsLoadingLocations] = useState(false);
// //   const [locationError, setLocationError] = useState("");

// //   const loadLocationsForSite = async (siteGuid: string, siteName: string) => {
// //     if (!siteGuid) {
// //       setLocationOptions([]);
// //       return;
// //     }
// //     setIsLoadingLocations(true);
// //     setLocationError("");
// //     try {
// //       const response = await tenantService.list("", "", "", {
// //         site_guid: siteGuid,
// //         site_name: siteName,
// //       });
// //       if (response.success && response.data) {
// //         setLocationOptions(
// //           response.data.results.map((t) => ({
// //             label: `${t.tenant_name} (${t.block}/${t.floor}/${t.unit})`,
// //             value: t.guid,
// //           }))
// //         );
// //       } else {
// //         setLocationError(response.message || "Could not load locations.");
// //         setLocationOptions([]);
// //       }
// //     } catch (error: any) {
// //       setLocationError(extractError(error, "Could not load locations."));
// //       setLocationOptions([]);
// //     } finally {
// //       setIsLoadingLocations(false);
// //     }
// //   };

// //   const handleSiteChange = (guid: string) => {
// //     const name = siteNameByGuid(guid);
// //     setForm((f) => ({
// //       ...f,
// //       site: guid,
// //       site_name: name,
// //       location: "",
// //       location_name: "",
// //     }));
// //     loadLocationsForSite(guid, name);
// //   };

// //   const handleLocationChange = (guid: string) => {
// //     const label = locationOptions.find((o) => o.value === guid)?.label ?? "";
// //     setField("location", guid);
// //     setField("location_name", label);
// //   };

// //   // ---------- modal helpers ----------
// //   const openAddModal = () => {
// //     setEditingGuid(null);
// //     setFormError("");
// //     setLocationOptions([]);
// //     setForm(emptyForm);
// //     setModalOpen(true);
// //   };

// //   const openEditModal = (row: TenantNotificationRecord) => {
// //     setEditingGuid(row.guid);
// //     setFormError("");
// //     setForm({
// //       site: row.site.guid,
// //       site_name: row.site.name,
// //       location: row.tenant.guid,
// //       location_name: row.tenant.location,
// //       from_date: row.from_date,
// //       to_date: row.to_date,
// //       message: row.message,
// //     });
// //     loadLocationsForSite(row.site.guid, row.site.name);
// //     setModalOpen(true);
// //   };

// //   const validate = (): string => {
// //     if (!form.site) return "Site is required";
// //     if (!form.location) return "Location is required";
// //     if (!form.from_date) return "From Date is required";
// //     if (!form.to_date) return "To Date is required";
// //     if (form.to_date < form.from_date) return "To Date cannot be before From Date";
// //     if (!form.message.trim()) return "Message is required";
// //     return "";
// //   };

// //   const handleSubmit = async (e: FormEvent) => {
// //     e.preventDefault();

// //     const message = validate();
// //     if (message) {
// //       setFormError(message);
// //       return;
// //     }
// //     setFormError("");
// //     setIsSubmitting(true);

// //     const payload = {
// //       site: form.site,
// //       tenant: form.location,
// //       from_date: form.from_date,
// //       to_date: form.to_date,
// //       message: form.message.trim(),
// //     };

// //     try {
// //       const res = editingGuid
// //         ? await tenantNotificationService.update(editingGuid, payload)
// //         : await tenantNotificationService.create(payload);

// //       if (!res.success) {
// //         setFormError(res.message || "Something went wrong. Please try again.");
// //         return;
// //       }

// //       setModalOpen(false);
// //       // if we just created a record, jump back to page 1 so it's visible
// //       if (!editingGuid && page !== 1) {
// //         setPage(1);
// //       } else {
// //         loadRecords();
// //       }
// //     } catch (error: any) {
// //       setFormError(extractError(error, "Something went wrong. Please try again."));
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const handleDelete = async (row: TenantNotificationRecord) => {
// //     if (!window.confirm(`Delete this notification for "${row.tenant.location}"?`)) return;
// //     setDeletingGuid(row.guid);
// //     try {
// //       const res = await tenantNotificationService.delete(row.guid);
// //       if (!res.success) {
// //         setListError(res.message || "Could not delete this notification.");
// //         return;
// //       }
// //       if (records.length === 1 && page > 1) {
// //         setPage((p) => p - 1);
// //       } else {
// //         loadRecords();
// //       }
// //     } catch (error: any) {
// //       setListError(extractError(error, "Could not delete this notification."));
// //     } finally {
// //       setDeletingGuid(null);
// //     }
// //   };

// //   // ---------- table columns ----------
// //   const columns: TableColumn<TenantNotificationRecord>[] = [
// //     { key: "site", header: "Site", render: (row) => row.site.name },
// //     { key: "location", header: "Location", render: (row) => row.tenant.location },
// //     { key: "from_date", header: "From Date" },
// //     { key: "to_date", header: "To Date" },
// //     {
// //       key: "message",
// //       header: "Message",
// //       render: (row) => (
// //         <span className="line-clamp-1 max-w-xs inline-block" title={row.message}>
// //           {row.message}
// //         </span>
// //       ),
// //     },
// //     {
// //       key: "status",
// //       header: "Status",
// //       render: (row) => (
// //         <span
// //           className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusBadgeClass[row.status]}`}
// //         >
// //           {row.status}
// //         </span>
// //       ),
// //     },
// //     {
// //       key: "__actions",
// //       header: "Actions",
// //       render: (row) => (
// //         <div className="flex items-center gap-1.5">
// //           <button
// //             onClick={() => openEditModal(row)}
// //             disabled={deletingGuid === row.guid}
// //             className="p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40"
// //           >
// //             <Pencil size={15} />
// //           </button>
// //           <button
// //             onClick={() => handleDelete(row)}
// //             disabled={deletingGuid === row.guid}
// //             className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
// //           >
// //             {deletingGuid === row.guid ? <Spinner size={15} /> : <Trash2 size={15} />}
// //           </button>
// //         </div>
// //       ),
// //       width: "90px",
// //     },
// //   ];

// //   return (
// //     <div>
// //       <PageHeader
// //         title="Tenant Notification"
// //         description="Schedule and manage notifications sent to tenants by site and location."
// //         actions={
// //           <Button icon={<Plus size={16} />} onClick={openAddModal}>
// //             New Tenant Notification
// //           </Button>
// //         }
// //       />

// //       {siteError && (
// //         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
// //           <AlertCircle size={16} />
// //           {siteError}
// //         </div>
// //       )}

// //       {listError && (
// //         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
// //           <AlertCircle size={16} />
// //           {listError}
// //         </div>
// //       )}

// //       <Card noPadding>
// //         <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-center gap-3">
// //           <div className="max-w-xs">
// //             <Input
// //               placeholder="Search by site, location or message..."
// //               icon={<Search size={15} />}
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //             />
// //           </div>

// //           <select
// //             value={siteFilter}
// //             onChange={(e) => {
// //               setSiteFilter(e.target.value);
// //               setPage(1);
// //             }}
// //             disabled={isLoadingSites}
// //             className={`${fieldClass} max-w-xs`}
// //           >
// //             {tableSiteOptions.map((o) => (
// //               <option key={o.value} value={o.value}>
// //                 {o.label}
// //               </option>
// //             ))}
// //           </select>
// //         </div>

// //         <div className="p-4 sm:p-5">
// //           {isLoadingRecords ? (
// //             <div className="flex justify-center py-10">
// //               <Spinner size={22} />
// //             </div>
// //           ) : (
// //             <>
// //               <Table columns={columns} data={records} keyField="guid" />
// //               <Pagination
// //                 currentPage={page}
// //                 totalPages={totalPages}
// //                 onPageChange={setPage}
// //                 totalRecords={totalRecords}
// //                 pageSize={PAGE_SIZE}
// //               />
// //             </>
// //           )}
// //         </div>
// //       </Card>

// //       <Modal
// //         isOpen={isModalOpen}
// //         onClose={() => !isSubmitting && setModalOpen(false)}
// //         title={editingGuid ? "Edit Tenant Notification" : "New Tenant Notification"}
// //         footer={
// //           <>
// //             <Button
// //               variant="outline"
// //               onClick={() => setModalOpen(false)}
// //               disabled={isSubmitting}
// //             >
// //               Cancel
// //             </Button>
// //             <Button onClick={handleSubmit} disabled={isSubmitting}>
// //               {isSubmitting ? (
// //                 <>
// //                   <Spinner size={16} />
// //                   {editingGuid ? "Saving..." : "Creating..."}
// //                 </>
// //               ) : editingGuid ? (
// //                 "Save Changes"
// //               ) : (
// //                 "Create"
// //               )}
// //             </Button>
// //           </>
// //         }
// //       >
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <label className={labelClass}>
// //               Site <span className="text-red-500">*</span>
// //             </label>
// //             <select
// //               value={form.site}
// //               onChange={(e) => handleSiteChange(e.target.value)}
// //               disabled={isSubmitting || isLoadingSites}
// //               className={fieldClass}
// //             >
// //               <option value="">
// //                 {isLoadingSites ? "Loading sites..." : "Select site"}
// //               </option>
// //               {siteOptions.map((o) => (
// //                 <option key={o.value} value={o.value}>
// //                   {o.label}
// //                 </option>
// //               ))}
// //             </select>
// //           </div>

// //           <div>
// //             <label className={labelClass}>
// //               Location <span className="text-red-500">*</span>
// //             </label>
// //             <select
// //               value={form.location}
// //               onChange={(e) => handleLocationChange(e.target.value)}
// //               disabled={isSubmitting || !form.site || isLoadingLocations}
// //               className={fieldClass}
// //             >
// //               <option value="">
// //                 {!form.site
// //                   ? "Select a site first"
// //                   : isLoadingLocations
// //                   ? "Loading locations..."
// //                   : "Select location"}
// //               </option>
// //               {locationOptions.map((o) => (
// //                 <option key={o.value} value={o.value}>
// //                   {o.label}
// //                 </option>
// //               ))}
// //             </select>
// //             {locationError && (
// //               <p className="text-xs text-red-600 mt-1">{locationError}</p>
// //             )}
// //           </div>

// //           <div className="grid grid-cols-2 gap-4">
// //             <Input
// //               label="From Date"
// //               type="date"
// //               required
// //               value={form.from_date}
// //               onChange={(e) => setField("from_date", e.target.value)}
// //               disabled={isSubmitting}
// //             />
// //             <Input
// //               label="To Date"
// //               type="date"
// //               required
// //               value={form.to_date}
// //               min={form.from_date || undefined}
// //               onChange={(e) => setField("to_date", e.target.value)}
// //               disabled={isSubmitting}
// //             />
// //           </div>

// //           <div>
// //             <label className={labelClass}>
// //               Message <span className="text-red-500">*</span>
// //             </label>
// //             <textarea
// //               placeholder="Enter notification message for tenants"
// //               required
// //               rows={4}
// //               value={form.message}
// //               onChange={(e) => setField("message", e.target.value)}
// //               disabled={isSubmitting}
// //               className={fieldClass}
// //             />
// //           </div>

// //           {formError && (
// //             <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
// //               {formError}
// //             </p>
// //           )}
// //         </form>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default TenantNotification;




// import { useEffect, useState } from "react";
// import type { FormEvent } from "react";
// import { Plus, Search, Pencil, Trash2, AlertCircle } from "lucide-react";
// import {
//   Card,
//   PageHeader,
//   Table,
//   Pagination,
//   Button,
//   Input,
//   Modal,
//   Spinner,
// } from "@/components/ui";
// import type { TableColumn } from "@/types";
// import { tenantService } from "@/service/tenantcreationservices";
// import {
//   tenantNotificationService,
//   type TenantNotificationRecord,
// } from "../../service/tenantnotificationservices";
// import { userService } from "@/service/usercreationservices";
// import type { SiteDropdownItem } from "@/service/usercreationservices";
// import { userStorage } from "@/utils/storage";

// const PAGE_SIZE = 10;
// const SEARCH_DEBOUNCE_MS = 400;
// const TENANT_MENU_KEY = "/system-config/tenant";

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

// interface DropdownOption {
//   label: string;
//   value: string;
// }

// interface NotificationForm {
//   site: string; // site guid
//   site_name: string;
//   location: string; // tenant guid (used as "location")
//   location_name: string;
//   from_date: string;
//   to_date: string;
//   message: string;
// }

// const emptyForm: NotificationForm = {
//   site: "",
//   site_name: "",
//   location: "",
//   location_name: "",
//   from_date: "",
//   to_date: "",
//   message: "",
// };

// const fieldClass =
//   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

// const extractError = (error: any, fallback: string): string => {
//   const data = error?.response?.data;
//   if (data?.errors) {
//     const first = Object.entries(data.errors)[0] as [string, string[]] | undefined;
//     if (first) return `${first[0]}: ${first[1]?.[0] ?? fallback}`;
//   }
//   return data?.message || fallback;
// };

// const statusBadgeClass: Record<string, string> = {
//   Upcoming: "bg-amber-50 text-amber-700 border-amber-100",
//   Active: "bg-green-50 text-green-700 border-green-100",
//   Ended: "bg-slate-100 text-slate-500 border-slate-200",
// };

// const TenantNotification = () => {
//   // ---------- logged-in user ----------
//   const [storedUser] = useState<StoredUser | null>(() =>
//     userStorage.getUser<StoredUser>()
//   );
//   const isSuperAdmin = storedUser?.is_super_admin === true;
//   const ownSite = storedUser?.site_detail ?? null;
//   const subsiteOptions: SiteItem[] =
//     storedUser?.permissions?.find((p) => p.menu_key === TENANT_MENU_KEY)
//       ?.subsites ?? [];

//   // ---------- sites ----------
//   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
//   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
//   const [siteError, setSiteError] = useState("");

//   const siteOptions: DropdownOption[] = isSuperAdmin
//     ? allSites.map((s) => ({
//         label: `${s.site_name} (${s.site_model.name})`,
//         value: s.guid,
//       }))
//     : ownSite
//     ? [ownSite, ...subsiteOptions].map((s) => ({ label: s.name, value: s.guid }))
//     : [];

//   const siteNameByGuid = (guid: string): string =>
//     siteOptions.find((s) => s.value === guid)?.label.replace(/\s*\(.*\)$/, "") ?? "";

//   useEffect(() => {
//     if (!isSuperAdmin) return;
//     const loadSites = async () => {
//       setIsLoadingSites(true);
//       setSiteError("");
//       try {
//         const res = await userService.siteDropdown();
//         if (res.success && res.data) {
//           setAllSites(res.data.results ?? []);
//         } else {
//           setSiteError(res.message || "Could not load sites.");
//         }
//       } catch (error: any) {
//         setSiteError(extractError(error, "Could not load sites. Please try again."));
//       } finally {
//         setIsLoadingSites(false);
//       }
//     };
//     loadSites();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---------- table / records (from API) ----------
//   const [records, setRecords] = useState<TenantNotificationRecord[]>([]);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoadingRecords, setIsLoadingRecords] = useState(true);
//   const [listError, setListError] = useState("");

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [siteFilter, setSiteFilter] = useState<string>(""); // "" = All Sites

//   const tableSiteOptions: DropdownOption[] = [
//     { label: "All Sites", value: "" },
//     ...siteOptions,
//   ];

//   const loadRecords = async (pageNum: number, searchTerm: string, site: string) => {
//     setIsLoadingRecords(true);
//     setListError("");
//     try {
//       const res = await tenantNotificationService.list(pageNum, PAGE_SIZE, searchTerm, site);
//       if (res.success && res.data) {
//         setRecords(res.data.results);
//         setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
//         setTotalPages(res.data.pagination?.total_pages ?? 1);
//       } else {
//         setListError(res.message || "Could not load tenant notifications.");
//         setRecords([]);
//         setTotalRecords(0);
//         setTotalPages(1);
//       }
//     } catch (error: any) {
//       setListError(extractError(error, "Could not load tenant notifications."));
//       setRecords([]);
//       setTotalRecords(0);
//       setTotalPages(1);
//     } finally {
//       setIsLoadingRecords(false);
//     }
//   };

//   // Single source of truth for fetching: page, search and site filter all land here.
//   // Search changes reset the page to 1 in the input's onChange, so this never
//   // double-fetches the way two separate effects would.
//   useEffect(() => {
//     const timer = setTimeout(
//       () => loadRecords(page, search, siteFilter),
//       search ? SEARCH_DEBOUNCE_MS : 0
//     );
//     return () => clearTimeout(timer);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, search, siteFilter]);

//   // ---------- modal / form ----------
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [editingGuid, setEditingGuid] = useState<string | null>(null);
//   const [form, setForm] = useState<NotificationForm>(emptyForm);
//   const [formError, setFormError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [deletingGuid, setDeletingGuid] = useState<string | null>(null);

//   const setField = <K extends keyof NotificationForm>(key: K, value: NotificationForm[K]) =>
//     setForm((f) => ({ ...f, [key]: value }));

//   // ---------- location dropdown (depends on selected site) ----------
//   const [locationOptions, setLocationOptions] = useState<DropdownOption[]>([]);
//   const [isLoadingLocations, setIsLoadingLocations] = useState(false);
//   const [locationError, setLocationError] = useState("");

//   const loadLocationsForSite = async (siteGuid: string, siteName: string) => {
//     if (!siteGuid) {
//       setLocationOptions([]);
//       return;
//     }
//     setIsLoadingLocations(true);
//     setLocationError("");
//     try {
//       const response = await tenantService.list(1, 100, "", {
//         site_guid: siteGuid,
//         site_name: siteName,
//       });
//       if (response.success && response.data) {
//         setLocationOptions(
//           response.data.results.map((t) => ({
//             label: `${t.tenant_name} (${t.block}/${t.floor}/${t.unit})`,
//             value: t.guid,
//           }))
//         );
//       } else {
//         setLocationError(response.message || "Could not load locations.");
//         setLocationOptions([]);
//       }
//     } catch (error: any) {
//       setLocationError(extractError(error, "Could not load locations."));
//       setLocationOptions([]);
//     } finally {
//       setIsLoadingLocations(false);
//     }
//   };

//   const handleSiteChange = (guid: string) => {
//     const name = siteNameByGuid(guid);
//     setForm((f) => ({
//       ...f,
//       site: guid,
//       site_name: name,
//       location: "",
//       location_name: "",
//     }));
//     loadLocationsForSite(guid, name);
//   };

//   const handleLocationChange = (guid: string) => {
//     const label = locationOptions.find((o) => o.value === guid)?.label ?? "";
//     setField("location", guid);
//     setField("location_name", label);
//   };

//   // ---------- modal helpers ----------
//   const openAddModal = () => {
//     setEditingGuid(null);
//     setFormError("");
//     setLocationOptions([]);
//     setForm(emptyForm);
//     setModalOpen(true);
//   };

//   const openEditModal = (row: TenantNotificationRecord) => {
//     setEditingGuid(row.guid);
//     setFormError("");
//     setForm({
//       site: row.site.guid,
//       site_name: row.site.name,
//       location: row.tenant.guid,
//       location_name: row.tenant.location,
//       from_date: row.from_date,
//       to_date: row.to_date,
//       message: row.message,
//     });
//     loadLocationsForSite(row.site.guid, row.site.name);
//     setModalOpen(true);
//   };

//   const validate = (): string => {
//     if (!form.site) return "Site is required";
//     if (!form.location) return "Location is required";
//     if (!form.from_date) return "From Date is required";
//     if (!form.to_date) return "To Date is required";
//     if (form.to_date < form.from_date) return "To Date cannot be before From Date";
//     if (!form.message.trim()) return "Message is required";
//     return "";
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     const message = validate();
//     if (message) {
//       setFormError(message);
//       return;
//     }
//     setFormError("");
//     setIsSubmitting(true);

//     const payload = {
//       site: form.site,
//       tenant: form.location,
//       from_date: form.from_date,
//       to_date: form.to_date,
//       message: form.message.trim(),
//     };

//     try {
//       const res = editingGuid
//         ? await tenantNotificationService.update(editingGuid, payload)
//         : await tenantNotificationService.create(payload);

//       if (!res.success) {
//         setFormError(res.message || "Something went wrong. Please try again.");
//         return;
//       }

//       setModalOpen(false);
//       // If we just created a record, jump back to page 1 so it's visible.
//       // Otherwise re-fetch the current page/filter combination.
//       if (!editingGuid && page !== 1) {
//         setPage(1);
//       } else {
//         loadRecords(page, search, siteFilter);
//       }
//     } catch (error: any) {
//       setFormError(extractError(error, "Something went wrong. Please try again."));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (row: TenantNotificationRecord) => {
//     if (!window.confirm(`Delete this notification for "${row.tenant.location}"?`)) return;
//     setDeletingGuid(row.guid);
//     try {
//       const res = await tenantNotificationService.delete(row.guid);
//       if (!res.success) {
//         setListError(res.message || "Could not delete this notification.");
//         return;
//       }
//       if (records.length === 1 && page > 1) {
//         setPage((p) => p - 1);
//       } else {
//         loadRecords(page, search, siteFilter);
//       }
//     } catch (error: any) {
//       setListError(extractError(error, "Could not delete this notification."));
//     } finally {
//       setDeletingGuid(null);
//     }
//   };

//   // ---------- table columns ----------
//   const columns: TableColumn<TenantNotificationRecord>[] = [
//     { key: "site", header: "Site", render: (row) => row.site.name },
//     { key: "location", header: "Location", render: (row) => row.tenant.location },
//     { key: "from_date", header: "From Date" },
//     { key: "to_date", header: "To Date" },
//     {
//       key: "message",
//       header: "Message",
//       render: (row) => (
//         <span className="line-clamp-1 max-w-xs inline-block" title={row.message}>
//           {row.message}
//         </span>
//       ),
//     },
//     {
//       key: "status",
//       header: "Status",
//       render: (row) => (
//         <span
//           className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusBadgeClass[row.status]}`}
//         >
//           {row.status}
//         </span>
//       ),
//     },
//     {
//       key: "__actions",
//       header: "Actions",
//       render: (row) => (
//         <div className="flex items-center gap-1.5">
//           <button
//             onClick={() => openEditModal(row)}
//             disabled={deletingGuid === row.guid}
//             className="p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40"
//           >
//             <Pencil size={15} />
//           </button>
//           <button
//             onClick={() => handleDelete(row)}
//             disabled={deletingGuid === row.guid}
//             className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
//           >
//             {deletingGuid === row.guid ? <Spinner size={15} /> : <Trash2 size={15} />}
//           </button>
//         </div>
//       ),
//       width: "90px",
//     },
//   ];

//   return (
//     <div>
//       <PageHeader
//         title="Tenant Notification"
//         description="Schedule and manage notifications sent to tenants by site and location."
//         actions={
//           <Button icon={<Plus size={16} />} onClick={openAddModal}>
//             New Tenant Notification
//           </Button>
//         }
//       />

//       {siteError && (
//         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
//           <AlertCircle size={16} />
//           {siteError}
//         </div>
//       )}

//       {listError && (
//         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
//           <AlertCircle size={16} />
//           {listError}
//         </div>
//       )}

//       <Card noPadding>
//         <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-center gap-3">
//           <div className="max-w-xs">
//             <Input
//               placeholder="Search by site, location or message..."
//               icon={<Search size={15} />}
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(1);
//               }}
//               disabled={isLoadingRecords}
//             />
//           </div>

//           <select
//             value={siteFilter}
//             onChange={(e) => {
//               setSiteFilter(e.target.value);
//               setPage(1);
//             }}
//             disabled={isLoadingRecords || isLoadingSites}
//             className={`${fieldClass} max-w-xs`}
//           >
//             {tableSiteOptions.map((o) => (
//               <option key={o.value} value={o.value}>
//                 {o.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="p-4 sm:p-5">
//           {isLoadingRecords ? (
//             <div className="flex justify-center py-10">
//               <Spinner size={22} />
//             </div>
//           ) : (
//             <>
//               <Table columns={columns} data={records} keyField="guid" />
//               <Pagination
//                 currentPage={page}
//                 totalPages={totalPages}
//                 onPageChange={setPage}
//                 totalRecords={totalRecords}
//                 pageSize={PAGE_SIZE}
//               />
//             </>
//           )}
//         </div>
//       </Card>

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => !isSubmitting && setModalOpen(false)}
//         title={editingGuid ? "Edit Tenant Notification" : "New Tenant Notification"}
//         footer={
//           <>
//             <Button
//               variant="outline"
//               onClick={() => setModalOpen(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} disabled={isSubmitting}>
//               {isSubmitting ? (
//                 <>
//                   <Spinner size={16} />
//                   {editingGuid ? "Saving..." : "Creating..."}
//                 </>
//               ) : editingGuid ? (
//                 "Save Changes"
//               ) : (
//                 "Create"
//               )}
//             </Button>
//           </>
//         }
//       >
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className={labelClass}>
//               Site <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={form.site}
//               onChange={(e) => handleSiteChange(e.target.value)}
//               disabled={isSubmitting || isLoadingSites}
//               className={fieldClass}
//             >
//               <option value="">
//                 {isLoadingSites ? "Loading sites..." : "Select site"}
//               </option>
//               {siteOptions.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className={labelClass}>
//               Location <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={form.location}
//               onChange={(e) => handleLocationChange(e.target.value)}
//               disabled={isSubmitting || !form.site || isLoadingLocations}
//               className={fieldClass}
//             >
//               <option value="">
//                 {!form.site
//                   ? "Select a site first"
//                   : isLoadingLocations
//                   ? "Loading locations..."
//                   : "Select location"}
//               </option>
//               {locationOptions.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//             {locationError && (
//               <p className="text-xs text-red-600 mt-1">{locationError}</p>
//             )}
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Input
//               label="From Date"
//               type="date"
//               required
//               value={form.from_date}
//               onChange={(e) => setField("from_date", e.target.value)}
//               disabled={isSubmitting}
//             />
//             <Input
//               label="To Date"
//               type="date"
//               required
//               value={form.to_date}
//               min={form.from_date || undefined}
//               onChange={(e) => setField("to_date", e.target.value)}
//               disabled={isSubmitting}
//             />
//           </div>

//           <div>
//             <label className={labelClass}>
//               Message <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               placeholder="Enter notification message for tenants"
//               required
//               rows={4}
//               value={form.message}
//               onChange={(e) => setField("message", e.target.value)}
//               disabled={isSubmitting}
//               className={fieldClass}
//             />
//           </div>

//           {formError && (
//             <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
//               {formError}
//             </p>
//           )}
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default TenantNotification;

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
import {
  tenantNotificationService,
  type TenantNotificationRecord,
} from "../../service/tenantnotificationservices";
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

interface NotificationForm {
  site: string; // site guid
  site_name: string;
  location: string; // tenant guid (used as "location")
  location_name: string;
  from_date: string;
  to_date: string;
  message: string;
}

const emptyForm: NotificationForm = {
  site: "",
  site_name: "",
  location: "",
  location_name: "",
  from_date: "",
  to_date: "",
  message: "",
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

const statusBadgeClass: Record<string, string> = {
  Upcoming: "bg-amber-50 text-amber-700 border-amber-100",
  Active: "bg-green-50 text-green-700 border-green-100",
  Ended: "bg-slate-100 text-slate-500 border-slate-200",
};

const TenantNotification = () => {
  // ---------- logged-in user ----------
  const [storedUser] = useState<StoredUser | null>(() =>
    userStorage.getUser<StoredUser>()
  );
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;
  const subsiteOptions: SiteItem[] =
    storedUser?.permissions?.find((p) => p.menu_key === TENANT_MENU_KEY)
      ?.subsites ?? [];

  // ---------- sites (super admin only: all sites) ----------
  const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
  const [siteError, setSiteError] = useState("");

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

  // ---------- site choices ----------
  // Sites the user can pick in the list filter:
  // super admin = every site, others = own site + any subsites they can view
  const siteChoices: SiteItem[] = isSuperAdmin
    ? allSites.map((s) => ({ guid: s.guid, name: s.site_name }))
    : ownSite
    ? [ownSite, ...subsiteOptions]
    : [];

  // Sites the user can pick in Add / Edit Tenant Notification:
  // super admin = every site, others = ONLY their own site
  const formSiteOptions: DropdownOption[] = isSuperAdmin
    ? allSites.map((s) => ({
        label: `${s.site_name} (${s.site_model.name})`,
        value: s.guid,
      }))
    : ownSite
    ? [{ label: ownSite.name, value: ownSite.guid }]
    : [];

  const siteNameByGuid = (guid: string): string =>
    formSiteOptions.find((s) => s.value === guid)?.label.replace(/\s*\(.*\)$/, "") ??
    siteChoices.find((s) => s.guid === guid)?.name ??
    "";

  // ---------- table / records (from API) ----------
  const [records, setRecords] = useState<TenantNotificationRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [listError, setListError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // "" = All Sites (super admin only)
  const [siteFilter, setSiteFilter] = useState<string>(
    isSuperAdmin ? "" : ownSite?.guid ?? ""
  );
  const selectedSite = siteChoices.find((s) => s.guid === siteFilter);

  // View-only when a non-admin selects one of their subsites (not their own site)
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
  const canManageRow = (row: TenantNotificationRecord) =>
    isSuperAdmin || row.site.guid === ownSite?.guid;

//   const loadRecords = async (pageNum: number, searchTerm: string, site?: SiteItem) => {
//     setIsLoadingRecords(true);
//     setListError("");
//     try {
//       const res = await tenantNotificationService.list(
//         pageNum,
//         PAGE_SIZE,
//         searchTerm,
//         site ? { site_guid: site.guid, site_name: site.name } : undefined
//       );
const loadRecords = async (pageNum: number, searchTerm: string, site?: SiteItem) => {
    setIsLoadingRecords(true);
    setListError("");
    try {
      const res = await tenantNotificationService.list(
        pageNum,
        PAGE_SIZE,
        searchTerm,
        site?.guid
      );
      if (res.success && res.data) {
        setRecords(res.data.results);
        setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
        setTotalPages(res.data.pagination?.total_pages ?? 1);
      } else {
        setListError(res.message || "Could not load tenant notifications.");
        setRecords([]);
        setTotalRecords(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      setListError(extractError(error, "Could not load tenant notifications."));
      setRecords([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  // Single source of truth for fetching: page, search and site filter all land here.
  useEffect(() => {
    const timer = setTimeout(
      () => loadRecords(page, search, selectedSite),
      search ? SEARCH_DEBOUNCE_MS : 0
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, siteFilter, allSites]);

  // ---------- modal / form ----------
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingGuid, setEditingGuid] = useState<string | null>(null);
  const [form, setForm] = useState<NotificationForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingGuid, setDeletingGuid] = useState<string | null>(null);

  const setField = <K extends keyof NotificationForm>(key: K, value: NotificationForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // ---------- location dropdown (depends on selected site) ----------
  const [locationOptions, setLocationOptions] = useState<DropdownOption[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationError, setLocationError] = useState("");

  const loadLocationsForSite = async (siteGuid: string, siteName: string) => {
    if (!siteGuid) {
      setLocationOptions([]);
      return;
    }
    setIsLoadingLocations(true);
    setLocationError("");
    try {
      const response = await tenantService.list(1, 100, "", {
        site_guid: siteGuid,
        site_name: siteName,
      });
      if (response.success && response.data) {
        setLocationOptions(
          response.data.results.map((t) => ({
            label: `${t.tenant_name} (${t.block}/${t.floor}/${t.unit})`,
            value: t.guid,
          }))
        );
      } else {
        setLocationError(response.message || "Could not load locations.");
        setLocationOptions([]);
      }
    } catch (error: any) {
      setLocationError(extractError(error, "Could not load locations."));
      setLocationOptions([]);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleSiteChange = (guid: string) => {
    const name = siteNameByGuid(guid);
    setForm((f) => ({
      ...f,
      site: guid,
      site_name: name,
      location: "",
      location_name: "",
    }));
    loadLocationsForSite(guid, name);
  };

  const handleLocationChange = (guid: string) => {
    const label = locationOptions.find((o) => o.value === guid)?.label ?? "";
    setField("location", guid);
    setField("location_name", label);
  };

  // ---------- modal helpers ----------
  const openAddModal = () => {
    setEditingGuid(null);
    setFormError("");
    setLocationOptions([]);
    setForm({
      ...emptyForm,
      // normal users only have their own site, so preselect it
      site: !isSuperAdmin && ownSite ? ownSite.guid : "",
      site_name: !isSuperAdmin && ownSite ? ownSite.name : "",
    });
    if (!isSuperAdmin && ownSite) {
      loadLocationsForSite(ownSite.guid, ownSite.name);
    }
    setModalOpen(true);
  };

  const openEditModal = (row: TenantNotificationRecord) => {
    setEditingGuid(row.guid);
    setFormError("");
    setForm({
      site: row.site.guid,
      site_name: row.site.name,
      location: row.tenant.guid,
      location_name: row.tenant.location,
      from_date: row.from_date,
      to_date: row.to_date,
      message: row.message,
    });
    loadLocationsForSite(row.site.guid, row.site.name);
    setModalOpen(true);
  };

  const validate = (): string => {
    if (!form.site) return "Site is required";
    if (!form.location) return "Location is required";
    if (!form.from_date) return "From Date is required";
    if (!form.to_date) return "To Date is required";
    if (form.to_date < form.from_date) return "To Date cannot be before From Date";
    if (!form.message.trim()) return "Message is required";
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

    const payload = {
      site: form.site,
      tenant: form.location,
      from_date: form.from_date,
      to_date: form.to_date,
      message: form.message.trim(),
    };

    try {
      const res = editingGuid
        ? await tenantNotificationService.update(editingGuid, payload)
        : await tenantNotificationService.create(payload);

      if (!res.success) {
        setFormError(res.message || "Something went wrong. Please try again.");
        return;
      }

      setModalOpen(false);
      // If we just created a record, jump back to page 1 so it's visible.
      if (!editingGuid && page !== 1) {
        setPage(1);
      } else {
        loadRecords(page, search, selectedSite);
      }
    } catch (error: any) {
      setFormError(extractError(error, "Something went wrong. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (row: TenantNotificationRecord) => {
    if (!window.confirm(`Delete this notification for "${row.tenant.location}"?`)) return;
    setDeletingGuid(row.guid);
    try {
      const res = await tenantNotificationService.delete(row.guid);
      if (!res.success) {
        setListError(res.message || "Could not delete this notification.");
        return;
      }
      if (records.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        loadRecords(page, search, selectedSite);
      }
    } catch (error: any) {
      setListError(extractError(error, "Could not delete this notification."));
    } finally {
      setDeletingGuid(null);
    }
  };

  // ---------- table columns ----------
  const columns: TableColumn<TenantNotificationRecord>[] = [
    { key: "site", header: "Site", render: (row) => row.site.name },
    { key: "location", header: "Location", render: (row) => row.tenant.location },
    { key: "from_date", header: "From Date" },
    { key: "to_date", header: "To Date" },
    {
      key: "message",
      header: "Message",
      render: (row) => (
        <span className="line-clamp-1 max-w-xs inline-block" title={row.message}>
          {row.message}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusBadgeClass[row.status]}`}
        >
          {row.status}
        </span>
      ),
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
        title="Tenant Notification"
        description="Schedule and manage notifications sent to tenants by site and location."
        actions={
          isReadOnly ? null : (
            <Button icon={<Plus size={16} />} onClick={openAddModal}>
              New Tenant Notification
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

      {listError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
          <AlertCircle size={16} />
          {listError}
        </div>
      )}

      <Card noPadding>
        <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-center gap-3">
          <div className="max-w-xs">
            <Input
              placeholder="Search by site, location or message..."
              icon={<Search size={15} />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              disabled={isLoadingRecords}
            />
          </div>

          {filterOptions.length > 0 && (
            <select
              value={siteFilter}
              onChange={(e) => {
                setSiteFilter(e.target.value);
                setPage(1);
              }}
              disabled={isLoadingRecords || isLoadingSites}
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
          {isLoadingRecords ? (
            <div className="flex justify-center py-10">
              <Spinner size={22} />
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
        title={editingGuid ? "Edit Tenant Notification" : "New Tenant Notification"}
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
          <div>
            <label className={labelClass}>
              Site Name <span className="text-red-500">*</span>
            </label>
            <select
              value={form.site}
              onChange={(e) => handleSiteChange(e.target.value)}
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

          <div>
            <label className={labelClass}>
              Location <span className="text-red-500">*</span>
            </label>
            <select
              value={form.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              disabled={isSubmitting || !form.site || isLoadingLocations}
              className={fieldClass}
            >
              <option value="">
                {!form.site
                  ? "Select a site first"
                  : isLoadingLocations
                  ? "Loading locations..."
                  : "Select location"}
              </option>
              {locationOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {locationError && (
              <p className="text-xs text-red-600 mt-1">{locationError}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="From Date"
              type="date"
              required
              value={form.from_date}
              onChange={(e) => setField("from_date", e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              label="To Date"
              type="date"
              required
              value={form.to_date}
              min={form.from_date || undefined}
              onChange={(e) => setField("to_date", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className={labelClass}>
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter notification message for tenants"
              required
              rows={4}
              value={form.message}
              onChange={(e) => setField("message", e.target.value)}
              disabled={isSubmitting}
              className={fieldClass}
            />
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

export default TenantNotification;