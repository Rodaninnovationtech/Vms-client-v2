// // // import { useRef, useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { ArrowLeft, Download, UploadCloud, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
// // // import { Card, PageHeader, Button, Badge } from "@/components/ui";
// // // import { downloadKeyTemplate, downloadPassTemplate } from "@/utils/excelTemplates";

// // // type BulkUploadType = "key" | "pass";

// // // interface BulkUploadProps {
// // //   type: BulkUploadType;
// // // }

// // // const config: Record<
// // //   BulkUploadType,
// // //   {
// // //     title: string;
// // //     backPath: string;
// // //     backLabel: string;
// // //     headers: string[];
// // //     download: () => Promise<void>;
// // //   }
// // // > = {
// // //   key: {
// // //     title: "Key",
// // //     backPath: "/property-management/key",
// // //     backLabel: "Back to Key",
// // //     headers: ["S.No", "Key No", "Key Name"],
// // //     download: downloadKeyTemplate,
// // //   },
// // //   pass: {
// // //     title: "Pass",
// // //     backPath: "/property-management/pass",
// // //     backLabel: "Back to Pass",
// // //     headers: ["S.No", "Pass No", "Pass Type", "Visitor Type"],
// // //     download: downloadPassTemplate,
// // //   },
// // // };

// // // const BulkUpload = ({ type }: BulkUploadProps) => {
// // //   const navigate = useNavigate();
// // //   const fileInputRef = useRef<HTMLInputElement>(null);
// // //   const cfg = config[type];

// // //   const [fileName, setFileName] = useState<string | null>(null);
// // //   const [rows, setRows] = useState<string[][]>([]);
// // //   const [error, setError] = useState("");
// // //   const [uploaded, setUploaded] = useState(false);

// // //   const handleFileSelect = async (file: File) => {
// // //     setError("");
// // //     setUploaded(false);

// // //     if (!file.name.match(/\.xlsx?$/i)) {
// // //       setError("Please upload a valid Excel file (.xlsx or .xls)");
// // //       return;
// // //     }

// // //     try {
// // //       const { default: ExcelJS } = await import("exceljs");
// // //       const buffer = await file.arrayBuffer();
// // //       const workbook = new ExcelJS.Workbook();
// // //       await workbook.xlsx.load(buffer);
// // //       const sheet = workbook.worksheets[0];

// // //       const parsedRows: string[][] = [];
// // //       sheet.eachRow((row, rowNumber) => {
// // //         if (rowNumber === 1) return; // skip header row
// // //         const values = (row.values as any[]).slice(1).map((v) => (v == null ? "" : String(v)));
// // //         if (values.some((v) => v !== "")) parsedRows.push(values);
// // //       });

// // //       setFileName(file.name);
// // //       setRows(parsedRows);
// // //     } catch {
// // //       setError("Could not read this file. Please make sure it matches the template format.");
// // //     }
// // //   };

// // //   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
// // //     e.preventDefault();
// // //     const file = e.dataTransfer.files?.[0];
// // //     if (file) handleFileSelect(file);
// // //   };

// // //   const handleSubmit = () => {
// // //     // Wire this up to your bulk-upload API endpoint when it's ready —
// // //     // e.g. POST the parsed `rows` (or the raw file) to the backend.
// // //     setUploaded(true);
// // //   };

// // //   const reset = () => {
// // //     setFileName(null);
// // //     setRows([]);
// // //     setError("");
// // //     setUploaded(false);
// // //     if (fileInputRef.current) fileInputRef.current.value = "";
// // //   };

// // //   return (
// // //     <div>
// // //       <button
// // //         onClick={() => navigate(cfg.backPath)}
// // //         className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 mb-3"
// // //       >
// // //         <ArrowLeft size={15} />
// // //         {cfg.backLabel}
// // //       </button>

// // //       <PageHeader
// // //         title={`Bulk Upload — ${cfg.title}`}
// // //         description={`Upload multiple ${cfg.title.toLowerCase()} records at once using the Excel template.`}
// // //       />

// // //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// // //         <Card title="Step 1 — Download Template" className="lg:col-span-1 h-fit">
// // //           <p className="text-sm text-slate-500 mb-4">
// // //             Download the Excel template, fill in your {cfg.title.toLowerCase()} details and
// // //             re-upload it. Columns: {cfg.headers.join(", ")}.
// // //           </p>
// // //           <Button
// // //             variant="outline"
// // //             icon={<Download size={16} />}
// // //             fullWidth
// // //             onClick={() => cfg.download()}
// // //           >
// // //             Download {cfg.title} Template
// // //           </Button>
// // //         </Card>

// // //         <Card title="Step 2 — Upload File" className="lg:col-span-2">
// // //           {!fileName ? (
// // //             <div
// // //               onDragOver={(e) => e.preventDefault()}
// // //               onDrop={handleDrop}
// // //               onClick={() => fileInputRef.current?.click()}
// // //               className="border-2 border-dashed border-primary-200 rounded-xl py-12 px-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary-50/40 transition-colors"
// // //             >
// // //               <UploadCloud size={32} className="text-primary-400 mb-3" />
// // //               <p className="text-sm font-medium text-slate-700">
// // //                 Click to browse or drag & drop your file here
// // //               </p>
// // //               <p className="text-xs text-slate-400 mt-1">Supports .xlsx and .xls files</p>
// // //               <input
// // //                 ref={fileInputRef}
// // //                 type="file"
// // //                 accept=".xlsx,.xls"
// // //                 className="hidden"
// // //                 onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
// // //               />
// // //             </div>
// // //           ) : (
// // //             <div>
// // //               <div className="flex items-center justify-between bg-primary-50/60 rounded-lg px-4 py-3 mb-4">
// // //                 <div className="flex items-center gap-3">
// // //                   <FileSpreadsheet size={20} className="text-primary-700" />
// // //                   <div>
// // //                     <p className="text-sm font-medium text-slate-800">{fileName}</p>
// // //                     <p className="text-xs text-slate-500">{rows.length} rows detected</p>
// // //                   </div>
// // //                 </div>
// // //                 <button onClick={reset} className="text-slate-400 hover:text-red-600">
// // //                   <X size={18} />
// // //                 </button>
// // //               </div>

