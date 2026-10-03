// // import { Badge } from "@/components/ui";
// // import { CrudPage } from "@/components/common";
// // import type { FormField } from "@/components/common";
// // import type { TableColumn, BadgeVariant } from "@/types";

// // interface VisitorTypeRecord {
// //   id: string;
// //   name: string;
// //   description: string;
// //   status: string;
// // }

// // const statusVariant: Record<string, BadgeVariant> = {
// //   Active: "success",
// //   Inactive: "neutral",
// // };

// // const columns: TableColumn<VisitorTypeRecord>[] = [
// //   { key: "id", header: "ID" },
// //   { key: "name", header: "Visitor Type Name" },
// //   { key: "description", header: "Description" },
// // ];

// // const formFields: FormField[] = [
// //   {
// //     name: "name",
// //     label: "Visitor Type Name",
// //     required: true,
// //     placeholder: "e.g. Guest, Vendor, Interview",
// //   },
// //   {
// //     name: "description",
// //     label: "Description",
// //     placeholder: "Enter description",
// //   },
// // ];

// // const initialData: VisitorTypeRecord[] = [
// //   { id: "VT-001", name: "Guest", description: "General guests visiting employees", status: "Active" },
// //   { id: "VT-002", name: "Vendor", description: "Suppliers and service vendors", status: "Active" },
// //   { id: "VT-003", name: "Interview", description: "Candidates attending interviews", status: "Active" },
// // ];

// // const VisitorTypeCreation = () => {
// //   return (
// //     <CrudPage
// //       title="Visitor Type Creation"
// //       description="Create and manage the types of visitors."
// //       addLabel="Visitor Type"
// //       idPrefix="VT"
// //       columns={columns}
// //       formFields={formFields}
// //       initialData={initialData}
// //       searchPlaceholder="Search by visitor type, description..."
// //     />
// //   );
// // };

// // export default VisitorTypeCreation;




// import { useCallback, useEffect, useState } from "react";
// import { CrudPage } from "@/components/common";
// import type { FormField } from "@/components/common";
// import type { TableColumn } from "@/types";
// import { visitorTypeService } from "../../service/visitortypeservice";
// import type { VisitorTypeRecord as ApiVisitorTypeRecord } from "../../service/visitortypeservice";

// interface VisitorTypeRow {
//   id: string;
//   guid: string;
//   name: string;
//   description: string;
//   status: string;
// }

// const columns: TableColumn<VisitorTypeRow>[] = [
//   { key: "id", header: "ID" },
//   { key: "name", header: "Visitor Type Name" },
//   { key: "description", header: "Description" },
//   { key: "status", header: "Status" },
// ];

// const formFields: FormField[] = [
//   {
//     name: "name",
//     label: "Visitor Type Name",
//     required: true,
//     placeholder: "e.g. Guest, Vendor, Interview",
//   },
//   {
//     name: "description",
//     label: "Description",
//     placeholder: "Enter description",
//   },
// ];

// const PAGE_SIZE = 10;

// const toRow = (record: ApiVisitorTypeRecord, index: number): VisitorTypeRow => ({
//   id: `VT-${String(index + 1).padStart(3, "0")}`,
//   guid: record.guid,
//   name: record.name,
//   description: record.description,
//   status: record.is_active ? "Active" : "Inactive",
// });

// const VisitorTypeCreation = () => {
//   const [rows, setRows] = useState<VisitorTypeRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const fetchData = useCallback(async (nextPage: number, nextSearch: string) => {
//     setLoading(true);
//     try {
//       const res = await visitorTypeService.list(nextPage, PAGE_SIZE, nextSearch);
//       console.log("[VisitorType] list response:", res);
//       if (res.success && res.data) {
//         setRows(res.data.results.map(toRow));
//         setTotalPages(res.data.pagination?.total_pages ?? 1);
//       }
//     } catch (err) {
//       console.error("[VisitorType] list error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData(page, search);
//   }, [fetchData, page, search]);

//   const handleSearch = (value: string) => {
//     setSearch(value);
//     setPage(1);
//   };

//   const handleAdd = async (values: Record<string, string>) => {
//     console.log("[VisitorType] handleAdd CALLED with:", values);
//     try {
//       const res = await visitorTypeService.create({
//         name: values.name,
//         description: values.description ?? "",
//         is_active: true,
//       });
//       console.log("[VisitorType] create response:", res);
//       if (res.success) {
//         await fetchData(page, search);
//       }
//       return res;
//     } catch (err) {
//       console.error("[VisitorType] create error:", err);
//       throw err;
//     }
//   };

