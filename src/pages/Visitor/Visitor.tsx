// // // // // // // // // // import { Badge } from "@/components/ui";
// // // // // // // // // // import { CrudPage } from "@/components/common";
// // // // // // // // // // import type { FormField } from "@/components/common";
// // // // // // // // // // import type { TableColumn, BadgeVariant } from "@/types";

// // // // // // // // // // interface VisitorRecord {
// // // // // // // // // //   id: string;
// // // // // // // // // //   name: string;
// // // // // // // // // //   type: string;
// // // // // // // // // //   phone: string;
// // // // // // // // // //   hostSite: string;
// // // // // // // // // //   status: string;
// // // // // // // // // // }

// // // // // // // // // // const statusVariant: Record<string, BadgeVariant> = {
// // // // // // // // // //   "Checked In": "success",
// // // // // // // // // //   "Checked Out": "neutral",
// // // // // // // // // //   Pending: "warning",
// // // // // // // // // // };

// // // // // // // // // // const columns: TableColumn<VisitorRecord>[] = [
// // // // // // // // // //   { key: "id", header: "ID" },
// // // // // // // // // //   { key: "name", header: "Name" },
// // // // // // // // // //   { key: "type", header: "Type" },
// // // // // // // // // //   { key: "phone", header: "Phone" },
// // // // // // // // // //   { key: "hostSite", header: "Host Site" },
// // // // // // // // // //   {
// // // // // // // // // //     key: "status",
// // // // // // // // // //     header: "Status",
// // // // // // // // // //     render: (row) => (
// // // // // // // // // //       <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>
// // // // // // // // // //     ),
// // // // // // // // // //   },
// // // // // // // // // // ];

// // // // // // // // // // const formFields: FormField[] = [
// // // // // // // // // //   { name: "name", label: "Full Name", required: true, placeholder: "Enter visitor name" },
// // // // // // // // // //   {
// // // // // // // // // //     name: "type",
// // // // // // // // // //     label: "Type",
// // // // // // // // // //     type: "select",
// // // // // // // // // //     required: true,
// // // // // // // // // //     options: [
// // // // // // // // // //       { label: "Visitor", value: "Visitor" },
// // // // // // // // // //       { label: "Contractor", value: "Contractor" },
// // // // // // // // // //     ],
// // // // // // // // // //   },
// // // // // // // // // //   { name: "phone", label: "Phone Number", required: true, placeholder: "10-digit mobile number" },
// // // // // // // // // //   { name: "hostSite", label: "Host Site", required: true, placeholder: "e.g. Tower A" },
// // // // // // // // // //   {
// // // // // // // // // //     name: "status",
// // // // // // // // // //     label: "Status",
// // // // // // // // // //     type: "select",
// // // // // // // // // //     options: [
// // // // // // // // // //       { label: "Checked In", value: "Checked In" },
// // // // // // // // // //       { label: "Checked Out", value: "Checked Out" },
// // // // // // // // // //       { label: "Pending", value: "Pending" },
// // // // // // // // // //     ],
// // // // // // // // // //   },
// // // // // // // // // // ];

// // // // // // // // // // const initialData: VisitorRecord[] = [
// // // // // // // // // //   { id: "VC-001", name: "Rohit Sharma", type: "Visitor", phone: "9876543210", hostSite: "Tower A", status: "Checked In" },
// // // // // // // // // //   { id: "VC-002", name: "ABC Electricals", type: "Contractor", phone: "9812345670", hostSite: "Tower C", status: "Checked In" },
// // // // // // // // // //   { id: "VC-003", name: "Meena Iyer", type: "Visitor", phone: "9900112233", hostSite: "Tower B", status: "Pending" },
// // // // // // // // // //   { id: "VC-004", name: "Karan Mehta", type: "Visitor", phone: "9723456781", hostSite: "Tower A", status: "Checked Out" },
// // // // // // // // // //   { id: "VC-005", name: "Sri Logistics", type: "Contractor", phone: "9345671234", hostSite: "Tower D", status: "Checked Out" },
// // // // // // // // // //   { id: "VC-006", name: "Priya Nair", type: "Visitor", phone: "9012345678", hostSite: "Tower B", status: "Checked In" },
// // // // // // // // // // ];