// // //               {rows.length > 0 && (
// // //                 <div className="overflow-x-auto rounded-lg border border-primary-50 mb-4 max-h-64 overflow-y-auto">
// // //                   <table className="w-full text-sm text-left border-collapse min-w-[420px]">
// // //                     <thead className="sticky top-0 bg-primary-50/90">
// // //                       <tr>
// // //                         {cfg.headers.map((h) => (
// // //                           <th key={h} className="px-3 py-2 text-xs font-semibold text-primary-800 uppercase">
// // //                             {h}
// // //                           </th>
// // //                         ))}
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {rows.slice(0, 50).map((r, i) => (
// // //                         <tr key={i} className="border-t border-slate-100">
// // //                           {cfg.headers.map((_, ci) => (
// // //                             <td key={ci} className="px-3 py-2 text-slate-700 whitespace-nowrap">
// // //                               {r[ci] || "-"}
// // //                             </td>
// // //                           ))}
// // //                         </tr>
// // //                       ))}
// // //                     </tbody>
// // //                   </table>
// // //                 </div>
// // //               )}

// // //               {uploaded ? (
// // //                 <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3.5 py-2.5 text-sm">
// // //                   <CheckCircle2 size={16} />
// // //                   {rows.length} {cfg.title.toLowerCase()} records uploaded successfully.
// // //                 </div>
// // //               ) : (
// // //                 <div className="flex items-center gap-2">
// // //                   <Button onClick={handleSubmit} disabled={rows.length === 0}>
// // //                     Upload {rows.length > 0 ? `${rows.length} Records` : ""}
// // //                   </Button>
// // //                   <Button variant="outline" onClick={reset}>
// // //                     Cancel
// // //                   </Button>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           )}

// // //           {error && (
// // //             <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mt-3">
// // //               {error}
// // //             </p>
// // //           )}
// // //         </Card>
// // //       </div>

// // //       <div className="mt-4">
// // //         <Badge variant="info">
// // //           Tip: keep column headers exactly as in the template so the upload parses correctly.
// // //         </Badge>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default BulkUpload;




// // import { useEffect, useMemo, useRef, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { ArrowLeft, Download, UploadCloud, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
// // import { Card, PageHeader, Button, Badge } from "@/components/ui";
// // import { downloadKeyTemplate, downloadPassTemplate } from "@/utils/excelTemplates";
// // import { userService } from "@/service/usercreationservices";
// // import type { SiteDropdownItem } from "@/service/usercreationservices";
// // import { userStorage } from "@/utils/storage";
// // import { keyService } from "@/service/keycreationservices";
// // import type { KeyStatus } from "@/service/keycreationservices";

// // type BulkUploadType = "key" | "pass";

// // interface BulkUploadProps {
// //   type: BulkUploadType;
// // }

// // interface SubsiteItem {
// //   id?: number;
// //   guid: string;
// //   site_code?: string;
// //   name: string;
// // }

// // interface StoredUser {
// //   is_super_admin?: boolean;
// //   site_detail?: SubsiteItem | null;
// // }

// // const config: Record<
// //   BulkUploadType,
// //   {
// //     title: string;
// //     backPath: string;
// //     backLabel: string;
// //     headers: string[];
// //     download: () => Promise<void>;
// //   }
// // > = {
// //   key: {
// //     title: "Key",
// //     backPath: "/property-management/key",
// //     backLabel: "Back to Key",
// //     headers: ["S.No", "Key No", "Key Name"],
// //     download: downloadKeyTemplate,
// //   },
// //   pass: {
// //     title: "Pass",
// //     backPath: "/property-management/pass",
// //     backLabel: "Back to Pass",
// //     headers: ["S.No", "Pass No", "Pass Type", "Visitor Type"],
// //     download: downloadPassTemplate,
// //   },
// // };

// // const fieldClass =
// //   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// // const BulkUpload = ({ type }: BulkUploadProps) => {
// //   const navigate = useNavigate();
// //   const fileInputRef = useRef<HTMLInputElement>(null);
// //   const cfg = config[type];

// //   // ----- logged-in user / site scope (same pattern as KeyCreation) -----
// //   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
// //   const isSuperAdmin = storedUser?.is_super_admin === true;
// //   const ownSite = storedUser?.site_detail ?? null;

// //   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
// //   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
// //   const [showErrorModal, setShowErrorModal] = useState(false);
// //   const errorCount = Object.keys(rowErrors).length;

// //   useEffect(() => {
// //     if (!isSuperAdmin) return; // non-admins are scoped to their own site, no API call needed
// //     let cancelled = false;

// //     (async () => {
// //       setIsLoadingSites(true);
// //       try {
// //         const res = await userService.siteDropdown();
// //         if (!cancelled && res.success && res.data) {
// //           setAllSites(res.data.results ?? []);
// //         }
// //       } finally {
// //         if (!cancelled) setIsLoadingSites(false);
// //       }
// //     })();

// //     return () => {
// //       cancelled = true;
// //     };
// //   }, [isSuperAdmin]);

// //   // Sites offered for bulk-upload: all sites for admins, only their own
// //   // site for everyone else — same rule as the Issue/Edit Key modal.
// //   const siteOptions = useMemo(
// //     () =>
// //       isSuperAdmin
// //         ? allSites.map((s) => ({
// //             label: `${s.site_name} (${s.site_model.name})`,
// //             value: s.guid,
// //           }))
// //         : ownSite
// //         ? [{ label: `${ownSite.name} (My Site)`, value: ownSite.guid }]
// //         : [],
// //     [isSuperAdmin, allSites, ownSite]
// //   );

// //   const [siteGuid, setSiteGuid] = useState<string>("");

// //   // Non-admins only ever have one choice — preselect it automatically.
// //   useEffect(() => {
// //     if (!isSuperAdmin && ownSite?.guid) setSiteGuid(ownSite.guid);
// //   }, [isSuperAdmin, ownSite]);

// //   // ----- file upload state -----
// //   const [fileName, setFileName] = useState<string | null>(null);
// //   const [rows, setRows] = useState<string[][]>([]);
// //   const [error, setError] = useState("");
// //   const [uploaded, setUploaded] = useState(false);

// //   const handleFileSelect = async (file: File) => {
// //     setError("");
// //     setUploaded(false);

// //     if (!file.name.match(/\.xlsx?$/i)) {
// //       setError("Please upload a valid Excel file (.xlsx or .xls)");
// //       return;
// //     }

// //     // try {
// //     //   const { default: ExcelJS } = await import("exceljs");
// //     //   const buffer = await file.arrayBuffer();
// //     //   const workbook = new ExcelJS.Workbook();
// //     //   await workbook.xlsx.load(buffer);
// //     //   const sheet = workbook.worksheets[0];

// //     //   const parsedRows: string[][] = [];
// //     //   sheet.eachRow((row, rowNumber) => {
// //     //     if (rowNumber === 1) return; // skip header row
// //     //     const values = (row.values as any[]).slice(1).map((v) => (v == null ? "" : String(v)));
// //     //     if (values.some((v) => v !== "")) parsedRows.push(values);
// //     //   });

// //     //   setFileName(file.name);
// //     //   setRows(parsedRows);
// //     // } catch {
// //     //   setError("Could not read this file. Please make sure it matches the template format.");
// //     // }
// //         try {
// //       const { default: ExcelJS } = await import("exceljs");
// //       const buffer = await file.arrayBuffer();
// //       const workbook = new ExcelJS.Workbook();
// //       await workbook.xlsx.load(buffer);
// //       const sheet = workbook.worksheets[0];

// //       const parsedRows: string[][] = [];
// //       let headerRow: string[] = [];

// //       sheet.eachRow((row, rowNumber) => {
// //         const values = (row.values as any[]).slice(1).map((v) => (v == null ? "" : String(v).trim()));
// //         if (rowNumber === 1) {
// //           headerRow = values;
// //           return;
// //         }
// //         // if (values.some((v) => v !== "")) parsedRows.push(values);
// //         if (values.slice(1).some((v) => v !== "")) parsedRows.push(values);
// //       });

// //       const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
// //       const expected = cfg.headers.map(normalize);
// //       const actual = headerRow.map(normalize);
// //       const headersMatch =
// //         expected.length === actual.length && expected.every((h, i) => h === actual[i]);

// //       if (!headersMatch) {
// //         setError(
// //           `This file doesn't match the ${cfg.title} template. Please use the "Download ${cfg.title} Template" button above.`
// //         );
// //         return;
// //       }

// //       setFileName(file.name);
// //       setRows(parsedRows);
// //     } catch {
// //       setError("Could not read this file. Please make sure it matches the template format.");
// //     }
// //   };

// //   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
// //     e.preventDefault();
// //     const file = e.dataTransfer.files?.[0];
// //     if (file) handleFileSelect(file);
// //   };

// //   // const handleSubmit = () => {
// //   //   if (!siteGuid) {
// //   //     setError("Please select a site before uploading.");
// //   //     return;
// //   //   }
// //   //   // Wire this up to your bulk-upload API endpoint when it's ready —
// //   //   // e.g. POST the parsed `rows` (or the raw file) plus `siteGuid` to the backend.
// //   //   setUploaded(true);
// //   // };

// //   // NEW
// // const flattenErrors = (errors?: unknown): string => {
// //   if (!errors) return "";
// //   if (Array.isArray(errors)) {
// //     return errors
// //       .map((e, i) => (e && Object.keys(e).length ? `Row ${i + 1}: ${flattenErrors(e)}` : ""))
// //       .filter(Boolean)
// //       .join(" ");
// //   }
// //   return Object.values(errors as Record<string, string[] | string>)
// //     .map((v) => (Array.isArray(v) ? v.join(" ") : String(v)))
// //     .join(" ");
// // };

// // // const handleSubmit = async () => {
// // //   setError("");

// // //   if (!siteGuid) {
// // //     setError("Please select a site before uploading.");
// // //     return;
// // //   }

// // //   // Pass upload has no API yet, so keep the old behaviour for it
// // //   if (type !== "key") {
// // //     setUploaded(true);
// // //     return;
// // //   }

// // //   // columns: [S.No, Key No, Key Name]
// // //   const payload = rows.map((r) => ({
// // //     key_no: (r[1] || "").trim(),
// // //     key_name: (r[2] || "").trim(),
// // //     site: siteGuid,
// // //     status: "Available" as KeyStatus,
// // //   }));

// // //   // validate before calling the API
// // //   const seen = new Set<string>();
// // //   for (let i = 0; i < payload.length; i++) {
// // //     const p = payload[i];
// // //     if (!p.key_no) return setError(`Row ${i + 1}: Key No is required`);
// // //     if (!p.key_name) return setError(`Row ${i + 1}: Key Name is required`);
// // //     if (p.key_no.length > 50) return setError(`Row ${i + 1}: Key No must be 50 characters or fewer`);
// // //     if (p.key_name.length > 150) return setError(`Row ${i + 1}: Key Name must be 150 characters or fewer`);

// // //     const k = p.key_no.toLowerCase();
// // //     if (seen.has(k)) return setError(`Row ${i + 1}: Key No "${p.key_no}" is repeated in the file`);
// // //     seen.add(k);
// // //   }

// // //   setIsSubmitting(true);
// // //   try {
// // //     const res = await keyService.create(payload); // sends the array
// // //     if (!res.success) {
// // //       setError(flattenErrors(res.errors) || res.message);
// // //       return;
// // //     }
// // //     setUploaded(true);
// // //   } finally {
// // //     setIsSubmitting(false);
// // //   }
// // // };

// // // NEW
// // const submitRows = async (rowsToSend: string[][]) => {
// //   setError("");
// //   setRowErrors({});

// //   if (!siteGuid) {
// //     setError("Please select a site before uploading.");
// //     return;
// //   }

// //   if (type !== "key") {
// //     setUploaded(true);
// //     return;
// //   }

// //   if (rowsToSend.length === 0) {
// //     setError("No rows left to upload.");
// //     return;
// //   }

// //   // columns: [S.No, Key No, Key Name]
// //   const payload = rowsToSend.map((r) => ({
// //     key_no: (r[1] || "").trim(),
// //     key_name: (r[2] || "").trim(),
// //     site: siteGuid,
// //     status: "Available" as KeyStatus,
// //   }));

// //   // local validation (required / length) before calling the API
// //   for (let i = 0; i < payload.length; i++) {
// //     const p = payload[i];
// //     if (!p.key_no) return setError(`Row ${i + 1}: Key No is required`);
// //     if (!p.key_name) return setError(`Row ${i + 1}: Key Name is required`);
// //     if (p.key_no.length > 50) return setError(`Row ${i + 1}: Key No must be 50 characters or fewer`);
// //     if (p.key_name.length > 150) return setError(`Row ${i + 1}: Key Name must be 150 characters or fewer`);
// //   }

// //   setIsSubmitting(true);
// //   try {
// //     const res = await keyService.create(payload);

// //     if (!res.success) {
// //       const list = res.errors as unknown;

// //       // per-row errors from the backend: [{row, key_no, message}]
// //       if (
// //         Array.isArray(list) &&
// //         list.length > 0 &&
// //         list.every((e) => e && typeof e.row === "number")
// //       ) {
// //         const map: Record<number, string> = {};
// //         list.forEach((e: { row: number; message: string }) => {
// //           map[e.row - 1] = e.message; // row is 1-based, index is 0-based
// //         });
// //         setRowErrors(map);
// //         setShowErrorModal(true);
// //         return;
// //       }

// //       setError(flattenErrors(res.errors) || res.message);
// //       return;
// //     }

// //     setUploaded(true);
// //   } finally {
// //     setIsSubmitting(false);
// //   }
// // };

// // const handleSubmit = () => submitRows(rows);

// // // popup button: drop the error rows, then upload the rest
// // const handleRemoveErrorsAndUpload = async () => {
// //   const cleanRows = rows.filter((_, i) => !(i in rowErrors));
// //   setShowErrorModal(false);
// //   setRows(cleanRows);
// //   await submitRows(cleanRows);
// // };


// //   const reset = () => {
// //     setFileName(null);
// //     setRows([]);
// //     setError("");
// //     setRowErrors({});
// //     setShowErrorModal(false);
// //     setUploaded(false);
// //     if (fileInputRef.current) fileInputRef.current.value = "";
// //   };

// //   const dropzoneDisabled = !siteGuid;

// //   return (
// //     <div>
// //       <button
// //         onClick={() => navigate(cfg.backPath)}
// //         className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 mb-3"
// //       >
// //         <ArrowLeft size={15} />
// //         {cfg.backLabel}
// //       </button>

// //       <PageHeader
// //         title={`Bulk Upload — ${cfg.title}`}
// //         description={`Upload multiple ${cfg.title.toLowerCase()} records at once using the Excel template.`}
// //       />

// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //         <Card title="Step 1 — Download Template" className="lg:col-span-1 h-fit">
// //           <p className="text-sm text-slate-500 mb-4">
// //             Download the Excel template, fill in your {cfg.title.toLowerCase()} details and
// //             re-upload it. Columns: {cfg.headers.join(", ")}.
// //           </p>
// //           <Button
// //             variant="outline"
// //             icon={<Download size={16} />}
// //             fullWidth
// //             onClick={() => cfg.download()}
// //           >
// //             Download {cfg.title} Template
// //           </Button>
// //         </Card>

// //         <Card title="Step 2 — Upload File" className="lg:col-span-2">
// //           {/* NEW: site selector, scoped the same way as Issue Key's Site field */}
// //           <div className="mb-4">
// //             <label className="block text-sm font-medium text-slate-700 mb-1.5">
// //               Site <span className="text-red-500">*</span>
// //             </label>
// //             <select
// //               value={siteGuid}
// //               onChange={(e) => setSiteGuid(e.target.value)}
// //               disabled={isLoadingSites || (!isSuperAdmin && siteOptions.length <= 1)}
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

// //           {!fileName ? (
// //             <div
// //               onDragOver={(e) => !dropzoneDisabled && e.preventDefault()}
// //               onDrop={(e) => {
// //                 if (dropzoneDisabled) {
// //                   e.preventDefault();
// //                   setError("Please select a site first.");
// //                   return;
// //                 }
// //                 handleDrop(e);
// //               }}
// //               onClick={() => {
// //                 if (dropzoneDisabled) {
// //                   setError("Please select a site first.");
// //                   return;
// //                 }
// //                 fileInputRef.current?.click();
// //               }}
// //               className={`border-2 border-dashed rounded-xl py-12 px-6 flex flex-col items-center justify-center text-center transition-colors ${
// //                 dropzoneDisabled
// //                   ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
// //                   : "border-primary-200 cursor-pointer hover:bg-primary-50/40"
// //               }`}
// //             >
// //               <UploadCloud size={32} className="text-primary-400 mb-3" />
// //               <p className="text-sm font-medium text-slate-700">
// //                 Click to browse or drag & drop your file here
// //               </p>
// //               <p className="text-xs text-slate-400 mt-1">Supports .xlsx and .xls files</p>
// //               <input
// //                 ref={fileInputRef}
// //                 type="file"
// //                 accept=".xlsx,.xls"
// //                 className="hidden"
// //                 disabled={dropzoneDisabled}
// //                 onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
// //               />
// //             </div>
// //           ) : (
// //             <div>
// //               <div className="flex items-center justify-between bg-primary-50/60 rounded-lg px-4 py-3 mb-4">
// //                 <div className="flex items-center gap-3">
// //                   <FileSpreadsheet size={20} className="text-primary-700" />
// //                   <div>
// //                     <p className="text-sm font-medium text-slate-800">{fileName}</p>
// //                     <p className="text-xs text-slate-500">{rows.length} rows detected</p>
// //                   </div>
// //                 </div>
// //                 <button onClick={reset} className="text-slate-400 hover:text-red-600">
// //                   <X size={18} />
// //                 </button>
// //               </div>

// //               {rows.length > 0 && (
// //                 <div className="overflow-x-auto rounded-lg border border-primary-50 mb-4 max-h-64 overflow-y-auto">
// //                   <table className="w-full text-sm text-left border-collapse min-w-[420px]">
// //                     {/* <thead className="sticky top-0 bg-primary-50/90">
// //                       <tr>
// //                         {cfg.headers.map((h) => (
// //                           <th key={h} className="px-3 py-2 text-xs font-semibold text-primary-800 uppercase">
// //                             {h}
// //                           </th>
// //                         ))}
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {rows.slice(0, 50).map((r, i) => (
// //                         <tr key={i} className="border-t border-slate-100">
// //                           {cfg.headers.map((_, ci) => (
// //                             <td key={ci} className="px-3 py-2 text-slate-700 whitespace-nowrap">
// //                               {r[ci] || "-"}
// //                             </td>
// //                           ))}
// //                         </tr>
// //                       ))}
// //                     </tbody> */}
// // <thead className="sticky top-0 bg-primary-50/90">
// //   <tr>
// //     {cfg.headers.map((h) => (
// //       <th key={h} className="px-3 py-2 text-xs font-semibold text-primary-800 uppercase">
// //         {h}
// //       </th>
// //     ))}
// //     {errorCount > 0 && (
// //       <th className="px-3 py-2 text-xs font-semibold text-red-700 uppercase">Error</th>
// //     )}
// //   </tr>
// // </thead>
// // <tbody>
// //   {rows.map((r, i) => (
// //     <tr
// //       key={i}
// //       className={`border-t border-slate-100 ${i in rowErrors ? "bg-red-50" : ""}`}
// //     >
// //       {cfg.headers.map((_, ci) => (
// //         <td key={ci} className="px-3 py-2 text-slate-700 whitespace-nowrap">
// //           {r[ci] || "-"}
// //         </td>
// //       ))}
// //       {errorCount > 0 && (
// //         <td className="px-3 py-2 text-red-600 whitespace-nowrap">{rowErrors[i] || ""}</td>
// //       )}
// //     </tr>
// //   ))}
// // </tbody>
// //                   </table>
// //                 </div>
// //               )}

// //               {uploaded ? (
// //                 <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3.5 py-2.5 text-sm">
// //                   <CheckCircle2 size={16} />
// //                   {rows.length} {cfg.title.toLowerCase()} records uploaded successfully.
// //                 </div>
// //               ) : (
// //                 <div className="flex items-center gap-2">
// //                   {/* <Button onClick={handleSubmit} disabled={rows.length === 0 || !siteGuid}>
// //                     Upload {rows.length > 0 ? `${rows.length} Records` : ""}
// //                   </Button> */}

// //                   <Button onClick={handleSubmit} disabled={rows.length === 0 || !siteGuid || isSubmitting}>
// //   {isSubmitting ? "Uploading..." : `Upload ${rows.length > 0 ? `${rows.length} Records` : ""}`}
// // </Button>

// //                   <Button variant="outline" onClick={reset}>
// //                     Cancel
// //                   </Button>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {error && (
// //             <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mt-3">
// //               {error}
// //             </p>
// //           )}
// //         </Card>
// //       </div>

// //       <div className="mt-4">
// //         <Badge variant="info">
// //           Tip: keep column headers exactly as in the template so the upload parses correctly.
// //         </Badge>
// //       </div>
// //       {showErrorModal && (
// //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
// //     <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
// //       <h3 className="text-base font-semibold text-slate-800">
// //         {errorCount} row{errorCount > 1 ? "s" : ""} could not be uploaded
// //       </h3>
// //       <p className="mt-1 text-sm text-slate-500">
// //         Remove these rows and upload the remaining {rows.length - errorCount} record(s)?
// //       </p>

// //       <ul className="mt-3 max-h-48 overflow-y-auto space-y-1.5">
// //         {Object.entries(rowErrors).map(([idx, msg]) => (
// //           <li
// //             key={idx}
// //             className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
// //           >
// //             Row {Number(idx) + 1} (Key No {rows[Number(idx)]?.[1] || "-"}): {msg}
// //           </li>
// //         ))}
// //       </ul>

// //       <div className="mt-4 flex items-center justify-end gap-2">
// //         <Button variant="outline" onClick={() => setShowErrorModal(false)}>
// //           Close
// //         </Button>
// //         <Button onClick={handleRemoveErrorsAndUpload} disabled={rows.length - errorCount === 0}>
// //           Remove errors & upload again
// //         </Button>
// //       </div>
// //     </div>
// //   </div>
// // )}
// //     </div>
// //   );
// // };

// // export default BulkUpload;




// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Download, UploadCloud, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
// import { Card, PageHeader, Button, Badge } from "@/components/ui";
// import { downloadKeyTemplate, downloadPassTemplate } from "@/utils/excelTemplates";
// import { userService } from "@/service/usercreationservices";
// import type { SiteDropdownItem } from "@/service/usercreationservices";
// import { userStorage } from "@/utils/storage";
// import { keyService } from "@/service/keycreationservices";
// import type { KeyStatus } from "@/service/keycreationservices";
// import { passService } from "@/service/passcreationservices";
// import type { PassStatus } from "@/service/passcreationservices";
// import { visitorTypeService } from "@/service/visitortypeservice";
// import type { VisitorTypeRecord } from "@/service/visitortypeservice";

// type BulkUploadType = "key" | "pass";

// interface BulkUploadProps {
//   type: BulkUploadType;
// }

// interface SubsiteItem {
//   id?: number;
//   guid: string;
//   site_code?: string;
//   name: string;
// }

// interface StoredUser {
//   is_super_admin?: boolean;
//   site_detail?: SubsiteItem | null;
// }

// const config: Record<
//   BulkUploadType,
//   {
//     title: string;
//     backPath: string;
//     backLabel: string;
//     headers: string[];
//     download: () => Promise<void>;
//     noColumnLabel: string; // label used for the "No" column in the error modal
//   }
// > = {
//   key: {
//     title: "Key",
//     backPath: "/property-management/key",
//     backLabel: "Back to Key",
//     headers: ["S.No", "Key No", "Key Name"],
//     download: downloadKeyTemplate,
//     noColumnLabel: "Key No",
//   },
//   pass: {
//     title: "Pass",
//     backPath: "/property-management/pass",
//     backLabel: "Back to Pass",
//     headers: ["S.No", "Pass No", "Pass Name"],
//     download: downloadPassTemplate,
//     noColumnLabel: "Pass No",
//   },
// };

// const fieldClass =
//   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// const BulkUpload = ({ type }: BulkUploadProps) => {
//   const navigate = useNavigate();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const cfg = config[type];
//   const isPass = type === "pass";

//   // ----- logged-in user / site scope (same pattern as KeyCreation) -----
//   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
//   const isSuperAdmin = storedUser?.is_super_admin === true;
//   const ownSite = storedUser?.site_detail ?? null;

//   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
//   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const errorCount = Object.keys(rowErrors).length;

//   useEffect(() => {
//     if (!isSuperAdmin) return; // non-admins are scoped to their own site, no API call needed
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

//   // Sites offered for bulk-upload: all sites for admins, only their own
//   // site for everyone else — same rule as the Issue/Edit Key modal.
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

//   const [siteGuid, setSiteGuid] = useState<string>("");

//   // Non-admins only ever have one choice — preselect it automatically.
//   useEffect(() => {
//     if (!isSuperAdmin && ownSite?.guid) setSiteGuid(ownSite.guid);
//   }, [isSuperAdmin, ownSite]);

//   // ----- visitor type (Pass only) -----
//   // The Excel template only carries Pass No / Pass Name, so the visitor type
//   // applied to every uploaded row is picked once here, right after Site —
//   // same pattern as the single Site dropdown applying to the whole batch.
//   const [visitorTypes, setVisitorTypes] = useState<VisitorTypeRecord[]>([]);
//   const [isLoadingVisitorTypes, setIsLoadingVisitorTypes] = useState(isPass);
//   const [visitorTypeGuid, setVisitorTypeGuid] = useState<string>("");

//   useEffect(() => {
//     if (!isPass) return;
//     let cancelled = false;

//     (async () => {
//       setIsLoadingVisitorTypes(true);
//       try {
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
//   }, [isPass]);

//   const visitorTypeOptions = useMemo(
//     () => visitorTypes.map((v) => ({ label: v.name, value: v.guid })),
//     [visitorTypes]
//   );

//   // ----- file upload state -----
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [rows, setRows] = useState<string[][]>([]);
//   const [error, setError] = useState("");
//   const [uploaded, setUploaded] = useState(false);

//   const handleFileSelect = async (file: File) => {
//     setError("");
//     setUploaded(false);

//     if (!file.name.match(/\.xlsx?$/i)) {
//       setError("Please upload a valid Excel file (.xlsx or .xls)");
//       return;
//     }

//     try {
//       const { default: ExcelJS } = await import("exceljs");
//       const buffer = await file.arrayBuffer();
//       const workbook = new ExcelJS.Workbook();
//       await workbook.xlsx.load(buffer);
//       const sheet = workbook.worksheets[0];

//       const parsedRows: string[][] = [];
//       let headerRow: string[] = [];

//       sheet.eachRow((row, rowNumber) => {
//         const values = (row.values as any[]).slice(1).map((v) => (v == null ? "" : String(v).trim()));
//         if (rowNumber === 1) {
//           headerRow = values;
//           return;
//         }
//         if (values.slice(1).some((v) => v !== "")) parsedRows.push(values);
//       });

//       const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
//       const expected = cfg.headers.map(normalize);
//       const actual = headerRow.map(normalize);
//       const headersMatch =
//         expected.length === actual.length && expected.every((h, i) => h === actual[i]);

//       if (!headersMatch) {
//         setError(
//           `This file doesn't match the ${cfg.title} template. Please use the "Download ${cfg.title} Template" button above.`
//         );
//         return;
//       }

//       setFileName(file.name);
//       setRows(parsedRows);
//     } catch {
//       setError("Could not read this file. Please make sure it matches the template format.");
//     }
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0];
//     if (file) handleFileSelect(file);
//   };

//   const flattenErrors = (errors?: unknown): string => {
//     if (!errors) return "";
//     if (Array.isArray(errors)) {
//       return errors
//         .map((e, i) => (e && Object.keys(e).length ? `Row ${i + 1}: ${flattenErrors(e)}` : ""))
//         .filter(Boolean)
//         .join(" ");
//     }
//     return Object.values(errors as Record<string, string[] | string>)
//       .map((v) => (Array.isArray(v) ? v.join(" ") : String(v)))
//       .join(" ");
//   };

//   const submitRows = async (rowsToSend: string[][]) => {
//     setError("");
//     setRowErrors({});

//     if (!siteGuid) {
//       setError("Please select a site before uploading.");
//       return;
//     }

//     if (isPass && !visitorTypeGuid) {
//       setError("Please select a visitor type before uploading.");
//       return;
//     }

//     if (rowsToSend.length === 0) {
//       setError("No rows left to upload.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       if (type === "key") {
//         // columns: [S.No, Key No, Key Name]
//         const payload = rowsToSend.map((r) => ({
//           key_no: (r[1] || "").trim(),
//           key_name: (r[2] || "").trim(),
//           site: siteGuid,
//           status: "Available" as KeyStatus,
//         }));

//         for (let i = 0; i < payload.length; i++) {
//           const p = payload[i];
//           if (!p.key_no) return setError(`Row ${i + 1}: Key No is required`);
//           if (!p.key_name) return setError(`Row ${i + 1}: Key Name is required`);
//           if (p.key_no.length > 50) return setError(`Row ${i + 1}: Key No must be 50 characters or fewer`);
//           if (p.key_name.length > 150) return setError(`Row ${i + 1}: Key Name must be 150 characters or fewer`);
//         }

//         const res = await keyService.create(payload);

//         if (!res.success) {
//           const list = res.errors as unknown;
//           if (Array.isArray(list) && list.length > 0 && list.every((e) => e && typeof e.row === "number")) {
//             const map: Record<number, string> = {};
//             list.forEach((e: { row: number; message: string }) => {
//               map[e.row - 1] = e.message; // row is 1-based, index is 0-based
//             });
//             setRowErrors(map);
//             setShowErrorModal(true);
//             return;
//           }
//           setError(flattenErrors(res.errors) || res.message);
//           return;
//         }
//       } else {
//         // columns: [S.No, Pass No, Pass Name] — visitor type comes from the
//         // dropdown above and is applied to every row in this batch.
//         const payload = rowsToSend.map((r) => ({
//           pass_no: (r[1] || "").trim(),
//           pass_name: (r[2] || "").trim(),
//           site: siteGuid,
//           visitor_type: visitorTypeGuid,
//           status: "Active" as PassStatus,
//         }));

//         for (let i = 0; i < payload.length; i++) {
//           const p = payload[i];
//           if (!p.pass_no) return setError(`Row ${i + 1}: Pass No is required`);
//           if (!p.pass_name) return setError(`Row ${i + 1}: Pass Name is required`);
//           if (p.pass_no.length > 50) return setError(`Row ${i + 1}: Pass No must be 50 characters or fewer`);
//           if (p.pass_name.length > 150) return setError(`Row ${i + 1}: Pass Name must be 150 characters or fewer`);
//         }

//         const res = await passService.create(payload);

//         if (!res.success) {
//           const list = res.errors as unknown;
//           if (Array.isArray(list) && list.length > 0 && list.every((e) => e && typeof e.row === "number")) {
//             const map: Record<number, string> = {};
//             list.forEach((e: { row: number; message: string }) => {
//               map[e.row - 1] = e.message; // row is 1-based, index is 0-based
//             });
//             setRowErrors(map);
//             setShowErrorModal(true);
//             return;
//           }
//           setError(flattenErrors(res.errors) || res.message);
//           return;
//         }
//       }

//       setUploaded(true);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmit = () => submitRows(rows);

//   // popup button: drop the error rows, then upload the rest
//   const handleRemoveErrorsAndUpload = async () => {
//     const cleanRows = rows.filter((_, i) => !(i in rowErrors));
//     setShowErrorModal(false);
//     setRows(cleanRows);
//     await submitRows(cleanRows);
//   };

//   const reset = () => {
//     setFileName(null);
//     setRows([]);
//     setError("");
//     setRowErrors({});
//     setShowErrorModal(false);
//     setUploaded(false);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const dropzoneDisabled = !siteGuid || (isPass && !visitorTypeGuid);

//   return (
//     <div>
//       <button
//         onClick={() => navigate(cfg.backPath)}
//         className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 mb-3"
//       >
//         <ArrowLeft size={15} />
//         {cfg.backLabel}
//       </button>

//       <PageHeader
//         title={`Bulk Upload — ${cfg.title}`}
//         description={`Upload multiple ${cfg.title.toLowerCase()} records at once using the Excel template.`}
//       />

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <Card title="Step 1 — Download Template" className="lg:col-span-1 h-fit">
//           <p className="text-sm text-slate-500 mb-4">
//             Download the Excel template, fill in your {cfg.title.toLowerCase()} details and
//             re-upload it. Columns: {cfg.headers.join(", ")}.
//           </p>
//           <Button
//             variant="outline"
//             icon={<Download size={16} />}
//             fullWidth
//             onClick={() => cfg.download()}
//           >
//             Download {cfg.title} Template
//           </Button>
//         </Card>

//         <Card title="Step 2 — Upload File" className="lg:col-span-2">
//           {/* Site selector, scoped the same way as Issue Key's Site field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-slate-700 mb-1.5">
//               Site <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={siteGuid}
//               onChange={(e) => setSiteGuid(e.target.value)}
//               disabled={isLoadingSites || (!isSuperAdmin && siteOptions.length <= 1)}
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

//           {/* Visitor Type selector — Pass bulk upload only, applied to every row */}
//           {isPass && (
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-slate-700 mb-1.5">
//                 Visitor Type <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={visitorTypeGuid}
//                 onChange={(e) => setVisitorTypeGuid(e.target.value)}
//                 disabled={isLoadingVisitorTypes}
//                 className={fieldClass}
//               >
//                 <option value="">
//                   {isLoadingVisitorTypes ? "Loading visitor types..." : "Select visitor type"}
//                 </option>
//                 {visitorTypeOptions.map((o) => (
//                   <option key={o.value} value={o.value}>
//                     {o.label}
//                   </option>
//                 ))}
//               </select>
//               <p className="text-xs text-slate-400 mt-1">
//                 Applied to every pass in this upload.
//               </p>
//             </div>
//           )}

//           {!fileName ? (
//             <div
//               onDragOver={(e) => !dropzoneDisabled && e.preventDefault()}
//               onDrop={(e) => {
//                 if (dropzoneDisabled) {
//                   e.preventDefault();
//                   setError(
//                     isPass ? "Please select a site and visitor type first." : "Please select a site first."
//                   );
//                   return;
//                 }
//                 handleDrop(e);
//               }}
//               onClick={() => {
//                 if (dropzoneDisabled) {
//                   setError(
//                     isPass ? "Please select a site and visitor type first." : "Please select a site first."
//                   );
//                   return;
//                 }
//                 fileInputRef.current?.click();
//               }}
//               className={`border-2 border-dashed rounded-xl py-12 px-6 flex flex-col items-center justify-center text-center transition-colors ${
//                 dropzoneDisabled
//                   ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
//                   : "border-primary-200 cursor-pointer hover:bg-primary-50/40"
//               }`}
//             >
//               <UploadCloud size={32} className="text-primary-400 mb-3" />
//               <p className="text-sm font-medium text-slate-700">
//                 Click to browse or drag & drop your file here
//               </p>
//               <p className="text-xs text-slate-400 mt-1">Supports .xlsx and .xls files</p>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".xlsx,.xls"
//                 className="hidden"
//                 disabled={dropzoneDisabled}
//                 onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
//               />
//             </div>
//           ) : (
//             <div>
//               <div className="flex items-center justify-between bg-primary-50/60 rounded-lg px-4 py-3 mb-4">
//                 <div className="flex items-center gap-3">
//                   <FileSpreadsheet size={20} className="text-primary-700" />
//                   <div>
//                     <p className="text-sm font-medium text-slate-800">{fileName}</p>
//                     <p className="text-xs text-slate-500">{rows.length} rows detected</p>
//                   </div>
//                 </div>
//                 <button onClick={reset} className="text-slate-400 hover:text-red-600">
//                   <X size={18} />
//                 </button>
//               </div>

//               {rows.length > 0 && (
//                 <div className="overflow-x-auto rounded-lg border border-primary-50 mb-4 max-h-64 overflow-y-auto">
//                   <table className="w-full text-sm text-left border-collapse min-w-[420px]">
//                     <thead className="sticky top-0 bg-primary-50/90">
//                       <tr>
//                         {cfg.headers.map((h) => (
//                           <th key={h} className="px-3 py-2 text-xs font-semibold text-primary-800 uppercase">
//                             {h}
//                           </th>
//                         ))}
//                         {errorCount > 0 && (
//                           <th className="px-3 py-2 text-xs font-semibold text-red-700 uppercase">Error</th>
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {rows.map((r, i) => (
//                         <tr
//                           key={i}
//                           className={`border-t border-slate-100 ${i in rowErrors ? "bg-red-50" : ""}`}
//                         >
//                           {cfg.headers.map((_, ci) => (
//                             <td key={ci} className="px-3 py-2 text-slate-700 whitespace-nowrap">
//                               {r[ci] || "-"}
//                             </td>
//                           ))}
//                           {errorCount > 0 && (
//                             <td className="px-3 py-2 text-red-600 whitespace-nowrap">{rowErrors[i] || ""}</td>
//                           )}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {uploaded ? (
//                 <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3.5 py-2.5 text-sm">
//                   <CheckCircle2 size={16} />
//                   {rows.length} {cfg.title.toLowerCase()} records uploaded successfully.
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <Button
//                     onClick={handleSubmit}
//                     disabled={rows.length === 0 || !siteGuid || (isPass && !visitorTypeGuid) || isSubmitting}
//                   >
//                     {isSubmitting ? "Uploading..." : `Upload ${rows.length > 0 ? `${rows.length} Records` : ""}`}
//                   </Button>

//                   <Button variant="outline" onClick={reset}>
//                     Cancel
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}

//           {error && (
//             <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mt-3">
//               {error}
//             </p>
//           )}
//         </Card>
//       </div>

//       <div className="mt-4">
//         <Badge variant="info">
//           Tip: keep column headers exactly as in the template so the upload parses correctly.
//         </Badge>
//       </div>
//       {showErrorModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
//             <h3 className="text-base font-semibold text-slate-800">
//               {errorCount} row{errorCount > 1 ? "s" : ""} could not be uploaded
//             </h3>
//             <p className="mt-1 text-sm text-slate-500">
//               Remove these rows and upload the remaining {rows.length - errorCount} record(s)?
//             </p>

//             <ul className="mt-3 max-h-48 overflow-y-auto space-y-1.5">
//               {Object.entries(rowErrors).map(([idx, msg]) => (
//                 <li
//                   key={idx}
//                   className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
//                 >
//                   Row {Number(idx) + 1} ({cfg.noColumnLabel} {rows[Number(idx)]?.[1] || "-"}): {msg}
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-4 flex items-center justify-end gap-2">
//               <Button variant="outline" onClick={() => setShowErrorModal(false)}>
//                 Close
//               </Button>
//               <Button onClick={handleRemoveErrorsAndUpload} disabled={rows.length - errorCount === 0}>
//                 Remove errors & upload again
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BulkUpload;



import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, UploadCloud, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
import { Card, PageHeader, Button, Badge } from "@/components/ui";
import { downloadKeyTemplate, downloadPassTemplate } from "@/utils/excelTemplates";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { userStorage } from "@/utils/storage";
import { keyService } from "@/service/keycreationservices";
import type { KeyStatus } from "@/service/keycreationservices";
import { passService } from "@/service/passcreationservices";
import type { PassStatus } from "@/service/passcreationservices";
import { visitorTypeService } from "@/service/visitortypeservice";
import type { VisitorTypeRecord } from "@/service/visitortypeservice";

type BulkUploadType = "key" | "pass";

interface BulkUploadProps {
  type: BulkUploadType;
}

interface SubsiteItem {
  id?: number;
  guid: string;
  site_code?: string;
  name: string;
}

interface StoredUser {
  is_super_admin?: boolean;
  site_detail?: SubsiteItem | null;
}

// Label used in error messages / the error modal for the "no" field — keeps
// Key and Pass on one code path even though their field names differ.
const fieldConfig: Record<BulkUploadType, { noLabel: string; nameLabel: string }> = {
  key: { noLabel: "Key No", nameLabel: "Key Name" },
  pass: { noLabel: "Pass No", nameLabel: "Pass Name" },
};

const config: Record<
  BulkUploadType,
  {
    title: string;
    backPath: string;
    backLabel: string;
    headers: string[];
    download: () => Promise<void>;
  }
> = {
  key: {
    title: "Key",
    backPath: "/property-management/key",
    backLabel: "Back to Key",
    headers: ["S.No", "Key No", "Key Name"],
    download: downloadKeyTemplate,
  },
  pass: {
    title: "Pass",
    backPath: "/property-management/pass",
    backLabel: "Back to Pass",
    // Visitor Type is no longer a column — it's picked once per upload via
    // the dropdown below and applied to every row.
    headers: ["S.No", "Pass No", "Pass Name"],
    download: downloadPassTemplate,
  },
};

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

const BulkUpload = ({ type }: BulkUploadProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cfg = config[type];
  const fields = fieldConfig[type];

  // ----- logged-in user / site scope (same pattern as KeyCreation) -----
  const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;

  const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const errorCount = Object.keys(rowErrors).length;

  useEffect(() => {
    if (!isSuperAdmin) return; // non-admins are scoped to their own site, no API call needed
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

  // Sites offered for bulk-upload: all sites for admins, only their own
  // site for everyone else — same rule as the Issue/Edit Key modal.
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

  const [siteGuid, setSiteGuid] = useState<string>("");

  // Non-admins only ever have one choice — preselect it automatically.
  useEffect(() => {
    if (!isSuperAdmin && ownSite?.guid) setSiteGuid(ownSite.guid);
  }, [isSuperAdmin, ownSite]);

  // ----- visitor type dropdown (Pass upload only) -----
  // One visitor type is picked per upload and applied to every row, the
  // same way Issue Pass picks a single visitor type per pass.
  const [visitorTypes, setVisitorTypes] = useState<VisitorTypeRecord[]>([]);
  const [isLoadingVisitorTypes, setIsLoadingVisitorTypes] = useState(type === "pass");
  const [visitorTypeGuid, setVisitorTypeGuid] = useState<string>("");

  useEffect(() => {
    if (type !== "pass") return;
    let cancelled = false;

    (async () => {
      setIsLoadingVisitorTypes(true);
      try {
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
  }, [type]);

  const visitorTypeOptions = useMemo(
    () => visitorTypes.map((v) => ({ label: v.name, value: v.guid })),
    [visitorTypes]
  );

  // ----- file upload state -----
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState(false);

  const handleFileSelect = async (file: File) => {
    setError("");
    setUploaded(false);

    if (!file.name.match(/\.xlsx?$/i)) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    try {
      const { default: ExcelJS } = await import("exceljs");
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const sheet = workbook.worksheets[0];

      const parsedRows: string[][] = [];
      let headerRow: string[] = [];

      sheet.eachRow((row, rowNumber) => {
        const values = (row.values as any[]).slice(1).map((v) => (v == null ? "" : String(v).trim()));
        if (rowNumber === 1) {
          headerRow = values;
          return;
        }
        if (values.slice(1).some((v) => v !== "")) parsedRows.push(values);
      });

      const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
      const expected = cfg.headers.map(normalize);
      const actual = headerRow.map(normalize);
      const headersMatch =
        expected.length === actual.length && expected.every((h, i) => h === actual[i]);

      if (!headersMatch) {
        setError(
          `This file doesn't match the ${cfg.title} template. Please use the "Download ${cfg.title} Template" button above.`
        );
        return;
      }

      setFileName(file.name);
      setRows(parsedRows);
    } catch {
      setError("Could not read this file. Please make sure it matches the template format.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const flattenErrors = (errors?: unknown): string => {
    if (!errors) return "";
    if (Array.isArray(errors)) {
      return errors
        .map((e, i) => (e && Object.keys(e).length ? `Row ${i + 1}: ${flattenErrors(e)}` : ""))
        .filter(Boolean)
        .join(" ");
    }
    return Object.values(errors as Record<string, string[] | string>)
      .map((v) => (Array.isArray(v) ? v.join(" ") : String(v)))
      .join(" ");
  };

  // columns for both Key and Pass are [S.No, <No>, <Name>], so row[1]/row[2]
  // line up either way.
  const submitRows = async (rowsToSend: string[][]) => {
    setError("");
    setRowErrors({});

    if (!siteGuid) {
      setError("Please select a site before uploading.");
      return;
    }

    if (type === "pass" && !visitorTypeGuid) {
      setError("Please select a visitor type before uploading.");
      return;
    }

    if (rowsToSend.length === 0) {
      setError("No rows left to upload.");
      return;
    }

    // ----- build + validate payload for the active type -----
    let apiCall: () => Promise<{ success: boolean; message: string; errors?: unknown }>;

    if (type === "key") {
      const payload = rowsToSend.map((r) => ({
        key_no: (r[1] || "").trim(),
        key_name: (r[2] || "").trim(),
        site: siteGuid,
        status: "Available" as KeyStatus,
      }));

      for (let i = 0; i < payload.length; i++) {
        const p = payload[i];
        if (!p.key_no) return setError(`Row ${i + 1}: Key No is required`);
        if (!p.key_name) return setError(`Row ${i + 1}: Key Name is required`);
        if (p.key_no.length > 50) return setError(`Row ${i + 1}: Key No must be 50 characters or fewer`);
        if (p.key_name.length > 150)
          return setError(`Row ${i + 1}: Key Name must be 150 characters or fewer`);
      }

      apiCall = () => keyService.create(payload);
    } else {
      const payload = rowsToSend.map((r) => ({
        pass_no: (r[1] || "").trim(),
        pass_name: (r[2] || "").trim(),
        site: siteGuid,
        visitor_type: visitorTypeGuid,
        status: "Active" as PassStatus,
      }));

      for (let i = 0; i < payload.length; i++) {
        const p = payload[i];
        if (!p.pass_no) return setError(`Row ${i + 1}: Pass No is required`);
        if (!p.pass_name) return setError(`Row ${i + 1}: Pass Name is required`);
        if (p.pass_no.length > 50) return setError(`Row ${i + 1}: Pass No must be 50 characters or fewer`);
        if (p.pass_name.length > 150)
          return setError(`Row ${i + 1}: Pass Name must be 150 characters or fewer`);
      }

      apiCall = () => passService.create(payload);
    }

    setIsSubmitting(true);
    try {
      const res = await apiCall();

      if (!res.success) {
        const list = res.errors as unknown;

        // per-row errors from the backend: [{row, key_no|pass_no, message}]
        if (
          Array.isArray(list) &&
          list.length > 0 &&
          list.every((e) => e && typeof e.row === "number")
        ) {
          const map: Record<number, string> = {};
          list.forEach((e: { row: number; message: string }) => {
            map[e.row - 1] = e.message; // row is 1-based, index is 0-based
          });
          setRowErrors(map);
          setShowErrorModal(true);
          return;
        }

        setError(flattenErrors(res.errors) || res.message);
        return;
      }

      setUploaded(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => submitRows(rows);

  // popup button: drop the error rows, then upload the rest
  const handleRemoveErrorsAndUpload = async () => {
    const cleanRows = rows.filter((_, i) => !(i in rowErrors));
    setShowErrorModal(false);
    setRows(cleanRows);
    await submitRows(cleanRows);
  };

  const reset = () => {
    setFileName(null);
    setRows([]);
    setError("");
    setRowErrors({});
    setShowErrorModal(false);
    setUploaded(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const dropzoneDisabled = !siteGuid || (type === "pass" && !visitorTypeGuid);

  return (
    <div>
      <button
        onClick={() => navigate(cfg.backPath)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 mb-3"
      >
        <ArrowLeft size={15} />
        {cfg.backLabel}
      </button>

      <PageHeader
        title={`Bulk Upload — ${cfg.title}`}
        description={`Upload multiple ${cfg.title.toLowerCase()} records at once using the Excel template.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Step 1 — Download Template" className="lg:col-span-1 h-fit">
          <p className="text-sm text-slate-500 mb-4">
            Download the Excel template, fill in your {cfg.title.toLowerCase()} details and
            re-upload it. Columns: {cfg.headers.join(", ")}.
          </p>
          <Button
            variant="outline"
            icon={<Download size={16} />}
            fullWidth
            onClick={() => cfg.download()}
          >
            Download {cfg.title} Template
          </Button>
        </Card>

        <Card title="Step 2 — Upload File" className="lg:col-span-2">
          {/* Site selector, scoped the same way as Issue Key/Pass's Site field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Site <span className="text-red-500">*</span>
            </label>
            <select
              value={siteGuid}
              onChange={(e) => setSiteGuid(e.target.value)}
              disabled={isLoadingSites || (!isSuperAdmin && siteOptions.length <= 1)}
              className={fieldClass}
            >
              <option value="">
                {isLoadingSites ? "Loading sites..." : "Select site"}
              </option>
              {siteOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Visitor Type selector — Pass upload only. One visitor type is
              applied to every row in the file. */}
          {type === "pass" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Visitor Type <span className="text-red-500">*</span>
              </label>
              <select
                value={visitorTypeGuid}
                onChange={(e) => setVisitorTypeGuid(e.target.value)}
                disabled={isLoadingVisitorTypes}
                className={fieldClass}
              >
                <option value="">
                  {isLoadingVisitorTypes ? "Loading visitor types..." : "Select visitor type"}
                </option>
                {visitorTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!fileName ? (
            <div
              onDragOver={(e) => !dropzoneDisabled && e.preventDefault()}
              onDrop={(e) => {
                if (dropzoneDisabled) {
                  e.preventDefault();
                  setError(
                    !siteGuid ? "Please select a site first." : "Please select a visitor type first."
                  );
                  return;
                }
                handleDrop(e);
              }}
              onClick={() => {
                if (dropzoneDisabled) {
                  setError(
                    !siteGuid ? "Please select a site first." : "Please select a visitor type first."
                  );
                  return;
                }
                fileInputRef.current?.click();
              }}
              className={`border-2 border-dashed rounded-xl py-12 px-6 flex flex-col items-center justify-center text-center transition-colors ${
                dropzoneDisabled
                  ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
                  : "border-primary-200 cursor-pointer hover:bg-primary-50/40"
              }`}
            >
              <UploadCloud size={32} className="text-primary-400 mb-3" />
              <p className="text-sm font-medium text-slate-700">
                Click to browse or drag & drop your file here
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports .xlsx and .xls files</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                disabled={dropzoneDisabled}
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between bg-primary-50/60 rounded-lg px-4 py-3 mb-4">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet size={20} className="text-primary-700" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{fileName}</p>
                    <p className="text-xs text-slate-500">{rows.length} rows detected</p>
                  </div>
                </div>
                <button onClick={reset} className="text-slate-400 hover:text-red-600">
                  <X size={18} />
                </button>
              </div>

              {rows.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-primary-50 mb-4 max-h-64 overflow-y-auto">
                  <table className="w-full text-sm text-left border-collapse min-w-[420px]">
                    <thead className="sticky top-0 bg-primary-50/90">
                      <tr>
                        {cfg.headers.map((h) => (
                          <th key={h} className="px-3 py-2 text-xs font-semibold text-primary-800 uppercase">
                            {h}
                          </th>
                        ))}
                        {errorCount > 0 && (
                          <th className="px-3 py-2 text-xs font-semibold text-red-700 uppercase">Error</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr
                          key={i}
                          className={`border-t border-slate-100 ${i in rowErrors ? "bg-red-50" : ""}`}
                        >
                          {cfg.headers.map((_, ci) => (
                            <td key={ci} className="px-3 py-2 text-slate-700 whitespace-nowrap">
                              {r[ci] || "-"}
                            </td>
                          ))}
                          {errorCount > 0 && (
                            <td className="px-3 py-2 text-red-600 whitespace-nowrap">
                              {rowErrors[i] || ""}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {uploaded ? (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3.5 py-2.5 text-sm">
                  <CheckCircle2 size={16} />
                  {rows.length} {cfg.title.toLowerCase()} records uploaded successfully.
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={rows.length === 0 || dropzoneDisabled || isSubmitting}
                  >
                    {isSubmitting ? "Uploading..." : `Upload ${rows.length > 0 ? `${rows.length} Records` : ""}`}
                  </Button>

                  <Button variant="outline" onClick={reset}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mt-3">
              {error}
            </p>
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Badge variant="info">
          Tip: keep column headers exactly as in the template so the upload parses correctly.
        </Badge>
      </div>

      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-slate-800">
              {errorCount} row{errorCount > 1 ? "s" : ""} could not be uploaded
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Remove these rows and upload the remaining {rows.length - errorCount} record(s)?
            </p>

            <ul className="mt-3 max-h-48 overflow-y-auto space-y-1.5">
              {Object.entries(rowErrors).map(([idx, msg]) => (
                <li
                  key={idx}
                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  Row {Number(idx) + 1} ({fields.noLabel} {rows[Number(idx)]?.[1] || "-"}): {msg}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setShowErrorModal(false)}>
                Close
              </Button>
              <Button onClick={handleRemoveErrorsAndUpload} disabled={rows.length - errorCount === 0}>
                Remove duplicate data & Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;