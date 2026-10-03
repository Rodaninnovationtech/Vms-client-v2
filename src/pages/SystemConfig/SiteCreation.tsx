// import { useEffect, useState } from "react";
// import type { FormEvent, ChangeEvent } from "react";
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
// import { API_BASE_URL } from "@/constants";
// import { siteService } from "../../service/sitecreationservices";
// import type { SiteRecord } from "../../service/sitecreationservices";
// import { siteModelService } from "../../service/Sitemodelservice ";
// import { siteTypeService } from "@/service/sitetypeservice";
// import { categoryService } from "@/service/categoryservice";
// import { userStorage } from "@/utils/storage";

// const PAGE_SIZE = 10;
// const MAX_IMAGE_MB = 5;
// const SEARCH_DEBOUNCE_MS = 400; // NEW
// const normalizeName = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, "");
// const isSubSiteName = (s: string) => normalizeName(s) === "subsite";

// const SITE_MENU_KEY = "/system-config/site";
// const OWN_SITE = "own"; 

// interface SubsiteItem {
//   id: number;
//   guid: string;
//   site_code: string;
//   name: string;
// }

// interface StoredUser {
//   is_super_admin?: boolean;
//   site?: string;
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
//   value: string; // guid
// }

// const fieldClass =
//   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

// interface SelectFieldProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   options: DropdownOption[];
//   placeholder: string;
//   disabled?: boolean;
//   required?: boolean; // NEW: defaults to true so existing callers are unaffected
// }

// const SelectField = ({
//   label,
//   value,
//   onChange,
//   options,
//   placeholder,
//   disabled,
//   required = true, // NEW
// }: SelectFieldProps) => (
//   <div>
//     <label className={labelClass}>
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       disabled={disabled}
//       className={fieldClass}
//     >
//       <option value="">{placeholder}</option>
//       {options.map((o) => (
//         <option key={o.value} value={o.value}>
//           {o.label}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// // Pulls the most useful message out of an API error response.
// // const extractError = (error: any, fallback: string): string => {
// //   const data = error?.response?.data;
// //   if (data?.errors) {
// //     const first = Object.entries(data.errors)[0] as [string, string[]] | undefined;
// //     if (first) return `${first[0]}: ${first[1]?.[0] ?? fallback}`;
// //   }
// //   return data?.message || fallback;
// // };

// const extractError = (error: any, fallback: string): string => {
//   const data = error?.response?.data;
//   if (data?.errors) {
//     const first = Object.entries(data.errors)[0] as [string, string[]] | undefined;
//     if (first) return first[1]?.[0] ?? fallback;
//   }
//   return data?.message || fallback;
// };

// const SiteCreation = () => {
//   // ---------- table ----------
//   const [records, setRecords] = useState<SiteRecord[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);

//   // ---------- dropdown options ----------
//   const [siteModelOptions, setSiteModelOptions] = useState<DropdownOption[]>([]);
//   const [siteTypeOptions, setSiteTypeOptions] = useState<DropdownOption[]>([]);
//   const [categoryOptions, setCategoryOptions] = useState<DropdownOption[]>([]);
//   const [isLoadingOptions, setIsLoadingOptions] = useState(true);
//   const [optionsError, setOptionsError] = useState("");

//   // NEW: parent-site dropdown (loaded fresh whenever the modal opens, so it
//   // reflects the latest sites and can exclude the one being edited)
//   const [parentSiteOptions, setParentSiteOptions] = useState<DropdownOption[]>([]);
//   const [isLoadingParentOptions, setIsLoadingParentOptions] = useState(false);

//   // ---------- modal / form ----------
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [editingGuid, setEditingGuid] = useState<string | null>(null);
//   const [siteCode, setSiteCode] = useState("");
//   const [siteName, setSiteName] = useState("");
//   const [siteModelGuid, setSiteModelGuid] = useState("");
//   const [siteTypeGuid, setSiteTypeGuid] = useState("");
//   const [categoryGuid, setCategoryGuid] = useState("");
//   const [parentGuid, setParentGuid] = useState(""); // NEW
//   const [contact, setContact] = useState("");
//   const [address, setAddress] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [existingImage, setExistingImage] = useState<string | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [fileInputKey, setFileInputKey] = useState(0); // resets the file input
//   const [formError, setFormError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [deletingGuid, setDeletingGuid] = useState<string | null>(null);

//   //  const [ownSiteName] = useState<string>(
//   //   () => userStorage.getUser<StoredUser>()?.site ?? ""
//   // );
//   // const [subsiteOptions] = useState<SubsiteItem[]>(
//   //   () =>
//   //     userStorage
//   //       .getUser<StoredUser>()
//   //       ?.permissions?.find((p) => p.menu_key === SITE_MENU_KEY)?.subsites ?? []
//   // );
//   // const [siteFilter, setSiteFilter] = useState<string>(OWN_SITE);
//   // const isReadOnly = siteFilter !== OWN_SITE; // a subsite is selected

