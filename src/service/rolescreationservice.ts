import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface RoleRecord {
  guid: string;
  name: string;
  description: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface RoleListData {
  results: RoleRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export interface RolePayload {
  name: string;
  description: string;
  is_active: boolean;
}

export const roleService = {
  // Sends page + page_size so the backend returns one page of records
  // at a time, along with pagination metadata (total_pages, total_records).
  list: async (page: number, pageSize: number): Promise<ApiResponse<RoleListData>> => {
    const response = await interceptor.post<ApiResponse<RoleListData>>(URLs.role.list, {
      page,
      page_size: pageSize,
    });
    return response.data;
  },

  create: async (payload: RolePayload): Promise<ApiResponse<RoleRecord>> => {
    const response = await interceptor.post<ApiResponse<RoleRecord>>(URLs.role.create, payload);
    return response.data;
  },

  update: async (guid: string, payload: RolePayload): Promise<ApiResponse<RoleRecord>> => {
    const response = await interceptor.put<ApiResponse<RoleRecord>>(URLs.role.update, {
      guid,
      ...payload,
    });
    return response.data;
  },

  delete: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.delete<ApiResponse<null>>(URLs.role.delete, {
      data: { guid },
    });
    return response.data;
  },
};