import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export type VisitKind = "Visitor" | "Contractor";

export interface PersonRecord {
  id: number;
  person_name: string;
  identity_type: string;
  identity_number: string;
  phone_number: string;
  email: string | null;
  currently_checked_in: boolean;
  is_banned: boolean;
  checked_in_site?: { guid: string; name: string } | null;
}

export interface VisitRecord {
  guid: string;
  id: number;
  kind: VisitKind;
  person: PersonRecord;
  site: { guid: string; name: string };
  location: { guid: string; name: string } | null;
  company: string;
  company_phone: string;
  source: "WALK_IN" | "PRE_REGISTRATION" | "PRE_REGISTRATION_BULK" | string;
  bulk_id: string | null;
  approval_status: string | null;
  requester_email: string | null;
  from_date: string | null;
  to_date: string | null;
  from_time: string | null;
  to_time: string | null;
  check_in: string | null;
  check_out: string | null;
  pass_no: string;
  key_no: string;
  vehicle_number: string;
  remark: string;
  status: "Checked In" | "Checked Out" | "Pending" | string;
  created_at: string;
}

export interface VisitorListParams {
  page: number | null;
  page_size: number | null;
  search?: string;
  site_guid?: string | null;
  kind?: VisitKind | "";
  from_date?: string | null; // YYYY-MM-DD
  to_date?: string | null; // YYYY-MM-DD
}

export interface CheckInPayload {
  kind: VisitKind;
  site: string; // site guid
  location: string; // tenant guid
  person_id?: number | null;
  person_name: string;
  identity_type: string;
  identity_number: string;
  phone_number: string;
  email?: string;
  company?: string;
  company_phone?: string;
  pass_no?: string;
  pass_name?: string | null;
  key_no?: string;
  key_name?: string | null;
  vehicle_number?: string;
  remark?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[] | string>;
}

interface VisitListData {
  results: VisitRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export const visitorService = {
  list: async (params: VisitorListParams): Promise<ApiResponse<VisitListData>> => {
    const response = await interceptor.post<ApiResponse<VisitListData>>(
      URLs.visitor.list,
      {
        page: params.page,
        page_size: params.page_size,
        search: params.search ?? "",
        site_guid: params.site_guid || null,
        kind: params.kind ?? "",
        from_date: params.from_date || null,
        to_date: params.to_date || null,
      }
    );
    return response.data;
  },

  checkIn: async (payload: CheckInPayload): Promise<ApiResponse<VisitRecord>> => {
    const response = await interceptor.post<ApiResponse<VisitRecord>>(
      URLs.visitor.checkIn,
      payload
    );
    return response.data;
  },

  checkOut: async (kind: VisitKind, guid: string): Promise<ApiResponse<VisitRecord>> => {
    const response = await interceptor.post<ApiResponse<VisitRecord>>(
      URLs.visitor.checkOut,
      { kind, guid }
    );
    return response.data;
  },

//   identitySearch: async (
//     identityType: string,
//     identityNumber: string
//   ): Promise<ApiResponse<{ results: PersonRecord[] }>> => {
//     const response = await interceptor.post<ApiResponse<{ results: PersonRecord[] }>>(
//       URLs.visitor.identitySearch,
//       { identity_type: identityType, identity_number: identityNumber }
//     );
//     return response.data;
//   },
// };

  identitySearch: async (
    identityType: string,
    identityNumber: string,
    site?: string
  ): Promise<ApiResponse<{ results: PersonRecord[] }>> => {
    const response = await interceptor.post<ApiResponse<{ results: PersonRecord[] }>>(
      URLs.visitor.identitySearch,
      { identity_type: identityType, identity_number: identityNumber, site: site || null  }
    );
    return response.data;
  },

  findByPass: async (
    site: string,
    passNo: string
  ): Promise<ApiResponse<VisitRecord>> => {
    const response = await interceptor.post<ApiResponse<VisitRecord>>(
      URLs.visitor.passLookup,
      { site, pass_no: passNo }
    );
    return response.data;
  },
};

// Pulls the server's message out of a 4xx response (axios throws on those).
export const apiErrorMessage = (err: unknown, fallback: string): string => {
  const data = (err as { response?: { data?: { message?: string; errors?: Record<string, unknown> } } })
    ?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors)[0];
    const text = Array.isArray(first) ? first[0] : first;
    if (typeof text === "string") return text;
  }
  return data?.message || fallback;
};