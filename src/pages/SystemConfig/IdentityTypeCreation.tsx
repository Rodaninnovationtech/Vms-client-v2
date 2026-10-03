// import { CrudPage } from "@/components/common";
// import type { FormField } from "@/components/common";
// import type { TableColumn } from "@/types";

// interface IdentityTypeRecord {
//   id: string;
//   identityTypeName: string;

//   identityNumberValidation: string;
//   identityNumberDigits: string;
//   identityNumberAlphabets: string;
//   identityNumberFormat: string;

//   phoneNumberValidation: string;
//   phoneNumberMin: string;
//   phoneNumberMax: string;
//   phoneNumberStartingWith: string;
//   phoneNumberFormat: string;
// }

// const columns: TableColumn<IdentityTypeRecord>[] = [
//   { key: "id", header: "ID" },
//   {
//     key: "identityTypeName",
//     header: "Identity Type Name",
//   },
//   {
//     key: "identityNumberValidation",
//     header: "Identity Number Validation",
//   },
//   {
//     key: "identityNumberDigits",
//     header: "ID Digits",
//   },
//   {
//     key: "identityNumberAlphabets",
//     header: "ID Alphabets",
//   },
//   {
//     key: "identityNumberFormat",
//     header: "ID Format",
//   },
//   {
//     key: "phoneNumberValidation",
//     header: "Phone Validation",
//   },
//   {
//     key: "phoneNumberMin",
//     header: "Phone Min",
//   },
//   {
//     key: "phoneNumberMax",
//     header: "Phone Max",
//   },
//   {
//     key: "phoneNumberStartingWith",
//     header: "Phone Starting With",
//   },
//   {
//     key: "phoneNumberFormat",
//     header: "Phone Format",
//   },
// ];

// const validationOptions = [
//   { label: "Required", value: "Required" },
//   { label: "Optional", value: "Optional" },
//   { label: "Not Required", value: "Not Required" },
// ];

// const formFields: FormField[] = [
//   // ─────────────────────────────────────
//   // Identity Type
//   // ─────────────────────────────────────
//   {
//     name: "identityTypeName",
//     label: "Identity Type Name",
//     required: true,
//     placeholder: "e.g. Aadhaar Card",
//   },

//   // ─────────────────────────────────────
//   // Identity Number Validation
//   // ─────────────────────────────────────
//   {
//     name: "identityNumberValidation",
//     label: "Identity Number Validation",
//     type: "select",
//     required: true,
//     options: validationOptions,
//   },
//   {
//     name: "identityNumberDigits",
//     label: "Number of Digits",
//     type: "number",
//     placeholder: "e.g. 12",
//   },
//   {
//     name: "identityNumberAlphabets",
//     label: "Number of Alphabets",
//     type: "number",
//     placeholder: "e.g. 0",
//   },
//   {
//     name: "identityNumberFormat",
//     label: "Identity Number Format",
//     placeholder: "e.g. 123456789012",
//   },

//   // ─────────────────────────────────────
//   // Phone Number Validation
//   // ─────────────────────────────────────
//   {
//     name: "phoneNumberValidation",
//     label: "Phone Number Validation",
//     type: "select",
//     required: true,
//     options: validationOptions,
//   },
//   {
//     name: "phoneNumberMin",
//     label: "Phone Number Minimum Digits",
//     type: "number",
//     placeholder: "e.g. 10",
//   },
//   {
//     name: "phoneNumberMax",
//     label: "Phone Number Maximum Digits",
//     type: "number",
//     placeholder: "e.g. 10",
//   },
//   {
//     name: "phoneNumberStartingWith",
//     label: "Phone Number Starting With",
//     placeholder: "e.g. 6, 7, 8, 9",
//   },
//   {
//     name: "phoneNumberFormat",
//     label: "Phone Number Format",
//     placeholder: "e.g. 9876543210",
//   },
// ];

// const initialData: IdentityTypeRecord[] = [
//   {
//     id: "IDT-001",
//     identityTypeName: "Aadhaar Card",

//     identityNumberValidation: "Required",
//     identityNumberDigits: "12",
//     identityNumberAlphabets: "0",
//     identityNumberFormat: "123456789012",

