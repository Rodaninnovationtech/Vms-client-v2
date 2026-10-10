// import { useEffect, useMemo, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, Download, UploadCloud, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
// import { Card, PageHeader, Button, Badge } from "@/components/ui";
// import { userService } from "@/service/usercreationservices";
// import type { SiteDropdownItem } from "@/service/usercreationservices";
// import { tenantService } from "@/service/tenantcreationservices";
// import { tenantNotificationService } from "@/service/tenantnotificationservices";
// import type { AvailabilityConflict } from "@/service/tenantnotificationservices";
// import { identityTypeService } from "@/service/identitytypeservice";
// import { visitorTypeService } from "@/service/visitortypeservice";
// import type { VisitorTypeRecord } from "@/service/visitortypeservice";
// import { apiErrorMessage } from "@/service/visitorservices";
// import { preRegistrationService } from "@/service/preregistrationservices";
// import type { PreRegistrationPayload } from "@/service/preregistrationservices";
// import { userStorage } from "@/utils/storage";
// import logoUrl from "../../components/assests/images/logos.jpg";

// /* ---------------------------------------------------------------------- */
// /* Types / constants                                                       */
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
// }

// interface IdentityTypeRecord {
//   guid: string;
//   identity_type_name: string;
//   identity_number_validation: string;
//   identity_number_digits?: number | null;
//   identity_number_alphabets?: number | null;
//   identity_number_format?: string;
//   phone_number_validation?: string;
//   phone_number_min?: number | null;
//   phone_number_max?: number | null;
//   phone_number_starting_with?: string;
//   phone_number_format?: string;
// }

// // Template columns. Company columns only for contractor-type visitors.
// const BASE_HEADERS = ["S.No", "Full Name", "Identity Type", "Identity Number", "Contact", "Email"];
// const COMPANY_HEADERS = ["Company Name", "Company Phone"];
// const TAIL_HEADERS = ["Vehicle", "Remark"];

// const getHeaders = (withCompany: boolean) => [
//   ...BASE_HEADERS,
//   ...(withCompany ? COMPANY_HEADERS : []),
//   ...TAIL_HEADERS,
// ];

// const COMPANY_VISITOR_TYPES = ["contractor", "contructor"];
// const isCompanyType = (name?: string) =>
//   COMPANY_VISITOR_TYPES.includes((name ?? "").trim().toLowerCase());

// const SETUP_MESSAGE =
//   "Please select Site, Location, From/To dates, Visitor Type and Approver first.";

// const fieldClass =
//   "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// const getToday = () => {
//   const d = new Date();
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//     d.getDate()
//   ).padStart(2, "0")}`;
// };

// // yyyy-mm-dd -> dd-mm-yyyy
// const fmtDate = (value?: string | null) => {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;
//   return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(
//     2,
//     "0"
//   )}-${d.getFullYear()}`;
// };

// /* ---------------------------------------------------------------------- */
// /* Cell parsing helper                                                     */
// /* ---------------------------------------------------------------------- */

// // Excel cell -> trimmed string
// const cellToString = (v: unknown): string => {
//   if (v == null) return "";
//   if (v instanceof Date) return v.toISOString();
//   if (typeof v === "object") {
//     const o = v as { text?: unknown; result?: unknown; richText?: { text: string }[] };
//     if (o.richText) return o.richText.map((r) => r.text).join("").trim();
//     if (o.text != null) return String(o.text).trim();
//     if (o.result != null) return cellToString(o.result);
//     return "";
//   }
//   return String(v).trim();
// };

// const normalizeHeader = (s: string) => s.toLowerCase().replace(/\s+/g, "");

// /* ---------------------------------------------------------------------- */
// /* Rule descriptions (shown on the "Identity Rules" sheet)                 */
// /* ---------------------------------------------------------------------- */

// const identityRuleText = (t: IdentityTypeRecord): string => {
//   if (t.identity_number_validation === "Not Required") return "Not required";

//   const parts: string[] = [];
//   if (t.identity_number_digits != null) parts.push(`${t.identity_number_digits} digit(s)`);
//   if (t.identity_number_alphabets != null) parts.push(`${t.identity_number_alphabets} letter(s)`);

//   let text = parts.length ? parts.join(" followed by ") : "Any value";
//   if (t.identity_number_format) text += ` (format ${t.identity_number_format})`;

//   return t.identity_number_validation === "Optional" ? `Optional. ${text}` : text;
// };

// const contactRuleText = (t: IdentityTypeRecord): string => {
//   if (t.phone_number_validation === "Not Required") return "Not required";

//   const parts: string[] = ["digits only"];
//   const min = t.phone_number_min;
//   const max = t.phone_number_max;
//   if (min != null && max != null && min === max) parts.push(`${min} digits`);
//   else {
//     if (min != null) parts.push(`at least ${min} digits`);
//     if (max != null) parts.push(`at most ${max} digits`);
//   }
//   if (t.phone_number_starting_with) parts.push(`starting with ${t.phone_number_starting_with}`);

//   let text = parts.join(", ");
//   if (t.phone_number_format) text += ` (format ${t.phone_number_format})`;

//   return t.phone_number_validation === "Optional" ? `Optional. ${text}` : text;
// };

// /* ---------------------------------------------------------------------- */
// /* Template download                                                       */
// /* logo + purple heading + identity type dropdown + number validation      */
// /* ---------------------------------------------------------------------- */

// const TEMPLATE_PURPLE = "FF6D28D9";
// const RULES_SHEET = "Identity Rules";
// const DATA_ROWS = 100;

// const downloadTemplate = async (
//   headers: string[],
//   visitorTypeName: string,
//   identityTypes: IdentityTypeRecord[]
// ) => {
//   const { default: ExcelJS } = await import("exceljs");
//   const wb = new ExcelJS.Workbook();

//   // main sheet first (the upload reads the first sheet)
//   const ws = wb.addWorksheet("Pre-Registration");
//   const rs = wb.addWorksheet(RULES_SHEET, { properties: { tabColor: { argb: TEMPLATE_PURPLE } } });

//   /* ------------------ Identity Rules sheet ------------------ */
//   // A name | B id validation | C digits | D letters | E id format | F id rule text
//   // G phone validation | H min | I max | J starts with | K phone format | L phone rule text
//   const ruleHeaders = [
//     "Identity Type",
//     "Identity Number Validation",
//     "Digits",
//     "Letters",
//     "Identity Number Format",
//     "Identity Number Rule",
//     "Contact Validation",
//     "Contact Min Digits",
//     "Contact Max Digits",
//     "Contact Starts With",
//     "Contact Format",
//     "Contact Rule",
//   ];
//   const ruleWidths = [24, 18, 9, 9, 20, 44, 18, 12, 12, 14, 18, 50];

//   ruleHeaders.forEach((h, i) => {
//     const cell = rs.getRow(1).getCell(i + 1);
//     cell.value = h;
//     cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
//     cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TEMPLATE_PURPLE } };
//     cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
//     rs.getColumn(i + 1).width = ruleWidths[i];
//   });
//   rs.getRow(1).height = 30;
//   rs.getColumn(10).numFmt = "@"; // "starts with" stays text

//   identityTypes.forEach((t, i) => {
//     const row = rs.getRow(i + 2);
//     row.getCell(1).value = t.identity_type_name;
//     row.getCell(2).value = t.identity_number_validation || "Required";
//     if (t.identity_number_digits != null) row.getCell(3).value = t.identity_number_digits;
//     if (t.identity_number_alphabets != null) row.getCell(4).value = t.identity_number_alphabets;
//     row.getCell(5).value = t.identity_number_format || "";
//     row.getCell(6).value = identityRuleText(t);
//     row.getCell(7).value = t.phone_number_validation || "Required";
//     if (t.phone_number_min != null) row.getCell(8).value = t.phone_number_min;
//     if (t.phone_number_max != null) row.getCell(9).value = t.phone_number_max;
//     row.getCell(10).value = t.phone_number_starting_with ? String(t.phone_number_starting_with) : "";
//     row.getCell(11).value = t.phone_number_format || "";
//     row.getCell(12).value = contactRuleText(t);
//   });

//   const lastRule = Math.max(identityTypes.length + 1, 2);
//   const R = (col: string) => `'${RULES_SHEET}'!$${col}$2:$${col}$${lastRule}`;

//   /* ------------------ main sheet layout ------------------ */
//   const lastCol = headers.length;
//   const HEADER_ROW = 4;
//   const FIRST_ROW = HEADER_ROW + 1;
//   const LAST_ROW = HEADER_ROW + DATA_ROWS;

//   headers.forEach((h, i) => {
//     ws.getColumn(i + 1).width = h === "S.No" ? 8 : h === "Remark" ? 30 : 20;
//   });

//   // rows 1-3: logo + title
//   [1, 2, 3].forEach((n) => (ws.getRow(n).height = 22));

//   try {
//     const res = await fetch(logoUrl);
//     const buf = await res.arrayBuffer();
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const imageId = wb.addImage({ buffer: buf as any, extension: "jpeg" });
//     ws.addImage(imageId, {
//       tl: { col: 0.1, row: 0.15 },
//       ext: { width: 150, height: 58 },
//     });
//   } catch {
//     /* template still downloads without the logo */
//   }

//   if (lastCol > 3) {
//     ws.mergeCells(1, 4, 3, lastCol);
//     const title = ws.getCell(1, 4);
//     title.value = `Pre-Registration Bulk Upload — ${visitorTypeName}`;
//     title.font = { bold: true, size: 14, color: { argb: TEMPLATE_PURPLE } };
//     title.alignment = { vertical: "middle", horizontal: "center" };
//   }

//   // row 4: purple heading
//   const headerRow = ws.getRow(HEADER_ROW);
//   headers.forEach((h, i) => {
//     const cell = headerRow.getCell(i + 1);
//     cell.value = h;
//     cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
//     cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TEMPLATE_PURPLE } };
//     cell.alignment = { vertical: "middle", horizontal: "left" };
//     cell.border = { bottom: { style: "thin", color: { argb: "FFD8CCFB" } } };
//   });
//   headerRow.height = 22;

//   /* ------------------ columns used by the checks ------------------ */
//   const idTypeCol = headers.indexOf("Identity Type") + 1;
//   const idNoCol = headers.indexOf("Identity Number") + 1;
//   const contactCol = headers.indexOf("Contact") + 1;

//   // hidden helper columns, one empty column after the last visible one
//   const idxCol = lastCol + 2;
//   const dgCol = lastCol + 3;
//   const alCol = lastCol + 4;
//   const idOkCol = lastCol + 5;
//   const phOkCol = lastCol + 6;
//   [idxCol, dgCol, alCol, idOkCol, phOkCol].forEach((c) => {
//     ws.getColumn(c).hidden = true;
//   });

