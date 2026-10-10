import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export type VisitKind = "Visitor" | "Contractor";

export interface DashboardFilterPayload {
  site_guid: string | null; // null = all sites (super admin) / own site (normal user)
  from_date: string | null; // YYYY-MM-DD, null = last 30 days
  to_date: string | null;
}

export interface DashboardDailyPoint {
  date: string; // YYYY-MM-DD
  visitor_check_in: number;
  visitor_check_out: number;
  contractor_check_in: number;
  contractor_check_out: number;
}

export interface DashboardSummary {
  from_date: string; // range actually used by the server
  to_date: string;
  sites: {
    parent: number;
    sub: number;
    individual: number;
  };
  totals: {
    passes: number;
    keys: number;
    tenants: number;
    banned: number;
  };
  activity: {
    visitor_check_in: number;
    visitor_check_out: number;
    contractor_check_in: number;
    contractor_check_out: number;
    visitor_not_checked_out: number;
    contractor_not_checked_out: number;
  };
  daily: DashboardDailyPoint[];
}

export interface NotCheckedOutRecord {
  guid: string;
  kind: VisitKind;
  person_name: string;
  identity_number: string;
  phone_number: string;
  company: string;
  site_name: string;
  location: string | null;
  pass_no: string;
  key_no: string;
  check_in: string; // ISO date-time
}

export interface NotCheckedOutListData {
  results: NotCheckedOutRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export const dashboardService = {
  summary: async (
    filters: DashboardFilterPayload
  ): Promise<ApiResponse<DashboardSummary>> => {
    const response = await interceptor.post<ApiResponse<DashboardSummary>>(
      URLs.dashboard.summary,
      filters
    );
    return response.data;
  },

  notCheckedOut: async (
    filters: DashboardFilterPayload,
    page: number,
    pageSize: number,
    kind: VisitKind | "",
    search: string
  ): Promise<ApiResponse<NotCheckedOutListData>> => {
    const response = await interceptor.post<ApiResponse<NotCheckedOutListData>>(
      URLs.dashboard.notCheckedOut,
      { ...filters, page, page_size: pageSize, kind, search }
    );
    return response.data;
  },
};