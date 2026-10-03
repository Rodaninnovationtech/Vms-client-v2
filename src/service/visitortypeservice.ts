import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface VisitorTypeRecord {
  guid: string;
  name: string;
  description: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

export interface VisitorTypePayload {
  name: string;
  description: string;
  is_active?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface VisitorTypeListData {
  results: VisitorTypeRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export const visitorTypeService = {
  list: async (
    page: number,
    pageSize: number,
    search?: string
  ): Promise<ApiResponse<VisitorTypeListData>> => {
    const response = await interceptor.post<ApiResponse<VisitorTypeListData>>(
      URLs.visitorType.list,
      { page, page_size: pageSize, search: search ?? "" }
    );
    return response.data;
  },

  create: async (
    payload: VisitorTypePayload
  ): Promise<ApiResponse<VisitorTypeRecord>> => {
    const response = await interceptor.post<ApiResponse<VisitorTypeRecord>>(
      URLs.visitorType.create,
      payload
    );
    return response.data;
  },

  update: async (
    guid: string,
    payload: VisitorTypePayload
  ): Promise<ApiResponse<VisitorTypeRecord>> => {
    const response = await interceptor.put<ApiResponse<VisitorTypeRecord>>(
      URLs.visitorType.update,
      { guid, ...payload }
    );
    return response.data;
  },

  delete: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.delete<ApiResponse<null>>(
      URLs.visitorType.delete,
      { data: { guid } }
    );
    return response.data;
  },
};