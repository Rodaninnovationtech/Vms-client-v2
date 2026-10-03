// Save as src/service/passcreationservices.ts

import interceptor from "@/service/interceptor";

import { URLs } from "@/constants";

// ---------- types ----------
export type PassStatus = "Active" | "Assigned" | "Lost";

export interface ApiResult<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[] | string> | Array<Record<string, string[] | string>>;
}

export interface PassSite {
  guid: string;
  name: string;
  site_code: string;
}

export interface PassVisitorType {
  guid: string;
  name: string;
}

export interface PassItem {
  guid: string;
  pass_no: string;
  pass_name: string;
  status: PassStatus;
  site: PassSite;
  visitor_type: PassVisitorType | null;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

export interface PassPayload {
  pass_no: string;
  pass_name: string;
  site: string;          // site guid
  visitor_type: string;  // visitor type guid
  status: PassStatus;
}

export interface PassUpdatePayload extends PassPayload {
  guid: string;
}

export interface PassListParams {
  page?: number | null;
  page_size?: number | null;
  search?: string;
  site_guid?: string | null;
  status?: PassStatus | "";
  visitor_type_guid?: string | null;
}

export interface PassPagination {
  page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
}

export interface PassListData {
  results: PassItem[];
  pagination?: PassPagination;
}

// ---------- helper ----------
type HttpMethod = "post" | "put" | "delete";

async function request<T>(
  method: HttpMethod,
  url: string,
  body: unknown
): Promise<ApiResult<T>> {
  try {
    const res = await interceptor.request({ method, url, data: body });
    return res.data as ApiResult<T>;
  } catch (err) {
    const e = err as { response?: { data?: ApiResult<T> }; message?: string };
    const payload = e.response?.data;
    return {
      success: false,
      message: payload?.message ?? e.message ?? "Something went wrong",
      errors: payload?.errors,
    };
  }
}

// ---------- service ----------
export const passService = {
  list: (params: PassListParams = {}) =>
    request<PassListData>("post", URLs.pass.list, params),

  create: (payload: PassPayload[]) =>
    request<{ results: PassItem[] }>("post", URLs.pass.create, payload),

  update: (payload: PassUpdatePayload) =>
    request<PassItem>("put", URLs.pass.update, payload),

  remove: (guid: string) =>
    request<null>("delete", URLs.pass.delete, { guid }),
};