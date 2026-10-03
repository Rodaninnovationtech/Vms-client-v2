import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface TenantNotificationSiteRef {
  guid: string;
  name: string;
}

export interface TenantNotificationTenantRef {
  guid: string;
  name: string;
  location: string; // "Name - block/floor/unit" display label
}

export interface TenantNotificationRecord {
  guid: string;
  site: TenantNotificationSiteRef;
  tenant: TenantNotificationTenantRef;
  from_date: string;
  to_date: string;
  message: string;
  status: "Upcoming" | "Active" | "Ended";
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

export interface TenantNotificationPayload {
  site: string; // site guid
  tenant: string; // tenant guid (the "location")
  from_date: string;
  to_date: string;
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface TenantNotificationListData {
  results: TenantNotificationRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export interface AvailabilityConflict {
  from_date: string;
  to_date: string;
  message: string;
}

export interface AvailabilityCheckData {
  available: boolean;
  conflicts: AvailabilityConflict[];
}

export const tenantNotificationService = {
  list: async (
    page: number,
    pageSize: number,
    search?: string,
    siteGuid?: string
  ): Promise<ApiResponse<TenantNotificationListData>> => {
    const response = await interceptor.post<ApiResponse<TenantNotificationListData>>(
      URLs.tenantNotification.list,
      {
        page,
        page_size: pageSize,
        search: search ?? "",
        site_guid: siteGuid || null,
      }
    );
    return response.data;
  },

  create: async (
    payload: TenantNotificationPayload
  ): Promise<ApiResponse<TenantNotificationRecord>> => {
    const response = await interceptor.post<ApiResponse<TenantNotificationRecord>>(
      URLs.tenantNotification.create,
      payload
    );
    return response.data;
  },

  update: async (
    guid: string,
    payload: TenantNotificationPayload
  ): Promise<ApiResponse<TenantNotificationRecord>> => {
    const response = await interceptor.put<ApiResponse<TenantNotificationRecord>>(
      URLs.tenantNotification.update,
      { guid, ...payload }
    );
    return response.data;
  },

  delete: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.delete<ApiResponse<null>>(
      URLs.tenantNotification.delete,
      { data: { guid } }
    );
    return response.data;
  },



  checkAvailability: async (
    tenant: string,
    fromDate: string,
    toDate: string
  ): Promise<ApiResponse<AvailabilityCheckData>> => {
    const response = await interceptor.post<ApiResponse<AvailabilityCheckData>>(
      URLs.tenantNotification.checkAvailability,
      { tenant, from_date: fromDate, to_date: toDate }
    );
    return response.data;
  },
};