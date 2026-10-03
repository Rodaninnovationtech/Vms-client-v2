// // // import { Badge } from "@/components/ui";
// // // import { CrudPage } from "@/components/common";
// // // import type { FormField } from "@/components/common";
// // // import type { TableColumn, BadgeVariant } from "@/types";

// // // interface BanRecord {
// // //   id: string;
// // //   name: string;
// // //   type: string;
// // //   phone: string;
// // //   reason: string;
// // //   bannedOn: string;
// // //   status: string;
// // // }

// // // const statusVariant: Record<string, BadgeVariant> = {
// // //   Active: "danger",
// // //   Lifted: "neutral",
// // // };

// // // const columns: TableColumn<BanRecord>[] = [
// // //   { key: "id", header: "Ban ID" },
// // //   { key: "name", header: "Name" },
// // //   { key: "type", header: "Type" },
// // //   { key: "phone", header: "Phone" },
// // //   { key: "reason", header: "Reason" },
// // //   { key: "bannedOn", header: "Banned On" },
// // //   {
// // //     key: "status",
// // //     header: "Status",
// // //     render: (row) => <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>,
// // //   },
// // // ];

// // // const formFields: FormField[] = [
// // //   { name: "name", label: "Full Name", required: true, placeholder: "Visitor / contractor name" },
// // //   {
// // //     name: "type",
// // //     label: "Type",
// // //     type: "select",
// // //     required: true,
// // //     options: [
// // //       { label: "Visitor", value: "Visitor" },
// // //       { label: "Contractor", value: "Contractor" },
// // //     ],
// // //   },
// // //   { name: "phone", label: "Phone Number", required: true, placeholder: "10-digit mobile number" },
// // //   { name: "reason", label: "Reason for Ban", required: true, placeholder: "e.g. Security violation" },
// // //   { name: "bannedOn", label: "Banned On", placeholder: "DD-MM-YYYY" },
// // //   {
// // //     name: "status",
// // //     label: "Status",
// // //     type: "select",
// // //     options: [
// // //       { label: "Active", value: "Active" },
// // //       { label: "Lifted", value: "Lifted" },
// // //     ],
// // //   },
// // // ];

// // // const initialData: BanRecord[] = [
// // //   { id: "BN-001", name: "Rakesh Nair", type: "Visitor", phone: "9845012345", reason: "Aggressive behavior at gate", bannedOn: "10-09-2026", status: "Active" },
// // //   { id: "BN-002", name: "XYZ Contractors", type: "Contractor", phone: "9812309876", reason: "Safety protocol violation", bannedOn: "02-09-2026", status: "Active" },
// // //   { id: "BN-003", name: "Sandeep Rao", type: "Visitor", phone: "9900123456", reason: "Unauthorized area access", bannedOn: "20-08-2026", status: "Lifted" },
// // // ];

// // // const Ban = () => {
// // //   return (
// // //     <CrudPage
// // //       title="Ban"
// // //       description="Manage banned visitors and contractors across all sites."
// // //       addLabel="Ban"
// // //       idPrefix="BN"
// // //       columns={columns}
// // //       formFields={formFields}
// // //       initialData={initialData}
// // //       searchPlaceholder="Search by name, phone, reason..."
// // //     />
// // //   );
// // // };

// // // export default Ban;





import { useEffect, useMemo, useRef, useState } from "react";
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
  Ban as BanIcon,
  AlertCircle,
  ChevronDown,
  Undo2,
  Pencil,
  Trash2,
} from "lucide-react";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { identityTypeService } from "@/service/identitytypeservice";
import { visitorService, apiErrorMessage } from "@/service/visitorservices";
import type { PersonRecord } from "@/service/visitorservices";
import { banService } from "@/service/banservices";
import type { BanRecord, BanType, BanStatus } from "@/service/banservices";
import { userStorage } from "@/utils/storage";

const BAN_MENU_KEY = "/ban"; // must match the menu_key saved in Role Permissions
const PAGE_SIZE = 10;

