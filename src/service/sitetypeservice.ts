// import interceptor from "@/service/interceptor";
// import { URLs } from "@/constants";

// export interface SiteTypeRecord {
//   guid: string;
//   site_type: string;
//   site_type_description: string;
//   created_by: string | null;
//   created_at: string;
//   updated_by: string | null;
//   updated_at: string;
// }

// interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data?: T;
//   errors?: Record<string, string[]>;
// }

// interface SiteTypeListData {
//   results: SiteTypeRecord[];
//   pagination?: {
//     page: number;
//     page_size: number;
//     total_records: number;
//     total_pages: number;
//   };
// }

// export interface SiteTypePayload {
//   site_type: string;
//   site_type_description: string;
// }

// export const siteTypeService = {
//   // Sends page + page_size so the backend returns one page of 10 records
//   // at a time, along with pagination metadata (total_pages, total_records).
//   list: async (page: number, pageSize: number): Promise<ApiResponse<SiteTypeListData>> => {
//     const response = await interceptor.post<ApiResponse<SiteTypeListData>>(URLs.siteType.list, {
//       page,
//       page_size: pageSize,
//     });
//     return response.data;
//   },

//   create: async (payload: SiteTypePayload): Promise<ApiResponse<SiteTypeRecord>> => {
//     const response = await interceptor.post<ApiResponse<SiteTypeRecord>>(URLs.siteType.create, payload);
//     return response.data;
//   },

//   update: async (guid: string, payload: SiteTypePayload): Promise<ApiResponse<SiteTypeRecord>> => {
//     const response = await interceptor.put<ApiResponse<SiteTypeRecord>>(URLs.siteType.update, {
//       guid,
//       ...payload,
//     });
//     return response.data;
//   },

//   delete: async (guid: string): Promise<ApiResponse<null>> => {
//     const response = await interceptor.delete<ApiResponse<null>>(URLs.siteType.delete, {
//       data: { guid },
//     });
//     return response.data;
//   },
// };







import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface SiteTypeRecord {
  guid: string;
  site_type: string;
  site_type_description: string;
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

interface SiteTypeListData {
  results: SiteTypeRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export interface SiteTypePayload {
  site_type: string;
  site_type_description: string;
}

export const siteTypeService = {
  // Sends page + page_size so the backend returns one page of 10 records
  // at a time, along with pagination metadata (total_pages, total_records).
  list: async (page: number, pageSize: number): Promise<ApiResponse<SiteTypeListData>> => {
    const response = await interceptor.post<ApiResponse<SiteTypeListData>>(URLs.siteType.list, {
      page,
      page_size: pageSize,
    });
    return response.data;
  },

  // Blank page/page_size → backend returns the full, unpaginated list.
  // Used to populate dropdowns (e.g. in Site Creation).
  listAll: async (): Promise<ApiResponse<SiteTypeListData>> => {
    const response = await interceptor.post<ApiResponse<SiteTypeListData>>(URLs.siteType.list, {
      page: "",
      page_size: "",
    });
    return response.data;
  },

  create: async (payload: SiteTypePayload): Promise<ApiResponse<SiteTypeRecord>> => {
    const response = await interceptor.post<ApiResponse<SiteTypeRecord>>(URLs.siteType.create, payload);
    return response.data;
  },

  update: async (guid: string, payload: SiteTypePayload): Promise<ApiResponse<SiteTypeRecord>> => {
    const response = await interceptor.put<ApiResponse<SiteTypeRecord>>(URLs.siteType.update, {
      guid,
      ...payload,
    });
    return response.data;
  },

  delete: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.delete<ApiResponse<null>>(URLs.siteType.delete, {
      data: { guid },
    });
    return response.data;
  },
};