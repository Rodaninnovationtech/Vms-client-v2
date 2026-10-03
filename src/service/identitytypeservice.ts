import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface IdentityTypeRecord {
  guid: string;
  identity_type_name: string;
  identity_number_validation: string;
  identity_number_digits: number | null;
  identity_number_alphabets: number | null;
  identity_number_format: string;
  phone_number_validation: string;
  phone_number_min: number | null;
  phone_number_max: number | null;
  phone_number_starting_with: string;
  phone_number_format: string;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

export interface IdentityTypePayload {
  identity_type_name: string;
  identity_number_validation: string;
  identity_number_digits: number | null;
  identity_number_alphabets: number | null;
  identity_number_format: string;
  phone_number_validation: string;
  phone_number_min: number | null;
  phone_number_max: number | null;
  phone_number_starting_with: string;
  phone_number_format: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface IdentityTypeListData {
  results: IdentityTypeRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export const identityTypeService = {
  list: async (
    page: number,
    pageSize: number,
    search?: string
  ): Promise<ApiResponse<IdentityTypeListData>> => {
    const response = await interceptor.post<ApiResponse<IdentityTypeListData>>(
      URLs.identityType.list,
      { page, page_size: pageSize, search: search ?? "" }
    );
    return response.data;
  },

  create: async (
    payload: IdentityTypePayload
  ): Promise<ApiResponse<IdentityTypeRecord>> => {
    const response = await interceptor.post<ApiResponse<IdentityTypeRecord>>(
      URLs.identityType.create,
      payload
    );
    return response.data;
  },

  update: async (
    guid: string,
    payload: IdentityTypePayload
  ): Promise<ApiResponse<IdentityTypeRecord>> => {
    const response = await interceptor.put<ApiResponse<IdentityTypeRecord>>(
      URLs.identityType.update,
      { guid, ...payload }
    );
    return response.data;
  },

  delete: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.delete<ApiResponse<null>>(
      URLs.identityType.delete,
      { data: { guid } }
    );
    return response.data;
  },
};