//   // const filterOptions: DropdownOption[] = [
//   //   { label: `${ownSiteName} (My Site)`, value: OWN_SITE },
//   //   ...subsiteOptions.map((s) => ({
//   //     label: `${s.name} (${s.site_code})`,
//   //     value: s.guid,
//   //   })),
//   // ];


//     const [storedUser] = useState<StoredUser | null>(() =>
//     userStorage.getUser<StoredUser>()
//   );
//   const isSuperAdmin = storedUser?.is_super_admin === true;
//   const ownSite = storedUser?.site_detail ?? null;
//   const subsiteOptions: SubsiteItem[] =
//     storedUser?.permissions?.find((p) => p.menu_key === SITE_MENU_KEY)
//       ?.subsites ?? [];

//   // Filter value is a site guid. "" means "All Sites" (super admin only).
//   const [siteFilter, setSiteFilter] = useState<string>(
//     isSuperAdmin ? "" : ownSite?.guid ?? ""
//   );

//   // Every site the user can pick (own site first)
//   const siteChoices: SubsiteItem[] = ownSite
//     ? [ownSite, ...subsiteOptions]
//     : subsiteOptions;
//   const selectedSite = siteChoices.find((s) => s.guid === siteFilter);

//   // Read-only only when one of the subsites is selected
//   const isReadOnly = !!selectedSite && selectedSite.guid !== ownSite?.guid;

//   const filterOptions: DropdownOption[] = isSuperAdmin
//     ? [{ label: "All Sites", value: "" }]
//     : siteChoices.map((s) => ({
//         label:
//           s.guid === ownSite?.guid
//             ? `${s.name} (My Site)`
//             : `${s.name} (${s.site_code})`,
//         value: s.guid,
//       }));

//   const selectedModelLabel =
//     siteModelOptions.find((o) => o.value === siteModelGuid)?.label ?? "";
//   const isSubSite = isSubSiteName(selectedModelLabel);

//   const handleSiteModelChange = (value: string) => {
//     setSiteModelGuid(value);
//     const label = siteModelOptions.find((o) => o.value === value)?.label ?? "";
//     // Switching away from Sub Site clears any parent that was chosen
//     if (!isSubSiteName(label)) setParentGuid("");
//   };
  
//   // ---------- data loading ----------
//   // NEW: takes the search term and passes it through to the API, so search
//   // runs server-side across all sites rather than filtering one loaded page.
//   const fetchList = async (pageNum: number, searchTerm: string) => {
//     setIsLoading(true);
//     setLoadError("");
//     try {
//       // const response = await siteService.list(pageNum, PAGE_SIZE, searchTerm);
//       // const response = await siteService.list(
//       //   pageNum,
//       //   PAGE_SIZE,
//       //   searchTerm,
//       //   selected
//       //     ? { site_guid: selected.guid, site_name: selected.name }
//       //     : undefined
//         // isReadOnly ? siteFilter : undefined
//       // const selected = subsiteOptions.find((s) => s.guid === siteFilter);
//       // const response = await siteService.list(
//       //   pageNum,
//       //   PAGE_SIZE,
//       //   searchTerm,
//       //   selected
//       //     ? { site_guid: selected.guid, site_name: selected.name }
//       //     : undefined
//       // );
//       const response = await siteService.list(
//         pageNum,
//         PAGE_SIZE,
//         searchTerm,
//         selectedSite
//           ? { site_guid: selectedSite.guid, site_name: selectedSite.name }
//           : undefined
//       );
//       if (response.success && response.data) {
//         setRecords(response.data.results);
//         setTotalPages(response.data.pagination?.total_pages ?? 1);
//         setTotalRecords(response.data.pagination?.total_records ?? response.data.results.length);
//       } else {
//         setLoadError(response.message || "Could not load sites.");
//       }
//     } catch (error: any) {
//       setLoadError(extractError(error, "Could not load sites. Please try again."));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Page changes (including the page-reset that search triggers below)
//   // re-fetch with whatever search term is currently set.
//   useEffect(() => {
//     fetchList(page, search);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page]);