//   const L = (c: number) => ws.getColumn(c).letter;

//   const textCols = ["Identity Number", "Contact", "Company Phone"]
//     .map((h) => headers.indexOf(h) + 1)
//     .filter((c) => c > 0);

//   for (let r = FIRST_ROW; r <= LAST_ROW; r++) {
//     const row = ws.getRow(r);
//     row.getCell(1).value = r - HEADER_ROW;

//     // keep ids / phone numbers as plain text so Excel doesn't reformat them
//     textCols.forEach((c) => {
//       row.getCell(c).numFmt = "@";
//     });

//     const typeRef = `$${L(idTypeCol)}${r}`;
//     const idNo = `$${L(idNoCol)}${r}`;
//     const ph = `$${L(contactCol)}${r}`;
//     const idx = `$${L(idxCol)}${r}`;
//     const dg = `$${L(dgCol)}${r}`;
//     const al = `$${L(alCol)}${r}`;

//     // position of the chosen identity type on the rules sheet (0 = none)
//     row.getCell(idxCol).value = { formula: `IFERROR(MATCH(${typeRef},${R("A")},0),0)` };
//     row.getCell(dgCol).value = {
//       formula: `IF(${idx}=0,0,N(INDEX(${R("C")},${idx})))`,
//     };
//     row.getCell(alCol).value = {
//       formula: `IF(${idx}=0,0,N(INDEX(${R("D")},${idx})))`,
//     };

//     /* ---- Identity Number check ---- */
//     const idRule = `INDEX(${R("B")},${idx})&""`;
//     const digitsOk = `IF(${dg}=0,TRUE,SUMPRODUCT(--ISNUMBER(FIND(MID(${idNo},ROW(INDIRECT("1:"&${dg})),1),"0123456789")))=${dg})`;
//     const lettersOk = `IF(${al}=0,TRUE,SUMPRODUCT(--(CODE(UPPER(MID(${idNo},${dg}+ROW(INDIRECT("1:"&${al})),1)))>=65),--(CODE(UPPER(MID(${idNo},${dg}+ROW(INDIRECT("1:"&${al})),1)))<=90))=${al})`;

//     row.getCell(idOkCol).value = {
//       formula:
//         `IFERROR(IF(${idx}=0,FALSE,IF(${idRule}="Not Required",TRUE,` +
//         `IF(LEN(${idNo})=0,${idRule}="Optional",` +
//         `IF(${dg}+${al}=0,TRUE,` +
//         `IF(LEN(${idNo})<>${dg}+${al},FALSE,AND(${digitsOk},${lettersOk})))))),FALSE)`,
//     };

//     /* ---- Contact check ---- */
//     const phRule = `INDEX(${R("G")},${idx})&""`;
//     const mn = `N(INDEX(${R("H")},${idx}))`;
//     const mx = `N(INDEX(${R("I")},${idx}))`;
//     const sw = `INDEX(${R("J")},${idx})&""`;
//     const digitsOnly = `SUMPRODUCT(--ISNUMBER(FIND(MID(${ph},ROW(INDIRECT("1:"&LEN(${ph}))),1),"0123456789")))=LEN(${ph})`;

//     row.getCell(phOkCol).value = {
//       formula:
//         `IFERROR(IF(${idx}=0,FALSE,IF(${phRule}="Not Required",TRUE,` +
//         `IF(LEN(${ph})=0,${phRule}="Optional",` +
//         `AND(${digitsOnly},IF(${mn}>0,LEN(${ph})>=${mn},TRUE),IF(${mx}>0,LEN(${ph})<=${mx},TRUE),` +
//         `IF(${sw}="",TRUE,ISNUMBER(FIND(LEFT(${ph},1),${sw}))))))),FALSE)`,
//     };

//     /* ---- validations on the visible cells ---- */
//     if (identityTypes.length > 0) {
//       row.getCell(idTypeCol).dataValidation = {
//         type: "list",
//         allowBlank: true,
//         formulae: [R("A")],
//         showErrorMessage: true,
//         errorStyle: "stop",
//         errorTitle: "Invalid Identity Type",
//         error: "Please pick an identity type from the dropdown.",
//       };
//     }

//     row.getCell(idNoCol).dataValidation = {
//       type: "custom",
//       allowBlank: true,
//       formulae: [`$${L(idOkCol)}${r}`],
//       showInputMessage: true,
//       promptTitle: "Identity Number",
//       prompt: "Select the Identity Type first. See the 'Identity Rules' sheet for the format.",
//       showErrorMessage: true,
//       errorStyle: "stop",
//       errorTitle: "Invalid Identity Number",
//       error:
//         "This identity number does not match the rule for the selected Identity Type. Select the Identity Type first and check the 'Identity Rules' sheet.",
//     };

//     row.getCell(contactCol).dataValidation = {
//       type: "custom",
//       allowBlank: true,
//       formulae: [`$${L(phOkCol)}${r}`],
//       showInputMessage: true,
//       promptTitle: "Contact",
//       prompt: "Select the Identity Type first. See the 'Identity Rules' sheet for the rule.",
//       showErrorMessage: true,
//       errorStyle: "stop",
//       errorTitle: "Invalid Contact Number",
//       error:
//         "This contact number does not match the rule for the selected Identity Type. Select the Identity Type first and check the 'Identity Rules' sheet.",
//     };
//   }

//   // red highlight for values that break the rule (also catches pasted values)
//   const redStyle = {
//     fill: {
//       type: "pattern" as const,
//       pattern: "solid" as const,
//       bgColor: { argb: "FFFECACA" },
//     },
//     font: { color: { argb: "FF991B1B" } },
//   };

//   ws.addConditionalFormatting({
//     ref: `${L(idNoCol)}${FIRST_ROW}:${L(idNoCol)}${LAST_ROW}`,
//     rules: [
//       {
//         type: "expression",
//         priority: 1,
//         formulae: [`AND(LEN($${L(idNoCol)}${FIRST_ROW})>0,NOT($${L(idOkCol)}${FIRST_ROW}))`],
//         style: redStyle,
//       },
//     ],
//   });

//   ws.addConditionalFormatting({
//     ref: `${L(contactCol)}${FIRST_ROW}:${L(contactCol)}${LAST_ROW}`,
//     rules: [
//       {
//         type: "expression",
//         priority: 2,
//         formulae: [`AND(LEN($${L(contactCol)}${FIRST_ROW})>0,NOT($${L(phOkCol)}${FIRST_ROW}))`],
//         style: redStyle,
//       },
//     ],
//   });

//   const buffer = await wb.xlsx.writeBuffer();
//   const blob = new Blob([buffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `Pre_Registration_${visitorTypeName.replace(/\s+/g, "_")}_Template.xlsx`;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
//   URL.revokeObjectURL(url);
// };

// /* ---------------------------------------------------------------------- */
// /* Small select component (outside the page so it doesn't remount)         */
// /* ---------------------------------------------------------------------- */

// interface DropdownProps {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
//   options: Option[];
//   placeholder: string;
//   disabled?: boolean;
// }

// const Dropdown = ({ label, value, onChange, options, placeholder, disabled }: DropdownProps) => (
//   <div>
//     <label className="block text-sm font-medium text-slate-700 mb-1.5">
//       {label} <span className="text-red-500">*</span>
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

// /* ---------------------------------------------------------------------- */
// /* Page                                                                     */
// /* ---------------------------------------------------------------------- */

// const BulkUploads = () => {
//   const navigate = useNavigate();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ----- logged-in user / site scope -----
//   const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
//   const isSuperAdmin = storedUser?.is_super_admin === true;
//   const ownSite = storedUser?.site_detail ?? null;

//   const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
//   const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);

//   useEffect(() => {
//     if (!isSuperAdmin) return;
//     let cancelled = false;
//     (async () => {
//       try {
//         const res = await userService.siteDropdown();
//         if (!cancelled && res.success && res.data) setAllSites(res.data.results ?? []);
//       } finally {
//         if (!cancelled) setIsLoadingSites(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, [isSuperAdmin]);

//   const siteOptions: Option[] = useMemo(
//     () =>
//       isSuperAdmin
//         ? allSites.map((s) => ({ label: `${s.site_name} (${s.site_model.name})`, value: s.guid }))
//         : ownSite
//         ? [{ label: ownSite.name, value: ownSite.guid }]
//         : [],
//     [isSuperAdmin, allSites, ownSite]
//   );

//   const [siteGuid, setSiteGuid] = useState("");
//   useEffect(() => {
//     if (!isSuperAdmin && ownSite?.guid) setSiteGuid(ownSite.guid);
//   }, [isSuperAdmin, ownSite]);

//   // ----- location + approvers (depend on site) -----
//   const [locationOptions, setLocationOptions] = useState<Option[]>([]);
//   const [isLoadingLocations, setIsLoadingLocations] = useState(false);
//   const [locationGuid, setLocationGuid] = useState("");
//   const [locationLabel, setLocationLabel] = useState("");

//   const [approverOptions, setApproverOptions] = useState<Option[]>([]);
//   const [isLoadingApprovers, setIsLoadingApprovers] = useState(false);
//   const [approverEmail, setApproverEmail] = useState("");

//   // ----- visit window (applies to every row) -----
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [fromTime, setFromTime] = useState("");
//   const [toTime, setToTime] = useState("");

//   const isTimeRangeValid =
//     (!fromTime && !toTime) ||
//     (!!fromTime && !!toTime && (fromDate !== toDate || toTime > fromTime));

//   // ----- availability for Location + date range -----
//   const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
//   const [availabilityChecked, setAvailabilityChecked] = useState(false);
//   const [availabilityAvailable, setAvailabilityAvailable] = useState(false);
//   const [availabilityConflicts, setAvailabilityConflicts] = useState<AvailabilityConflict[]>([]);
//   const [availabilityError, setAvailabilityError] = useState("");
//   const availabilityRequestId = useRef(0);

//   const resetAvailability = () => {
//     availabilityRequestId.current += 1;
//     setIsCheckingAvailability(false);
//     setAvailabilityChecked(false);
//     setAvailabilityAvailable(false);
//     setAvailabilityConflicts([]);
//     setAvailabilityError("");
//   };

//   const checkAvailability = async (loc: string, from: string, to: string) => {
//     resetAvailability();
//     const requestId = availabilityRequestId.current;
//     setIsCheckingAvailability(true);
//     try {
//       const res = await tenantNotificationService.checkAvailability(loc, from, to);
//       if (requestId !== availabilityRequestId.current) return;

