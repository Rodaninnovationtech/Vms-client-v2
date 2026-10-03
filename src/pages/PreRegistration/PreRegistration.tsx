// // // import { Badge } from "@/components/ui";
// // // import { CrudPage } from "@/components/common";
// // // import type { FormField } from "@/components/common";
// // // import type { TableColumn, BadgeVariant } from "@/types";

// // // interface PreRegRecord {
// // //   id: string;
// // //   visitorName: string;
// // //   hostName: string;
// // //   site: string;
// // //   visitDate: string;
// // //   status: string;
// // // }

// // // const statusVariant: Record<string, BadgeVariant> = {
// // //   Approved: "success",
// // //   Pending: "warning",
// // //   Rejected: "danger",
// // // };

// // // const columns: TableColumn<PreRegRecord>[] = [
// // //   { key: "id", header: "ID" },
// // //   { key: "visitorName", header: "Visitor Name" },
// // //   { key: "hostName", header: "Host Name" },
// // //   { key: "site", header: "Site" },
// // //   { key: "visitDate", header: "Visit Date" },
// // //   {
// // //     key: "status",
// // //     header: "Status",
// // //     render: (row) => <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>,
// // //   },
// // // ];

// // // const formFields: FormField[] = [
// // //   { name: "visitorName", label: "Visitor Name", required: true },
// // //   { name: "hostName", label: "Host Name", required: true },
// // //   { name: "site", label: "Site", required: true, placeholder: "e.g. Tower A" },
// // //   { name: "visitDate", label: "Visit Date", type: "text", placeholder: "DD-MM-YYYY" },
// // //   {
// // //     name: "status",
// // //     label: "Status",
// // //     type: "select",
// // //     options: [
// // //       { label: "Pending", value: "Pending" },
// // //       { label: "Approved", value: "Approved" },
// // //       { label: "Rejected", value: "Rejected" },
// // //     ],
// // //   },
// // // ];

// // // const initialData: PreRegRecord[] = [
// // //   { id: "PR-001", visitorName: "Anita Rao", hostName: "Suresh Kumar", site: "Tower A", visitDate: "18-09-2026", status: "Pending" },
// // //   { id: "PR-002", visitorName: "Vikram Singh", hostName: "Neha Gupta", site: "Tower B", visitDate: "19-09-2026", status: "Approved" },
// // //   { id: "PR-003", visitorName: "Divya Patel", hostName: "Amit Shah", site: "Tower C", visitDate: "20-09-2026", status: "Rejected" },
// // //   { id: "PR-004", visitorName: "Ravi Verma", hostName: "Pooja Menon", site: "Tower A", visitDate: "21-09-2026", status: "Approved" },
// // // ];

// // // const PreRegistration = () => {
// // //   return (
// // //     <CrudPage
// // //       title="Pre-Registration"
// // //       description="Schedule and manage upcoming visitor pre-registrations."
// // //       addLabel="New Pre-Registration"
// // //       idPrefix="PR"
// // //       columns={columns}
// // //       formFields={formFields}
// // //       initialData={initialData}
// // //       searchPlaceholder="Search by visitor, host, site..."
// // //     />
// // //   );
// // // };

// // // export default PreRegistration;


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
  CalendarPlus,
  AlertCircle,
  Info,
  Pencil,
  Trash2,
} from "lucide-react";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { tenantService } from "@/service/tenantcreationservices";
import { tenantNotificationService } from "@/service/tenantnotificationservices";
import type { AvailabilityConflict } from "@/service/tenantnotificationservices";
import { identityTypeService } from "@/service/identitytypeservice";
import { visitorTypeService } from "@/service/visitortypeservice";
// import { passService } from "@/service/passcreationservices";
// import { keyService } from "@/service/keycreationservices";
import { visitorService, apiErrorMessage } from "@/service/visitorservices";
import type { PersonRecord } from "@/service/visitorservices";
import { preRegistrationService } from "../../service/preregistrationservices";
import type {
  PreRegistrationRecord,
  PreRegistrationPayload,
} from "../../service/preregistrationservices";

import { userStorage } from "@/utils/storage";

/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */

const getToday = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// ISO datetime / date -> dd-mm-yyyy
const fmtDate = (value?: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
};

