import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export type BanType = "TEMPORARY" | "PERMANENT";
export type BanStatus = "Active" | "Upcoming" | "Expired" | "Lifted";

export interface BanPerson {
  id: number;
  person_name: string;
  identity_type: string;
  identity_number: string;
  phone_number: string;
  email: string | null;
}

export interface BanRecord {
  guid: string;
  id: number;
  person: BanPerson;
  site: { guid: string; name: string; site_code?: string };
  ban_type: BanType;
  from_date: string | null; // YYYY-MM-DD
  to_date: string | null; // YYYY-MM-DD
  reason: string;
  is_active: boolean;
  status: BanStatus;
  created_at: string;
  updated_at: string;
}

export interface BanListParams {
  page: number | null;
  page_size: number | null;
  search?: string;
  site_guid?: string | null;
  ban_type?: BanType | "";
  status?: BanStatus | "";
  from_date?: string | null;
  to_date?: string | null;
}

export interface BanCreatePayload {
  person_id: number;
  sites: string[]; // site guids, one ban row is created per site
  ban_type: BanType;
  from_date: string | null;
  to_date: string | null;
  reason: string;
}

export interface BanUpdatePayload {
  guid: string;
  site: string; // site guid
  ban_type: BanType;
  from_date: string | null;
  to_date: string | null;
  reason: string;
  is_active?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[] | string>;
}

interface BanListData {
  results: BanRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export const banService = {
  list: async (params: BanListParams): Promise<ApiResponse<BanListData>> => {
    const response = await interceptor.post<ApiResponse<BanListData>>(URLs.ban.list, {
      page: params.page,
      page_size: params.page_size,
      search: params.search ?? "",
      site_guid: params.site_guid || null,
      ban_type: params.ban_type ?? "",
      status: params.status ?? "",
      from_date: params.from_date || null,
      to_date: params.to_date || null,
    });
    return response.data;
  },

  create: async (
    payload: BanCreatePayload
  ): Promise<ApiResponse<{ results: BanRecord[] }>> => {
    const response = await interceptor.post<ApiResponse<{ results: BanRecord[] }>>(
      URLs.ban.create,
      payload
    );
    return response.data;
  },

  update: async (payload: BanUpdatePayload): Promise<ApiResponse<BanRecord>> => {
    const response = await interceptor.post<ApiResponse<BanRecord>>(URLs.ban.update, payload);
    return response.data;
  },

  lift: async (guid: string): Promise<ApiResponse<BanRecord>> => {
    const response = await interceptor.post<ApiResponse<BanRecord>>(URLs.ban.lift, { guid });
    return response.data;
  },

  delete: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.post<ApiResponse<null>>(URLs.ban.delete, { guid });
    return response.data;
  },
};