//     phoneNumberValidation: "Required",
//     phoneNumberMin: "10",
//     phoneNumberMax: "10",
//     phoneNumberStartingWith: "6, 7, 8, 9",
//     phoneNumberFormat: "9876543210",
//   },
//   {
//     id: "IDT-002",
//     identityTypeName: "Passport",

//     identityNumberValidation: "Required",
//     identityNumberDigits: "7",
//     identityNumberAlphabets: "1",
//     identityNumberFormat: "A123456",

//     phoneNumberValidation: "Optional",
//     phoneNumberMin: "10",
//     phoneNumberMax: "10",
//     phoneNumberStartingWith: "6, 7, 8, 9",
//     phoneNumberFormat: "9876543210",
//   },
//   {
//     id: "IDT-003",
//     identityTypeName: "Driving License",

//     identityNumberValidation: "Required",
//     identityNumberDigits: "13",
//     identityNumberAlphabets: "2",
//     identityNumberFormat: "KA0120230012345",

//     phoneNumberValidation: "Optional",
//     phoneNumberMin: "10",
//     phoneNumberMax: "10",
//     phoneNumberStartingWith: "6, 7, 8, 9",
//     phoneNumberFormat: "9876543210",
//   },
// ];

// const IdentityTypeCreation = () => {
//   return (
//     <CrudPage
//       title="Identity Type Creation"
//       description="Configure identity types and their identity and phone number validation rules."
//       addLabel="Add Identity Type"
//       idPrefix="IDT"
//       columns={columns}
//       formFields={formFields}
//       initialData={initialData}
//       searchPlaceholder="Search identity types..."
//     />
//   );
// };

// export default IdentityTypeCreation;




import { useEffect, useState } from "react";
import { CrudPage } from "@/components/common";
import type { FormField } from "@/components/common";
import type { TableColumn } from "@/types";
import { identityTypeService } from "@/service/identitytypeservice";
import type { IdentityTypeRecord } from "@/service/identitytypeservice";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const validationOptions = [
  { label: "Required", value: "Required" },
  { label: "Optional", value: "Optional" },
  { label: "Not Required", value: "Not Required" },
];

const dash = <span className="text-slate-400">—</span>;

const extractError = (error: any, fallback: string): string => {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.entries(data.errors)[0] as [string, string[]] | undefined;
    if (first) return first[1]?.[0] ?? fallback;
  }
  return data?.message || fallback;
};

const toNumber = (v: unknown): number | null => {
  const s = String(v ?? "").trim();
  return s === "" ? null : Number(s);
};

// ---------- columns (same as old UI) ----------
const columns: TableColumn<IdentityTypeRecord>[] = [
  { key: "identity_type_name", header: "Identity Type Name" },
  { key: "identity_number_validation", header: "Identity Number Validation" },
  {
    key: "identity_number_digits",
    header: "ID Digits",
    render: (row) => row.identity_number_digits ?? dash,
  },
  {
    key: "identity_number_alphabets",
    header: "ID Alphabets",
    render: (row) => row.identity_number_alphabets ?? dash,
  },
  {
    key: "identity_number_format",
    header: "ID Format",
    render: (row) => row.identity_number_format || dash,
  },
  { key: "phone_number_validation", header: "Phone Validation" },
  {
    key: "phone_number_min",
    header: "Phone Min",
    render: (row) => row.phone_number_min ?? dash,
  },
  {
    key: "phone_number_max",
    header: "Phone Max",
    render: (row) => row.phone_number_max ?? dash,
  },
  {
    key: "phone_number_starting_with",
    header: "Phone Starting With",
    render: (row) => row.phone_number_starting_with || dash,
  },
  {
    key: "phone_number_format",
    header: "Phone Format",
    render: (row) => row.phone_number_format || dash,
  },
];

