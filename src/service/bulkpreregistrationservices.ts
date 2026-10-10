import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";
import type { VisitKind, VisitRecord } from "@/service/visitorservices";

export type BulkPersonStatus = "NEW" | "EXISTING";
export type BulkVisitStatus = "" | "Pending" | "Checked In" | "Checked Out";

export interface BulkRowInput {
  row_no: number; // Excel row number, echoed back in the results
  person_name: string;
  identity_type: string;
  identity_number: string;
  phone_number: string;
  email: string;
  company: string;
  company_phone: string;
  vehicle_number: string;
  remark: string;
}

export interface BulkPayload {
  site: string;
  location: string;
  visitor_type: string;
  from_date: string;
  to_date: string;
  from_time: string | null;
  to_time: string | null;
  approver_email: string;
  rows: BulkRowInput[];
}

export interface BulkRowResult {
  row_no: number;
  valid: boolean;
  error: string;
  field: string;
  person_status: BulkPersonStatus | "";
  person_id: number | null;
}

export interface BulkSummary {
  total: number;
  valid: number;
  invalid: number;
  new_persons: number;
  existing_persons: number;
}

export interface BulkValidateData {
  valid: boolean;
  summary: BulkSummary;
  rows: BulkRowResult[];
}

export interface BulkCreateData {
  bulk_id: string;
  kind: VisitKind;
  created: number;
  new_persons: number;
  existing_persons: number;
}

export interface BulkApprovedRecord extends VisitRecord {
  bulk_id: string | null;
  can_check_in: boolean;
}

export interface BulkApprovedListParams {
  page: number | null;
  page_size: number | null;
  search?: string;
  site_guid?: string | null;
  bulk_id?: string;
  kind?: VisitKind | "";
  visit_status?: BulkVisitStatus;
  from_date?: string | null;
  to_date?: string | null;
}

export interface BulkIdRecord {
  bulk_id: string;
  kind: VisitKind;
  site: { guid: string; name: string };
  from_date: string | null;
  to_date: string | null;
  requester_email: string | null;
  created_at: string;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[] | string>;
}

// 400/409 responses that still carry { success:false, data:{ rows } } are returned
// as a normal response so the page can show the row errors.
const passFailure = <T,>(err: unknown): ApiResponse<T> => {
  const body = (err as { response?: { data?: unknown } })?.response?.data;
  if (body && typeof body === "object" && "success" in (body as object)) {
    return body as ApiResponse<T>;
  }
  throw err;
};

export const bulkPreRegistrationService = {
  validate: async (payload: BulkPayload): Promise<ApiResponse<BulkValidateData>> => {
    try {
      const res = await interceptor.post<ApiResponse<BulkValidateData>>(
        URLs.bulkPreRegistration.validate,
        payload
      );
      return res.data;
    } catch (err) {
      return passFailure<BulkValidateData>(err);
    }
  },

  create: async (payload: BulkPayload): Promise<ApiResponse<BulkCreateData | BulkValidateData>> => {
    try {
      const res = await interceptor.post<ApiResponse<BulkCreateData>>(
        URLs.bulkPreRegistration.create,
        payload
      );
      return res.data;
    } catch (err) {
      return passFailure<BulkValidateData>(err);
    }
  },

  approvedList: async (
    params: BulkApprovedListParams
  ): Promise<
    ApiResponse<{
      results: BulkApprovedRecord[];
      pagination?: { page: number; page_size: number; total_records: number; total_pages: number };
    }>
  > => {
    const res = await interceptor.post(URLs.bulkPreRegistration.approvedList, {
      page: params.page,
      page_size: params.page_size,
      search: params.search ?? "",
      site_guid: params.site_guid || null,
      bulk_id: params.bulk_id ?? "",
      kind: params.kind ?? "",
      visit_status: params.visit_status ?? "",
      from_date: params.from_date || null,
      to_date: params.to_date || null,
    });
    return res.data;
  },

  bulkIds: async (
    siteGuid?: string | null,
    search = ""
  ): Promise<ApiResponse<{ results: BulkIdRecord[] }>> => {
    const res = await interceptor.post(URLs.bulkPreRegistration.bulkIds, {
      site_guid: siteGuid || null,
      search,
    });
    return res.data;
  },
};