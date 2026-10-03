import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";
import type { PreRegistrationRecord } from "@/service/preregistrationservices";

export interface ApprovalRecord extends PreRegistrationRecord {
  // true when the logged-in user may approve / reject this pending request
  can_act: boolean;
}

// History rows are approved / rejected requests; they also carry the decider's name.
export interface ApprovalHistoryRecord extends ApprovalRecord {
  approved_by_name: string | null;
}

// Approval page = PENDING requests only
export interface ApprovalListParams {
  page: number | null;
  page_size: number | null;
  search?: string;
  site_guid?: string | null;
  visitor_type_guid?: string | null;
  from_date?: string | null; // visit period overlaps, YYYY-MM-DD
  to_date?: string | null;
}

export interface ApprovalHistoryParams {
  page: number | null;
  page_size: number | null;
  search?: string;
  site_guid?: string | null;
  visitor_type_guid?: string | null;
  decision?: string; // "" | Approved | Rejected
  decided_from?: string | null; // day approved / rejected, YYYY-MM-DD
  decided_to?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[] | string>;
}

interface Pagination {
  page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
}

interface ApprovalListData {
  results: ApprovalRecord[];
  pagination?: Pagination;
  summary?: { pending: number };
}

interface ApprovalHistoryData {
  results: ApprovalHistoryRecord[];
  pagination?: Pagination;
  summary?: { pending: number; approved: number; rejected: number };
}

export const approvalService = {
  // pending requests waiting for a decision
  list: async (params: ApprovalListParams): Promise<ApiResponse<ApprovalListData>> => {
    const response = await interceptor.post<ApiResponse<ApprovalListData>>(
      URLs.approval.list,
      {
        page: params.page,
        page_size: params.page_size,
        search: params.search ?? "",
        site_guid: params.site_guid || null,
        visitor_type_guid: params.visitor_type_guid || null,
        from_date: params.from_date || null,
        to_date: params.to_date || null,
      }
    );
    return response.data;
  },

  // approved + rejected requests
  history: async (
    params: ApprovalHistoryParams
  ): Promise<ApiResponse<ApprovalHistoryData>> => {
    const response = await interceptor.post<ApiResponse<ApprovalHistoryData>>(
      URLs.approval.history,
      {
        page: params.page,
        page_size: params.page_size,
        search: params.search ?? "",
        site_guid: params.site_guid || null,
        visitor_type_guid: params.visitor_type_guid || null,
        decision: params.decision ?? "",
        decided_from: params.decided_from || null,
        decided_to: params.decided_to || null,
      }
    );
    return response.data;
  },

  // remark is required by the server when rejecting
  act: async (
    guid: string,
    action: "APPROVE" | "REJECT",
    remark = ""
  ): Promise<ApiResponse<ApprovalRecord>> => {
    const response = await interceptor.post<ApiResponse<ApprovalRecord>>(
      URLs.approval.action,
      { guid, action, remark }
    );
    return response.data;
  },
};