// // // // // // // // // // const Visitor = () => {
// // // // // // // // // //   return (
// // // // // // // // // //     <CrudPage
// // // // // // // // // //       title="Visitor / Contractor"
// // // // // // // // // //       description="Manage all visitor and contractor entries across sites."
// // // // // // // // // //       addLabel="Add Visitor"
// // // // // // // // // //       idPrefix="VC"
// // // // // // // // // //       columns={columns}
// // // // // // // // // //       formFields={formFields}
// // // // // // // // // //       initialData={initialData}
// // // // // // // // // //       searchPlaceholder="Search by name, phone, site..."
// // // // // // // // // //     />
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default Visitor;


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
  LogIn,
  LogOut,
  AlertCircle,
  Info,
  ClipboardCheck,
} from "lucide-react";
import { userService } from "@/service/usercreationservices";
import type { SiteDropdownItem } from "@/service/usercreationservices";
import { tenantService } from "@/service/tenantcreationservices";
import { tenantNotificationService } from "@/service/tenantnotificationservices";
import type { AvailabilityConflict } from "@/service/tenantnotificationservices";
import { identityTypeService } from "@/service/identitytypeservice";
import { visitorTypeService } from "@/service/visitortypeservice";
import { passService } from "@/service/passcreationservices";
import { keyService } from "@/service/keycreationservices";
import { visitorService, apiErrorMessage } from "@/service/visitorservices";
import type {
  PersonRecord,
  VisitKind,
  VisitRecord,
} from "@/service/visitorservices";
import { userStorage } from "@/utils/storage";
import PreRegistractionApprovedList from "./PreRegistractionApprovedList";
const VISITOR_MENU_KEY = "/visitor";
const PAGE_SIZE = 10;

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

const withName = (no?: string | null, name?: string | null) => {
  if (!no) return "—";
  return name ? `${no} - ${name}` : no;
};


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
  "Checked In": "success",
  "Checked Out": "neutral",
  Pending: "warning",
};

const KIND_OPTIONS: SiteOption[] = [
  { label: "All Types", value: "" },
  { label: "Visitor", value: "Visitor" },
  { label: "Contractor", value: "Contractor" },
];

// Contractor rows go to the Contractor table and need company details.
// "contructor" matches the current spelling in the API data.
const isCompanyType = (name?: string) =>
  ["contractor", "contructor"].includes((name ?? "").trim().toLowerCase());

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-60";

/* ---------------------------------------------------------------------- */
/* Pass / Key options for a site                                           */
/* ---------------------------------------------------------------------- */

// function useAvailableSiteAssets(siteGuid: string) {
//   const [passOptions, setPassOptions] = useState<SiteOption[]>([]);
//   const [keyOptions, setKeyOptions] = useState<SiteOption[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!siteGuid) {
//       setPassOptions([]);
//       setKeyOptions([]);
//       setError("");
//       setIsLoading(false);
//       return;
//     }
//     let cancelled = false;

//     (async () => {
//       setIsLoading(true);
//       setError("");
//       const [passRes, keyRes] = await Promise.all([
//         passService.list({ page: null, page_size: null, site_guid: siteGuid, status: "Active" }),
//         keyService.list({ page: null, page_size: null, site_guid: siteGuid, status: "Available" }),
//       ]);
//       if (cancelled) return;

//       setPassOptions(
//         passRes.success && passRes.data
//           ? passRes.data.results.map((p) => ({
//               label: `${p.pass_no} - ${p.pass_name}`,
//               value: p.pass_no,
//             }))
//           : []
//       );
//       setKeyOptions(
//         keyRes.success && keyRes.data
//           ? keyRes.data.results.map((k) => ({
//               label: `${k.key_no} - ${k.key_name}`,
//               value: k.key_no,
//             }))
//           : []
//       );
//       if (!passRes.success || !keyRes.success) {
//         setError("Could not load passes/keys for this site.");
//       }
//       setIsLoading(false);
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [siteGuid]);

//   return { passOptions, keyOptions, isLoading, error };
// }

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
/* Cascading Check-In modal                                                */
/* Site -> Location -> Dates/Availability -> Identity -> Visitor details   */
/* ---------------------------------------------------------------------- */

