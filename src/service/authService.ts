import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";

export interface LoginPayload {
  login_id: string;
  password: string;
}

export interface LoginResponseData {
  user_id: number;
  login_id: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  site_logo?: string | null;
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await interceptor.post<LoginResponse>(URLs.auth.login, payload);
    return response.data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await interceptor.post(URLs.auth.logOut, { refresh_token: refreshToken });
  },
};
