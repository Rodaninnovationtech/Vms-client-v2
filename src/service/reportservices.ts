// import interceptor from "@/service/interceptor";
// import { URLs } from "@/constants";

// export interface ReportRecord {
//   guid: string;
//   kind: "Visitor" | "Contractor";
//   person_name: string;
//   identity_type: string;
//   identity_number: string;
//   phone_number: string;
//   email: string;
//   visitor_type_name: string;
//   company: string;
//   company_phone: string;
//   site_name: string;
//   location: string;
//   pass_no: string;
//   key_no: string;
//   vehicle_number: string;
//   check_in: string | null;
//   check_out: string | null;
//   status: "Checked In" | "Checked Out";
// }

// export interface ReportListParams {
//   page: number | null;
//   page_size: number | null; // null + null = all rows (export)
//   search?: string;
//   site_guid?: string | null;
//   visitor_type_guid?: string | null;
//   from_date?: string | null;
//   to_date?: string | null;
// }

// export interface ReportListResponse {
//   success: boolean;
//   message?: string;
//   data?: {
//     results: ReportRecord[];
//     pagination?: {
//       total_records: number;
//       total_pages: number;
//       page: number;
//       page_size: number;
//     };
//   };
// }

// export const reportService = {
//   async list(params: ReportListParams): Promise<ReportListResponse> {
//     const { data } = await interceptor.post<ReportListResponse>(URLs.report.list, params);
//     return data;
//   },
// };



import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";
import { apiErrorMessage } from "@/service/visitorservices";

export interface ReportRecord {
  guid: string;
  kind: "Visitor" | "Contractor";
  person_name: string;
  identity_type: string;
  identity_number: string;
  phone_number: string;
  email: string;
  visitor_type_name: string;
  company: string;
  company_phone: string;
  site_name: string;
  location: string;
  pass_no: string;
  key_no: string;
  vehicle_number: string;
  check_in: string | null;
  check_out: string | null;
  status: "Checked In" | "Checked Out";
}

export interface ReportListParams {
  page: number | null;
  page_size: number | null; // null + null = all rows (export)
  search?: string;
  site_guid?: string | null;
  visitor_type_guid?: string | null;
  from_date?: string | null;
  to_date?: string | null;
  isexcel?: boolean | null; // true = Excel file, false = PDF file, omitted = JSON list
}

export interface ReportListResponse {
  success: boolean;
  message?: string;
  data?: {
    results: ReportRecord[];
    pagination?: {
      total_records: number;
      total_pages: number;
      page: number;
      page_size: number;
    };
  };
}

export const reportService = {
  async list(params: ReportListParams): Promise<ReportListResponse> {
    const { data } = await interceptor.post<ReportListResponse>(URLs.report.list, params);
    return data;
  },

  // same endpoint, but the server answers with a file (xlsx / pdf)
  async exportFile(params: ReportListParams): Promise<Blob> {
    const { data } = await interceptor.post<Blob>(URLs.report.list, params, {
      responseType: "blob",
    });
    return data;
  },
};

// With responseType "blob" an error body (JSON) also arrives as a Blob - read it.
export async function exportErrorMessage(err: unknown, fallback: string): Promise<string> {
  const body = (err as { response?: { data?: unknown } })?.response?.data;
  if (body instanceof Blob) {
    try {
      const parsed = JSON.parse(await body.text());
      return parsed?.message || fallback;
    } catch {
      return fallback;
    }
  }
  return apiErrorMessage(err, fallback);
}