// "2026-09-21" or an ISO datetime -> "21-09-2026"
const fmtDate = (value?: string | null) => {
  if (!value) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const banTypeLabel = (t: BanType) => (t === "TEMPORARY" ? "Temporary" : "Permanent");
const banCode = (id: number) => `BN-${String(id).padStart(3, "0")}`;

/* ------------------------------ Types ------------------------------ */

interface SiteOption {
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

interface IdentityTypeRecord {
  guid: string;
  identity_type_name: string;
  identity_number_validation: "Required" | "Optional" | "Not Required" | string;
  identity_number_digits?: number | null;
  identity_number_alphabets?: number | null;
  identity_number_format?: string;
}

/* --------------------------- Static data --------------------------- */

const statusVariant: Record<string, BadgeVariant> = {
  Active: "danger",
  Upcoming: "warning",
  Expired: "neutral",
  Lifted: "neutral",
};

const BAN_TYPE_FILTER: SiteOption[] = [
  { label: "All Ban Types", value: "" },
  { label: "Temporary", value: "TEMPORARY" },
  { label: "Permanent", value: "PERMANENT" },
];

const STATUS_FILTER: SiteOption[] = [
  { label: "All Status", value: "" },
  { label: "Active", value: "Active" },
  { label: "Upcoming", value: "Upcoming" },
  { label: "Expired", value: "Expired" },
  { label: "Lifted", value: "Lifted" },
];

const BAN_TYPE_OPTIONS: SiteOption[] = [
  { label: "Temporary", value: "TEMPORARY" },
  { label: "Permanent", value: "PERMANENT" },
];

const EDIT_STATUS_OPTIONS: SiteOption[] = [
  { label: "Active", value: "Active" },
  { label: "Lifted", value: "Lifted" },
];

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

/* ------------------------- Multi-select field ------------------------ */

interface MultiSelectProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  options: SiteOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

function MultiSelect({ label, required, placeholder, disabled, options, value, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const allSelected = options.length > 0 && value.length === options.length;
  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  const summary =
    value.length === 0
      ? placeholder || "Select"
      : value.length <= 2
      ? options.filter((o) => value.includes(o.value)).map((o) => o.label).join(", ")
      : `${value.length} sites selected`;

  return (
    <div ref={ref} className="relative">
      <span className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`${fieldClass} flex items-center justify-between text-left`}
      >
        <span className={`truncate ${value.length === 0 ? "text-slate-400" : ""}`}>{summary}</span>
        <ChevronDown size={15} className="shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
          {options.length > 1 && (
            <label className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-primary-50">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onChange(allSelected ? [] : options.map((o) => o.value))}
              />
              Select all
            </label>
          )}
          {options.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm text-slate-700 hover:bg-primary-50"
            >
              <input type="checkbox" checked={value.includes(o.value)} onChange={() => toggle(o.value)} />
              {o.label}
            </label>
          ))}
          {options.length === 0 && (
            <p className="px-2.5 py-2 text-sm text-slate-400">No sites available</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------ Visitor details card ----------------------- */

interface PersonCardData {
  person_name: string;
  identity_type: string;
  identity_number: string;
  phone_number: string;
  email: string | null;
}

function VisitorDetailsCard({
  person,
  hasActiveBan,
}: {
  person: PersonCardData;
  hasActiveBan?: boolean;
}) {
  const row = (label: string, value?: string | null) => (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-700 text-right break-all">{value || "—"}</span>
    </div>
  );

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
      <div className="flex items-center justify-between gap-2 pb-2 mb-1 border-b border-slate-200">
        <span className="text-sm font-semibold text-slate-800">Visitor Details</span>
        {hasActiveBan && <Badge variant="warning">Has an active ban</Badge>}
      </div>
      {row("Name", person.person_name)}
      {row("Identity Type", person.identity_type)}
      {row("Identity Number", person.identity_number)}
      {row("Contact", person.phone_number)}
      {row("Email", person.email)}
    </div>
  );
}

/* ------------------------------ Ban modal ---------------------------- */
/* Create: identity search -> visitor -> sites (multi) -> type -> reason     */
/* Edit:   visitor card (fixed) -> site (single) -> type -> reason -> status */

const emptyBanForm = {
  identityType: "",
  identityNumber: "",
  hasSearched: false,
  searchResults: [] as PersonRecord[],
  selectedVisitorIndex: "",
  sites: [] as string[], // create: site guids
  site: "", // edit: one site guid
  banType: "" as BanType | "",
  fromDate: "",
  toDate: "",
  reason: "",
  status: "Active" as "Active" | "Lifted", // edit only
};

type BanForm = typeof emptyBanForm;

interface BanModalProps {
  isOpen: boolean;
  editing: BanRecord | null;
  onClose: () => void;
  onSaved: () => void;
  siteOptions: SiteOption[];
  isLoadingSites: boolean;
  identityTypeOptions: SiteOption[];
  identityTypes: IdentityTypeRecord[];
  isLoadingLookups: boolean;
}

function BanModal({
  isOpen,
  editing,
  onClose,
  onSaved,
  siteOptions,
  isLoadingSites,
  identityTypeOptions,
  identityTypes,
  isLoadingLookups,
}: BanModalProps) {
  const [form, setForm] = useState<BanForm>(emptyBanForm);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isEdit = !!editing;

  const set = <K extends keyof BanForm>(key: K, value: BanForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Fill the form when the modal opens for editing.
  useEffect(() => {
    if (!isOpen || !editing) return;
    setForm({
      ...emptyBanForm,
      site: editing.site.guid,
      banType: editing.ban_type,
      fromDate: editing.from_date ?? "",
      toDate: editing.to_date ?? "",
      reason: editing.reason ?? "",
      status: editing.is_active ? "Active" : "Lifted",
    });
    setSubmitError("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editing?.guid]);

  // Create: users with exactly one site get it preselected.
  useEffect(() => {
    if (
      isOpen &&
      !editing &&
      !isLoadingSites &&
      siteOptions.length === 1 &&
      form.sites.length === 0
    ) {
      setForm((prev) => ({ ...prev, sites: [siteOptions[0].value] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editing, isLoadingSites, siteOptions]);

  // ---------- Identity number validation (same as Visitor) ----------
  const selectedIdentityTypeRecord = useMemo(
    () => identityTypes.find((t) => t.identity_type_name === form.identityType) || null,
    [identityTypes, form.identityType]
  );

  const identityNumberPattern = useMemo(() => {
    if (!selectedIdentityTypeRecord) return null;
    const { identity_number_digits: digits, identity_number_alphabets: alphabets } =
      selectedIdentityTypeRecord;
    if (digits == null && alphabets == null) return null;
    const digitPart = digits != null ? `[0-9]{${digits}}` : "";
    const alphaPart = alphabets != null ? `[A-Za-z]{${alphabets}}` : "";
    return new RegExp(`^${digitPart}${alphaPart}$`);
  }, [selectedIdentityTypeRecord]);

  const isIdentityNumberValid = useMemo(() => {
    const value = form.identityNumber.trim();
    if (!selectedIdentityTypeRecord) return value.length > 0;
    const validation = selectedIdentityTypeRecord.identity_number_validation;
    if (validation === "Not Required") return true;
    if (validation === "Optional" && value.length === 0) return true;
    if (value.length === 0) return false;
    return identityNumberPattern ? identityNumberPattern.test(value) : true;
  }, [form.identityNumber, selectedIdentityTypeRecord, identityNumberPattern]);

  const identityNumberErrorMessage = useMemo(() => {
    if (!selectedIdentityTypeRecord || isIdentityNumberValid) return "";
    const {
      identity_number_format: format,
      identity_number_digits: digits,
      identity_number_alphabets: alphabets,
    } = selectedIdentityTypeRecord;
    if (format) return `Must match the format ${format}.`;
    const parts: string[] = [];
    if (digits != null) parts.push(`${digits} digit(s)`);
    if (alphabets != null) parts.push(`${alphabets} letter(s)`);
    return parts.length ? `Must be ${parts.join(" followed by ")}.` : "Invalid Identity Number.";
  }, [selectedIdentityTypeRecord, isIdentityNumberValid]);

  // ---------- Handlers ----------
  const resetAll = () => {
    setForm(emptyBanForm);
    setSubmitError("");
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleIdentityTypeChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      identityType: value,
      identityNumber: "",
      hasSearched: false,
      searchResults: [],
      selectedVisitorIndex: "",
    }));
  };

  const handleIdentityNumberChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      identityNumber: value,
      hasSearched: false,
      searchResults: [],
      selectedVisitorIndex: "",
    }));
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setSubmitError("");
    try {
      const res = await visitorService.identitySearch(form.identityType, form.identityNumber.trim());
      const matches = res.success && res.data ? res.data.results : [];
      setForm((prev) => ({
        ...prev,
        hasSearched: true,
        searchResults: matches,
        selectedVisitorIndex: "",
      }));
    } catch (err) {
      setSubmitError(apiErrorMessage(err, "Could not search for this identity."));
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectVisitor = (indexStr: string) => {
    setForm((prev) => ({ ...prev, selectedVisitorIndex: indexStr }));
  };

  const handleBanTypeChange = (value: string) => {
    const next = value as BanType | "";
    setForm((prev) => ({
      ...prev,
      banType: next,
      // Permanent = no dates
      fromDate: next === "TEMPORARY" ? prev.fromDate || getToday() : "",
      toDate: next === "TEMPORARY" ? prev.toDate : "",
    }));
  };

  const selectedPerson: PersonRecord | null =
    form.selectedVisitorIndex !== ""
      ? form.searchResults[Number(form.selectedVisitorIndex)] ?? null
      : null;

  const isTemporary = form.banType === "TEMPORARY";
  const datesValid =
    !isTemporary || (!!form.fromDate && !!form.toDate && form.toDate >= form.fromDate);

  const canSearch =
    !!form.identityType &&
    form.identityNumber.trim().length > 0 &&
    isIdentityNumberValid &&
    !isSearching;

  const canSubmit = isEdit
    ? !!form.site && !!form.banType && datesValid && form.reason.trim().length > 0 && !isSubmitting
    : !!selectedPerson &&
      form.sites.length > 0 &&
      !!form.banType &&
      datesValid &&
      form.reason.trim().length > 0 &&
      !isSubmitting;

  const visitorOptions = form.searchResults.map((v, i) => ({
    label: `${v.person_name} — ${v.phone_number}`,
    value: String(i),
  }));

    // keep the ban's current site selectable in edit mode
  const editSiteOptions: SiteOption[] =
    editing && !siteOptions.some((o) => o.value === editing.site.guid)
      ? [{ label: editing.site.name, value: editing.site.guid }, ...siteOptions]
      : siteOptions;

  const handleSubmit = async () => {
    if (!canSubmit || !form.banType) return;
    setIsSubmitting(true);
    setSubmitError("");

    const from_date = isTemporary ? form.fromDate : null;
    const to_date = isTemporary ? form.toDate : null;

    try {
      const res =
        isEdit && editing
          ? await banService.update({
              guid: editing.guid,
              site: form.site,
              ban_type: form.banType,
              from_date,
              to_date,
              reason: form.reason.trim(),
              is_active: form.status === "Active",
            })
          : await banService.create({
              person_id: selectedPerson!.id,
              sites: form.sites,
              ban_type: form.banType,
              from_date,
              to_date,
              reason: form.reason.trim(),
            });

      if (res.success) {
        resetAll();
        onSaved();
      } else {
        setSubmitError(res.message || "Could not save ban.");
      }
    } catch (err) {
      setSubmitError(apiErrorMessage(err, "Could not save ban. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Ban" : "Ban Visitor / Contractor"}
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Ban"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {isEdit && editing ? (
          <VisitorDetailsCard person={editing.person} />
        ) : (
          <>
            {/* 1. Identity type */}
            <Select
              label="Identity Type"
              placeholder={isLoadingLookups ? "Loading..." : "Select Identity Type"}
              required
              disabled={isLoadingLookups}
              options={identityTypeOptions}
              value={form.identityType}
              onChange={(e) => handleIdentityTypeChange(e.target.value)}
            />

            {/* 2. Identity number + search */}
            <div>
              <span className="block text-sm font-medium text-slate-700 mb-1.5">
                Identity Number <span className="text-red-500">*</span>
              </span>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    placeholder={
                      selectedIdentityTypeRecord?.identity_number_format
                        ? `e.g. ${selectedIdentityTypeRecord.identity_number_format}`
                        : "Enter ID number"
                    }
                    disabled={!form.identityType}
                    value={form.identityNumber}
                    onChange={(e) => handleIdentityNumberChange(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  icon={<SearchIcon size={15} />}
                  disabled={!canSearch}
                  onClick={handleSearch}
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
              {form.identityNumber && !isIdentityNumberValid && (
                <p className="text-xs text-red-600 mt-1.5">{identityNumberErrorMessage}</p>
              )}
            </div>

            {form.hasSearched && (
              <p className="text-xs -mt-2 text-slate-500">
                {form.searchResults.length > 0
                  ? `${form.searchResults.length} matching record${
                      form.searchResults.length > 1 ? "s" : ""
                    } found.`
                  : "No record found for this identity. Only existing visitors / contractors can be banned."}
              </p>
            )}

            {/* 3. Visitors dropdown */}
            {form.searchResults.length > 0 && (
              <Select
                label="Visitors"
                placeholder="Select Visitor"
                required
                options={visitorOptions}
                value={form.selectedVisitorIndex}
                onChange={(e) => handleSelectVisitor(e.target.value)}
              />
            )}

            {/* 4. Visitor details card */}
            {selectedPerson && (
              <VisitorDetailsCard person={selectedPerson} hasActiveBan={selectedPerson.is_banned} />
            )}
          </>
        )}

        {/* 5. Site(s) */}
        {isEdit ? (
          <Select
            label="Site"
            placeholder={isLoadingSites ? "Loading sites..." : "Select Site"}
            required
            disabled={isLoadingSites}
            options={editSiteOptions}
            value={form.site}
            onChange={(e) => set("site", e.target.value)}
          />
        ) : (
          <MultiSelect
            label="Sites"
            required
            placeholder={isLoadingSites ? "Loading sites..." : "Select Sites"}
            disabled={isLoadingSites}
            options={siteOptions}
            value={form.sites}
            onChange={(v) => set("sites", v)}
          />
        )}

        {/* 6. Ban type + dates */}
        <Select
          label="Ban Type"
          placeholder="Select Ban Type"
          required
          options={BAN_TYPE_OPTIONS}
          value={form.banType}
          onChange={(e) => handleBanTypeChange(e.target.value)}
        />

        {isTemporary && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="block text-sm font-medium text-slate-700 mb-1.5">
                From Date <span className="text-red-500">*</span>
              </span>
              <input
                type="date"
                className={fieldClass}
                value={form.fromDate}
                max={form.toDate || undefined}
                onChange={(e) => set("fromDate", e.target.value)}
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-slate-700 mb-1.5">
                To Date <span className="text-red-500">*</span>
              </span>
              <input
                type="date"
                className={fieldClass}
                value={form.toDate}
                min={form.fromDate || undefined}
                onChange={(e) => set("toDate", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* 7. Reason */}
        <Input
          label="Banned Reason"
          type="textarea"
          required
          placeholder="e.g. Security violation"
          value={form.reason}
          onChange={(e) => set("reason", e.target.value)}
        />

        {/* 8. Status (edit only) */}
        {isEdit && (
          <Select
            label="Status"
            options={EDIT_STATUS_OPTIONS}
            value={form.status}
            onChange={(e) => set("status", e.target.value as "Active" | "Lifted")}
          />
        )}

        {submitError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
            <AlertCircle size={16} />
            {submitError}
          </div>
        )}
      </div>
    </Modal>
  );
}

/* -------------------------------- Page ------------------------------- */

const Ban = () => {
  const [records, setRecords] = useState<BanRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [banTypeFilter, setBanTypeFilter] = useState<BanType | "">("");
  const [statusFilter, setStatusFilter] = useState<BanStatus | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const [isBanOpen, setBanOpen] = useState(false);
  const [editing, setEditing] = useState<BanRecord | null>(null);

  // ---------- logged-in user (admin vs my-site) ----------
  const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;
  // const subsiteOptions: SiteItem[] =
  //   storedUser?.permissions?.find((p) => p.menu_key === BAN_MENU_KEY)?.subsites ?? [];


  const banPermission = storedUser?.permissions?.find(
  (p) => p.menu_key === BAN_MENU_KEY
);

// subsites appear in the dropdown only when view = true
const subsiteOptions: SiteItem[] = banPermission?.view
  ? banPermission.subsites ?? []
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

  // Options for the ban form (multi-select on create, single select on edit)
  // const banSiteOptions: SiteOption[] = isSuperAdmin
  //   ? allSites.map((s) => ({ label: `${s.site_name} (${s.site_model.name})`, value: s.guid }))
  //   : siteChoices.map((s) => ({ label: s.name, value: s.guid }));

    const banSiteOptions: SiteOption[] = isSuperAdmin
    ? allSites.map((s) => ({ label: `${s.site_name} (${s.site_model.name})`, value: s.guid }))
    : ownSite
    ? [{ label: ownSite.name, value: ownSite.guid }]
    : [];
    
  // "" = All Sites (super admin only)
  const [siteFilter, setSiteFilter] = useState<string>(isSuperAdmin ? "" : ownSite?.guid ?? "");

  // non-super-admin viewing a site other than their own -> read only
const isReadOnlySite =
  !isSuperAdmin && !!siteFilter && siteFilter !== ownSite?.guid;

  const filterOptions: SiteOption[] = isSuperAdmin
    ? [{ label: "All Sites", value: "" }, ...siteChoices.map((s) => ({ label: s.name, value: s.guid }))]
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

  // ----- identity types (loaded the first time the create modal opens) -----
  const [identityTypeRecords, setIdentityTypeRecords] = useState<IdentityTypeRecord[]>([]);
  const [isLoadingLookups, setIsLoadingLookups] = useState(false);
  const lookupsLoaded = useRef(false);

  useEffect(() => {
    if (!isBanOpen || editing || lookupsLoaded.current) return;
    let cancelled = false;

    (async () => {
      setIsLoadingLookups(true);
      try {
        const identityRes = await identityTypeService.list("", "", "");
        if (cancelled) return;
        if (identityRes.success && identityRes.data) {
          setIdentityTypeRecords(identityRes.data.results);
          lookupsLoaded.current = true;
        }
      } catch {
        /* retried on next open */
      } finally {
        if (!cancelled) setIsLoadingLookups(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isBanOpen, editing]);

  const identityTypeOptions: SiteOption[] = useMemo(
    () => identityTypeRecords.map((r) => ({ label: r.identity_type_name, value: r.identity_type_name })),
    [identityTypeRecords]
  );

  // ----- debounce the search box -----
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // ----- load the table from the API -----
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoadingList(true);
      setListError("");
      try {
        const res = await banService.list({
          page,
          page_size: PAGE_SIZE,
          search: debouncedSearch,
          site_guid: siteFilter || null,
          ban_type: banTypeFilter,
          status: statusFilter,
          from_date: fromDate || null,
          to_date: toDate || null,
        });
        if (cancelled) return;

        if (res.success && res.data) {
          setRecords(res.data.results);
          setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
          setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
        } else {
          setListError(res.message || "Could not load bans.");
        }
      } catch (err) {
        if (!cancelled) setListError(apiErrorMessage(err, "Could not load bans."));
      } finally {
        if (!cancelled) setIsLoadingList(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, siteFilter, banTypeFilter, statusFilter, fromDate, toDate, refreshKey]);

  const handleSiteFilterChange = (value: string) => {
    setSiteFilter(value);
    setPage(1);
  };
  const handleBanTypeFilterChange = (value: string) => {
    setBanTypeFilter(value as BanType | "");
    setPage(1);
  };
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as BanStatus | "");
    setPage(1);
  };
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
    setBanTypeFilter("");
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setSiteFilter(isSuperAdmin ? "" : ownSite?.guid ?? "");
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setBanOpen(true);
  };

  const openEdit = (row: BanRecord) => {
    setEditing(row);
    setBanOpen(true);
  };

  const closeModal = () => {
    setBanOpen(false);
    setEditing(null);
  };

  const handleLift = async (row: BanRecord) => {
    if (!window.confirm(`Lift the ban for "${row.person.person_name}" at ${row.site.name}?`)) return;
    try {
      const res = await banService.lift(row.guid);
      if (res.success) setRefreshKey((k) => k + 1);
      else setListError(res.message || "Could not lift ban.");
    } catch (err) {
      setListError(apiErrorMessage(err, "Could not lift ban."));
    }
  };

  const handleDelete = async (row: BanRecord) => {
    if (!window.confirm(`Delete the ban for "${row.person.person_name}" at ${row.site.name}?`)) return;
    try {
      const res = await banService.delete(row.guid);
      if (res.success) {
        // step back a page if the last row of this page was deleted
        if (records.length === 1 && page > 1) setPage((p) => p - 1);
        setRefreshKey((k) => k + 1);
      } else {
        setListError(res.message || "Could not delete ban.");
      }
    } catch (err) {
      setListError(apiErrorMessage(err, "Could not delete ban."));
    }
  };

  // ---------- table columns (one row per person per site) ----------
  const iconBtn =
    "p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700";

  // const columns: TableColumn<BanRecord>[] = [
  const baseColumns: TableColumn<BanRecord>[] = [
    { key: "id", header: "Ban ID", render: (row) => banCode(row.id) },
    { key: "name", header: "Name", render: (row) => row.person.person_name },
    {
      key: "identity",
      header: "Identity",
      render: (row) => `${row.person.identity_type} · ${row.person.identity_number}`,
    },
    { key: "phone", header: "Phone", render: (row) => row.person.phone_number || "—" },
    { key: "email", header: "Email", render: (row) => row.person.email || "—" },
    { key: "site", header: "Site", render: (row) => row.site.name },
    { key: "ban_type", header: "Ban Type", render: (row) => banTypeLabel(row.ban_type) },
    { key: "from_date", header: "From", render: (row) => fmtDate(row.from_date) },
    { key: "to_date", header: "To", render: (row) => fmtDate(row.to_date) },
    { key: "reason", header: "Reason", render: (row) => row.reason || "—" },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>,
    },
  ];
  const actionColumn: TableColumn<BanRecord> = {
  key: "__actions",
  header: "Actions",
  width: "130px",
  render: (row) => (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => openEdit(row)}
        className={iconBtn}
        aria-label="Edit ban"
        title="Edit"
      >
        <Pencil size={15} />
      </button>

    </div>
  ),
};

// hide the Actions column when a subsite is selected
const columns: TableColumn<BanRecord>[] = isReadOnlySite
  ? baseColumns
  : [...baseColumns, actionColumn];

  return (
    <div>
      <PageHeader
        title="Ban"
        description="Manage banned visitors and contractors across all sites."
        actions={
          isReadOnlySite ? undefined : (

          <Button icon={<BanIcon size={16} />} onClick={openCreate}>
            Ban
          </Button>
          )
        }
      />

      {(siteError || listError) && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mb-4">
          <AlertCircle size={16} />
          {siteError || listError}
        </div>
      )}

      <Card noPadding>
        <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search name, phone, email, identity type / no..."
              icon={<SearchIcon size={15} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filterOptions.length > 0 && (
            <select
              value={siteFilter}
              onChange={(e) => handleSiteFilterChange(e.target.value)}
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
            value={banTypeFilter}
            onChange={(e) => handleBanTypeFilterChange(e.target.value)}
            className={`${fieldClass} max-w-[10rem]`}
            aria-label="Filter by ban type"
          >
            {BAN_TYPE_FILTER.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className={`${fieldClass} max-w-[9rem]`}
            aria-label="Filter by status"
          >
            {STATUS_FILTER.map((o) => (
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
              onChange={(e) => handleFromDateChange(e.target.value)}
              className={`${fieldClass} mt-1`}
            />
          </label>

          <label className="text-xs text-slate-500">
            To
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
        </div>

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

      <BanModal
        isOpen={isBanOpen}
        editing={editing}
        onClose={closeModal}
        onSaved={() => {
          closeModal();
          setPage(1);
          setRefreshKey((k) => k + 1);
        }}
        siteOptions={banSiteOptions}
        isLoadingSites={isLoadingSites}
        identityTypeOptions={identityTypeOptions}
        identityTypes={identityTypeRecords}
        isLoadingLookups={isLoadingLookups}
      />
    </div>
  );
};

export default Ban;