//       if (res.success && res.data) {
//         setAvailabilityChecked(true);
//         setAvailabilityAvailable(res.data.available);
//         setAvailabilityConflicts(res.data.conflicts);
//       } else {
//         setAvailabilityError(res.message || "Could not check availability.");
//       }
//     } catch {
//       if (requestId !== availabilityRequestId.current) return;
//       setAvailabilityError("Could not check availability. Please try again.");
//     } finally {
//       if (requestId === availabilityRequestId.current) setIsCheckingAvailability(false);
//     }
//   };

//   // site changed -> reload locations + approvers, clear everything below
//   useEffect(() => {
//     setLocationGuid("");
//     setLocationLabel("");
//     setApproverEmail("");
//     setLocationOptions([]);
//     setApproverOptions([]);
//     setFromDate("");
//     setToDate("");
//     resetAvailability();
//     if (!siteGuid) return;

//     let cancelled = false;
//     const siteName = siteOptions.find((s) => s.value === siteGuid)?.label || "";

//     (async () => {
//       setIsLoadingLocations(true);
//       setIsLoadingApprovers(true);

//       try {
//         const res = await tenantService.list(1, 100, "", {
//           site_guid: siteGuid,
//           site_name: siteName,
//         });
//         if (!cancelled && res.success && res.data) {
//           setLocationOptions(
//             res.data.results.map((t) => ({
//               label: `${t.tenant_name} (${t.block}/${t.floor}/${t.unit})`,
//               value: t.guid,
//             }))
//           );
//         }
//       } catch {
//         /* leave empty */
//       } finally {
//         if (!cancelled) setIsLoadingLocations(false);
//       }

//       try {
//         const res = await preRegistrationService.approverDropdown(siteGuid);
//         if (!cancelled && res.success && res.data) {
//           setApproverOptions(
//             res.data.results.map((a) => {
//               const who = a.full_name ? `${a.full_name} — ${a.email}` : a.email;
//               return { label: a.role ? `${who} (${a.role.name})` : who, value: a.email };
//             })
//           );
//         }
//       } catch {
//         /* leave empty */
//       } finally {
//         if (!cancelled) setIsLoadingApprovers(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [siteGuid]);

//   // Picking a location clears the dates; availability is checked once both are set.
//   const handleLocationChange = (value: string) => {
//     setLocationGuid(value);
//     setLocationLabel(locationOptions.find((o) => o.value === value)?.label || "");
//     setFromDate("");
//     setToDate("");
//     resetAvailability();
//   };

//   const handleFromDateChange = (value: string) => {
//     const nextTo = value && toDate && toDate < value ? value : toDate;
//     setFromDate(value);
//     setToDate(nextTo);

//     if (!locationGuid || !value || !nextTo) {
//       resetAvailability();
//       return;
//     }
//     checkAvailability(locationGuid, value, nextTo);
//   };

//   const handleToDateChange = (value: string) => {
//     const nextFrom = value && fromDate && value < fromDate ? value : fromDate;
//     setToDate(value);
//     setFromDate(nextFrom);

//     if (!locationGuid || !value || !nextFrom) {
//       resetAvailability();
//       return;
//     }
//     checkAvailability(locationGuid, nextFrom, value);
//   };

//   // ----- identity types + visitor types -----
//   const [identityTypes, setIdentityTypes] = useState<IdentityTypeRecord[]>([]);
//   const [visitorTypes, setVisitorTypes] = useState<VisitorTypeRecord[]>([]);
//   const [isLoadingLookups, setIsLoadingLookups] = useState(true);
//   const [visitorTypeGuid, setVisitorTypeGuid] = useState("");

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
//         const [idRes, vtRes] = await Promise.all([
//           identityTypeService.list("", "", ""),
//           visitorTypeService.list(1, 100, ""),
//         ]);
//         if (cancelled) return;
//         if (idRes.success && idRes.data) setIdentityTypes(idRes.data.results);
//         if (vtRes.success && vtRes.data) {
//           setVisitorTypes((vtRes.data.results ?? []).filter((v) => v.is_active !== false));
//         }
//       } finally {
//         if (!cancelled) setIsLoadingLookups(false);
//       }
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const visitorTypeOptions: Option[] = useMemo(
//     () => visitorTypes.map((v) => ({ label: v.name, value: v.guid })),
//     [visitorTypes]
//   );

//   const selectedVisitorTypeName =
//     visitorTypes.find((v) => v.guid === visitorTypeGuid)?.name ?? "";
//   const needsCompany = isCompanyType(selectedVisitorTypeName);
//   const headers = useMemo(() => getHeaders(needsCompany), [needsCompany]);

//   // value of a named column in a parsed row
//   const get = (r: string[], name: string) => {
//     const i = headers.indexOf(name);
//     return i >= 0 ? r[i] ?? "" : "";
//   };

//   // ----- file state -----
//   const [fileName, setFileName] = useState<string | null>(null);
//   const [rows, setRows] = useState<string[][]>([]);
//   const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [uploadedCount, setUploadedCount] = useState<number | null>(null);
//   const [showErrorModal, setShowErrorModal] = useState(false);
//   const errorCount = Object.keys(rowErrors).length;

//   const setupReady =
//     !!siteGuid &&
//     !!locationGuid &&
//     !!fromDate &&
//     !!toDate &&
//     isTimeRangeValid &&
//     availabilityChecked &&
//     availabilityAvailable &&
//     !!visitorTypeGuid &&
//     !!approverEmail;

//   const reset = () => {
//     setFileName(null);
//     setRows([]);
//     setError("");
//     setRowErrors({});
//     setShowErrorModal(false);
//     setUploadedCount(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // template differs per visitor type, so a loaded file is dropped on change
//   const handleVisitorTypeChange = (value: string) => {
//     setVisitorTypeGuid(value);
//     reset();
//   };

//   const handleFileSelect = async (file: File) => {
//     setError("");
//     setRowErrors({});
//     setUploadedCount(null);

//     if (!file.name.match(/\.xlsx?$/i)) {
//       setError("Please upload a valid Excel file (.xlsx or .xls)");
//       return;
//     }

//     try {
//       const { default: ExcelJS } = await import("exceljs");
//       const workbook = new ExcelJS.Workbook();
//       await workbook.xlsx.load(await file.arrayBuffer());
//       const sheet = workbook.worksheets[0];

//       // the template has a logo/title above the heading, so find the heading row
//       let headerRowNo = 0;
//       const scanTo = Math.min(sheet.rowCount, 15);
//       for (let n = 1; n <= scanTo; n++) {
//         if (normalizeHeader(cellToString(sheet.getRow(n).getCell(1).value)) === "s.no") {
//           headerRowNo = n;
//           break;
//         }
//       }

//       const mismatchMessage = `This file doesn't match the ${selectedVisitorTypeName} template. Please use the "Download Template" button.`;

//       if (!headerRowNo) {
//         setError(mismatchMessage);
//         return;
//       }

//       const headerValues = headers.map((_, i) =>
//         cellToString(sheet.getRow(headerRowNo).getCell(i + 1).value)
//       );
//       // the column right after the last heading must stay empty
//       // (hidden check columns start one column further right)
//       const extraCell = cellToString(sheet.getRow(headerRowNo).getCell(headers.length + 1).value);
//       const headersMatch =
//         !extraCell && headers.every((h, i) => normalizeHeader(h) === normalizeHeader(headerValues[i]));

//       if (!headersMatch) {
//         setError(mismatchMessage);
//         return;
//       }

//       const parsed: string[][] = [];
//       sheet.eachRow((row, rowNumber) => {
//         if (rowNumber <= headerRowNo) return;
//         const values = headers.map((_, i) => cellToString(row.getCell(i + 1).value));
//         // S.No is pre-filled, so a row counts only if another column has data
//         if (values.slice(1).some((v) => v !== "")) parsed.push(values);
//       });

//       if (parsed.length === 0) {
//         setError("No data rows found in this file.");
//         return;
//       }

//       setFileName(file.name);
//       setRows(parsed);
//     } catch {
//       setError("Could not read this file. Please make sure it matches the template format.");
//     }
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0];
//     if (file) handleFileSelect(file);
//   };

//   /* ---------- per-row validation (returns an error message or "") ---------- */
//   const validateRow = (r: string[]): string => {
//     const idTypeText = get(r, "Identity Type");

//     if (!get(r, "Full Name")) return "Full Name is required";
//     if (!idTypeText) return "Identity Type is required";

//     const idType = identityTypes.find(
//       (t) => t.identity_type_name.toLowerCase() === idTypeText.toLowerCase()
//     );
//     if (!idType) return `Unknown Identity Type "${idTypeText}"`;

//     // identity number
//     const idNo = get(r, "Identity Number");
//     const idRule = idType.identity_number_validation;
//     if (idRule !== "Not Required" && !(idRule === "Optional" && !idNo)) {
//       if (!idNo) return "Identity Number is required";
//       const { identity_number_digits: dg, identity_number_alphabets: al } = idType;
//       if (dg != null || al != null) {
//         const re = new RegExp(
//           `^${dg != null ? `[0-9]{${dg}}` : ""}${al != null ? `[A-Za-z]{${al}}` : ""}$`
//         );
//         if (!re.test(idNo)) {
//           return idType.identity_number_format
//             ? `Identity Number must match ${idType.identity_number_format}`
//             : "Invalid Identity Number";
//         }
//       }
//     }

//     // contact
//     const phone = get(r, "Contact");
//     const phRule = idType.phone_number_validation;
//     if (phRule !== "Not Required" && !(phRule === "Optional" && !phone)) {
//       if (!phone) return "Contact is required";
//       if (!/^[0-9]+$/.test(phone)) return "Contact must contain digits only";
//       const { phone_number_min: min, phone_number_max: max, phone_number_starting_with: sw } =
//         idType;
//       if (min != null && phone.length < min) return `Contact must be at least ${min} digits`;
//       if (max != null && phone.length > max) return `Contact must be at most ${max} digits`;
//       if (sw && !sw.split("").includes(phone.charAt(0)))
//         return `Contact must start with ${sw}`;
//     }

//     // email (optional)
//     const email = get(r, "Email");
//     if (email && !/^\S+@\S+\.\S+$/.test(email)) return "Invalid Email";

//     // company (contractor type)
//     if (needsCompany) {
//       if (!get(r, "Company Name")) return "Company Name is required for this visitor type";
//       if (!/^[0-9]{10}$/.test(get(r, "Company Phone"))) return "Company Phone must be 10 digits";
//     }

//     return "";
//   };

