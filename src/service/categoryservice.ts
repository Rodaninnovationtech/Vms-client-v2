// import interceptor from "@/service/interceptor";
// import { URLs } from "@/constants";

// export interface CategoryRecord {
//   guid: string;
//   category_name: string;
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

// interface CategoryListData {
//   results: CategoryRecord[];
//   pagination?: {
//     page: number;
//     page_size: number;
//     total_records: number;
//     total_pages: number;
//   };
// }

// export interface CategoryPayload {
//   category_name: string;
// }

// export const categoryService = {
//   list: async (page: number, pageSize: number): Promise<ApiResponse<CategoryListData>> => {
//     const response = await interceptor.post<ApiResponse<CategoryListData>>(URLs.category.list, {
//       page,
//       page_size: pageSize,
//     });
//     return response.data;
//   },

//   create: async (payload: CategoryPayload): Promise<ApiResponse<CategoryRecord>> => {
//     const response = await interceptor.post<ApiResponse<CategoryRecord>>(URLs.category.create, payload);
//     return response.data;
//   },

//   update: async (guid: string, payload: CategoryPayload): Promise<ApiResponse<CategoryRecord>> => {
//     const response = await interceptor.put<ApiResponse<CategoryRecord>>(URLs.category.update, {
//       guid,
//       ...payload,
//     });
//     return response.data;
//   },

//   delete: async (guid: string): Promise<ApiResponse<null>> => {
//     const response = await interceptor.delete<ApiResponse<null>>(URLs.category.delete, {
//       data: { guid },
//     });
//     return response.data;
//   },
// };


import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface CategoryRecord {
  guid: string;
  category_name: string;
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

interface CategoryListData {
  results: CategoryRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export interface CategoryPayload {
  category_name: string;
}

export const categoryService = {
  list: async (page: number, pageSize: number): Promise<ApiResponse<CategoryListData>> => {
    const response = await interceptor.post<ApiResponse<CategoryListData>>(URLs.category.list, {
      page,
      page_size: pageSize,
    });
    return response.data;
  },

  // Blank page/page_size → backend returns the full, unpaginated list.
  // Used to populate dropdowns (e.g. in Site Creation).
  listAll: async (): Promise<ApiResponse<CategoryListData>> => {
    const response = await interceptor.post<ApiResponse<CategoryListData>>(URLs.category.list, {
      page: "",
      page_size: "",
    });
    return response.data;
  },

  create: async (payload: CategoryPayload): Promise<ApiResponse<CategoryRecord>> => {
    const response = await interceptor.post<ApiResponse<CategoryRecord>>(URLs.category.create, payload);
    return response.data;
  },

  update: async (guid: string, payload: CategoryPayload): Promise<ApiResponse<CategoryRecord>> => {
    const response = await interceptor.put<ApiResponse<CategoryRecord>>(URLs.category.update, {
      guid,
      ...payload,
    });
    return response.data;
  },

  delete: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.delete<ApiResponse<null>>(URLs.category.delete, {
      data: { guid },
    });
    return response.data;
  },
};