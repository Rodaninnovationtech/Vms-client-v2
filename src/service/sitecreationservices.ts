import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface RelatedRef {
  guid: string;
  name: string;
}

export interface ParentSiteOption {
  guid: string;
  site_name: string;
}

export interface SiteRecord {
  guid: string;
  site_code: string;
  site_name: string;
  site_model: RelatedRef;
  site_type: RelatedRef;
  category: RelatedRef;
  parent: RelatedRef | null; 
  contact: string;
  site_image: string | null; // relative URL, prefix with API_BASE_URL to display
  address: string;
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

interface SiteListData {
  results: SiteRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}


interface ParentSiteListData {
  results: ParentSiteOption[];
}

export interface SitePayload {
  site_code: string;
  site_name: string;
  site_model: string; // guid
  site_type: string; // guid
  category: string; // guid
  parent?: string | null;
  contact: string;
  address: string;
  site_image?: File | null; // required on create, optional on update
}

// The image is a file, so create/update are sent as multipart/form-data.
const buildFormData = (payload: SitePayload, guid?: string): FormData => {
  const formData = new FormData();
  if (guid) formData.append("guid", guid);
  formData.append("site_code", payload.site_code);
  formData.append("site_name", payload.site_name);
  formData.append("site_model", payload.site_model);
  formData.append("site_type", payload.site_type);
  formData.append("category", payload.category);
  formData.append("parent", payload.parent ?? "");
  formData.append("contact", payload.contact);
  formData.append("address", payload.address);
  if (payload.site_image) formData.append("site_image", payload.site_image);
  return formData;
};

const multipartConfig = { headers: { "Content-Type": "multipart/form-data" } };

// export const siteService = {
//   list: async (page: number, pageSize: number): Promise<ApiResponse<SiteListData>> => {
//     const response = await interceptor.post<ApiResponse<SiteListData>>(URLs.site.list, {
//       page,
//       page_size: pageSize,
//     });
//     return response.data;
//   },

export const siteService = {
  // NEW: optional `search` matches against site_name on the backend
  list: async (
    page: number,
    pageSize: number,
    search?: string,
    site?: { site_guid: string; site_name: string }
  ): Promise<ApiResponse<SiteListData>> => {
    const response = await interceptor.post<ApiResponse<SiteListData>>(URLs.site.list, {
      page,
      page_size: pageSize,
      search: search ?? "",
      site_guid: site?.site_guid ?? null,
      site_name: site?.site_name ?? "",
    });
    return response.data;
  },

  create: async (payload: SitePayload): Promise<ApiResponse<SiteRecord>> => {
    const response = await interceptor.post<ApiResponse<SiteRecord>>(
      URLs.site.create,
      buildFormData(payload),
      multipartConfig
    );
    return response.data;
  },

  update: async (guid: string, payload: SitePayload): Promise<ApiResponse<SiteRecord>> => {
    const response = await interceptor.put<ApiResponse<SiteRecord>>(
      URLs.site.update,
      buildFormData(payload, guid),
      multipartConfig
    );
    return response.data;
  },

  delete: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.delete<ApiResponse<null>>(URLs.site.delete, {
      data: { guid },
    });
    return response.data;
  },

  listParents: async (excludeGuid?: string): Promise<ApiResponse<ParentSiteListData>> => {
    const response = await interceptor.post<ApiResponse<ParentSiteListData>>(
      URLs.site.parentList,
      { exclude: excludeGuid ?? "" }
    );
    return response.data;
  },
  
};