import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";
import type { VisitKind, VisitRecord } from "@/service/visitorservices";

export type PreRegVisitStatus = "" | "Pending" | "Checked In" | "Checked Out";

export interface PreRegApprovedRecord extends VisitRecord {
  can_check_in: boolean;
  key_name?: string | null;
  pass_name?: string | null;
}

export interface PreRegApprovedListParams {
  page: number | null;
  page_size: number | null;
  search?: string;
  site_guid?: string | null;
  kind?: VisitKind | "";
  visit_status?: PreRegVisitStatus;
  from_date?: string | null;
  to_date?: string | null;
}

export interface PreRegCheckInPayload {
  kind: VisitKind;
  guid: string;
  pass_no?: string;
  key_no?: string;
  vehicle_number?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[] | string>;
}

interface ListData {
  results: PreRegApprovedRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export const preRegApprovedService = {
  list: async (params: PreRegApprovedListParams): Promise<ApiResponse<ListData>> => {
    const response = await interceptor.post<ApiResponse<ListData>>(
      URLs.visitor.preRegApprovedList,
      {
        page: params.page,
        page_size: params.page_size,
        search: params.search ?? "",
        site_guid: params.site_guid || null,
        kind: params.kind ?? "",
        visit_status: params.visit_status ?? "",
        from_date: params.from_date || null,
        to_date: params.to_date || null,
      }
    );
    return response.data;
  },

  checkIn: async (
    payload: PreRegCheckInPayload
  ): Promise<ApiResponse<PreRegApprovedRecord>> => {
    const response = await interceptor.post<ApiResponse<PreRegApprovedRecord>>(
      URLs.visitor.preRegApprovedCheckIn,
      payload
    );
    return response.data;
  },

  bulkCheckIn: async (payload: {
    bulk_id: string;
    pass_no?: string;
    key_no?: string;
  }): Promise<ApiResponse<{ count: number; bulk_id: string }>> => {
    const response = await interceptor.post<ApiResponse<{ count: number; bulk_id: string }>>(
      URLs.visitor.preRegBulkCheckIn,
      payload
    );
    return response.data;
  },

  bulkCheckOut: async (
    bulk_id: string
  ): Promise<ApiResponse<{ count: number; bulk_id: string }>> => {
    const response = await interceptor.post<ApiResponse<{ count: number; bulk_id: string }>>(
      URLs.visitor.preRegBulkCheckOut,
      { bulk_id }
    );
    return response.data;
  },
};