// HH:MM:SS -> hh:mm AM/PM
const fmtTime = (value?: string | null) => {
  if (!value) return "";
  const [h, m] = value.split(":");
  const hour = Number(h);
  if (Number.isNaN(hour)) return value;
  return `${String(hour % 12 || 12).padStart(2, "0")}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

const fmtDateTime = (date?: string | null, time?: string | null) =>
  `${fmtDate(date)}${time ? ` ${fmtTime(time)}` : ""}`;

/* ---------------------------------------------------------------------- */
/* Types                                                                   */
/* ---------------------------------------------------------------------- */

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

interface IdentityTypeRecord {
  guid: string;
  identity_type_name: string;
  identity_number_validation: "Required" | "Optional" | "Not Required" | string;
  identity_number_digits?: number | null;
  identity_number_alphabets?: number | null;
  identity_number_format?: string;
  phone_number_validation?: string;
  phone_number_min?: number | null;
  phone_number_max?: number | null;
  phone_number_starting_with?: string;
  phone_number_format?: string;
}

/* ---------------------------------------------------------------------- */
/* Static data                                                             */
/* ---------------------------------------------------------------------- */

const statusVariant: Record<string, BadgeVariant> = {
  Approved: "success",
  Pending: "warning",
  Rejected: "danger",
};

const PRE_REG_MENU_KEY = "/pre-registration";
const PAGE_SIZE = 10;

// "contructor" matches the current spelling in the API data.
const COMPANY_VISITOR_TYPES = ["contractor", "contructor"];

const PRE_REG_STATUS_OPTIONS: SiteOption[] = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

const isCompanyType = (name?: string) =>
  COMPANY_VISITOR_TYPES.includes((name ?? "").trim().toLowerCase());

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

/* ---------------------------------------------------------------------- */
/* Pass / Key options for a site                                           */
/* ---------------------------------------------------------------------- */

function useAvailableSiteAssets(siteGuid: string, visitorTypeGuid: string) {
  const [passOptions, setPassOptions] = useState<SiteOption[]>([]);
  const [keyOptions, setKeyOptions] = useState<SiteOption[]>([]);
  const [isLoadingPasses, setIsLoadingPasses] = useState(false);
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [passError, setPassError] = useState("");
  const [keyError, setKeyError] = useState("");

  // Keys: depend on the site only
  useEffect(() => {
    if (!siteGuid) {
      setKeyOptions([]);
      setKeyError("");
      setIsLoadingKeys(false);
      return;
    }
    let cancelled = false;

    (async () => {
      setIsLoadingKeys(true);
      setKeyError("");
      const keyRes = await keyService.list({
        page: null,
        page_size: null,
        site_guid: siteGuid,
        status: "Available",
      });
      if (cancelled) return;

      setKeyOptions(
        keyRes.success && keyRes.data
          ? keyRes.data.results.map((k) => ({
              label: `${k.key_no} - ${k.key_name}`,
              value: k.key_no,
            }))
          : []
      );
      if (!keyRes.success) setKeyError("Could not load keys for this site.");
      setIsLoadingKeys(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [siteGuid]);

  // Passes: depend on the site AND the selected visitor type
  useEffect(() => {
    if (!siteGuid || !visitorTypeGuid) {
      setPassOptions([]);
      setPassError("");
      setIsLoadingPasses(false);
      return;
    }
    let cancelled = false;

    (async () => {
      setIsLoadingPasses(true);
      setPassError("");
      const passRes = await passService.list({
        page: null,
        page_size: null,
        site_guid: siteGuid,
        status: "Active",
        visitor_type_guid: visitorTypeGuid,
      });
      if (cancelled) return;

      setPassOptions(
        passRes.success && passRes.data
          ? passRes.data.results.map((p) => ({
              label: `${p.pass_no} - ${p.pass_name}`,
              value: p.pass_no,
            }))
          : []
      );
      if (!passRes.success) setPassError("Could not load passes for this visitor type.");
      setIsLoadingPasses(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [siteGuid, visitorTypeGuid]);

  return {
    passOptions,
    keyOptions,
    isLoadingPasses,
    isLoadingKeys,
    error: passError || keyError,
  };
}

/* ---------------------------------------------------------------------- */
/* Approvers of a site                                                     */
/* POST /approvals/approvers/  { site_guid }                               */
/* Only users of that site whose role has the Approval menu enabled.       */
/* ---------------------------------------------------------------------- */

function useApprovers(siteGuid: string) {
  const [approverOptions, setApproverOptions] = useState<SiteOption[]>([]);
  const [isLoadingApprovers, setIsLoadingApprovers] = useState(false);
  const [approverError, setApproverError] = useState("");

  useEffect(() => {
    if (!siteGuid) {
      setApproverOptions([]);
      setApproverError("");
      setIsLoadingApprovers(false);
      return;
    }
    let cancelled = false;

    (async () => {
      setIsLoadingApprovers(true);
      setApproverError("");
      try {
        const res = await preRegistrationService.approverDropdown(siteGuid);
        if (cancelled) return;
        if (res.success && res.data) {
          setApproverOptions(
            res.data.results.map((a) => {
              const who = a.full_name ? `${a.full_name} — ${a.email}` : a.email;
              return {
                label: a.role ? `${who} (${a.role.name})` : who,
                value: a.email,
              };
            })
          );
        } else {
          setApproverOptions([]);
          setApproverError(res.message || "Could not load approvers.");
        }
      } catch (err) {
        if (!cancelled) {
          setApproverOptions([]);
          setApproverError(apiErrorMessage(err, "Could not load approvers."));
        }
      } finally {
        if (!cancelled) setIsLoadingApprovers(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [siteGuid]);

  return { approverOptions, isLoadingApprovers, approverError };
}

const emptyForm = {
  location: "", // tenant guid
  locationLabel: "",
  site: "",
  fromDate: "",
  toDate: "",
  fromTime: "", // HH:MM, optional
  toTime: "", // HH:MM, optional
  identityType: "",
  identityNumber: "",
  hasSearched: false,
  searchResults: [] as PersonRecord[],
  selectedVisitorIndex: "",
  fullName: "",
  contact: "",
  email: "",
  visitorType: "", // visitor type guid
  companyName: "",
  companyPhone: "",
  // passNumber: "",
  // key: "",
  vehicle: "",
  remark: "",
  approverEmail: "",
};

type PreRegForm = typeof emptyForm;

interface PreRegModalProps {
  isOpen: boolean;
  editRecord: PreRegistrationRecord | null; // null = new request
  onClose: () => void;
  onSaved: () => void;
  siteOptions: SiteOption[];
  isLoadingSites: boolean;
  identityTypeOptions: SiteOption[];
  identityTypes: IdentityTypeRecord[];
  visitorTypeOptions: SiteOption[];
  isLoadingLookups: boolean;
}

function PreRegistrationModal({
  isOpen,
  editRecord,
  onClose,
  onSaved,
  siteOptions,
  isLoadingSites,
  identityTypeOptions,
  identityTypes,
  visitorTypeOptions,
  isLoadingLookups,
}: PreRegModalProps) {
  const [form, setForm] = useState<PreRegForm>(emptyForm);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // const {
  //   passOptions,
  //   keyOptions,
  //   isLoadingPasses,
  //   isLoadingKeys,
  //   error: assetsError,
  // } = useAvailableSiteAssets(isOpen ? form.site : "", isOpen ? form.visitorType : "");

  const { approverOptions, isLoadingApprovers, approverError } = useApprovers(
    isOpen ? form.site : ""
  );

  // Locations = tenants of the selected site
  const [locationOptions, setLocationOptions] = useState<SiteOption[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Availability for Location + date range
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

  const checkAvailability = async (locationGuid: string, from: string, to: string) => {
    resetAvailability();
    const requestId = availabilityRequestId.current;
    setIsCheckingAvailability(true);
    try {
      const res = await tenantNotificationService.checkAvailability(locationGuid, from, to);
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

  // ---------- Visitor type / company ----------
  const selectedVisitorTypeName =
    visitorTypeOptions.find((o) => o.value === form.visitorType)?.label || "";
  const showCompanyFields = isCompanyType(selectedVisitorTypeName);
  const isCompanyPhoneValid = /^[0-9]{10}$/.test(form.companyPhone.trim());

  // ---------- Time range (both or neither) ----------
  const isTimeRangeValid =
    (!form.fromTime && !form.toTime) ||
    (!!form.fromTime &&
      !!form.toTime &&
      (form.fromDate !== form.toDate || form.toTime > form.fromTime));

  // ---------- Identity Number validation ----------
  const [showIdentityInfo, setShowIdentityInfo] = useState(false);

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
    if (form.identityNumber.trim().length === 0) {
      return "Identity Number is required for this identity type.";
    }
    if (format) return `Must match the format ${format}.`;
    const parts: string[] = [];
    if (digits != null) parts.push(`${digits} digit(s)`);
    if (alphabets != null) parts.push(`${alphabets} letter(s)`);
    return parts.length ? `Must be ${parts.join(" followed by ")}.` : "Invalid Identity Number.";
  }, [selectedIdentityTypeRecord, isIdentityNumberValid, form.identityNumber]);

  // ---------- Contact validation ----------
  const [showPhoneInfo, setShowPhoneInfo] = useState(false);

  const isContactValid = useMemo(() => {
    const value = form.contact.trim();
    if (!selectedIdentityTypeRecord) return value.length > 0;

    const {
      phone_number_validation: validation,
      phone_number_min: min,
      phone_number_max: max,
      phone_number_starting_with: startingWith,
    } = selectedIdentityTypeRecord;

    if (validation === "Not Required") return true;
    if (validation === "Optional" && value.length === 0) return true;
    if (value.length === 0) return false;

    if (!/^[0-9]+$/.test(value)) return false;
    if (min != null && value.length < min) return false;
    if (max != null && value.length > max) return false;
    if (startingWith && !startingWith.split("").includes(value.charAt(0))) return false;

    return true;
  }, [form.contact, selectedIdentityTypeRecord]);

  const contactErrorMessage = useMemo(() => {
    if (!selectedIdentityTypeRecord || isContactValid) return "";
    const {
      phone_number_min: min,
      phone_number_max: max,
      phone_number_starting_with: startingWith,
    } = selectedIdentityTypeRecord;
    if (form.contact.trim().length === 0) {
      return "Contact number is required for this identity type.";
    }
    const parts: string[] = [];
    if (min != null && max != null && min === max) parts.push(`${min} digits`);
    else {
      if (min != null) parts.push(`at least ${min} digits`);
      if (max != null) parts.push(`at most ${max} digits`);
    }
    if (startingWith) parts.push(`starting with ${startingWith}`);
    return parts.length ? `Must be ${parts.join(", ")}.` : "Invalid contact number.";
  }, [selectedIdentityTypeRecord, isContactValid, form.contact]);

  const set = <K extends keyof PreRegForm>(key: K, value: PreRegForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const loadLocationsForSite = async (siteGuid: string, siteName: string) => {
    if (!siteGuid) {
      setLocationOptions([]);
      return;
    }
    setIsLoadingLocations(true);
    setLocationError("");
    try {
      const res = await tenantService.list(1, 100, "", {
        site_guid: siteGuid,
        site_name: siteName,
      });
      if (res.success && res.data) {
        setLocationOptions(
          res.data.results.map((t) => ({
            label: `${t.tenant_name} (${t.block}/${t.floor}/${t.unit})`,
            value: t.guid,
          }))
        );
      } else {
        setLocationError(res.message || "Could not load locations.");
        setLocationOptions([]);
      }
    } catch {
      setLocationError("Could not load locations.");
      setLocationOptions([]);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // New request, non-admin users have exactly one site: preselect it.
  useEffect(() => {
    if (isOpen && !editRecord && !isLoadingSites && siteOptions.length === 1 && !form.site) {
      const only = siteOptions[0];
      setForm((prev) => ({ ...prev, site: only.value }));
      loadLocationsForSite(only.value, only.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editRecord, isLoadingSites, siteOptions]);

  // Edit: fill the form from the saved request.
  useEffect(() => {
    if (!isOpen || !editRecord) return;
    const r = editRecord;

    setForm({
      ...emptyForm,
      site: r.site.guid,
      location: r.location?.guid ?? "",
      locationLabel: r.location?.name ?? "",
      fromDate: r.from_date ?? "",
      toDate: r.to_date ?? "",
      fromTime: (r.from_time ?? "").slice(0, 5),
      toTime: (r.to_time ?? "").slice(0, 5),
      identityType: r.person.identity_type,
      identityNumber: r.person.identity_number,
      hasSearched: true,
      searchResults: [r.person],
      selectedVisitorIndex: "0",
      fullName: r.person.person_name,
      contact: r.person.phone_number,
      email: r.person.email ?? "",
      visitorType: r.visitor_type?.guid ?? "",
      companyName: r.company,
      companyPhone: r.company_phone,
      // passNumber: r.pass_no,
      // key: r.key_no,
      vehicle: r.vehicle_number,
      remark: r.remark,
      approverEmail: r.approver_email ?? "",
    });
    setSubmitError("");
    loadLocationsForSite(r.site.guid, r.site.name);
    if (r.location && r.from_date && r.to_date) {
      checkAvailability(r.location.guid, r.from_date, r.to_date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editRecord]);

  const resetAll = () => {
    setForm(emptyForm);
    setLocationOptions([]);
    setLocationError("");
    setShowIdentityInfo(false);
    setShowPhoneInfo(false);
    setSubmitError("");
    resetAvailability();
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleSiteChange = (value: string) => {
    const label = siteOptions.find((s) => s.value === value)?.label || "";
    setForm({ ...emptyForm, site: value });
    setLocationOptions([]);
    resetAvailability();
    loadLocationsForSite(value, label);
  };

  // Picking a location clears the dates. Availability is checked only
  // once both From and To have been selected.
  const handleLocationChange = (value: string) => {
    const label = locationOptions.find((o) => o.value === value)?.label || "";

    setForm((prev) => ({
      ...prev,
      location: value,
      locationLabel: label,
      fromDate: "",
      toDate: "",
    }));

    resetAvailability();
  };

  // Changing From / To re-runs the availability check for the new range.
  const handleFromDateChange = (value: string) => {
    const nextTo = value && form.toDate && form.toDate < value ? value : form.toDate;
    setForm((prev) => ({ ...prev, fromDate: value, toDate: nextTo }));

    if (!form.location || !value || !nextTo) {
      resetAvailability();
      return;
    }
    checkAvailability(form.location, value, nextTo);
  };

  const handleToDateChange = (value: string) => {
    const nextFrom = value && form.fromDate && value < form.fromDate ? value : form.fromDate;
    setForm((prev) => ({ ...prev, toDate: value, fromDate: nextFrom }));

    if (!form.location || !value || !nextFrom) {
      resetAvailability();
      return;
    }
    checkAvailability(form.location, nextFrom, value);
  };

  const handleIdentityTypeChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      identityType: value,
      identityNumber: "",
      hasSearched: false,
      searchResults: [],
      selectedVisitorIndex: "",
      fullName: "",
      contact: "",
      email: "",
    }));
    setShowIdentityInfo(false);
    setShowPhoneInfo(false);
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

  // Looks up existing persons (Visitor Details table) by identity type + number.
  const handleSearch = async () => {
    setIsSearching(true);
    setSubmitError("");
    try {
      const res = await visitorService.identitySearch(
        form.identityType,
        form.identityNumber.trim(),
        form.site
      );
      const matches = res.success && res.data ? res.data.results : [];
      setForm((prev) => ({
        ...prev,
        hasSearched: true,
        searchResults: matches,
        selectedVisitorIndex: "",
        fullName: "",
        contact: "",
        email: "",
      }));
    } catch (err) {
      setSubmitError(apiErrorMessage(err, "Could not search for this identity."));
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectVisitor = (indexStr: string) => {
    const match = form.searchResults[Number(indexStr)];
    setForm((prev) => ({
      ...prev,
      selectedVisitorIndex: indexStr,
      fullName: match?.person_name || "",
      contact: match?.phone_number || "",
      email: match?.email || "",
    }));
  };

  const handleVisitorTypeChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      visitorType: value,
      companyName: "",
      companyPhone: "",
      // passNumber: "",
    }));
  };

  const selectedPerson: PersonRecord | null =
    form.selectedVisitorIndex !== ""
      ? form.searchResults[Number(form.selectedVisitorIndex)] ?? null
      : null;

  // A pre-registration is for a future visit, so only a ban blocks it here.
  // "Already checked in" is enforced at check-in time.
  const personBlocked = !!selectedPerson && selectedPerson.is_banned;

  const canSearch =
    !!form.identityType &&
    form.identityNumber.trim().length > 0 &&
    isIdentityNumberValid &&
    !isSearching;

  const canSubmit =
    !!form.location &&
    !!form.site &&
    !!form.fromDate &&
    !!form.toDate &&
    isTimeRangeValid &&
    availabilityChecked &&
    availabilityAvailable &&
    !!form.identityType &&
    form.identityNumber.trim().length > 0 &&
    isIdentityNumberValid &&
    form.fullName.trim().length > 0 &&
    isContactValid &&
    !!form.visitorType &&
    (!showCompanyFields || (form.companyName.trim().length > 0 && isCompanyPhoneValid)) &&
    !!form.approverEmail &&
    !personBlocked &&
    !isSubmitting;

  const visitorOptions = form.searchResults.map((v, i) => ({
    label: `${v.person_name} — ${v.phone_number}${v.is_banned ? " (Banned)" : ""}${
      v.currently_checked_in
        ? ` (Checked in${v.checked_in_site ? ` at ${v.checked_in_site.name}` : ""})`
        : ""
    }`,
    value: String(i),
  }));

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const payload: PreRegistrationPayload = {
        site: form.site,
        location: form.location,
        visitor_type: form.visitorType,
        from_date: form.fromDate,
        to_date: form.toDate,
        from_time: form.fromTime || null,
        to_time: form.toTime || null,
        person_id: selectedPerson?.id ?? null,
        person_name: form.fullName.trim(),
        identity_type: form.identityType,
        identity_number: form.identityNumber.trim(),
        phone_number: form.contact.trim(),
        email: form.email.trim(),
        company: showCompanyFields ? form.companyName.trim() : "",
        company_phone: showCompanyFields ? form.companyPhone.trim() : "",
        // pass_no: form.passNumber,
        // key_no: form.key,
        pass_no: "",
        key_no: "",
        vehicle_number: form.vehicle.trim(),
        remark: form.remark.trim(),
        approver_email: form.approverEmail,
      };

      const res = editRecord
        ? await preRegistrationService.update(editRecord.guid, payload)
        : await preRegistrationService.create(payload);

      if (res.success) {
        resetAll();
        onSaved();
      } else {
        setSubmitError(res.message || "Pre-registration failed.");
      }
    } catch (err) {
      setSubmitError(apiErrorMessage(err, "Pre-registration failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editRecord ? "Edit Pre-Registration" : "New Pre-Registration"}
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isSubmitting ? "Saving..." : editRecord ? "Save Changes" : "Submit"}
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
          value={form.site}
          onChange={(e) => handleSiteChange(e.target.value)}
        />

        <Select
          label="Location"
          placeholder={
            !form.site
              ? "Select Site first"
              : isLoadingLocations
              ? "Loading locations..."
              : "Select Location"
          }
          required
          disabled={!form.site || isLoadingLocations}
          options={locationOptions}
          value={form.location}
          onChange={(e) => handleLocationChange(e.target.value)}
        />
        {locationError && <p className="text-xs text-red-600 -mt-2">{locationError}</p>}

        {form.location && (
          <>
            {/* From / To dates: availability is checked once both are set */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm font-medium text-slate-700">
                From <span className="text-red-500">*</span>
                <input
                  type="date"
                  value={form.fromDate}
                  min={getToday()}
                  max={form.toDate || undefined}
                  onChange={(e) => handleFromDateChange(e.target.value)}
                  className={`${fieldClass} mt-1.5`}
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                To <span className="text-red-500">*</span>
                <input
                  type="date"
                  value={form.toDate}
                  min={form.fromDate || getToday()}
                  onChange={(e) => handleToDateChange(e.target.value)}
                  className={`${fieldClass} mt-1.5`}
                />
              </label>
            </div>

            {isCheckingAvailability && (
              <p className="text-xs text-slate-500 -mt-2">Checking availability...</p>
            )}

            {availabilityError && (
              <p className="text-xs text-red-600 -mt-2">{availabilityError}</p>
            )}

            {availabilityChecked && availabilityAvailable && (
              <p className="text-xs text-emerald-600 -mt-2">
                {form.locationLabel || "This location"} is available from{" "}
                {fmtDate(form.fromDate)} to {fmtDate(form.toDate)}.
              </p>
            )}

            {availabilityChecked && !availabilityAvailable && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 -mt-2">
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

            {/* Optional visit time window */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm font-medium text-slate-700">
                From Time
                <input
                  type="time"
                  value={form.fromTime}
                  onChange={(e) => set("fromTime", e.target.value)}
                  className={`${fieldClass} mt-1.5`}
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                To Time
                <input
                  type="time"
                  value={form.toTime}
                  onChange={(e) => set("toTime", e.target.value)}
                  className={`${fieldClass} mt-1.5`}
                />
              </label>
            </div>
            {!isTimeRangeValid && (
              <p className="text-xs text-red-600 -mt-2">
                Enter both times, and make To Time later than From Time.
              </p>
            )}
          </>
        )}

        <Select
          label="Identity Type"
          placeholder={isLoadingLookups ? "Loading..." : "Select Identity Type"}
          required
          disabled={
            !form.site || !availabilityChecked || !availabilityAvailable || isLoadingLookups
          }
          options={identityTypeOptions}
          value={form.identityType}
          onChange={(e) => handleIdentityTypeChange(e.target.value)}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700">
              Identity Number <span className="text-red-500">*</span>
            </span>
            {selectedIdentityTypeRecord && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowIdentityInfo((v) => !v)}
                  className="p-1 rounded-full text-slate-400 hover:bg-primary-50 hover:text-primary-700"
                  aria-label="Identity number format requirements"
                >
                  <Info size={15} />
                </button>
                {showIdentityInfo && (
                  <div className="absolute right-0 z-10 mt-1 w-64 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-lg">
                    <p className="font-medium text-slate-700 mb-1.5">
                      {selectedIdentityTypeRecord.identity_type_name} — Identity Number
                    </p>
                    <ul className="space-y-1">
                      <li>Validation: {selectedIdentityTypeRecord.identity_number_validation}</li>
                      {selectedIdentityTypeRecord.identity_number_format && (
                        <li>Format: {selectedIdentityTypeRecord.identity_number_format}</li>
                      )}
                      {selectedIdentityTypeRecord.identity_number_digits != null && (
                        <li>Digits: {selectedIdentityTypeRecord.identity_number_digits}</li>
                      )}
                      {selectedIdentityTypeRecord.identity_number_alphabets != null && (
                        <li>Letters: {selectedIdentityTypeRecord.identity_number_alphabets}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

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
              : "No existing record found — enter visitor details below."}
          </p>
        )}

        {form.searchResults.length > 0 && (
          <Select
            label="Visitors"
            placeholder="Select Visitor"
            options={visitorOptions}
            value={form.selectedVisitorIndex}
            onChange={(e) => handleSelectVisitor(e.target.value)}
          />
        )}

        {selectedPerson?.is_banned && (
          <p className="text-xs text-red-600 -mt-2">
            This person is banned and cannot be pre-registered.
          </p>
        )}

        <Input
          label="Full Name"
          placeholder="Enter full name"
          required
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700">
              Contact <span className="text-red-500">*</span>
            </span>
            {selectedIdentityTypeRecord && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPhoneInfo((v) => !v)}
                  className="p-1 rounded-full text-slate-400 hover:bg-primary-50 hover:text-primary-700"
                  aria-label="Contact number format requirements"
                >
                  <Info size={15} />
                </button>
                {showPhoneInfo && (
                  <div className="absolute right-0 z-10 mt-1 w-64 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-lg">
                    <p className="font-medium text-slate-700 mb-1.5">
                      {selectedIdentityTypeRecord.identity_type_name} — Contact
                    </p>
                    <ul className="space-y-1">
                      <li>Validation: {selectedIdentityTypeRecord.phone_number_validation}</li>
                      {selectedIdentityTypeRecord.phone_number_format && (
                        <li>Format: {selectedIdentityTypeRecord.phone_number_format}</li>
                      )}
                      {selectedIdentityTypeRecord.phone_number_min != null && (
                        <li>Min digits: {selectedIdentityTypeRecord.phone_number_min}</li>
                      )}
                      {selectedIdentityTypeRecord.phone_number_max != null && (
                        <li>Max digits: {selectedIdentityTypeRecord.phone_number_max}</li>
                      )}
                      {selectedIdentityTypeRecord.phone_number_starting_with && (
                        <li>Starts with: {selectedIdentityTypeRecord.phone_number_starting_with}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <Input
            placeholder={
              selectedIdentityTypeRecord?.phone_number_format
                ? `e.g. ${selectedIdentityTypeRecord.phone_number_format}`
                : "Enter mobile number"
            }
            value={form.contact}
            disabled={!!selectedPerson}
            onChange={(e) => set("contact", e.target.value)}
          />

          {form.contact && !isContactValid && (
            <p className="text-xs text-red-600 mt-1.5">{contactErrorMessage}</p>
          )}
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="Enter email address"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
        />

        <Select
          label="Type of Visitor"
          placeholder={isLoadingLookups ? "Loading..." : "Select Type"}
          required
          disabled={isLoadingLookups}
          options={visitorTypeOptions}
          value={form.visitorType}
          onChange={(e) => handleVisitorTypeChange(e.target.value)}
        />

        {showCompanyFields && (
          <>
            <Input
              label="Company Name"
              placeholder="Enter company name"
              required
              value={form.companyName}
              onChange={(e) => set("companyName", e.target.value)}
            />
            <div>
              <Input
                label="Company Phone Number"
                placeholder="10-digit phone number"
                required
                value={form.companyPhone}
                onChange={(e) => set("companyPhone", e.target.value)}
              />
              {form.companyPhone && !isCompanyPhoneValid && (
                <p className="text-xs text-red-600 mt-1.5">Must be 10 digits.</p>
              )}
            </div>
          </>
        )}

        {/* <Select
          label="Pass Number"
          placeholder={
            !form.site
              ? "Select Site first"
              : !form.visitorType
              ? "Select Type of Visitor first"
              : isLoadingPasses
              ? "Loading passes..."
              : passOptions.length === 0
              ? "No passes available for this type"
              : "Select Pass"
          }
          disabled={
            !form.site || !form.visitorType || isLoadingPasses || passOptions.length === 0
          }
          options={passOptions}
          value={form.passNumber}
          onChange={(e) => set("passNumber", e.target.value)}
        /> */}

        {/* <Select
          label="Key"
          placeholder={
            !form.site
              ? "Select Site first"
              : isLoadingKeys
              ? "Loading keys..."
              : keyOptions.length === 0
              ? "No keys available"
              : "Select Key"
          }
          disabled={!form.site || isLoadingKeys || keyOptions.length === 0}
          options={keyOptions}
          value={form.key}
          onChange={(e) => set("key", e.target.value)}
        /> */}
        {/* {assetsError && <p className="text-xs text-red-600 -mt-2">{assetsError}</p>} */}

        <Input
          label="Vehicle"
          placeholder="Vehicle number (optional)"
          value={form.vehicle}
          onChange={(e) => set("vehicle", e.target.value)}
        />

        <Input
          label="Check-in Remark"
          type="textarea"
          placeholder="Any remarks..."
          value={form.remark}
          onChange={(e) => set("remark", e.target.value)}
        />

        {/* Approver: users of this site whose role has the Approval menu enabled */}
        <Select
          label="Approver Email"
          placeholder={
            !form.site
              ? "Select Site first"
              : isLoadingApprovers
              ? "Loading approvers..."
              : approverOptions.length === 0
              ? "No approvers for this site"
              : "Select Approver"
          }
          required
          disabled={!form.site || isLoadingApprovers || approverOptions.length === 0}
          options={approverOptions}
          value={form.approverEmail}
          onChange={(e) => set("approverEmail", e.target.value)}
        />
        {approverError && <p className="text-xs text-red-600 -mt-2">{approverError}</p>}

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

/* ---------------------------------------------------------------------- */
/* Page                                                                     */
/* ---------------------------------------------------------------------- */

const PreRegistration = () => {
  const [records, setRecords] = useState<PreRegistrationRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  // create / edit modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<PreRegistrationRecord | null>(null);

  // delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<PreRegistrationRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // ---------- logged-in user (admin vs my-site) ----------
  const [storedUser] = useState<StoredUser | null>(() => userStorage.getUser<StoredUser>());
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;
  const subsiteOptions: SiteItem[] =
    storedUser?.permissions?.find((p) => p.menu_key === PRE_REG_MENU_KEY)?.subsites ?? [];

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

  const modalSiteOptions: SiteOption[] = isSuperAdmin
    ? allSites.map((s) => ({
        label: `${s.site_name} (${s.site_model.name})`,
        value: s.guid,
      }))
    : ownSite
    ? [{ label: ownSite.name, value: ownSite.guid }]
    : [];

  // "" = All Sites (super admin only)
  const [siteFilter, setSiteFilter] = useState<string>(isSuperAdmin ? "" : ownSite?.guid ?? "");

   // non-admin viewing a site other than their own = read-only
  const isReadOnlySite =
    !isSuperAdmin && !!siteFilter && siteFilter !== ownSite?.guid;

  const filterOptions: SiteOption[] = isSuperAdmin
    ? [
        { label: "All Sites", value: "" },
        ...siteChoices.map((s) => ({ label: s.name, value: s.guid })),
      ]
    : siteChoices.map((s) => ({
        label:
          s.guid === ownSite?.guid
            // ? `${s.name} (My Site)`
            // : `${s.name}${s.site_code ? ` (${s.site_code})` : ""}`,
            ? `${s.name} (Primary)`
            : `${s.name} (Other)`,
        value: s.guid,
      }));

  // ----- identity types + visitor types (loaded the first time the modal opens) -----
  const [identityTypeRecords, setIdentityTypeRecords] = useState<IdentityTypeRecord[]>([]);
  const [visitorTypeOptions, setVisitorTypeOptions] = useState<SiteOption[]>([]);
  const [isLoadingLookups, setIsLoadingLookups] = useState(false);
  const lookupsLoaded = useRef(false);

  useEffect(() => {
    if (!isModalOpen || lookupsLoaded.current) return;
    let cancelled = false;

    (async () => {
      setIsLoadingLookups(true);
      try {
        const [identityRes, visitorTypeRes] = await Promise.all([
          identityTypeService.list("", "", ""),
          visitorTypeService.list(1, 100, ""),
        ]);
        if (cancelled) return;

        if (identityRes.success && identityRes.data) {
          setIdentityTypeRecords(identityRes.data.results);
        }
        if (visitorTypeRes.success && visitorTypeRes.data) {
          setVisitorTypeOptions(
            visitorTypeRes.data.results
              .filter((t) => t.is_active)
              .map((t) => ({ label: t.name, value: t.guid }))
          );
        }
        lookupsLoaded.current = identityRes.success && visitorTypeRes.success;
      } catch {
        /* leave lists empty; retried on next open */
      } finally {
        if (!cancelled) setIsLoadingLookups(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isModalOpen]);

  const identityTypeOptions: SiteOption[] = useMemo(
    () =>
      identityTypeRecords.map((r) => ({
        label: r.identity_type_name,
        value: r.identity_type_name,
      })),
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
        const res = await preRegistrationService.list({
          page,
          page_size: PAGE_SIZE,
          search: debouncedSearch,
          site_guid: siteFilter || null,
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
          setListError(res.message || "Could not load pre-registrations.");
        }
      } catch (err) {
        if (!cancelled) setListError(apiErrorMessage(err, "Could not load pre-registrations."));
      } finally {
        if (!cancelled) setIsLoadingList(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, siteFilter, statusFilter, fromDate, toDate, refreshKey]);

  const handleSiteFilterChange = (value: string) => {
    setSiteFilter(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
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
    setStatusFilter("");
    setFromDate("");
    setToDate("");
    setSiteFilter(isSuperAdmin ? "" : ownSite?.guid ?? "");
    setPage(1);
  };

  // ----- create / edit / delete -----
  const openCreate = () => {
    setEditRecord(null);
    setModalOpen(true);
  };

  const openEdit = (row: PreRegistrationRecord) => {
    setEditRecord(row);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditRecord(null);
  };

  const handleSaved = () => {
    const wasNew = !editRecord;
    closeModal();
    if (wasNew) setPage(1);
    setRefreshKey((k) => k + 1);
  };

  const openDelete = (row: PreRegistrationRecord) => {
    setDeleteTarget(row);
    setDeleteError("");
  };

  const closeDelete = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError("");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      const res = await preRegistrationService.remove(deleteTarget.guid);
      if (res.success) {
        setDeleteTarget(null);
        // step back a page if the last row of the page was removed
        if (records.length === 1 && page > 1) setPage(page - 1);
        setRefreshKey((k) => k + 1);
      } else {
        setDeleteError(res.message || "Could not delete this request.");
      }
    } catch (err) {
      setDeleteError(apiErrorMessage(err, "Could not delete this request."));
    } finally {
      setIsDeleting(false);
    }
  };

  // ---------- table columns ----------
  const columns: TableColumn<PreRegistrationRecord>[] = [
    {
      key: "name",
      header: "Visitor Name",
      render: (row) => row.person.person_name,
    },
    {
      key: "kind",
      header: "Type",
      render: (row) => row.visitor_type?.name ?? row.kind,
    },
    {
      key: "identity",
      header: "Identity",
      render: (row) => `${row.person.identity_type} · ${row.person.identity_number}`,
    },
    {
      key: "contact",
      header: "Contact",
      render: (row) => row.person.phone_number || "—",
    },
    {
      key: "company",
      header: "Company",
      render: (row) => row.company || "—",
    },
    {
      key: "location",
      header: "Location",
      render: (row) => row.location?.name ?? "—",
    },
    {
      key: "site",
      header: "Site",
      render: (row) => row.site.name,
    },
    {
      key: "from_date",
      header: "From",
      render: (row) => fmtDateTime(row.from_date, row.from_time),
    },
    {
      key: "to_date",
      header: "To",
      render: (row) => fmtDateTime(row.to_date, row.to_time),
    },
    {
      key: "approver_email",
      header: "Approver",
      render: (row) => row.approver_email || "—",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span title={row.decision_remark || undefined}>
          <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>
        </span>
      ),
    },
    // {
    //   key: "__actions",
    //   header: "Actions",
    //   render: (row) =>
    //     row.can_edit || row.can_delete ? (
    //       <div className="flex items-center gap-1.5">
    //         {row.can_edit && (
    //           <button
    //             onClick={() => openEdit(row)}
    //             className="p-1.5 rounded-md bg-primary-50 text-primary-700 hover:bg-primary-100"
    //             aria-label="Edit"
    //           >
    //             <Pencil size={15} />
    //           </button>
    //         )}
    //         {row.can_delete && (
    //           <button
    //             onClick={() => openDelete(row)}
    //             className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
    //             aria-label="Delete"
    //           >
    //             <Trash2 size={15} />
    //           </button>
    //         )}
    //       </div>
    //     ) : (
    //       <span className="text-xs text-slate-400">No action</span>
    //     ),
    //   width: "110px",
    // },
        {
      key: "__actions",
      header: "Actions",
      render: (row) => {
        const canEdit = row.can_edit && row.status !== "Rejected";
        const canDelete = row.can_delete && row.status !== "Rejected";
        return canEdit || canDelete ? (
          <div className="flex items-center gap-1.5">
            {canEdit && (
              <button
                onClick={() => openEdit(row)}
                className="p-1.5 rounded-md bg-primary-50 text-primary-700 hover:bg-primary-100"
                aria-label="Edit"
              >
                <Pencil size={15} />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => openDelete(row)}
                className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-400">No action</span>
        );
      },
      width: "110px",
    },
  ];

    const visibleColumns = isReadOnlySite
    ? columns.filter((c) => c.key !== "__actions")
    : columns;

  return (
    <div>
      <PageHeader
        title="Pre-Registration"
        description="Raise and manage pre-registration requests. Approvers review them on the Approval page."
        actions={
          isReadOnlySite ? undefined : (
          <Button icon={<CalendarPlus size={16} />} onClick={openCreate}>
            New Pre-Registration
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
              placeholder="Search name, identity no, contact, location, company, approver..."
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
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`${fieldClass} max-w-[10rem]`}
            aria-label="Filter by status"
          >
            {PRE_REG_STATUS_OPTIONS.map((o) => (
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
            <Table columns={visibleColumns} data={records} keyField="guid" />
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

      <PreRegistrationModal
        isOpen={isModalOpen}
        editRecord={editRecord}
        onClose={closeModal}
        onSaved={handleSaved}
        siteOptions={modalSiteOptions}
        isLoadingSites={isLoadingSites}
        identityTypeOptions={identityTypeOptions}
        identityTypes={identityTypeRecords}
        visitorTypeOptions={visitorTypeOptions}
        isLoadingLookups={isLoadingLookups}
      />

      <Modal
        isOpen={!!deleteTarget}
        onClose={closeDelete}
        title="Delete pre-registration"
        footer={
          <>
            <Button variant="outline" onClick={closeDelete}>
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Delete the pre-registration request for{" "}
            <span className="font-medium">{deleteTarget?.person.person_name}</span>? This
            cannot be undone.
          </p>
          {deleteError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
              <AlertCircle size={16} />
              {deleteError}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PreRegistration;