const emptyCheckInForm = {
  location: "", // tenant guid
  locationLabel: "",
  site: "",
  fromDate: "",
  toDate: "",
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
  passNumber: "",
  key: "",
  vehicle: "",
  remark: "",
};

type CheckInForm = typeof emptyCheckInForm;

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckedIn: () => void;
  siteOptions: SiteOption[];
  isLoadingSites: boolean;
  identityTypeOptions: SiteOption[];
  identityTypes: IdentityTypeRecord[];
  visitorTypeOptions: SiteOption[];
  isLoadingLookups: boolean;
}

function CheckInModal({
  isOpen,
  onClose,
  onCheckedIn,
  siteOptions,
  isLoadingSites,
  identityTypeOptions,
  identityTypes,
  visitorTypeOptions,
  isLoadingLookups,
}: CheckInModalProps) {
  const [form, setForm] = useState<CheckInForm>(emptyCheckInForm);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // const {
  //   passOptions,
  //   keyOptions,
  //   isLoading: isLoadingAssets,
  //   error: assetsError,
  // } = useAvailableSiteAssets(isOpen ? form.site : "");

    const {
    passOptions,
    keyOptions,
    isLoadingPasses,
    isLoadingKeys,
    error: assetsError,
  } = useAvailableSiteAssets(isOpen ? form.site : "", isOpen ? form.visitorType : "");


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

  const set = <K extends keyof CheckInForm>(key: K, value: CheckInForm[K]) =>
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

  // Non-admin users have exactly one site: preselect it.
  useEffect(() => {
    if (isOpen && !isLoadingSites && siteOptions.length === 1 && !form.site) {
      const only = siteOptions[0];
      setForm((prev) => ({ ...prev, site: only.value }));
      loadLocationsForSite(only.value, only.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isLoadingSites, siteOptions]);

  const resetAll = () => {
    setForm(emptyCheckInForm);
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
    setForm({ ...emptyCheckInForm, site: value });
    setLocationOptions([]);
    resetAvailability();
    loadLocationsForSite(value, label);
  };

  const handleLocationChange = (value: string) => {
    const label = locationOptions.find((o) => o.value === value)?.label || "";
    const today = getToday();

    setForm((prev) => ({
      ...prev,
      location: value,
      locationLabel: label,
      fromDate: value ? today : "",
      toDate: value ? today : "",
    }));

    if (!value) {
      resetAvailability();
      return;
    }
    checkAvailability(value, today, today);
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
      // const matches = res.success && res.data ? res.data.results : [];
      // setForm((prev) => ({
      //   ...prev,
      //   hasSearched: true,
      //   searchResults: matches,
      //   selectedVisitorIndex: matches.length === 1 ? "0" : "",
      //   fullName: matches.length === 1 ? matches[0].person_name : "",
      //   contact: matches.length === 1 ? matches[0].phone_number : "",
      //   email: matches.length === 1 ? matches[0].email || "" : "",
      // }));
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

  // const handleVisitorTypeChange = (value: string) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     visitorType: value,
  //     companyName: "",
  //     companyPhone: "",
  //   }));
  // };
  const handleVisitorTypeChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      visitorType: value,
      companyName: "",
      companyPhone: "",
      passNumber: "",
    }));
  };

  const selectedPerson: PersonRecord | null =
    form.selectedVisitorIndex !== ""
      ? form.searchResults[Number(form.selectedVisitorIndex)] ?? null
      : null;
  const personBlocked = !!selectedPerson && (selectedPerson.is_banned || selectedPerson.currently_checked_in);

  const canSearch =
    !!form.identityType &&
    form.identityNumber.trim().length > 0 &&
    isIdentityNumberValid &&
    !isSearching;

  const canCheckIn =
    !!form.location &&
    !!form.site &&
    !!form.fromDate &&
    !!form.toDate &&
    availabilityChecked &&
    availabilityAvailable &&
    !!form.identityType &&
    form.identityNumber.trim().length > 0 &&
    isIdentityNumberValid &&
    form.fullName.trim().length > 0 &&
    form.contact.trim().length > 0 &&
    isContactValid &&
    !!form.visitorType &&
    (!showCompanyFields || (form.companyName.trim().length > 0 && isCompanyPhoneValid)) &&
    !personBlocked &&
    !isSubmitting;

  // const visitorOptions = form.searchResults.map((v, i) => ({
  //   label: `${v.person_name} — ${v.phone_number}${v.is_banned ? " (Banned)" : ""}${
  //     v.currently_checked_in ? " (Checked in)" : ""
  //   }`,
  //   value: String(i),
  // }));

  const visitorOptions = form.searchResults.map((v, i) => ({
    label: `${v.person_name} — ${v.phone_number}${v.is_banned ? " (Banned)" : ""}${
      v.currently_checked_in
        ? ` (Checked in${v.checked_in_site ? ` at ${v.checked_in_site.name}` : ""})`
        : ""
    }`,
    value: String(i),
  }));

  const handleSubmit = async () => {
    if (!canCheckIn) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await visitorService.checkIn({
        kind: showCompanyFields ? "Contractor" : "Visitor",
        site: form.site,
        location: form.location,
        person_id: selectedPerson?.id ?? null,
        person_name: form.fullName.trim(),
        identity_type: form.identityType,
        identity_number: form.identityNumber.trim(),
        phone_number: form.contact.trim(),
        email: form.email.trim(),
        company: showCompanyFields ? form.companyName.trim() : "",
        company_phone: showCompanyFields ? form.companyPhone.trim() : "",
        pass_no: form.passNumber,
        key_no: form.key,
        vehicle_number: form.vehicle.trim(),
        remark: form.remark.trim(),
      });
      if (res.success) {
        resetAll();
        onCheckedIn();
      } else {
        setSubmitError(res.message || "Check-in failed.");
      }
    } catch (err) {
      setSubmitError(apiErrorMessage(err, "Check-in failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Check-In Visitor"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canCheckIn}>
            {isSubmitting ? "Checking in..." : "Check In"}
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
            {isCheckingAvailability && (
              <p className="text-xs text-slate-500 -mt-2">Checking availability...</p>
            )}

            {availabilityError && (
              <p className="text-xs text-red-600 -mt-2">{availabilityError}</p>
            )}

            {availabilityChecked && availabilityAvailable && (
              <p className="text-xs text-emerald-600 -mt-2">
                {form.locationLabel || "This location"} is available from {form.fromDate} to{" "}
                {form.toDate}.
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
            This person is banned and cannot be checked in.
          </p>
        )}
        {/* {selectedPerson?.currently_checked_in && !selectedPerson.is_banned && (
          <p className="text-xs text-red-600 -mt-2">This person is already checked in.</p>
        )} */}
        {selectedPerson?.currently_checked_in && !selectedPerson.is_banned && (
          <p className="text-xs text-red-600 -mt-2">
            This person is already checked in -
            {selectedPerson.checked_in_site ? ` ${selectedPerson.checked_in_site.name}` : ""}. 
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

          {/* <Input
            placeholder={
              selectedIdentityTypeRecord?.phone_number_format
                ? `e.g. ${selectedIdentityTypeRecord.phone_number_format}`
                : "Enter mobile number"
            }
            value={form.contact}
            onChange={(e) => set("contact", e.target.value)}
          /> */}
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
              : isLoadingAssets
              ? "Loading passes..."
              : passOptions.length === 0
              ? "No passes available"
              : "Select Pass"
          }
          disabled={!form.site || isLoadingAssets || passOptions.length === 0}
          options={passOptions}
          value={form.passNumber}
          onChange={(e) => set("passNumber", e.target.value)}
        /> */}

        <Select
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
        />

        <Select
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
        />
        {assetsError && <p className="text-xs text-red-600 -mt-2">{assetsError}</p>}

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
/* Check-Out modal: Site -> Assigned Pass -> person details -> Check Out   */
/* ---------------------------------------------------------------------- */

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckedOut: () => void;
  siteOptions: SiteOption[];
  isLoadingSites: boolean;
}

function CheckOutModal({
  isOpen,
  onClose,
  onCheckedOut,
  siteOptions,
  isLoadingSites,
}: CheckOutModalProps) {
  const [site, setSite] = useState("");
  const [passNo, setPassNo] = useState("");
  const [passOptions, setPassOptions] = useState<SiteOption[]>([]);
  const [isLoadingPasses, setIsLoadingPasses] = useState(false);
  const [visit, setVisit] = useState<VisitRecord | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Non-admin users have exactly one site: preselect it.
  useEffect(() => {
    if (isOpen && !isLoadingSites && siteOptions.length === 1 && !site) {
      setSite(siteOptions[0].value);
    }
  }, [isOpen, isLoadingSites, siteOptions, site]);

  // Load passes with status "Assigned" for the selected site
  useEffect(() => {
    if (!isOpen || !site) {
      setPassOptions([]);
      return;
    }
    let cancelled = false;

    (async () => {
      setIsLoadingPasses(true);
      setError("");
      try {
        const res = await passService.list({
          page: null,
          page_size: null,
          site_guid: site,
          status: "Assigned",
        });
        if (cancelled) return;
        if (res.success && res.data) {
          setPassOptions(
            res.data.results.map((p) => ({
              label: `${p.pass_no} - ${p.pass_name}`,
              value: p.pass_no,
            }))
          );
        } else {
          setPassOptions([]);
          setError(res.message || "Could not load passes.");
        }
      } catch {
        if (!cancelled) {
          setPassOptions([]);
          setError("Could not load passes.");
        }
      } finally {
        if (!cancelled) setIsLoadingPasses(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, site]);

  // Look up the checked-in person for the selected pass
  useEffect(() => {
    setVisit(null);
    if (!site || !passNo) return;
    let cancelled = false;

    (async () => {
      setIsLookingUp(true);
      setError("");
      try {
        const res = await visitorService.findByPass(site, passNo);
        if (cancelled) return;
        if (res.success && res.data) setVisit(res.data);
        else setError(res.message || "No checked-in person found for this pass.");
      } catch (err) {
        if (!cancelled)
          setError(apiErrorMessage(err, "Could not load visitor for this pass."));
      } finally {
        if (!cancelled) setIsLookingUp(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [site, passNo]);

  const reset = () => {
    setSite("");
    setPassNo("");
    setPassOptions([]);
    setVisit(null);
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSiteChange = (value: string) => {
    setSite(value);
    setPassNo("");
    setVisit(null);
    setError("");
  };

  const handleSubmit = async () => {
    if (!visit) return;
    setIsSubmitting(true);
    setError("");
    try {
      const res = await visitorService.checkOut(visit.kind, visit.guid);
      if (res.success) {
        reset();
        onCheckedOut();
      } else {
        setError(res.message || "Check-out failed.");
      }
    } catch (err) {
      setError(apiErrorMessage(err, "Check-out failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const detail = (label: string, value?: string | null) => (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-700 text-right">{value || "—"}</span>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Check-Out Visitor"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!visit || isSubmitting}>
            {isSubmitting ? "Checking out..." : "Check Out"}
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
          onChange={(e) => handleSiteChange(e.target.value)}
        />

        <Select
          label="Pass Number"
          placeholder={
            !site
              ? "Select Site first"
              : isLoadingPasses
              ? "Loading passes..."
              : passOptions.length === 0
              ? "No assigned passes"
              : "Select Pass"
          }
          required
          disabled={!site || isLoadingPasses || passOptions.length === 0}
          options={passOptions}
          value={passNo}
          onChange={(e) => setPassNo(e.target.value)}
        />

        {isLookingUp && <p className="text-xs text-slate-500">Loading details...</p>}

        {visit && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
            {detail("Name", visit.person.person_name)}
            {detail("Type", visit.kind)}
            {detail("Identity", `${visit.person.identity_type} · ${visit.person.identity_number}`)}
            {detail("Contact", visit.person.phone_number)}
            {detail("Email", visit.person.email)}
            {visit.kind === "Contractor" && detail("Company", visit.company)}
            {visit.kind === "Contractor" && detail("Company Phone", visit.company_phone)}
            {detail("Location", visit.location?.name)}
            {detail("Site", visit.site.name)}
            {detail("Pass", visit.pass_no)}
            {detail("Key", visit.key_no)}
            {detail("Vehicle", visit.vehicle_number)}
            {detail("Checked In", fmtDate(visit.check_in))}
            {detail("Remark", visit.remark)}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>
    </Modal>
  );
}
/* ---------------------------------------------------------------------- */
/* Page                                                                     */
/* ---------------------------------------------------------------------- */

const Visitor = () => {
  const [records, setRecords] = useState<VisitRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<VisitKind | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const [isCheckInOpen, setCheckInOpen] = useState(false);
  const [isCheckOutOpen, setCheckOutOpen] = useState(false);
  const [showPreReg, setShowPreReg] = useState(false);
  // ---------- logged-in user (admin vs my-site) ----------
  const [storedUser] = useState<StoredUser | null>(() =>
    userStorage.getUser<StoredUser>()
  );
  const isSuperAdmin = storedUser?.is_super_admin === true;
  const ownSite = storedUser?.site_detail ?? null;
  // const subsiteOptions: SiteItem[] =
  //   storedUser?.permissions?.find((p) => p.menu_key === VISITOR_MENU_KEY)?.subsites ?? [];


  const visitorPermission = storedUser?.permissions?.find(
  (p) => p.menu_key === VISITOR_MENU_KEY
);

// subsites appear in the dropdown only when view = true
const subsiteOptions: SiteItem[] = visitorPermission?.view
  ? visitorPermission.subsites ?? []
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

  const checkInSiteOptions: SiteOption[] = isSuperAdmin
    ? allSites.map((s) => ({
        label: `${s.site_name} (${s.site_model.name})`,
        value: s.guid,
      }))
    : ownSite
    ? [{ label: ownSite.name, value: ownSite.guid }]
    : [];

  // "" = All Sites (super admin only)
  const [siteFilter, setSiteFilter] = useState<string>(
    isSuperAdmin ? "" : ownSite?.guid ?? ""
  );

  const isReadOnlySite =
  !isSuperAdmin && !!siteFilter && siteFilter !== ownSite?.guid;

  const filterOptions: SiteOption[] = isSuperAdmin
    ? [
        { label: "All Sites", value: "" },
        ...siteChoices.map((s) => ({ label: s.name, value: s.guid })),
      ]
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

  // ----- identity types + visitor types (loaded the first time the modal opens) -----
  const [identityTypeRecords, setIdentityTypeRecords] = useState<IdentityTypeRecord[]>([]);
  const [visitorTypeOptions, setVisitorTypeOptions] = useState<SiteOption[]>([]);
  const [isLoadingLookups, setIsLoadingLookups] = useState(false);
  const lookupsLoaded = useRef(false);

  useEffect(() => {
    if (!isCheckInOpen || lookupsLoaded.current) return;
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
  }, [isCheckInOpen]);

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
        const res = await visitorService.list({
          page,
          page_size: PAGE_SIZE,
          search: debouncedSearch,
          site_guid: siteFilter || null,
          kind: kindFilter,
          from_date: fromDate || null,
          to_date: toDate || null,
        });
        if (cancelled) return;

        if (res.success && res.data) {
          setRecords(res.data.results);
          setTotalRecords(res.data.pagination?.total_records ?? res.data.results.length);
          setTotalPages(Math.max(1, res.data.pagination?.total_pages ?? 1));
        } else {
          setListError(res.message || "Could not load visitors.");
        }
      } catch (err) {
        if (!cancelled) setListError(apiErrorMessage(err, "Could not load visitors."));
      } finally {
        if (!cancelled) setIsLoadingList(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, siteFilter, kindFilter, fromDate, toDate, refreshKey]);

  const handleSiteFilterChange = (value: string) => {
    setSiteFilter(value);
    setPage(1);
  };

  const handleKindChange = (value: string) => {
    setKindFilter(value as VisitKind | "");
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
    setKindFilter("");
    setFromDate("");
    setToDate("");
    setSiteFilter(isSuperAdmin ? "" : ownSite?.guid ?? "");
    setPage(1);
  };

  // const handleCheckOut = async (row: VisitRecord) => {
  //   if (!window.confirm(`Check out "${row.person.person_name}"?`)) return;
  //   try {
  //     const res = await visitorService.checkOut(row.kind, row.guid);
  //     if (res.success) setRefreshKey((k) => k + 1);
  //     else setListError(res.message || "Check-out failed.");
  //   } catch (err) {
  //     setListError(apiErrorMessage(err, "Check-out failed."));
  //   }
  // };

  // ---------- table columns ----------
  const columns: TableColumn<VisitRecord>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => row.person.person_name,
    },
    { key: "kind", header: "Type" },
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
    key: "email",
    header: "Email",
    render: (row) => row.person.email || "—",
    },
    {
      key: "company",
      header: "Company",
      render: (row) => row.company || "—",
    },
    {
    key: "company_phone",
    header: "Company Phone",
    render: (row) => row.company_phone || "—",
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
    key: "pass",
    header: "Pass",
    render: (row) => withName(row.pass_no, row.pass_name),
    },
    {
      key: "key",
      header: "Key",
      render: (row) => withName(row.key_no, row.key_name),
    },
    {
      key: "vehicle_number",
      header: "Vehicle",
      render: (row) => row.vehicle_number || "—",
    },
    {
      key: "check_in",
      header: "Check In",
      render: (row) =>
        row.check_in
          ? fmtDate(row.check_in)
          : row.from_date
          ? `Due ${fmtDate(row.from_date)}`
          : "—",
    },
    {
      key: "check_out",
      header: "Check Out",
      render: (row) => fmtDate(row.check_out),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={statusVariant[row.status] || "neutral"}>{row.status}</Badge>
      ),
    },
    // {
    //   key: "__actions",
    //   header: "Actions",
    //   render: (row) =>
    //     row.status === "Checked In" ? (
    //       <button
    //         onClick={() => handleCheckOut(row)}
    //         className="p-1.5 rounded-md text-slate-400 hover:bg-primary-50 hover:text-primary-700"
    //         aria-label="Check out"
    //         title="Check out"
    //       >
    //         <LogOut size={15} />
    //       </button>
    //     ) : null,
    //   width: "90px",
    // },
  ];

   if (showPreReg) {
    return (
      <PreRegistractionApprovedList
        onBack={() => {
          setShowPreReg(false);
          setRefreshKey((k) => k + 1);
        }}
        filterOptions={filterOptions}
        siteOptions={checkInSiteOptions}
        isLoadingSites={isLoadingSites}
        initialSite={siteFilter}
        canAct={!isReadOnlySite}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Visitor / Contractor"
        description="Manage all visitor and contractor entries across sites."
        actions={
          isReadOnlySite ? undefined : (
          <div className="flex items-center gap-2">
            <Button
            variant="outline"
            icon={<ClipboardCheck size={16} />}
            onClick={() => setShowPreReg(true)}
          >
            Pre-Registration Approved List
          </Button>
          <Button icon={<LogIn size={16} />} onClick={() => setCheckInOpen(true)}>
            Check-In Visitor
          </Button>
          <Button
              variant="outline"
              icon={<LogOut size={16} />}
              onClick={() => setCheckOutOpen(true)}
            >
              Check-Out Visitor
            </Button>
          </div>
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
              placeholder="Search identity no, name, contact, location, vehicle, email, company..."
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
            value={kindFilter}
            onChange={(e) => handleKindChange(e.target.value)}
            className={`${fieldClass} max-w-[10rem]`}
            aria-label="Filter by type"
          >
            {KIND_OPTIONS.map((o) => (
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
            // <Table columns={columns} data={records} keyField="guid" />
            <div className="overflow-x-auto">
              <Table columns={columns} data={records} keyField="guid" />
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

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setCheckInOpen(false)}
        onCheckedIn={() => {
          setCheckInOpen(false);
          setPage(1);
          setRefreshKey((k) => k + 1);
        }}
        siteOptions={checkInSiteOptions}
        isLoadingSites={isLoadingSites}
        identityTypeOptions={identityTypeOptions}
        identityTypes={identityTypeRecords}
        visitorTypeOptions={visitorTypeOptions}
        isLoadingLookups={isLoadingLookups}
      />
      <CheckOutModal
        isOpen={isCheckOutOpen}
        onClose={() => setCheckOutOpen(false)}
        onCheckedOut={() => {
          setCheckOutOpen(false);
          setRefreshKey((k) => k + 1);
        }}
        siteOptions={checkInSiteOptions}
        isLoadingSites={isLoadingSites}
      />
    </div>
  );
};

export default Visitor;