//   const buildPayload = (r: string[]): PreRegistrationPayload => ({
//     site: siteGuid,
//     location: locationGuid,
//     visitor_type: visitorTypeGuid,
//     from_date: fromDate,
//     to_date: toDate,
//     from_time: fromTime || null,
//     to_time: toTime || null,
//     person_id: null,
//     person_name: get(r, "Full Name"),
//     identity_type:
//       identityTypes.find(
//         (t) => t.identity_type_name.toLowerCase() === get(r, "Identity Type").toLowerCase()
//       )?.identity_type_name ?? get(r, "Identity Type"),
//     identity_number: get(r, "Identity Number"),
//     phone_number: get(r, "Contact"),
//     email: get(r, "Email"),
//     company: needsCompany ? get(r, "Company Name") : "",
//     company_phone: needsCompany ? get(r, "Company Phone") : "",
//     pass_no: "",
//     key_no: "",
//     vehicle_number: get(r, "Vehicle"),
//     remark: get(r, "Remark"),
//     approver_email: approverEmail,
//   });

//   const handleUpload = async () => {
//     setError("");
//     setRowErrors({});
//     setUploadedCount(null);

//     if (!setupReady) {
//       setError(SETUP_MESSAGE);
//       return;
//     }

//     // 1) validate everything first
//     const errs: Record<number, string> = {};
//     rows.forEach((r, i) => {
//       const msg = validateRow(r);
//       if (msg) errs[i] = msg;
//     });
//     if (Object.keys(errs).length > 0) {
//       setRowErrors(errs);
//       setShowErrorModal(true);
//       return;
//     }

//     // 2) create one by one; the server also checks bans etc.
//     setIsSubmitting(true);
//     const failed: { row: string[]; message: string }[] = [];
//     let ok = 0;

//     for (const r of rows) {
//       try {
//         const res = await preRegistrationService.create(buildPayload(r));
//         if (res.success) ok += 1;
//         else failed.push({ row: r, message: res.message || "Could not create" });
//       } catch (err) {
//         failed.push({ row: r, message: apiErrorMessage(err, "Could not create") });
//       }
//     }
//     setIsSubmitting(false);
//     setUploadedCount(ok);

//     // keep only the failed rows on screen, with their error
//     if (failed.length > 0) {
//       const map: Record<number, string> = {};
//       failed.forEach((f, i) => (map[i] = f.message));
//       setRows(failed.map((f) => f.row));
//       setRowErrors(map);
//       setShowErrorModal(true);
//     } else {
//       setRows([]);
//     }
//   };

//   // popup button: drop invalid rows, keep the good ones for upload
//   const handleRemoveErrorRows = () => {
//     setRows((prev) => prev.filter((_, i) => !(i in rowErrors)));
//     setRowErrors({});
//     setShowErrorModal(false);
//   };

//   const allDone = uploadedCount !== null && rows.length === 0;
//   const dropzoneDisabled = !setupReady;

//   return (
//     <div>
//       <button
//         onClick={() => navigate("/pre-registration")}
//         className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 mb-3"
//       >
//         <ArrowLeft size={15} />
//         Back to Pre-Registration
//       </button>

//       <PageHeader
//         title="Bulk Upload — Pre-Registration"
//         description="Upload multiple pre-registration requests at once using the Excel template."
//       />

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* ---------------- Step 1 ---------------- */}
//         <Card title="Step 1 — Download Template" className="lg:col-span-1 h-fit">
//           <div className="mb-4">
//             <Dropdown
//               label="Visitor Type"
//               value={visitorTypeGuid}
//               onChange={handleVisitorTypeChange}
//               options={visitorTypeOptions}
//               placeholder={isLoadingLookups ? "Loading..." : "Select visitor type"}
//               disabled={isLoadingLookups}
//             />
//           </div>

//           {visitorTypeGuid ? (
//             <>
//               <p className="text-sm text-slate-500 mb-3">
//                 Download the template and fill in one visitor per row. Visit dates and times are
//                 chosen on this page, not in the file.
//               </p>
//               <p className="text-sm text-slate-500 mb-3">
//                 In the file, pick the Identity Type first. The Identity Number and Contact are then
//                 checked against that type's rules (see the "Identity Rules" sheet).
//               </p>
//               <p className="text-xs text-slate-400 mb-4">Columns: {headers.join(", ")}.</p>
//             </>
//           ) : (
//             <p className="text-sm text-slate-500 mb-4">
//               Select the visitor type first. The template columns depend on it.
//             </p>
//           )}

//           <Button
//             variant="outline"
//             icon={<Download size={16} />}
//             fullWidth
//             disabled={!visitorTypeGuid || isLoadingLookups}
//             onClick={() => downloadTemplate(headers, selectedVisitorTypeName, identityTypes)}
//           >
//             Download Template
//           </Button>
//         </Card>

//         {/* ---------------- Step 2 ---------------- */}
//         <Card title="Step 2 — Upload File" className="lg:col-span-2">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//             <Dropdown
//               label="Site"
//               value={siteGuid}
//               onChange={setSiteGuid}
//               options={siteOptions}
//               placeholder={isLoadingSites ? "Loading sites..." : "Select site"}
//               disabled={isLoadingSites || (!isSuperAdmin && siteOptions.length <= 1)}
//             />
//             <Dropdown
//               label="Location"
//               value={locationGuid}
//               onChange={handleLocationChange}
//               options={locationOptions}
//               placeholder={
//                 !siteGuid
//                   ? "Select site first"
//                   : isLoadingLocations
//                   ? "Loading locations..."
//                   : "Select location"
//               }
//               disabled={!siteGuid || isLoadingLocations}
//             />

//             {/* From / To dates + times, right after Location */}
//             <label className="text-sm font-medium text-slate-700">
//               From Date <span className="text-red-500">*</span>
//               <input
//                 type="date"
//                 value={fromDate}
//                 min={getToday()}
//                 max={toDate || undefined}
//                 disabled={!locationGuid}
//                 onChange={(e) => handleFromDateChange(e.target.value)}
//                 className={`${fieldClass} mt-1.5`}
//               />
//             </label>
//             <label className="text-sm font-medium text-slate-700">
//               To Date <span className="text-red-500">*</span>
//               <input
//                 type="date"
//                 value={toDate}
//                 min={fromDate || getToday()}
//                 disabled={!locationGuid}
//                 onChange={(e) => handleToDateChange(e.target.value)}
//                 className={`${fieldClass} mt-1.5`}
//               />
//             </label>
//             <label className="text-sm font-medium text-slate-700">
//               From Time
//               <input
//                 type="time"
//                 value={fromTime}
//                 disabled={!locationGuid}
//                 onChange={(e) => setFromTime(e.target.value)}
//                 className={`${fieldClass} mt-1.5`}
//               />
//             </label>
//             <label className="text-sm font-medium text-slate-700">
//               To Time
//               <input
//                 type="time"
//                 value={toTime}
//                 disabled={!locationGuid}
//                 onChange={(e) => setToTime(e.target.value)}
//                 className={`${fieldClass} mt-1.5`}
//               />
//             </label>

//             <Dropdown
//               label="Approver"
//               value={approverEmail}
//               onChange={setApproverEmail}
//               options={approverOptions}
//               placeholder={
//                 !siteGuid
//                   ? "Select site first"
//                   : isLoadingApprovers
//                   ? "Loading approvers..."
//                   : approverOptions.length === 0
//                   ? "No approvers for this site"
//                   : "Select approver"
//               }
//               disabled={!siteGuid || isLoadingApprovers || approverOptions.length === 0}
//             />
//           </div>

//           {/* availability + time messages */}
//           <div className="space-y-2 mb-4 -mt-1">
//             {isCheckingAvailability && (
//               <p className="text-xs text-slate-500">Checking availability...</p>
//             )}

//             {availabilityError && <p className="text-xs text-red-600">{availabilityError}</p>}

//             {availabilityChecked && availabilityAvailable && (
//               <p className="text-xs text-emerald-600">
//                 {locationLabel || "This location"} is available from {fmtDate(fromDate)} to{" "}
//                 {fmtDate(toDate)}.
//               </p>
//             )}

//             {availabilityChecked && !availabilityAvailable && (
//               <div className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5">
//                 <p className="text-xs font-medium text-red-600 mb-1">
//                   Not available for the selected dates. Already booked:
//                 </p>
//                 <ul className="text-xs text-red-600 space-y-0.5">
//                   {availabilityConflicts.map((c, i) => (
//                     <li key={i}>
//                       {c.from_date} to {c.to_date}
//                       {c.message ? ` — ${c.message}` : ""}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {!isTimeRangeValid && (
//               <p className="text-xs text-red-600">
//                 Enter both times, and make To Time later than From Time.
//               </p>
//             )}

//             {needsCompany && (
//               <p className="text-xs text-slate-500">
//                 This visitor type needs Company Name and a 10-digit Company Phone in every row.
//               </p>
//             )}
//           </div>

//           {!fileName ? (
//             <div
//               onDragOver={(e) => !dropzoneDisabled && e.preventDefault()}
//               onDrop={(e) => {
//                 if (dropzoneDisabled) {
//                   e.preventDefault();
//                   setError(SETUP_MESSAGE);
//                   return;
//                 }
//                 handleDrop(e);
//               }}
//               onClick={() => {
//                 if (dropzoneDisabled) {
//                   setError(SETUP_MESSAGE);
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
//                     <p className="text-xs text-slate-500">{rows.length} rows pending</p>
//                   </div>
//                 </div>
//                 <button onClick={reset} className="text-slate-400 hover:text-red-600">
//                   <X size={18} />
//                 </button>
//               </div>

