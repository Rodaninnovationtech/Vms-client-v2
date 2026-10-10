import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, UploadCloud, FileSpreadsheet, X, CheckCircle2 } from "lucide-react";
import { Card, PageHeader, Button, Badge } from "@/components/ui";
import { downloadTenantTemplate } from "@/utils/excelTemplates";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { userStorage } from "@/utils/storage";
import { tenantService } from "@/service/tenantcreationservices";

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

const BACK_PATH = "/system-config/tenant";

// Must match the template exactly (see downloadTenantTemplate)
const HEADERS = [
  "S.No",
  "First Name",
  "Last Name",
  "Contact",
  "Email",
  "Tenant Location Name",
  "Block",
  "Floor",
  "Unit",
];

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

// Excel cells can be numbers, hyperlinks (emails!), rich text, formulas...
const cellToString = (v: any): string => {
  if (v == null) return "";
  if (typeof v === "object") {
    if (Array.isArray(v.richText)) return v.richText.map((t: any) => t.text).join("").trim();
    if (v.text != null) return String(v.text).trim(); // hyperlink cell
    if (v.result != null) return String(v.result).trim(); // formula cell
    if (v instanceof Date) return v.toISOString();
  }
  return String(v).trim();
};

const BulkUploadTenant = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----- logged-in user / site scope (same pattern as TenantCreation) -----
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
    if (!isSuperAdmin) return;
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

  // Super admin = every site, others = only their own site
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

  useEffect(() => {
    if (!isSuperAdmin && ownSite?.guid) setSiteGuid(ownSite.guid);
  }, [isSuperAdmin, ownSite]);

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
        const raw = (row.values as any[]).slice(1);
        // make sure every row has all columns, even if trailing cells are empty
        const values = HEADERS.map((_, i) => cellToString(raw[i]));
        if (rowNumber === 1) {
          headerRow = values;
          return;
        }
        if (values.slice(1).some((v) => v !== "")) parsedRows.push(values);
      });

      const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, "");
      const expected = HEADERS.map(normalize);
      const actual = headerRow.map(normalize);
      const headersMatch = expected.every((h, i) => h === actual[i]);

      if (!headersMatch) {
        setError(
          `This file doesn't match the Tenant template. Please use the "Download Tenant Template" button above.`
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

  // columns: [S.No, First Name, Last Name, Contact, Email, Tenant Location Name, Block, Floor, Unit]
  const submitRows = async (rowsToSend: string[][]) => {
    setError("");
    setRowErrors({});

    if (!siteGuid) {
      setError("Please select a site before uploading.");
      return;
    }

    if (rowsToSend.length === 0) {
      setError("No rows left to upload.");
      return;
    }

    const payload = rowsToSend.map((r) => ({
      first_name: (r[1] || "").trim(),
      last_name: (r[2] || "").trim(),
      contact: (r[3] || "").trim(),
      email: (r[4] || "").trim(),
      tenant_name: (r[5] || "").trim(),
      block: (r[6] || "").trim(),
      floor: (r[7] || "").trim(),
      unit: (r[8] || "").trim(),
      site: siteGuid,
    }));

    for (let i = 0; i < payload.length; i++) {
      const p = payload[i];
      if (!p.first_name) return setError(`Row ${i + 1}: First Name is required`);
      if (!p.last_name) return setError(`Row ${i + 1}: Last Name is required`);
      if (!p.contact) return setError(`Row ${i + 1}: Contact is required`);
      if (!p.email) return setError(`Row ${i + 1}: Email is required`);
      if (!/^\S+@\S+\.\S+$/.test(p.email)) return setError(`Row ${i + 1}: Enter a valid email`);
      if (!p.tenant_name) return setError(`Row ${i + 1}: Tenant Location Name is required`);
      if (!p.block) return setError(`Row ${i + 1}: Block is required`);
      if (!p.floor) return setError(`Row ${i + 1}: Floor is required`);
      if (!p.unit) return setError(`Row ${i + 1}: Unit is required`);
    }

    setIsSubmitting(true);
    try {
      // NOTE: backend must accept an array (same as keyService / passService).
    const res = await tenantService.create(payload);
      if (!res.success) {
        const list = res.errors as unknown;

        // per-row errors from the backend: [{row, message}]
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
    // } catch (err: any) {
    //   const data = err?.response?.data;
    //   setError(flattenErrors(data?.errors) || data?.message || "Upload failed. Please try again.");
    // } finally {
        } catch (err: any) {
      const data = err?.response?.data;
      const list = data?.errors as unknown;

      // per-row errors from the backend: [{row, message}]
      if (
        Array.isArray(list) &&
        list.length > 0 &&
        list.every((e: any) => e && typeof e.row === "number")
      ) {
        const map: Record<number, string> = {};
        list.forEach((e: { row: number; message: string }) => {
          map[e.row - 1] = e.message;
        });
        setRowErrors(map);
        setShowErrorModal(true);
        return;
      }

      setError(flattenErrors(data?.errors) || data?.message || "Upload failed. Please try again.");
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

  const dropzoneDisabled = !siteGuid;

  return (
    <div>
      <button
        onClick={() => navigate(BACK_PATH)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 mb-3"
      >
        <ArrowLeft size={15} />
        Back to Tenant
      </button>

      <PageHeader
        title="Bulk Upload — Tenant"
        description="Upload multiple tenant records at once using the Excel template."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Step 1 — Download Template" className="lg:col-span-1 h-fit">
          <p className="text-sm text-slate-500 mb-4">
            Download the Excel template, fill in your tenant details and re-upload it. Columns:{" "}
            {HEADERS.join(", ")}.
          </p>
          <Button
            variant="outline"
            icon={<Download size={16} />}
            fullWidth
            onClick={() => downloadTenantTemplate()}
          >
            Download Tenant Template
          </Button>
        </Card>

        <Card title="Step 2 — Upload File" className="lg:col-span-2">
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
              <option value="">{isLoadingSites ? "Loading sites..." : "Select site"}</option>
              {siteOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {!fileName ? (
            <div
              onDragOver={(e) => !dropzoneDisabled && e.preventDefault()}
              onDrop={(e) => {
                if (dropzoneDisabled) {
                  e.preventDefault();
                  setError("Please select a site first.");
                  return;
                }
                handleDrop(e);
              }}
              onClick={() => {
                if (dropzoneDisabled) {
                  setError("Please select a site first.");
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
                  <table className="w-full text-sm text-left border-collapse min-w-[900px]">
                    <thead className="sticky top-0 bg-primary-50/90">
                      <tr>
                        {HEADERS.map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-xs font-semibold text-primary-800 uppercase whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
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
                          {HEADERS.map((_, ci) => (
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
                  {rows.length} tenant records uploaded successfully.
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={rows.length === 0 || dropzoneDisabled || isSubmitting}
                  >
                    {isSubmitting
                      ? "Uploading..."
                      : `Upload ${rows.length > 0 ? `${rows.length} Records` : ""}`}
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
                  Row {Number(idx) + 1} ({rows[Number(idx)]?.[1] || "-"} {rows[Number(idx)]?.[2] || ""},{" "}
                  Unit {rows[Number(idx)]?.[8] || "-"}): {msg}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setShowErrorModal(false)}>
                Close
              </Button>
              <Button onClick={handleRemoveErrorsAndUpload} disabled={rows.length - errorCount === 0}>
                Remove error rows & Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUploadTenant;