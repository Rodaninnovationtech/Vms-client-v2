import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

// ================= TYPES =================

export interface UserRecord {
  id: number;
  login_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  job_title: string;
  gender: string;
  role: { guid: string; name: string } | null;
  site: { guid: string; name: string } | null;
  profile_photo: string | null; // relative url, e.g. /media/user_photos/...
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface UserListData {
  results: UserRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export interface UserPayload {
  login_id: string;
  password: string; // blank on update = keep current password
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  gender: string;
  role: string; // role guid
  site: string; // site guid, "" = none
  is_active: boolean;
  profile_photo: File | null;
}

export interface SiteDropdownItem {
  guid: string;
  site_name: string;
  site_model: { guid: string; name: string };
}

type SiteDropdownData = { results: SiteDropdownItem[] };


// ================= HELPERS =================

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

const buildFormData = (payload: UserPayload, id?: number): FormData => {
  const fd = new FormData();

  if (id !== undefined) fd.append("id", String(id));

  fd.append("login_id", payload.login_id);
  fd.append("first_name", payload.first_name);
  fd.append("last_name", payload.last_name);
  fd.append("email", payload.email);
  fd.append("job_title", payload.job_title);
  fd.append("gender", payload.gender);
  fd.append("role", payload.role);
  fd.append("site", payload.site);
  // always sent: with multipart a missing boolean would be read as false
  fd.append("is_active", String(payload.is_active));

  if (payload.password) fd.append("password", payload.password);
  if (payload.profile_photo) fd.append("profile_photo", payload.profile_photo);

  return fd;
};

// ================= SERVICE =================

export const userService = {
  list: async (
    page: number,
    pageSize: number,
    search = ""
  ): Promise<ApiResponse<UserListData>> => {
    const response = await interceptor.post<ApiResponse<UserListData>>(
      URLs.user.list,
      { page, page_size: pageSize, search }
    );
    return response.data;
  },

  create: async (payload: UserPayload): Promise<ApiResponse<UserRecord>> => {
    const response = await interceptor.post<ApiResponse<UserRecord>>(
      URLs.user.create,
      buildFormData(payload),
      multipart
    );
    return response.data;
  },

  update: async (
    id: number,
    payload: UserPayload
  ): Promise<ApiResponse<UserRecord>> => {
    const response = await interceptor.put<ApiResponse<UserRecord>>(
      URLs.user.update,
      buildFormData(payload, id),
      multipart
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await interceptor.delete<ApiResponse<null>>(
      URLs.user.delete,
      { data: { id } }
    );
    return response.data;
  },

  // Site dropdown: guid, site_name, site_model
  siteDropdown: async (): Promise<ApiResponse<SiteDropdownData>> => {
    const response = await interceptor.get<ApiResponse<SiteDropdownData>>(
      URLs.site.dropdown
    );
    return response.data;
  },

};