// import interceptor from "@/service/interceptor";
// import { URLs } from "@/constants";

// export interface SiteModelRecord {
//   guid: string;
//   site_model: string;
//   site_model_description: string;
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

// interface SiteModelListData {
//   results: SiteModelRecord[];
//   pagination?: {
//     page: number;
//     page_size: number;
//     total_records: number;
//     total_pages: number;
//   };
// }

// export interface SiteModelPayload {
//   site_model: string;
//   site_model_description: string;
// }

// export const siteModelService = {
//   // Sends page + page_size so the backend returns one page of records
//   // at a time, along with pagination metadata (total_pages, total_records).
//   list: async (page: number, pageSize: number): Promise<ApiResponse<SiteModelListData>> => {
//     const response = await interceptor.post<ApiResponse<SiteModelListData>>(URLs.siteModel.list, {
//       page,
//       page_size: pageSize,
//     });
//     return response.data;
//   },

//   create: async (payload: SiteModelPayload): Promise<ApiResponse<SiteModelRecord>> => {
//     const response = await interceptor.post<ApiResponse<SiteModelRecord>>(URLs.siteModel.create, payload);
//     return response.data;
//   },

//   update: async (guid: string, payload: SiteModelPayload): Promise<ApiResponse<SiteModelRecord>> => {
//     const response = await interceptor.put<ApiResponse<SiteModelRecord>>(URLs.siteModel.update, {
//       guid,
//       ...payload,
//     });
//     return response.data;
//   },

//   delete: async (guid: string): Promise<ApiResponse<null>> => {
//     const response = await interceptor.delete<ApiResponse<null>>(URLs.siteModel.delete, {
//       data: { guid },
//     });
//     return response.data;
//   },
// };


import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface SiteModelRecord {
  guid: string;
  site_model: string;
  site_model_description: string;
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

interface SiteModelListData {
  results: SiteModelRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export interface SiteModelPayload {
  site_model: string;
  site_model_description: string;
}

export const siteModelService = {
  // Sends page + page_size so the backend returns one page of records
  // at a time, along with pagination metadata (total_pages, total_records).
  list: async (page: number, pageSize: number): Promise<ApiResponse<SiteModelListData>> => {
    const response = await interceptor.post<ApiResponse<SiteModelListData>>(URLs.siteModel.list, {
      page,
      page_size: pageSize,
    });
    return response.data;
  },

  // Blank page/page_size → backend returns the full, unpaginated list.
  // Used to populate dropdowns (e.g. in Site Creation).
  listAll: async (): Promise<ApiResponse<SiteModelListData>> => {
    const response = await interceptor.post<ApiResponse<SiteModelListData>>(URLs.siteModel.list, {
      page: "",
      page_size: "",
    });
    return response.data;
  },

  create: async (payload: SiteModelPayload): Promise<ApiResponse<SiteModelRecord>> => {
    const response = await interceptor.post<ApiResponse<SiteModelRecord>>(URLs.siteModel.create, payload);
    return response.data;
  },

  update: async (guid: string, payload: SiteModelPayload): Promise<ApiResponse<SiteModelRecord>> => {
    const response = await interceptor.put<ApiResponse<SiteModelRecord>>(URLs.siteModel.update, {
      guid,
      ...payload,
    });
    return response.data;
  },

  delete: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.delete<ApiResponse<null>>(URLs.siteModel.delete, {
      data: { guid },
    });
    return response.data;
  },
};