//               {rows.length > 0 && (
//                 <div className="overflow-x-auto rounded-lg border border-primary-50 mb-4 max-h-72 overflow-y-auto">
//                   <table className="w-full text-sm text-left border-collapse min-w-[700px]">
//                     <thead className="sticky top-0 bg-primary-50/90">
//                       <tr>
//                         {headers.map((h) => (
//                           <th
//                             key={h}
//                             className="px-3 py-2 text-xs font-semibold text-primary-800 uppercase whitespace-nowrap"
//                           >
//                             {h}
//                           </th>
//                         ))}
//                         {errorCount > 0 && (
//                           <th className="px-3 py-2 text-xs font-semibold text-red-700 uppercase">
//                             Error
//                           </th>
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {rows.map((r, i) => (
//                         <tr
//                           key={i}
//                           className={`border-t border-slate-100 ${i in rowErrors ? "bg-red-50" : ""}`}
//                         >
//                           {headers.map((_, ci) => (
//                             <td key={ci} className="px-3 py-2 text-slate-700 whitespace-nowrap">
//                               {r[ci] || "-"}
//                             </td>
//                           ))}
//                           {errorCount > 0 && (
//                             <td className="px-3 py-2 text-red-600 whitespace-nowrap">
//                               {rowErrors[i] || ""}
//                             </td>
//                           )}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {uploadedCount !== null && uploadedCount > 0 && (
//                 <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3.5 py-2.5 text-sm mb-3">
//                   <CheckCircle2 size={16} />
//                   {uploadedCount} pre-registration{uploadedCount > 1 ? "s" : ""} created
//                   successfully.
//                 </div>
//               )}

//               {allDone ? (
//                 <div className="flex items-center gap-2">
//                   <Button onClick={() => navigate("/pre-registration")}>
//                     Go to Pre-Registration
//                   </Button>
//                   <Button variant="outline" onClick={reset}>
//                     Upload another file
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <Button
//                     onClick={handleUpload}
//                     disabled={rows.length === 0 || dropzoneDisabled || isSubmitting}
//                   >
//                     {isSubmitting
//                       ? "Uploading..."
//                       : `Upload ${rows.length > 0 ? `${rows.length} Records` : ""}`}
//                   </Button>
//                   <Button variant="outline" onClick={reset} disabled={isSubmitting}>
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
//           Tip: keep the template's heading row and hidden columns as they are. The selected dates,
//           times, location and approver apply to every row in the file.
//         </Badge>
//       </div>

//       {showErrorModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
//             <h3 className="text-base font-semibold text-slate-800">
//               {errorCount} row{errorCount > 1 ? "s" : ""} could not be uploaded
//             </h3>
//             <p className="mt-1 text-sm text-slate-500">
//               {uploadedCount !== null
//                 ? "These rows failed on the server. Fix them in your file and upload again."
//                 : `Fix these rows in your file, or remove them and upload the remaining ${
//                     rows.length - errorCount
//                   } record(s).`}
//             </p>

//             <ul className="mt-3 max-h-56 overflow-y-auto space-y-1.5">
//               {Object.entries(rowErrors).map(([idx, msg]) => (
//                 <li
//                   key={idx}
//                   className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
//                 >
//                   Row {Number(idx) + 1} ({get(rows[Number(idx)] ?? [], "Full Name") || "-"}): {msg}
//                 </li>
//               ))}
//             </ul>

//             <div className="mt-4 flex items-center justify-end gap-2">
//               <Button variant="outline" onClick={() => setShowErrorModal(false)}>
//                 Close
//               </Button>
//               {uploadedCount === null && (
//                 <Button onClick={handleRemoveErrorRows} disabled={rows.length - errorCount === 0}>
//                   Remove error rows
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BulkUploads;




import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, UploadCloud, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
import { Card, PageHeader, Button, Badge } from "@/components/ui";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { tenantService } from "@/service/tenantcreationservices";
import { tenantNotificationService } from "@/service/tenantnotificationservices";
import type { AvailabilityConflict } from "@/service/tenantnotificationservices";
import { identityTypeService } from "@/service/identitytypeservice";
import { visitorTypeService } from "@/service/visitortypeservice";
import type { VisitorTypeRecord } from "@/service/visitortypeservice";
import { apiErrorMessage } from "@/service/visitorservices";
import { preRegistrationService } from "@/service/preregistrationservices";
import { bulkPreRegistrationService } from "@/service/bulkpreregistrationservices";
import type {
  BulkCreateData,
  BulkPayload,
  BulkPersonStatus,
  BulkSummary,
  BulkValidateData,
} from "@/service/bulkpreregistrationservices";
import { userStorage } from "@/utils/storage";
import logoUrl from "../../components/assests/images/logos.jpg";

/* ---------------------------------------------------------------------- */
/* Types / constants                                                       */
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
}

interface IdentityTypeRecord {
  guid: string;
  identity_type_name: string;
  identity_number_validation: string;
  identity_number_digits?: number | null;
  identity_number_alphabets?: number | null;
  identity_number_format?: string;
  phone_number_validation?: string;
  phone_number_min?: number | null;
  phone_number_max?: number | null;
  phone_number_starting_with?: string;
  phone_number_format?: string;
}

type ValidationState = "idle" | "validating" | "passed" | "failed";

// Template columns. Company columns only for contractor-type visitors.
const BASE_HEADERS = ["S.No", "Full Name", "Identity Type", "Identity Number", "Contact", "Email"];
const COMPANY_HEADERS = ["Company Name", "Company Phone"];
const TAIL_HEADERS = ["Vehicle", "Remark"];

const getHeaders = (withCompany: boolean) => [
  ...BASE_HEADERS,
  ...(withCompany ? COMPANY_HEADERS : []),
  ...TAIL_HEADERS,
];

const COMPANY_VISITOR_TYPES = ["contractor", "contructor"];
const isCompanyType = (name?: string) =>
  COMPANY_VISITOR_TYPES.includes((name ?? "").trim().toLowerCase());

const SETUP_MESSAGE =
  "Please select Site, Location, From/To dates, Visitor Type and Approver first.";

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

// yyyy-mm-dd -> dd-mm-yyyy
const fmtDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${d.getFullYear()}`;
};

/* ---------------------------------------------------------------------- */
/* Cell parsing helper                                                     */
/* ---------------------------------------------------------------------- */

// Excel cell -> trimmed string
const cellToString = (v: unknown): string => {
  if (v == null) return "";
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    const o = v as { text?: unknown; result?: unknown; richText?: { text: string }[] };
    if (o.richText) return o.richText.map((r) => r.text).join("").trim();
    if (o.text != null) return String(o.text).trim();
    if (o.result != null) return cellToString(o.result);
    return "";
  }
  return String(v).trim();
};

const normalizeHeader = (s: string) => s.toLowerCase().replace(/\s+/g, "");

/* ---------------------------------------------------------------------- */
/* Rule descriptions (shown on the "Identity Rules" sheet)                 */
/* ---------------------------------------------------------------------- */

const identityRuleText = (t: IdentityTypeRecord): string => {
  if (t.identity_number_validation === "Not Required") return "Not required";

  const parts: string[] = [];
  if (t.identity_number_digits != null) parts.push(`${t.identity_number_digits} digit(s)`);
  if (t.identity_number_alphabets != null) parts.push(`${t.identity_number_alphabets} letter(s)`);

  let text = parts.length ? parts.join(" followed by ") : "Any value";
  if (t.identity_number_format) text += ` (format ${t.identity_number_format})`;

  return t.identity_number_validation === "Optional" ? `Optional. ${text}` : text;
};

const contactRuleText = (t: IdentityTypeRecord): string => {
  if (t.phone_number_validation === "Not Required") return "Not required";

  const parts: string[] = ["digits only"];
  const min = t.phone_number_min;
  const max = t.phone_number_max;
  if (min != null && max != null && min === max) parts.push(`${min} digits`);
  else {
    if (min != null) parts.push(`at least ${min} digits`);
    if (max != null) parts.push(`at most ${max} digits`);
  }
  if (t.phone_number_starting_with) parts.push(`starting with ${t.phone_number_starting_with}`);

  let text = parts.join(", ");
  if (t.phone_number_format) text += ` (format ${t.phone_number_format})`;

  return t.phone_number_validation === "Optional" ? `Optional. ${text}` : text;
};

/* ---------------------------------------------------------------------- */
/* Template download                                                       */
/* logo + purple heading + identity type dropdown + number validation      */
/* ---------------------------------------------------------------------- */

const TEMPLATE_PURPLE = "FF6D28D9";
const RULES_SHEET = "Identity Rules";
const DATA_ROWS = 100;

const downloadTemplate = async (
  headers: string[],
  visitorTypeName: string,
  identityTypes: IdentityTypeRecord[]
) => {
  const { default: ExcelJS } = await import("exceljs");
  const wb = new ExcelJS.Workbook();

  // main sheet first (the upload reads the first sheet)
  const ws = wb.addWorksheet("Pre-Registration");
  const rs = wb.addWorksheet(RULES_SHEET, { properties: { tabColor: { argb: TEMPLATE_PURPLE } } });

  /* ------------------ Identity Rules sheet ------------------ */
  // A name | B id validation | C digits | D letters | E id format | F id rule text
  // G phone validation | H min | I max | J starts with | K phone format | L phone rule text
  const ruleHeaders = [
    "Identity Type",
    "Identity Number Validation",
    "Digits",
    "Letters",
    "Identity Number Format",
    "Identity Number Rule",
    "Contact Validation",
    "Contact Min Digits",
    "Contact Max Digits",
    "Contact Starts With",
    "Contact Format",
    "Contact Rule",
  ];
  const ruleWidths = [24, 18, 9, 9, 20, 44, 18, 12, 12, 14, 18, 50];

  ruleHeaders.forEach((h, i) => {
    const cell = rs.getRow(1).getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TEMPLATE_PURPLE } };
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    rs.getColumn(i + 1).width = ruleWidths[i];
  });
  rs.getRow(1).height = 30;
  rs.getColumn(10).numFmt = "@"; // "starts with" stays text

  identityTypes.forEach((t, i) => {
    const row = rs.getRow(i + 2);
    row.getCell(1).value = t.identity_type_name;
    row.getCell(2).value = t.identity_number_validation || "Required";
    if (t.identity_number_digits != null) row.getCell(3).value = t.identity_number_digits;
    if (t.identity_number_alphabets != null) row.getCell(4).value = t.identity_number_alphabets;
    row.getCell(5).value = t.identity_number_format || "";
    row.getCell(6).value = identityRuleText(t);
    row.getCell(7).value = t.phone_number_validation || "Required";
    if (t.phone_number_min != null) row.getCell(8).value = t.phone_number_min;
    if (t.phone_number_max != null) row.getCell(9).value = t.phone_number_max;
    row.getCell(10).value = t.phone_number_starting_with ? String(t.phone_number_starting_with) : "";
    row.getCell(11).value = t.phone_number_format || "";
    row.getCell(12).value = contactRuleText(t);
  });

  const lastRule = Math.max(identityTypes.length + 1, 2);
  const R = (col: string) => `'${RULES_SHEET}'!$${col}$2:$${col}$${lastRule}`;

  /* ------------------ main sheet layout ------------------ */
  const lastCol = headers.length;
  const HEADER_ROW = 4;
  const FIRST_ROW = HEADER_ROW + 1;
  const LAST_ROW = HEADER_ROW + DATA_ROWS;

  headers.forEach((h, i) => {
    ws.getColumn(i + 1).width = h === "S.No" ? 8 : h === "Remark" ? 30 : 20;
  });

  // rows 1-3: logo + title
  [1, 2, 3].forEach((n) => (ws.getRow(n).height = 22));

  try {
    const res = await fetch(logoUrl);
    const buf = await res.arrayBuffer();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageId = wb.addImage({ buffer: buf as any, extension: "jpeg" });
    ws.addImage(imageId, {
      tl: { col: 0.1, row: 0.15 },
      ext: { width: 150, height: 58 },
    });
  } catch {
    /* template still downloads without the logo */
  }

  if (lastCol > 3) {
    ws.mergeCells(1, 4, 3, lastCol);
    const title = ws.getCell(1, 4);
    title.value = `Pre-Registration Bulk Upload — ${visitorTypeName}`;
    title.font = { bold: true, size: 14, color: { argb: TEMPLATE_PURPLE } };
    title.alignment = { vertical: "middle", horizontal: "center" };
  }

  // row 4: purple heading
  const headerRow = ws.getRow(HEADER_ROW);
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: TEMPLATE_PURPLE } };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = { bottom: { style: "thin", color: { argb: "FFD8CCFB" } } };
  });
  headerRow.height = 22;

  /* ------------------ columns used by the checks ------------------ */
  const idTypeCol = headers.indexOf("Identity Type") + 1;
  const idNoCol = headers.indexOf("Identity Number") + 1;
  const contactCol = headers.indexOf("Contact") + 1;

  // hidden helper columns, one empty column after the last visible one
  const idxCol = lastCol + 2;
  const dgCol = lastCol + 3;
  const alCol = lastCol + 4;
  const idOkCol = lastCol + 5;
  const phOkCol = lastCol + 6;
  [idxCol, dgCol, alCol, idOkCol, phOkCol].forEach((c) => {
    ws.getColumn(c).hidden = true;
  });

  const L = (c: number) => ws.getColumn(c).letter;

  const textCols = ["Identity Number", "Contact", "Company Phone"]
    .map((h) => headers.indexOf(h) + 1)
    .filter((c) => c > 0);

  for (let r = FIRST_ROW; r <= LAST_ROW; r++) {
    const row = ws.getRow(r);
    row.getCell(1).value = r - HEADER_ROW;

    // keep ids / phone numbers as plain text so Excel doesn't reformat them
    textCols.forEach((c) => {
      row.getCell(c).numFmt = "@";
    });

    const typeRef = `$${L(idTypeCol)}${r}`;
    const idNo = `$${L(idNoCol)}${r}`;
    const ph = `$${L(contactCol)}${r}`;
    const idx = `$${L(idxCol)}${r}`;
    const dg = `$${L(dgCol)}${r}`;
    const al = `$${L(alCol)}${r}`;

    // position of the chosen identity type on the rules sheet (0 = none)
    row.getCell(idxCol).value = { formula: `IFERROR(MATCH(${typeRef},${R("A")},0),0)` };
    row.getCell(dgCol).value = {
      formula: `IF(${idx}=0,0,N(INDEX(${R("C")},${idx})))`,
    };
    row.getCell(alCol).value = {
      formula: `IF(${idx}=0,0,N(INDEX(${R("D")},${idx})))`,
    };

    /* ---- Identity Number check ---- */
    const idRule = `INDEX(${R("B")},${idx})&""`;
    const digitsOk = `IF(${dg}=0,TRUE,SUMPRODUCT(--ISNUMBER(FIND(MID(${idNo},ROW(INDIRECT("1:"&${dg})),1),"0123456789")))=${dg})`;
    const lettersOk = `IF(${al}=0,TRUE,SUMPRODUCT(--(CODE(UPPER(MID(${idNo},${dg}+ROW(INDIRECT("1:"&${al})),1)))>=65),--(CODE(UPPER(MID(${idNo},${dg}+ROW(INDIRECT("1:"&${al})),1)))<=90))=${al})`;

    row.getCell(idOkCol).value = {
      formula:
        `IFERROR(IF(${idx}=0,FALSE,IF(${idRule}="Not Required",TRUE,` +
        `IF(LEN(${idNo})=0,${idRule}="Optional",` +
        `IF(${dg}+${al}=0,TRUE,` +
        `IF(LEN(${idNo})<>${dg}+${al},FALSE,AND(${digitsOk},${lettersOk})))))),FALSE)`,
    };

    /* ---- Contact check ---- */
    const phRule = `INDEX(${R("G")},${idx})&""`;
    const mn = `N(INDEX(${R("H")},${idx}))`;
    const mx = `N(INDEX(${R("I")},${idx}))`;
    const sw = `INDEX(${R("J")},${idx})&""`;
    const digitsOnly = `SUMPRODUCT(--ISNUMBER(FIND(MID(${ph},ROW(INDIRECT("1:"&LEN(${ph}))),1),"0123456789")))=LEN(${ph})`;

    row.getCell(phOkCol).value = {
      formula:
        `IFERROR(IF(${idx}=0,FALSE,IF(${phRule}="Not Required",TRUE,` +
        `IF(LEN(${ph})=0,${phRule}="Optional",` +
        `AND(${digitsOnly},IF(${mn}>0,LEN(${ph})>=${mn},TRUE),IF(${mx}>0,LEN(${ph})<=${mx},TRUE),` +
        `IF(${sw}="",TRUE,ISNUMBER(FIND(LEFT(${ph},1),${sw}))))))),FALSE)`,
    };

    /* ---- validations on the visible cells ---- */
    if (identityTypes.length > 0) {
      row.getCell(idTypeCol).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [R("A")],
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Invalid Identity Type",
        error: "Please pick an identity type from the dropdown.",
      };
    }

    row.getCell(idNoCol).dataValidation = {
      type: "custom",
      allowBlank: true,
      formulae: [`$${L(idOkCol)}${r}`],
      showInputMessage: true,
      promptTitle: "Identity Number",
      prompt: "Select the Identity Type first. See the 'Identity Rules' sheet for the format.",
      showErrorMessage: true,
      errorStyle: "stop",
      errorTitle: "Invalid Identity Number",
      error:
        "This identity number does not match the rule for the selected Identity Type. Select the Identity Type first and check the 'Identity Rules' sheet.",
    };

    row.getCell(contactCol).dataValidation = {
      type: "custom",
      allowBlank: true,
      formulae: [`$${L(phOkCol)}${r}`],
      showInputMessage: true,
      promptTitle: "Contact",
      prompt: "Select the Identity Type first. See the 'Identity Rules' sheet for the rule.",
      showErrorMessage: true,
      errorStyle: "stop",
      errorTitle: "Invalid Contact Number",
      error:
        "This contact number does not match the rule for the selected Identity Type. Select the Identity Type first and check the 'Identity Rules' sheet.",
    };
  }

  // red highlight for values that break the rule (also catches pasted values)
  const redStyle = {
    fill: {
      type: "pattern" as const,
      pattern: "solid" as const,
      bgColor: { argb: "FFFECACA" },
    },
    font: { color: { argb: "FF991B1B" } },
  };

  ws.addConditionalFormatting({
    ref: `${L(idNoCol)}${FIRST_ROW}:${L(idNoCol)}${LAST_ROW}`,
    rules: [
      {
        type: "expression",
        priority: 1,
        formulae: [`AND(LEN($${L(idNoCol)}${FIRST_ROW})>0,NOT($${L(idOkCol)}${FIRST_ROW}))`],
        style: redStyle,
      },
    ],
  });

  ws.addConditionalFormatting({
    ref: `${L(contactCol)}${FIRST_ROW}:${L(contactCol)}${LAST_ROW}`,
    rules: [
      {
        type: "expression",
        priority: 2,
        formulae: [`AND(LEN($${L(contactCol)}${FIRST_ROW})>0,NOT($${L(phOkCol)}${FIRST_ROW}))`],
        style: redStyle,
      },
    ],
  });

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Pre_Registration_${visitorTypeName.replace(/\s+/g, "_")}_Template.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/* ---------------------------------------------------------------------- */
/* Small select component (outside the page so it doesn't remount)         */
/* ---------------------------------------------------------------------- */

interface DropdownProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
}

const Dropdown = ({ label, value, onChange, options, placeholder, disabled }: DropdownProps) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label} <span className="text-red-500">*</span>
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

/* ---------------------------------------------------------------------- */
/* Page                                                                     */
/* ---------------------------------------------------------------------- */

const BulkUploads = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----- logged-in user / site scope -----
  const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;

  const [allSites, setAllSites] = useState<SiteDropdownItem[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(isSuperAdmin);

  useEffect(() => {
    if (!isSuperAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await userService.siteDropdown();
        if (!cancelled && res.success && res.data) setAllSites(res.data.results ?? []);
      } finally {
        if (!cancelled) setIsLoadingSites(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin]);

  const siteOptions: Option[] = useMemo(
    () =>
      isSuperAdmin
        ? allSites.map((s) => ({ label: `${s.site_name} (${s.site_model.name})`, value: s.guid }))
        : ownSite
        ? [{ label: ownSite.name, value: ownSite.guid }]
        : [],
    [isSuperAdmin, allSites, ownSite]
  );

  const [siteGuid, setSiteGuid] = useState("");
  useEffect(() => {
    if (!isSuperAdmin && ownSite?.guid) setSiteGuid(ownSite.guid);
  }, [isSuperAdmin, ownSite]);

  // ----- location + approvers (depend on site) -----
  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationGuid, setLocationGuid] = useState("");
  const [locationLabel, setLocationLabel] = useState("");

  const [approverOptions, setApproverOptions] = useState<Option[]>([]);
  const [isLoadingApprovers, setIsLoadingApprovers] = useState(false);
  const [approverEmail, setApproverEmail] = useState("");

  // ----- visit window (applies to every row) -----
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const isTimeRangeValid =
    (!fromTime && !toTime) ||
    (!!fromTime && !!toTime && (fromDate !== toDate || toTime > fromTime));

  // ----- availability for Location + date range -----
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availabilityAvailable, setAvailabilityAvailable] = useState(false);
  const [availabilityConflicts, setAvailabilityConflicts] = useState<AvailabilityConflict[]>([]);
  const [availabilityError, setAvailabilityError] = useState("");
  const availabilityRequestId = useRef(0);

  const resetAvailability = () => {
    availabilityRequestId.current += 1;
    setIsCheckingAvailability(false);
    setAvailabilityChecked(false);
    setAvailabilityAvailable(false);
    setAvailabilityConflicts([]);
    setAvailabilityError("");
  };

  const checkAvailability = async (loc: string, from: string, to: string) => {
    resetAvailability();
    const requestId = availabilityRequestId.current;
    setIsCheckingAvailability(true);
    try {
      const res = await tenantNotificationService.checkAvailability(loc, from, to);
      if (requestId !== availabilityRequestId.current) return;

      if (res.success && res.data) {
        setAvailabilityChecked(true);
        setAvailabilityAvailable(res.data.available);
        setAvailabilityConflicts(res.data.conflicts);
      } else {
        setAvailabilityError(res.message || "Could not check availability.");
      }
    } catch {
      if (requestId !== availabilityRequestId.current) return;
      setAvailabilityError("Could not check availability. Please try again.");
    } finally {
      if (requestId === availabilityRequestId.current) setIsCheckingAvailability(false);
    }
  };

  // site changed -> reload locations + approvers, clear everything below
  useEffect(() => {
    setLocationGuid("");
    setLocationLabel("");
    setApproverEmail("");
    setLocationOptions([]);
    setApproverOptions([]);
    setFromDate("");
    setToDate("");
    resetAvailability();
    if (!siteGuid) return;

    let cancelled = false;
    const siteName = siteOptions.find((s) => s.value === siteGuid)?.label || "";

    (async () => {
      setIsLoadingLocations(true);
      setIsLoadingApprovers(true);

      try {
        const res = await tenantService.list(1, 100, "", {
          site_guid: siteGuid,
          site_name: siteName,
        });
        if (!cancelled && res.success && res.data) {
          setLocationOptions(
            res.data.results.map((t) => ({
              label: `${t.tenant_name} (${t.block}/${t.floor}/${t.unit})`,
              value: t.guid,
            }))
          );
        }
      } catch {
        /* leave empty */
      } finally {
        if (!cancelled) setIsLoadingLocations(false);
      }

      try {
        const res = await preRegistrationService.approverDropdown(siteGuid);
        if (!cancelled && res.success && res.data) {
          setApproverOptions(
            res.data.results.map((a) => {
              const who = a.full_name ? `${a.full_name} — ${a.email}` : a.email;
              return { label: a.role ? `${who} (${a.role.name})` : who, value: a.email };
            })
          );
        }
      } catch {
        /* leave empty */
      } finally {
        if (!cancelled) setIsLoadingApprovers(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteGuid]);

  // Picking a location clears the dates; availability is checked once both are set.
  const handleLocationChange = (value: string) => {
    setLocationGuid(value);
    setLocationLabel(locationOptions.find((o) => o.value === value)?.label || "");
    setFromDate("");
    setToDate("");
    resetAvailability();
  };

  const handleFromDateChange = (value: string) => {
    const nextTo = value && toDate && toDate < value ? value : toDate;
    setFromDate(value);
    setToDate(nextTo);

    if (!locationGuid || !value || !nextTo) {
      resetAvailability();
      return;
    }
    checkAvailability(locationGuid, value, nextTo);
  };

  const handleToDateChange = (value: string) => {
    const nextFrom = value && fromDate && value < fromDate ? value : fromDate;
    setToDate(value);
    setFromDate(nextFrom);

    if (!locationGuid || !value || !nextFrom) {
      resetAvailability();
      return;
    }
    checkAvailability(locationGuid, nextFrom, value);
  };

  // ----- identity types + visitor types -----
  const [identityTypes, setIdentityTypes] = useState<IdentityTypeRecord[]>([]);
  const [visitorTypes, setVisitorTypes] = useState<VisitorTypeRecord[]>([]);
  const [isLoadingLookups, setIsLoadingLookups] = useState(true);
  const [visitorTypeGuid, setVisitorTypeGuid] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [idRes, vtRes] = await Promise.all([
          identityTypeService.list("", "", ""),
          visitorTypeService.list(1, 100, ""),
        ]);
        if (cancelled) return;
        if (idRes.success && idRes.data) setIdentityTypes(idRes.data.results);
        if (vtRes.success && vtRes.data) {
          setVisitorTypes((vtRes.data.results ?? []).filter((v) => v.is_active !== false));
        }
      } finally {
        if (!cancelled) setIsLoadingLookups(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visitorTypeOptions: Option[] = useMemo(
    () => visitorTypes.map((v) => ({ label: v.name, value: v.guid })),
    [visitorTypes]
  );

  const selectedVisitorTypeName =
    visitorTypes.find((v) => v.guid === visitorTypeGuid)?.name ?? "";
  const needsCompany = isCompanyType(selectedVisitorTypeName);
  const headers = useMemo(() => getHeaders(needsCompany), [needsCompany]);

  // value of a named column in a parsed row
  const get = (r: string[], name: string) => {
    const i = headers.indexOf(name);
    return i >= 0 ? r[i] ?? "" : "";
  };

  // ----- file + validation state -----
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<string[][]>([]);
  const [rowNos, setRowNos] = useState<number[]>([]); // Excel row number of each parsed row
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
  const [personStatus, setPersonStatus] = useState<Record<number, BulkPersonStatus>>({});
  const [summary, setSummary] = useState<BulkSummary | null>(null);
  const [validation, setValidation] = useState<ValidationState>("idle");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkCreateData | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const errorCount = Object.keys(rowErrors).length;

  const setupReady =
    !!siteGuid &&
    !!locationGuid &&
    !!fromDate &&
    !!toDate &&
    isTimeRangeValid &&
    availabilityChecked &&
    availabilityAvailable &&
    !!visitorTypeGuid &&
    !!approverEmail;

  const resetValidation = () => {
    setValidation("idle");
    setRowErrors({});
    setPersonStatus({});
    setSummary(null);
    setShowErrorModal(false);
  };

  // any change to the setup invalidates an earlier validation result
  useEffect(() => {
    resetValidation();
  }, [siteGuid, locationGuid, fromDate, toDate, fromTime, toTime, approverEmail, visitorTypeGuid]);

  const reset = () => {
    setFileName(null);
    setRows([]);
    setRowNos([]);
    setError("");
    setBulkResult(null);
    resetValidation();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // template differs per visitor type, so a loaded file is dropped on change
  const handleVisitorTypeChange = (value: string) => {
    setVisitorTypeGuid(value);
    reset();
  };

  const handleFileSelect = async (file: File) => {
    setError("");
    setBulkResult(null);
    resetValidation();

    if (!file.name.match(/\.xlsx?$/i)) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    try {
      const { default: ExcelJS } = await import("exceljs");
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const sheet = workbook.worksheets[0];

      // the template has a logo/title above the heading, so find the heading row
      let headerRowNo = 0;
      const scanTo = Math.min(sheet.rowCount, 15);
      for (let n = 1; n <= scanTo; n++) {
        if (normalizeHeader(cellToString(sheet.getRow(n).getCell(1).value)) === "s.no") {
          headerRowNo = n;
          break;
        }
      }

      const mismatchMessage = `This file doesn't match the ${selectedVisitorTypeName} template. Please use the "Download Template" button.`;

      if (!headerRowNo) {
        setError(mismatchMessage);
        return;
      }

      const headerValues = headers.map((_, i) =>
        cellToString(sheet.getRow(headerRowNo).getCell(i + 1).value)
      );
      // the column right after the last heading must stay empty
      const extraCell = cellToString(sheet.getRow(headerRowNo).getCell(headers.length + 1).value);
      const headersMatch =
        !extraCell &&
        headers.every((h, i) => normalizeHeader(h) === normalizeHeader(headerValues[i]));

      if (!headersMatch) {
        setError(mismatchMessage);
        return;
      }

      const parsed: string[][] = [];
      const nos: number[] = [];
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber <= headerRowNo) return;
        const values = headers.map((_, i) => cellToString(row.getCell(i + 1).value));
        // S.No is pre-filled, so a row counts only if another column has data
        if (values.slice(1).some((v) => v !== "")) {
          parsed.push(values);
          nos.push(rowNumber);
        }
      });

      if (parsed.length === 0) {
        setError("No data rows found in this file.");
        return;
      }

      setFileName(file.name);
      setRows(parsed);
      setRowNos(nos);
    } catch {
      setError("Could not read this file. Please make sure it matches the template format.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  /* ---------- API payload (same for validate and submit) ---------- */
  const buildPayload = (): BulkPayload => ({
    site: siteGuid,
    location: locationGuid,
    visitor_type: visitorTypeGuid,
    from_date: fromDate,
    to_date: toDate,
    from_time: fromTime || null,
    to_time: toTime || null,
    approver_email: approverEmail,
    rows: rows.map((r, i) => ({
      row_no: rowNos[i],
      person_name: get(r, "Full Name"),
      identity_type: get(r, "Identity Type"),
      identity_number: get(r, "Identity Number"),
      phone_number: get(r, "Contact"),
      email: get(r, "Email"),
      company: needsCompany ? get(r, "Company Name") : "",
      company_phone: needsCompany ? get(r, "Company Phone") : "",
      vehicle_number: get(r, "Vehicle"),
      remark: get(r, "Remark"),
    })),
  });

  // server row results -> table / popup state. Returns the number of bad rows.
  const applyRowResults = (data: BulkValidateData): number => {
    const indexByRowNo = new Map(rowNos.map((n, i) => [n, i]));
    const errs: Record<number, string> = {};
    const people: Record<number, BulkPersonStatus> = {};

    data.rows.forEach((r) => {
      const i = indexByRowNo.get(r.row_no);
      if (i === undefined) return;
      if (r.error) errs[i] = r.error;
      else if (r.person_status) people[i] = r.person_status;
    });

    setRowErrors(errs);
    setPersonStatus(people);
    setSummary(data.summary);
    return Object.keys(errs).length;
  };

  /* ---------- 1) Validate ---------- */
  const handleValidate = async () => {
    setError("");
    if (!setupReady) {
      setError(SETUP_MESSAGE);
      return;
    }

    setValidation("validating");
    try {
      const res = await bulkPreRegistrationService.validate(buildPayload());
      if (res.success && res.data) {
        const bad = applyRowResults(res.data);
        if (bad === 0) {
          setValidation("passed");
        } else {
          setValidation("failed");
          setShowErrorModal(true);
        }
      } else {
        setValidation("idle");
        setError(res.message || "Validation failed.");
      }
    } catch (err) {
      setValidation("idle");
      setError(apiErrorMessage(err, "Validation failed. Please try again."));
    }
  };

  /* ---------- 2) Submit (only after validation passed) ---------- */
  const handleSubmit = async () => {
    if (validation !== "passed") return;
    setError("");
    setIsSubmitting(true);
    try {
      const res = await bulkPreRegistrationService.create(buildPayload());

      if (res.success && res.data && "bulk_id" in res.data) {
        setBulkResult(res.data);
        setRows([]);
        setRowNos([]);
        resetValidation();
      } else if (res.data && "rows" in res.data) {
        // data changed since validation (e.g. someone else registered the same person)
        applyRowResults(res.data);
        setValidation("failed");
        setShowErrorModal(true);
      } else {
        setError(res.message || "Bulk upload failed.");
      }
    } catch (err) {
      setError(apiErrorMessage(err, "Bulk upload failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // popup button: drop invalid rows, keep the good ones, validate again
  const handleRemoveErrorRows = () => {
    const keep = rows.map((_, i) => !(i in rowErrors));
    setRows((prev) => prev.filter((_, i) => keep[i]));
    setRowNos((prev) => prev.filter((_, i) => keep[i]));
    resetValidation();
  };

  const allDone = bulkResult !== null && rows.length === 0;
  const dropzoneDisabled = !setupReady;
  const showPersonCol = Object.keys(personStatus).length > 0;

  return (
    <div>
      <button
        onClick={() => navigate("/pre-registration")}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 mb-3"
      >
        <ArrowLeft size={15} />
        Back to Pre-Registration
      </button>

      <PageHeader
        title="Bulk Upload — Pre-Registration"
        description="Upload multiple pre-registration requests at once using the Excel template."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ---------------- Step 1 ---------------- */}
        <Card title="Step 1 — Download Template" className="lg:col-span-1 h-fit">
          <div className="mb-4">
            <Dropdown
              label="Visitor Type"
              value={visitorTypeGuid}
              onChange={handleVisitorTypeChange}
              options={visitorTypeOptions}
              placeholder={isLoadingLookups ? "Loading..." : "Select visitor type"}
              disabled={isLoadingLookups}
            />
          </div>

          {visitorTypeGuid ? (
            <>
              <p className="text-sm text-slate-500 mb-3">
                Download the template and fill in one visitor per row. Visit dates and times are
                chosen on this page, not in the file.
              </p>
              <p className="text-sm text-slate-500 mb-3">
                In the file, pick the Identity Type first. The Identity Number and Contact are then
                checked against that type's rules (see the "Identity Rules" sheet).
              </p>
              <p className="text-xs text-slate-400 mb-4">Columns: {headers.join(", ")}.</p>
            </>
          ) : (
            <p className="text-sm text-slate-500 mb-4">
              Select the visitor type first. The template columns depend on it.
            </p>
          )}

          <Button
            variant="outline"
            icon={<Download size={16} />}
            fullWidth
            disabled={!visitorTypeGuid || isLoadingLookups}
            onClick={() => downloadTemplate(headers, selectedVisitorTypeName, identityTypes)}
          >
            Download Template
          </Button>
        </Card>

        {/* ---------------- Step 2 ---------------- */}
        <Card title="Step 2 — Upload File" className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Dropdown
              label="Site"
              value={siteGuid}
              onChange={setSiteGuid}
              options={siteOptions}
              placeholder={isLoadingSites ? "Loading sites..." : "Select site"}
              disabled={isLoadingSites || (!isSuperAdmin && siteOptions.length <= 1)}
            />
            <Dropdown
              label="Location"
              value={locationGuid}
              onChange={handleLocationChange}
              options={locationOptions}
              placeholder={
                !siteGuid
                  ? "Select site first"
                  : isLoadingLocations
                  ? "Loading locations..."
                  : "Select location"
              }
              disabled={!siteGuid || isLoadingLocations}
            />

            <label className="text-sm font-medium text-slate-700">
              From Date <span className="text-red-500">*</span>
              <input
                type="date"
                value={fromDate}
                min={getToday()}
                max={toDate || undefined}
                disabled={!locationGuid}
                onChange={(e) => handleFromDateChange(e.target.value)}
                className={`${fieldClass} mt-1.5`}
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              To Date <span className="text-red-500">*</span>
              <input
                type="date"
                value={toDate}
                min={fromDate || getToday()}
                disabled={!locationGuid}
                onChange={(e) => handleToDateChange(e.target.value)}
                className={`${fieldClass} mt-1.5`}
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              From Time
              <input
                type="time"
                value={fromTime}
                disabled={!locationGuid}
                onChange={(e) => setFromTime(e.target.value)}
                className={`${fieldClass} mt-1.5`}
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              To Time
              <input
                type="time"
                value={toTime}
                disabled={!locationGuid}
                onChange={(e) => setToTime(e.target.value)}
                className={`${fieldClass} mt-1.5`}
              />
            </label>

            <Dropdown
              label="Approver"
              value={approverEmail}
              onChange={setApproverEmail}
              options={approverOptions}
              placeholder={
                !siteGuid
                  ? "Select site first"
                  : isLoadingApprovers
                  ? "Loading approvers..."
                  : approverOptions.length === 0
                  ? "No approvers for this site"
                  : "Select approver"
              }
              disabled={!siteGuid || isLoadingApprovers || approverOptions.length === 0}
            />
          </div>

          {/* availability + time messages */}
          <div className="space-y-2 mb-4 -mt-1">
            {isCheckingAvailability && (
              <p className="text-xs text-slate-500">Checking availability...</p>
            )}

            {availabilityError && <p className="text-xs text-red-600">{availabilityError}</p>}

            {availabilityChecked && availabilityAvailable && (
              <p className="text-xs text-emerald-600">
                {locationLabel || "This location"} is available from {fmtDate(fromDate)} to{" "}
                {fmtDate(toDate)}.
              </p>
            )}

            {availabilityChecked && !availabilityAvailable && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5">
                <p className="text-xs font-medium text-red-600 mb-1">
                  Not available for the selected dates. Already booked:
                </p>
                <ul className="text-xs text-red-600 space-y-0.5">
                  {availabilityConflicts.map((c, i) => (
                    <li key={i}>
                      {c.from_date} to {c.to_date}
                      {c.message ? ` — ${c.message}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!isTimeRangeValid && (
              <p className="text-xs text-red-600">
                Enter both times, and make To Time later than From Time.
              </p>
            )}

            {needsCompany && (
              <p className="text-xs text-slate-500">
                This visitor type needs Company Name and a 10-digit Company Phone in every row.
              </p>
            )}
          </div>

          {!fileName ? (
            <div
              onDragOver={(e) => !dropzoneDisabled && e.preventDefault()}
              onDrop={(e) => {
                if (dropzoneDisabled) {
                  e.preventDefault();
                  setError(SETUP_MESSAGE);
                  return;
                }
                handleDrop(e);
              }}
              onClick={() => {
                if (dropzoneDisabled) {
                  setError(SETUP_MESSAGE);
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
                    <p className="text-xs text-slate-500">{rows.length} rows pending</p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  disabled={isSubmitting || validation === "validating"}
                  className="text-slate-400 hover:text-red-600"
                >
                  <X size={18} />
                </button>
              </div>

              {rows.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-primary-50 mb-4 max-h-72 overflow-y-auto">
                  <table className="w-full text-sm text-left border-collapse min-w-[700px]">
                    <thead className="sticky top-0 bg-primary-50/90">
                      <tr>
                        {headers.map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-xs font-semibold text-primary-800 uppercase whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                        {showPersonCol && (
                          <th className="px-3 py-2 text-xs font-semibold text-primary-800 uppercase">
                            Person
                          </th>
                        )}
                        {errorCount > 0 && (
                          <th className="px-3 py-2 text-xs font-semibold text-red-700 uppercase">
                            Error
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr
                          key={i}
                          className={`border-t border-slate-100 ${i in rowErrors ? "bg-red-50" : ""}`}
                        >
                          {headers.map((_, ci) => (
                            <td key={ci} className="px-3 py-2 text-slate-700 whitespace-nowrap">
                              {r[ci] || "-"}
                            </td>
                          ))}
                          {showPersonCol && (
                            <td className="px-3 py-2 whitespace-nowrap">
                              {personStatus[i] ? (
                                <Badge variant={personStatus[i] === "NEW" ? "info" : "success"}>
                                  {personStatus[i] === "NEW" ? "New" : "Existing"}
                                </Badge>
                              ) : (
                                ""
                              )}
                            </td>
                          )}
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

              {validation === "passed" && summary && (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3.5 py-2.5 text-sm mb-3">
                  <CheckCircle2 size={16} />
                  All {summary.total} rows are valid ({summary.new_persons} new,{" "}
                  {summary.existing_persons} existing). You can submit now.
                </div>
              )}

              {validation === "failed" && errorCount > 0 && (
                <div className="flex items-center justify-between gap-2 text-red-700 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 text-sm mb-3">
                  <span>
                    {errorCount} of {rows.length} rows have issues. Nothing was submitted.
                  </span>
                  <button
                    onClick={() => setShowErrorModal(true)}
                    className="text-xs font-medium underline"
                  >
                    View errors
                  </button>
                </div>
              )}

              {bulkResult && (
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3.5 py-2.5 text-sm mb-3">
                  <CheckCircle2 size={16} />
                  {bulkResult.created} pre-registration{bulkResult.created > 1 ? "s" : ""} created
                  under Bulk ID {bulkResult.bulk_id}. Sent to the approver.
                </div>
              )}

              {allDone ? (
                <div className="flex items-center gap-2">
                  <Button onClick={() => navigate("/pre-registration")}>
                    Go to Pre-Registration
                  </Button>
                  <Button variant="outline" onClick={reset}>
                    Upload another file
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {validation === "passed" ? (
                    <Button onClick={handleSubmit} disabled={isSubmitting || rows.length === 0}>
                      {isSubmitting ? "Submitting..." : `Submit ${rows.length} Records`}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleValidate}
                      disabled={rows.length === 0 || dropzoneDisabled || validation === "validating"}
                    >
                      {validation === "validating" ? "Validating..." : "Validate"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={reset}
                    disabled={isSubmitting || validation === "validating"}
                  >
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
          Tip: keep the template's heading row and hidden columns as they are. The selected dates,
          times, location and approver apply to every row. Click Validate first; Submit appears
          only when every row is clean.
        </Badge>
      </div>

      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-base font-semibold text-slate-800">
              {errorCount} row{errorCount > 1 ? "s" : ""} need attention
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Fix these rows in your Excel file and upload it again, or remove them and validate
              the remaining {Math.max(rows.length - errorCount, 0)} record(s).
            </p>

            <ul className="mt-3 max-h-56 overflow-y-auto space-y-1.5">
              {Object.entries(rowErrors).map(([idx, msg]) => (
                <li
                  key={idx}
                  className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  Excel row {rowNos[Number(idx)]} (
                  {get(rows[Number(idx)] ?? [], "Full Name") || "-"}): {msg}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setShowErrorModal(false)}>
                Close
              </Button>
              <Button onClick={handleRemoveErrorRows} disabled={rows.length - errorCount === 0}>
                Remove error rows
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUploads;