//   // NEW: debounce the search box, then reset to page 1 and re-fetch.
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (page !== 1) {
//         setPage(1); // triggers the effect above, which re-fetches with `search`
//       } else {
//         fetchList(1, search);
//       }
//     }, SEARCH_DEBOUNCE_MS);
//     return () => clearTimeout(timer);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, siteFilter]);

//   // Loads every Site Model / Site Type / Category (no pagination) for the dropdowns.
//   useEffect(() => {
//     const loadOptions = async () => {
//       setIsLoadingOptions(true);
//       setOptionsError("");
//       try {
//         const [modelRes, typeRes, categoryRes] = await Promise.all([
//           siteModelService.listAll(),
//           siteTypeService.listAll(),
//           categoryService.listAll(),
//         ]);

//         if (modelRes.success && modelRes.data) {
//           setSiteModelOptions(
//             modelRes.data.results.map((r) => ({ label: r.site_model, value: r.guid }))
//           );
//         }
//         if (typeRes.success && typeRes.data) {
//           setSiteTypeOptions(
//             typeRes.data.results.map((r) => ({ label: r.site_type, value: r.guid }))
//           );
//         }
//         if (categoryRes.success && categoryRes.data) {
//           setCategoryOptions(
//             categoryRes.data.results.map((r) => ({ label: r.category_name, value: r.guid }))
//           );
//         }

//         if (!modelRes.success || !typeRes.success || !categoryRes.success) {
//           setOptionsError("Some dropdown options could not be loaded.");
//         }
//       } catch (error: any) {
//         setOptionsError(
//           extractError(error, "Could not load Site Model / Site Type / Category options.")
//         );
//       } finally {
//         setIsLoadingOptions(false);
//       }
//     };

//     loadOptions();
//   }, []);

//   // NEW: loads the "Parent Site" dropdown. Pass the guid being edited (if
//   // any) so a site can't be offered as its own parent.
//   const loadParentOptions = async (excludeGuid?: string) => {
//     setIsLoadingParentOptions(true);
//     try {
//       const response = await siteService.listParents(excludeGuid);
//       if (response.success && response.data) {
//         setParentSiteOptions(
//           response.data.results.map((r) => ({ label: r.site_name, value: r.guid }))
//         );
//       }
//     } catch (error: any) {
//       // Non-fatal: parent is optional, so just leave the dropdown empty.
//       setParentSiteOptions([]);
//     } finally {
//       setIsLoadingParentOptions(false);
//     }
//   };

//   // ---------- modal helpers ----------
//   const resetForm = () => {
//     setEditingGuid(null);
//     setSiteCode("");
//     setSiteName("");
//     setSiteModelGuid("");
//     setSiteTypeGuid("");
//     setCategoryGuid("");
//     setParentGuid(""); // NEW
//     setContact("");
//     setAddress("");
//     setImageFile(null);
//     setExistingImage(null);
//     setPreviewUrl(null);
//     setFileInputKey((k) => k + 1);
//     setFormError("");
//   };

//   const openAddModal = () => {
//     resetForm();
//     setModalOpen(true);
//     loadParentOptions(); // NEW: no exclusion needed for a brand-new site
//   };

//   const openEditModal = (row: SiteRecord) => {
//     resetForm();
//     setEditingGuid(row.guid);
//     setSiteCode(row.site_code);
//     setSiteName(row.site_name);
//     setSiteModelGuid(row.site_model.guid);
//     setSiteTypeGuid(row.site_type.guid);
//     setCategoryGuid(row.category.guid);
//     setParentGuid(row.parent?.guid ?? ""); // NEW
//     setContact(row.contact);
//     setAddress(row.address);
//     setExistingImage(row.site_image);
//     setModalOpen(true);
//     loadParentOptions(row.guid); // NEW: exclude itself from its own parent list
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;
//     setFormError("");

//     if (!file) {
//       setImageFile(null);
//       setPreviewUrl(null);
//       return;
//     }
//     if (!file.type.startsWith("image/")) {
//       setFormError("Please choose an image file.");
//       setImageFile(null);
//       setPreviewUrl(null);
//       setFileInputKey((k) => k + 1);
//       return;
//     }
//     if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
//       setFormError(`Image must be ${MAX_IMAGE_MB} MB or smaller.`);
//       setImageFile(null);
//       setPreviewUrl(null);
//       setFileInputKey((k) => k + 1);
//       return;
//     }
//     setImageFile(file);
//     setPreviewUrl(URL.createObjectURL(file));
//   };

//   const validate = (): string => {
//     if (!siteCode.trim()) return "Site Code is required";
//     if (!siteName.trim()) return "Site Name is required";
//     if (!siteModelGuid) return "Site Model is required";
//     if (!siteTypeGuid) return "Site Type is required";
//     if (!categoryGuid) return "Category is required";
//     // NOTE: Parent Site is intentionally optional — a site with no parent
//     // is a top-level site, so it is not validated here.
//     if (!contact.trim()) return "Contact is required";
//     if (!editingGuid && !imageFile) return "Site Image is required";
//     if (!address.trim()) return "Address is required";
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
//     try {
//       const payload = {
//         site_code: siteCode.trim(),
//         site_name: siteName.trim(),
//         site_model: siteModelGuid,
//         site_type: siteTypeGuid,
//         category: categoryGuid,
//         parent: isSubSite ? parentGuid || null : null, // NEW
//         contact: contact.trim(),
//         address: address.trim(),
//         site_image: imageFile,
//       };
//       const response = editingGuid
//         ? await siteService.update(editingGuid, payload)
//         : await siteService.create(payload);

//       if (response.success) {
//         setModalOpen(false);
//         await fetchList(page, search);
//       } else {
//         setFormError(response.message || "Something went wrong. Please try again.");
//       }
//     } catch (error: any) {
//       setFormError(extractError(error, "Something went wrong. Please try again."));
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async (row: SiteRecord) => {
//     if (!window.confirm(`Delete site "${row.site_name}" (${row.site_code})?`)) return;

//     setDeletingGuid(row.guid);
//     try {
//       const response = await siteService.delete(row.guid);
//       if (response.success) {
//         if (records.length === 1 && page > 1) {
//           setPage((p) => p - 1);
//         } else {
//           await fetchList(page, search);
//         }
//       } else {
//         alert(response.message || "Could not delete this site.");
//       }
//     } catch (error: any) {
//       alert(extractError(error, "Could not delete this site."));
//     } finally {
//       setDeletingGuid(null);
//     }
//   };

//   const canManageRow = (row: SiteRecord) =>
//     isSuperAdmin || row.guid === ownSite?.guid;

//   // ---------- table columns ----------
//   const columns: TableColumn<SiteRecord>[] = [
//     { key: "site_code", header: "Site Code" },
//     { key: "site_name", header: "Site Name" },
//     {
//       key: "site_model",
//       header: "Site Model",
//       render: (row) => row.site_model.name,
//     },
//     {
//       key: "site_type",
//       header: "Site Type",
//       render: (row) => row.site_type.name,
//     },
//     {
//       key: "category",
//       header: "Category",
//       render: (row) => row.category.name,
//     },
//     {
//       // NEW: shows which parent site this is a subsite of (if any)
//       key: "parent",
//       header: "Parent Site",
//       render: (row) =>
//         row.parent ? row.parent.name : <span className="text-slate-400">—</span>,
//     },
//     { key: "contact", header: "Contact" },
//     {
//       key: "site_image",
//       header: "Image",
//       render: (row) =>
//         row.site_image ? (
//           <img
//             src={`${API_BASE_URL}${row.site_image}`}
//             alt={row.site_name}
//             className="h-10 w-14 rounded-md object-cover border border-slate-200"
//           />
//         ) : (
//           <span className="text-slate-400">—</span>
//         ),
//     },
//     {
//       // key: "__actions",
//       // header: "Actions",
//       // render: (row) => (
//       //   <div className="flex items-center gap-1.5">
//       //     <button
//       //       onClick={() => openEditModal(row)}
//       //       disabled={deletingGuid === row.guid}
//       //       className="p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40"
//       //     >
//       //       <Pencil size={15} />
//       //     </button>
//       //     <button
//       //       onClick={() => handleDelete(row)}
//       //       disabled={deletingGuid === row.guid}
//       //       className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
//       //     >
//       //       {deletingGuid === row.guid ? <Spinner size={15} /> : <Trash2 size={15} />}
//       //     </button>
//       //   </div>
//       // ),
//       // width: "90px",
//             key: "__actions",
//       header: "Actions",
//       render: (row) =>
//         canManageRow(row) ? (
//           <div className="flex items-center gap-1.5">
//             <button
//               onClick={() => openEditModal(row)}
//               disabled={deletingGuid === row.guid}
//               className="p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40"
//             >
//               <Pencil size={15} />
//             </button>
//             <button
//               onClick={() => handleDelete(row)}
//               disabled={deletingGuid === row.guid}
//               className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
//             >
//               {deletingGuid === row.guid ? <Spinner size={15} /> : <Trash2 size={15} />}
//             </button>
//           </div>
//         ) : (
//           <span className="text-slate-400">—</span>
//         ),
//       width: "90px",
//     },
//   ];

//   const visibleColumns = isReadOnly
//     ? columns.filter((c) => c.key !== "__actions")
//     : columns;

//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   return (
//     <div>
//       <PageHeader
//         title="Site Creation"
//         description="Create and manage physical sites/properties."
//         // actions={
//         //   <Button icon={<Plus size={16} />} onClick={openAddModal}>
//         //     Add Site
//         //   </Button>
//         // }
//         actions={
//           isReadOnly ? null : (
//             <Button icon={<Plus size={16} />} onClick={openAddModal}>
//               Add Site
//             </Button>
//           )
//         }
//       />

//       {optionsError && (
//         <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
//           <AlertCircle size={16} />
//           {optionsError}
//         </div>
//       )}

//       <Card noPadding>
//         {/* <div className="p-4 sm:p-5 border-b border-primary-50"> */}
//                 <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-center gap-3">
//           <div className="max-w-xs">
//             <Input
//               placeholder="Search by site name..."
//               icon={<Search size={15} />}
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               disabled={isLoading}
//             />
//           </div>
//           {filterOptions.length > 0 && (
//             <select
//               value={siteFilter}
//               onChange={(e) => setSiteFilter(e.target.value)}
//               disabled={isLoading}
//               className={`${fieldClass} max-w-xs`}
//             >
//               {filterOptions.map((o) => (
//                 <option key={o.value} value={o.value}>
//                   {o.label}
//                 </option>
//               ))}
//             </select>
//           )}

//           {isReadOnly && (
//             <span className="text-xs text-slate-500">View only</span>
//           )}
//         </div>

//         <div className="p-4 sm:p-5">
//           {loadError && (
//             <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
//               <AlertCircle size={16} />
//               {loadError}
//             </div>
//           )}

//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
//               <Spinner size={28} className="text-primary-500" />
//               <p className="text-sm">Loading sites...</p>
//             </div>
//           ) : (
//             <>
//               {/* <Table columns={columns} data={records} keyField="guid" /> */}
//               <Table columns={visibleColumns} data={records} keyField="guid" />
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
//         title={editingGuid ? "Edit Site" : "Add Site"}
//         footer={
//           <>
//             <Button variant="outline" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
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
//           <Input
//             label="Site Code"
//             placeholder="Enter site code"
//             required
//             value={siteCode}
//             onChange={(e) => setSiteCode(e.target.value)}
//             disabled={isSubmitting}
//           />
//           <Input
//             label="Site Name"
//             placeholder="Enter site name"
//             required
//             value={siteName}
//             onChange={(e) => setSiteName(e.target.value)}
//             disabled={isSubmitting}
//           />

//           <SelectField
//             label="Site Model"
//             value={siteModelGuid}
//             // onChange={setSiteModelGuid}
//             onChange={handleSiteModelChange}
//             options={siteModelOptions}
//             placeholder={isLoadingOptions ? "Loading..." : "Select Site Model"}
//             disabled={isSubmitting || isLoadingOptions}
//           />
//           <SelectField
//             label="Site Type"
//             value={siteTypeGuid}
//             onChange={setSiteTypeGuid}
//             options={siteTypeOptions}
//             placeholder={isLoadingOptions ? "Loading..." : "Select Site Type"}
//             disabled={isSubmitting || isLoadingOptions}
//           />
//           <SelectField
//             label="Category"
//             value={categoryGuid}
//             onChange={setCategoryGuid}
//             options={categoryOptions}
//             placeholder={isLoadingOptions ? "Loading..." : "Select Category"}
//             disabled={isSubmitting || isLoadingOptions}
//           />

//           {/* NEW: optional parent site (subsite) selector */}
          
//           {isSubSite && (
//           <SelectField
//             label="Parent Site"
//             value={parentGuid}
//             onChange={setParentGuid}
//             options={parentSiteOptions}
//             placeholder={
//               isLoadingParentOptions ? "Loading..." : "Select Parent Site"
//             }
//             disabled={isSubmitting || isLoadingParentOptions}
//             required={false}
//           />
//           )}
//           <Input
//             label="Contact"
//             placeholder="Enter contact"
//             required
//             value={contact}
//             onChange={(e) => setContact(e.target.value)}
//             disabled={isSubmitting}
//           />

//           <div>
//             <label className={labelClass}>
//               Site Image {!editingGuid && <span className="text-red-500">*</span>}
//             </label>
//             {imageFile && previewUrl ? (
//               <div className="mb-2 flex items-center gap-3">
//                 <img
//                   src={previewUrl}
//                   alt="Selected"
//                   className="h-14 w-20 rounded-md object-cover border border-slate-200"
//                 />
//                 <p className="text-xs text-slate-500">New image selected: {imageFile.name}</p>
//               </div>
//             ) : (
//               editingGuid &&
//               existingImage && (
//                 <div className="mb-2 flex items-center gap-3">
//                   <img
//                     src={`${API_BASE_URL}${existingImage}`}
//                     alt="Current site"
//                     className="h-14 w-20 rounded-md object-cover border border-slate-200"
//                   />
//                   <p className="text-xs text-slate-500">
//                     Current image. Choose a new file only if you want to replace it.
//                   </p>
//                 </div>
//               )
//             )}
//             <input
//               key={fileInputKey}
//               type="file"
//               accept="image/*"
//               onChange={handleFileChange}
//               disabled={isSubmitting}
//               className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-60"
//             />
//             <p className="mt-1 text-xs text-slate-400">Image files only, up to {MAX_IMAGE_MB} MB.</p>
//           </div>

//           <div>
//             <label className={labelClass}>
//               Address <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               rows={3}
//               placeholder="Enter address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
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

// export default SiteCreation;
























import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
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
import { API_BASE_URL } from "@/constants";
import { siteService } from "../../service/sitecreationservices";
import type { SiteRecord } from "../../service/sitecreationservices";
import { siteModelService } from "../../service/Sitemodelservice ";
import { siteTypeService } from "@/service/sitetypeservice";
import { categoryService } from "@/service/categoryservice";
import { userStorage } from "@/utils/storage";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";

const PAGE_SIZE = 10;
const MAX_IMAGE_MB = 5;
const SEARCH_DEBOUNCE_MS = 400;
const normalizeName = (s: string) => s.toLowerCase().replace(/[\s_-]+/g, "");
const isSubSiteName = (s: string) => normalizeName(s) === "subsite";

const SITE_MENU_KEY = "/system-config/site";

interface SubsiteItem {
  id?: number;
  guid: string;
  site_code?: string;
  name: string;
}

interface StoredUser {
  is_super_admin?: boolean;
  site?: string;
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
  value: string; // guid
}

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
}

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  required = true,
}: SelectFieldProps) => (
  <div>
    <label className={labelClass}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={fieldClass}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

// Pulls the most useful message out of an API error response.
const extractError = (error: any, fallback: string): string => {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.entries(data.errors)[0] as [string, string[]] | undefined;
    if (first) return first[1]?.[0] ?? fallback;
  }
  return data?.message || fallback;
};

