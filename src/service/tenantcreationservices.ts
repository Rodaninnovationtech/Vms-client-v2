import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface TenantSiteRef {
  guid: string;
  name: string;
  site_code: string;
  site_model: { guid: string; name: string };
  parent: { guid: string; name: string } | null;
}

export interface TenantRecord {
  guid: string;
  first_name: string;
  last_name: string;
  contact: string;
  email: string;
  tenant_name: string;
  block: string;
  floor: string;
  unit: string;
  site: TenantSiteRef;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

export interface TenantPayload {
  first_name: string;
  last_name: string;
  contact: string;
  email: string;
  tenant_name: string;
  block: string;
  floor: string;
  unit: string;
  site: string; // site guid
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface TenantListData {
  results: TenantRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export const tenantService = {
  list: async (
    page: number,
    pageSize: number,
    search?: string,
    site?: { site_guid: string; site_name: string }
  ): Promise<ApiResponse<TenantListData>> => {
    const response = await interceptor.post<ApiResponse<TenantListData>>(
      URLs.tenant.list,
      {
        page,
        page_size: pageSize,
        search: search ?? "",
        site_guid: site?.site_guid ?? null,
        site_name: site?.site_name ?? "",
      }
    );
    return response.data;
  },

  // create: async (payload: TenantPayload): Promise<ApiResponse<TenantRecord>> => {
  //   const response = await interceptor.post<ApiResponse<TenantRecord>>(
  //     URLs.tenant.create,
  //     payload
  //   );
  //   return response.data;
  // },
    // Always sends an array. A single object is wrapped, so the Add Tenant modal still works.
  create: async (
    payload: TenantPayload | TenantPayload[]
  ): Promise<ApiResponse<TenantRecord[]>> => {
    const body = Array.isArray(payload) ? payload : [payload];
    const response = await interceptor.post<ApiResponse<TenantRecord[]>>(
      URLs.tenant.create,
      body
    );
    return response.data;
  },

  update: async (
    guid: string,
    payload: TenantPayload
  ): Promise<ApiResponse<TenantRecord>> => {
    const response = await interceptor.put<ApiResponse<TenantRecord>>(
      URLs.tenant.update,
      { guid, ...payload }
    );
    return response.data;
  },

  delete: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.delete<ApiResponse<null>>(
      URLs.tenant.delete,
      { data: { guid } }
    );
    return response.data;
  },
};