//   const handleEdit = async (row: VisitorTypeRow, values: Record<string, string>) => {
//     console.log("[VisitorType] handleEdit CALLED with:", row, values);
//     try {
//       const res = await visitorTypeService.update(row.guid, {
//         name: values.name,
//         description: values.description ?? "",
//         is_active: row.status === "Active",
//       });
//       console.log("[VisitorType] update response:", res);
//       if (res.success) {
//         await fetchData(page, search);
//       }
//       return res;
//     } catch (err) {
//       console.error("[VisitorType] update error:", err);
//       throw err;
//     }
//   };

//   const handleDelete = async (row: VisitorTypeRow) => {
//     console.log("[VisitorType] handleDelete CALLED with:", row);
//     try {
//       const res = await visitorTypeService.delete(row.guid);
//       console.log("[VisitorType] delete response:", res);
//       if (res.success) {
//         await fetchData(page, search);
//       }
//       return res;
//     } catch (err) {
//       console.error("[VisitorType] delete error:", err);
//       throw err;
//     }
//   };

//   return (
//     <CrudPage
//       title="Visitor Type Creation"
//       description="Create and manage the types of visitors."
//       addLabel="Visitor Type"
//       idPrefix="VT"
//       columns={columns}
//       formFields={formFields}
//       data={rows}
//       loading={loading}
//       searchPlaceholder="Search by visitor type, description..."
//       onSearch={handleSearch}
//       onAdd={handleAdd}
//       onEdit={handleEdit}
//       onDelete={handleDelete}
//       pagination={{ page, totalPages, onPageChange: setPage }}
//     />
//   );
// };

// export default VisitorTypeCreation;



import { useEffect, useState } from "react";
import { CrudPage } from "@/components/common";
import type { FormField } from "@/components/common";
import type { TableColumn } from "@/types";
import { visitorTypeService } from "@/service/visitortypeservice";
import type { VisitorTypeRecord } from "@/service/visitortypeservice";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const extractError = (error: any, fallback: string): string => {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.entries(data.errors)[0] as [string, string[]] | undefined;
    if (first) return first[1]?.[0] ?? fallback;
  }
  return data?.message || fallback;
};

// ---------- columns ----------
const columns: TableColumn<VisitorTypeRecord>[] = [
  { key: "name", header: "Visitor Type Name" },
  { key: "description", header: "Description" },
  {
    key: "is_active",
    header: "Status",
    render: (row) => (row.is_active ? "Active" : "Inactive"),
  },
];

// ---------- form fields ----------
const formFields: FormField[] = [
  {
    name: "name",
    label: "Visitor Type Name",
    required: true,
    placeholder: "e.g. Guest, Vendor, Interview",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Enter description",
  },
];

const buildPayload = (v: Record<string, any>) => ({
  name: String(v.name ?? "").trim(),
  description: String(v.description ?? "").trim(),
  is_active: true,
});

const VisitorTypeCreation = () => {
  const [records, setRecords] = useState<VisitorTypeRecord[]>([]);
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
      const response = await visitorTypeService.list(pageNum, PAGE_SIZE, searchTerm);
      if (response.success && response.data) {
        setRecords(response.data.results);
        setTotalPages(response.data.pagination?.total_pages ?? 1);
        setTotalRecords(
          response.data.pagination?.total_records ?? response.data.results.length
        );
      } else {
        setLoadError(response.message || "Could not load visitor types.");
      }
    } catch (error: any) {
      setLoadError(extractError(error, "Could not load visitor types. Please try again."));
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

  const handleCreate = async (values: Record<string, any>): Promise<string> => {
    try {
      const res = await visitorTypeService.create(buildPayload(values));
      if (!res.success) return res.message || "Something went wrong. Please try again.";
      await fetchList(page, search);
      return "";
    } catch (error: any) {
      return extractError(error, "Something went wrong. Please try again.");
    }
  };

  const handleUpdate = async (
    row: VisitorTypeRecord,
    values: Record<string, any>
  ): Promise<string> => {
    try {
      const res = await visitorTypeService.update(row.guid, buildPayload(values));
      if (!res.success) return res.message || "Something went wrong. Please try again.";
      await fetchList(page, search);
      return "";
    } catch (error: any) {
      return extractError(error, "Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (row: VisitorTypeRecord): Promise<string> => {
    try {
      const res = await visitorTypeService.delete(row.guid);
      if (!res.success) return res.message || "Could not delete this visitor type.";
      if (records.length === 1 && page > 1) setPage((p) => p - 1);
      else await fetchList(page, search);
      return "";
    } catch (error: any) {
      return extractError(error, "Could not delete this visitor type.");
    }
  };

  return (
    <CrudPage
      title="Visitor Type Creation"
      description="Create and manage the types of visitors."
      addLabel="Add Visitor Type"
      columns={columns}
      formFields={formFields}
      searchPlaceholder="Search visitor types..."
      keyField="guid"
      data={records}
      isLoading={isLoading}
      error={loadError}
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
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
};

export default VisitorTypeCreation;