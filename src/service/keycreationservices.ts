// Save as src/service/keycreationservices.ts

import interceptor from "@/service/interceptor";

import { URLs } from "@/constants";

// ---------- types ----------
export type KeyStatus = "Assigned" | "Available" | "Lost";

export interface ApiResult<T> {
  success: boolean;
  message: string;
  data?: T;
  // errors?: Record<string, string[] | string>;
    errors?: Record<string, string[] | string> | Array<Record<string, string[] | string>>;

}

export interface KeySite {
  guid: string;
  name: string;
  site_code: string;
}

export interface KeyItem {
  guid: string;
  key_no: string;
  key_name: string;
  status: KeyStatus;
  site: KeySite;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

export interface KeyPayload {
  key_no: string;
  key_name: string;
  site: string; // site guid
  status: KeyStatus;
}

export interface KeyUpdatePayload extends KeyPayload {
  guid: string;
}

export interface KeyListParams {
  page?: number | null;
  page_size?: number | null;
  search?: string;
  site_guid?: string | null;
  status?: KeyStatus | "";
}

export interface KeyPagination {
  page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
}

export interface KeyListData {
  results: KeyItem[];
  pagination?: KeyPagination;
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
    // DRF error bodies look like { success: false, message, errors }
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
export const keyService = {
  list: (params: KeyListParams = {}) =>
    request<KeyListData>("post", URLs.key.list, params),

  // create: (payload: KeyPayload) =>
  //   request<KeyItem>("post", URLs.key.create, payload),

  create: (payload: KeyPayload[]) =>
  request<{ results: KeyItem[] }>("post", URLs.key.create, payload),
  
  update: (payload: KeyUpdatePayload) =>
    request<KeyItem>("put", URLs.key.update, payload),

  remove: (guid: string) =>
    request<null>("delete", URLs.key.delete, { guid }),
};