const SiteCreation = () => {
  // ---------- table ----------
  const [records, setRecords] = useState<SiteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // ---------- dropdown options ----------
  const [siteModelOptions, setSiteModelOptions] = useState<DropdownOption[]>([]);
  const [siteTypeOptions, setSiteTypeOptions] = useState<DropdownOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<DropdownOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState("");

  // Parent-site dropdown (loaded fresh whenever the modal opens, so it
  // reflects the latest sites and can exclude the one being edited)
  const [parentSiteOptions, setParentSiteOptions] = useState<DropdownOption[]>([]);
  const [isLoadingParentOptions, setIsLoadingParentOptions] = useState(false);

  // ---------- modal / form ----------
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingGuid, setEditingGuid] = useState<string | null>(null);
  const [siteCode, setSiteCode] = useState("");
  const [siteName, setSiteName] = useState("");
  const [siteModelGuid, setSiteModelGuid] = useState("");
  const [siteTypeGuid, setSiteTypeGuid] = useState("");
  const [categoryGuid, setCategoryGuid] = useState("");
  const [parentGuid, setParentGuid] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingGuid, setDeletingGuid] = useState<string | null>(null);

  const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;
  const subsiteOptions: SubsiteItem[] =
    storedUser?.permissions?.find((p) => p.menu_key === SITE_MENU_KEY)?.subsites ?? [];

  // ----- full site list (super admin only — for the filter dropdown) -----
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

  // Admin's full site list, reshaped to the same SubsiteItem shape used
  // everywhere else in this file, so it can plug into siteChoices/filter logic.
  const adminSiteChoices: SubsiteItem[] = allSites.map((s) => ({
    guid: s.guid,
    name: s.site_name,
  }));

  // Filter value is a site guid. "" means "All Sites" (super admin only).
  const [siteFilter, setSiteFilter] = useState<string>(
    isSuperAdmin ? "" : ownSite?.guid ?? ""
  );

  // Every site the user can pick (own site first)
  const siteChoices: SubsiteItem[] = ownSite ? [ownSite, ...subsiteOptions] : subsiteOptions;

  const selectedSite = isSuperAdmin
    ? adminSiteChoices.find((s) => s.guid === siteFilter)
    : siteChoices.find((s) => s.guid === siteFilter);

  // Read-only only when one of the subsites is selected
  const isReadOnly = !!selectedSite && selectedSite.guid !== ownSite?.guid;

  const filterOptions: DropdownOption[] = isSuperAdmin
    ? [
        { label: "All Sites", value: "" },
        ...adminSiteChoices.map((s) => ({ label: s.name, value: s.guid })),
      ]
    : siteChoices.map((s) => ({
        label:
          s.guid === ownSite?.guid ? `${s.name} (My Site)` : `${s.name} (${s.site_code})`,
        value: s.guid,
      }));

  const selectedModelLabel =
    siteModelOptions.find((o) => o.value === siteModelGuid)?.label ?? "";
  const isSubSite = isSubSiteName(selectedModelLabel);

  const handleSiteModelChange = (value: string) => {
    setSiteModelGuid(value);
    const label = siteModelOptions.find((o) => o.value === value)?.label ?? "";
    // Switching away from Sub Site clears any parent that was chosen
    if (!isSubSiteName(label)) setParentGuid("");
  };

  // ---------- data loading ----------
  // Takes the search term and passes it through to the API, so search
  // runs server-side across all sites rather than filtering one loaded page.
  const fetchList = async (pageNum: number, searchTerm: string) => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await siteService.list(
        pageNum,
        PAGE_SIZE,
        searchTerm,
        selectedSite ? { site_guid: selectedSite.guid, site_name: selectedSite.name } : undefined
      );
      if (response.success && response.data) {
        setRecords(response.data.results);
        setTotalPages(response.data.pagination?.total_pages ?? 1);
        setTotalRecords(response.data.pagination?.total_records ?? response.data.results.length);
      } else {
        setLoadError(response.message || "Could not load sites.");
      }
    } catch (error: any) {
      setLoadError(extractError(error, "Could not load sites. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  // Page changes (including the page-reset that search triggers below)
  // re-fetch with whatever search term is currently set.
  useEffect(() => {
    fetchList(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Debounce the search box, then reset to page 1 and re-fetch.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1); // triggers the effect above, which re-fetches with `search`
      } else {
        fetchList(1, search);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, siteFilter]);

  // Loads every Site Model / Site Type / Category (no pagination) for the dropdowns.
  useEffect(() => {
    const loadOptions = async () => {
      setIsLoadingOptions(true);
      setOptionsError("");
      try {
        const [modelRes, typeRes, categoryRes] = await Promise.all([
          siteModelService.listAll(),
          siteTypeService.listAll(),
          categoryService.listAll(),
        ]);

        if (modelRes.success && modelRes.data) {
          setSiteModelOptions(
            modelRes.data.results.map((r) => ({ label: r.site_model, value: r.guid }))
          );
        }
        if (typeRes.success && typeRes.data) {
          setSiteTypeOptions(
            typeRes.data.results.map((r) => ({ label: r.site_type, value: r.guid }))
          );
        }
        if (categoryRes.success && categoryRes.data) {
          setCategoryOptions(
            categoryRes.data.results.map((r) => ({ label: r.category_name, value: r.guid }))
          );
        }

        if (!modelRes.success || !typeRes.success || !categoryRes.success) {
          setOptionsError("Some dropdown options could not be loaded.");
        }
      } catch (error: any) {
        setOptionsError(
          extractError(error, "Could not load Site Model / Site Type / Category options.")
        );
      } finally {
        setIsLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // Loads the "Parent Site" dropdown. Pass the guid being edited (if
  // any) so a site can't be offered as its own parent.
  const loadParentOptions = async (excludeGuid?: string) => {
    setIsLoadingParentOptions(true);
    try {
      const response = await siteService.listParents(excludeGuid);
      if (response.success && response.data) {
        setParentSiteOptions(
          response.data.results.map((r) => ({ label: r.site_name, value: r.guid }))
        );
      }
    } catch (error: any) {
      // Non-fatal: parent is optional, so just leave the dropdown empty.
      setParentSiteOptions([]);
    } finally {
      setIsLoadingParentOptions(false);
    }
  };

  // ---------- modal helpers ----------
  const resetForm = () => {
    setEditingGuid(null);
    setSiteCode("");
    setSiteName("");
    setSiteModelGuid("");
    setSiteTypeGuid("");
    setCategoryGuid("");
    setParentGuid("");
    setContact("");
    setAddress("");
    setImageFile(null);
    setExistingImage(null);
    setPreviewUrl(null);
    setFileInputKey((k) => k + 1);
    setFormError("");
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
    loadParentOptions(); // no exclusion needed for a brand-new site
  };

  const openEditModal = (row: SiteRecord) => {
    resetForm();
    setEditingGuid(row.guid);
    setSiteCode(row.site_code);
    setSiteName(row.site_name);
    setSiteModelGuid(row.site_model.guid);
    setSiteTypeGuid(row.site_type.guid);
    setCategoryGuid(row.category.guid);
    setParentGuid(row.parent?.guid ?? "");
    setContact(row.contact);
    setAddress(row.address);
    setExistingImage(row.site_image);
    setModalOpen(true);
    loadParentOptions(row.guid); // exclude itself from its own parent list
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormError("");

    if (!file) {
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setFormError("Please choose an image file.");
      setImageFile(null);
      setPreviewUrl(null);
      setFileInputKey((k) => k + 1);
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setFormError(`Image must be ${MAX_IMAGE_MB} MB or smaller.`);
      setImageFile(null);
      setPreviewUrl(null);
      setFileInputKey((k) => k + 1);
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const validate = (): string => {
    if (!siteCode.trim()) return "Site Code is required";
    if (!siteName.trim()) return "Site Name is required";
    if (!siteModelGuid) return "Site Model is required";
    if (!siteTypeGuid) return "Site Type is required";
    if (!categoryGuid) return "Category is required";
    // Parent Site is intentionally optional — a site with no parent
    // is a top-level site, so it is not validated here.
    if (!contact.trim()) return "Contact is required";
    if (!editingGuid && !imageFile) return "Site Image is required";
    if (!address.trim()) return "Address is required";
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
        site_code: siteCode.trim(),
        site_name: siteName.trim(),
        site_model: siteModelGuid,
        site_type: siteTypeGuid,
        category: categoryGuid,
        parent: isSubSite ? parentGuid || null : null,
        contact: contact.trim(),
        address: address.trim(),
        site_image: imageFile,
      };
      const response = editingGuid
        ? await siteService.update(editingGuid, payload)
        : await siteService.create(payload);

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

  const handleDelete = async (row: SiteRecord) => {
    if (!window.confirm(`Delete site "${row.site_name}" (${row.site_code})?`)) return;

    setDeletingGuid(row.guid);
    try {
      const response = await siteService.delete(row.guid);
      if (response.success) {
        if (records.length === 1 && page > 1) {
          setPage((p) => p - 1);
        } else {
          await fetchList(page, search);
        }
      } else {
        alert(response.message || "Could not delete this site.");
      }
    } catch (error: any) {
      alert(extractError(error, "Could not delete this site."));
    } finally {
      setDeletingGuid(null);
    }
  };

  const canManageRow = (row: SiteRecord) => isSuperAdmin || row.guid === ownSite?.guid;

  // ---------- table columns ----------
  const columns: TableColumn<SiteRecord>[] = [
    { key: "site_code", header: "Site Code" },
    { key: "site_name", header: "Site Name" },
    { key: "site_model", header: "Site Model", render: (row) => row.site_model.name },
    { key: "site_type", header: "Site Type", render: (row) => row.site_type.name },
    { key: "category", header: "Category", render: (row) => row.category.name },
    {
      // Shows which parent site this is a subsite of (if any)
      key: "parent",
      header: "Parent Site",
      render: (row) =>
        row.parent ? row.parent.name : <span className="text-slate-400">—</span>,
    },
    { key: "contact", header: "Contact" },
    {
      key: "site_image",
      header: "Image",
      render: (row) =>
        row.site_image ? (
          <img
            src={`${API_BASE_URL}${row.site_image}`}
            alt={row.site_name}
            className="h-10 w-14 rounded-md object-cover border border-slate-200"
          />
        ) : (
          <span className="text-slate-400">—</span>
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

  const visibleColumns = isReadOnly ? columns.filter((c) => c.key !== "__actions") : columns;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div>
      <PageHeader
        title="Site Creation"
        description="Create and manage physical sites/properties."
        actions={
          isReadOnly ? null : (
            <Button icon={<Plus size={16} />} onClick={openAddModal}>
              Add Site
            </Button>
          )
        }
      />

      {optionsError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
          <AlertCircle size={16} />
          {optionsError}
        </div>
      )}

      <Card noPadding>
        <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-center gap-3">
          <div className="max-w-xs">
            <Input
              placeholder="Search by site name..."
              icon={<Search size={15} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {filterOptions.length > 0 && (
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
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
              <p className="text-sm">Loading sites...</p>
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
        title={editingGuid ? "Edit Site" : "Add Site"}
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
            label="Site Code"
            placeholder="Enter site code"
            required
            value={siteCode}
            onChange={(e) => setSiteCode(e.target.value)}
            disabled={isSubmitting}
          />
          <Input
            label="Site Name"
            placeholder="Enter site name"
            required
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            disabled={isSubmitting}
          />

          <SelectField
            label="Site Model"
            value={siteModelGuid}
            onChange={handleSiteModelChange}
            options={siteModelOptions}
            placeholder={isLoadingOptions ? "Loading..." : "Select Site Model"}
            disabled={isSubmitting || isLoadingOptions}
          />
          <SelectField
            label="Site Type"
            value={siteTypeGuid}
            onChange={setSiteTypeGuid}
            options={siteTypeOptions}
            placeholder={isLoadingOptions ? "Loading..." : "Select Site Type"}
            disabled={isSubmitting || isLoadingOptions}
          />
          <SelectField
            label="Category"
            value={categoryGuid}
            onChange={setCategoryGuid}
            options={categoryOptions}
            placeholder={isLoadingOptions ? "Loading..." : "Select Category"}
            disabled={isSubmitting || isLoadingOptions}
          />

          {isSubSite && (
            <SelectField
              label="Parent Site"
              value={parentGuid}
              onChange={setParentGuid}
              options={parentSiteOptions}
              placeholder={isLoadingParentOptions ? "Loading..." : "Select Parent Site"}
              disabled={isSubmitting || isLoadingParentOptions}
              required={false}
            />
          )}

          <Input
            label="Contact"
            placeholder="Enter contact"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            disabled={isSubmitting}
          />

          <div>
            <label className={labelClass}>
              Site Image {!editingGuid && <span className="text-red-500">*</span>}
            </label>
            {imageFile && previewUrl ? (
              <div className="mb-2 flex items-center gap-3">
                <img
                  src={previewUrl}
                  alt="Selected"
                  className="h-14 w-20 rounded-md object-cover border border-slate-200"
                />
                <p className="text-xs text-slate-500">New image selected: {imageFile.name}</p>
              </div>
            ) : (
              editingGuid &&
              existingImage && (
                <div className="mb-2 flex items-center gap-3">
                  <img
                    src={`${API_BASE_URL}${existingImage}`}
                    alt="Current site"
                    className="h-14 w-20 rounded-md object-cover border border-slate-200"
                  />
                  <p className="text-xs text-slate-500">
                    Current image. Choose a new file only if you want to replace it.
                  </p>
                </div>
              )
            )}
            <input
              key={fileInputKey}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100 disabled:opacity-60"
            />
            <p className="mt-1 text-xs text-slate-400">Image files only, up to {MAX_IMAGE_MB} MB.</p>
          </div>

          <div>
            <label className={labelClass}>
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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

export default SiteCreation;