import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface PermissionItem {
  menu_key: string;
  view: boolean;
  enabled: boolean;
}

export interface UserProfile {
  login_id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  profile_photo: string | null; // relative url, prefix with API_BASE_URL
  role: string | null;
  site: string | null;
  is_super_admin: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface RolePermissionData {
  role_guid: string;
  permissions: PermissionItem[];
}

export interface MyPermissionData {
  is_super_admin: boolean;
  role: string | null;
  permissions: PermissionItem[];
  profile: UserProfile;
}

export const rolePermissionService = {
  // Saved permissions of one role (Role Permission page)
  get: async (roleGuid: string): Promise<ApiResponse<RolePermissionData>> => {
    const response = await interceptor.post<ApiResponse<RolePermissionData>>(
      URLs.rolePermission.get,
      { role_guid: roleGuid }
    );
    return response.data;
  },

  // Save all menu rows for one role
  save: async (
    roleGuid: string,
    permissions: PermissionItem[]
  ): Promise<ApiResponse<null>> => {
    const response = await interceptor.post<ApiResponse<null>>(
      URLs.rolePermission.save,
      { role_guid: roleGuid, permissions }
    );
    return response.data;
  },

  // Permissions of the logged-in user (based on user.role)
  mine: async (): Promise<ApiResponse<MyPermissionData>> => {
    const response = await interceptor.get<ApiResponse<MyPermissionData>>(
      URLs.rolePermission.mine
    );
    return response.data;
  },
};