// ---------- form fields (same as old UI, names match API) ----------
const formFields: FormField[] = [
  {
    name: "identity_type_name",
    label: "Identity Type Name",
    required: true,
    placeholder: "e.g. Aadhaar Card",
  },
  {
    name: "identity_number_validation",
    label: "Identity Number Validation",
    type: "select",
    required: true,
    options: validationOptions,
  },
  {
    name: "identity_number_digits",
    label: "Number of Digits",
    type: "number",
    placeholder: "e.g. 12",
  },
  {
    name: "identity_number_alphabets",
    label: "Number of Alphabets",
    type: "number",
    placeholder: "e.g. 0",
  },
  {
    name: "identity_number_format",
    label: "Identity Number Format",
    placeholder: "e.g. 123456789012",
  },
  {
    name: "phone_number_validation",
    label: "Phone Number Validation",
    type: "select",
    required: true,
    options: validationOptions,
  },
  {
    name: "phone_number_min",
    label: "Phone Number Minimum Digits",
    type: "number",
    placeholder: "e.g. 10",
  },
  {
    name: "phone_number_max",
    label: "Phone Number Maximum Digits",
    type: "number",
    placeholder: "e.g. 10",
  },
  {
    name: "phone_number_starting_with",
    label: "Phone Number Starting With",
    placeholder: "e.g. 6, 7, 8, 9",
  },
  {
    name: "phone_number_format",
    label: "Phone Number Format",
    placeholder: "e.g. 9876543210",
  },
];

const buildPayload = (v: Record<string, any>) => ({
  identity_type_name: String(v.identity_type_name ?? "").trim(),
  identity_number_validation: v.identity_number_validation,
  identity_number_digits: toNumber(v.identity_number_digits),
  identity_number_alphabets: toNumber(v.identity_number_alphabets),
  identity_number_format: String(v.identity_number_format ?? "").trim(),
  phone_number_validation: v.phone_number_validation,
  phone_number_min: toNumber(v.phone_number_min),
  phone_number_max: toNumber(v.phone_number_max),
  phone_number_starting_with: String(v.phone_number_starting_with ?? "").trim(),
  phone_number_format: String(v.phone_number_format ?? "").trim(),
});

const IdentityTypeCreation = () => {
  const [records, setRecords] = useState<IdentityTypeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchList = async (pageNum: number, searchTerm: string) => {
    setIsLoading(true);
    setLoadError("");
    try {
      const response = await identityTypeService.list(pageNum, PAGE_SIZE, searchTerm);
      if (response.success && response.data) {
        setRecords(response.data.results);
        setTotalPages(response.data.pagination?.total_pages ?? 1);
        setTotalRecords(
          response.data.pagination?.total_records ?? response.data.results.length
        );
      } else {
        setLoadError(response.message || "Could not load identity types.");
      }
    } catch (error: any) {
      setLoadError(extractError(error, "Could not load identity types. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(
      () => fetchList(page, search),
      search ? SEARCH_DEBOUNCE_MS : 0
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  // Each handler returns an error message string on failure, or "" on success
  const handleCreate = async (values: Record<string, any>): Promise<string> => {
    try {
      const res = await identityTypeService.create(buildPayload(values));
      if (!res.success) return res.message || "Something went wrong. Please try again.";
      await fetchList(page, search);
      return "";
    } catch (error: any) {
      return extractError(error, "Something went wrong. Please try again.");
    }
  };

  const handleUpdate = async (
    row: IdentityTypeRecord,
    values: Record<string, any>
  ): Promise<string> => {
    try {
      const res = await identityTypeService.update(row.guid, buildPayload(values));
      if (!res.success) return res.message || "Something went wrong. Please try again.";
      await fetchList(page, search);
      return "";
    } catch (error: any) {
      return extractError(error, "Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (row: IdentityTypeRecord): Promise<string> => {
    try {
      const res = await identityTypeService.delete(row.guid);
      if (!res.success) return res.message || "Could not delete this identity type.";
      if (records.length === 1 && page > 1) setPage((p) => p - 1);
      else await fetchList(page, search);
      return "";
    } catch (error: any) {
      return extractError(error, "Could not delete this identity type.");
    }
  };

  return (
    <CrudPage
      title="Identity Type Creation"
      description="Configure identity types and their identity and phone number validation rules."
      addLabel="Add Identity Type"
      columns={columns}
      formFields={formFields}
      searchPlaceholder="Search identity types..."
      keyField="guid"
      // server data
      data={records}
      isLoading={isLoading}
      error={loadError}
      // search + pagination
      search={search}
      onSearchChange={(value: string) => {
        setSearch(value);
        setPage(1);
      }}
      page={page}
      totalPages={totalPages}
      totalRecords={totalRecords}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      // CRUD
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
};

export default IdentityTypeCreation;