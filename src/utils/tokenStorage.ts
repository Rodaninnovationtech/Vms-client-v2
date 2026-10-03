// const ACCESS_TOKEN_KEY = "vms_access_token";
// const REFRESH_TOKEN_KEY = "vms_refresh_token";
// const USER_KEY = "vms_user";

// export interface StoredUser {
//   user_id: number;
//   login_id: string;
//   email: string;
//   is_active: boolean;
//   is_staff: boolean;
//   is_superuser: boolean;
// }

// export const tokenStorage = {
//   getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
//   getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),

//   setTokens: (accessToken: string, refreshToken: string) => {
//     localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
//     localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
//   },

//   getUser: (): StoredUser | null => {
//     const raw = localStorage.getItem(USER_KEY);
//     return raw ? (JSON.parse(raw) as StoredUser) : null;
//   },

//   setUser: (user: StoredUser) => {
//     localStorage.setItem(USER_KEY, JSON.stringify(user));
//   },

//   clear: () => {
//     localStorage.removeItem(ACCESS_TOKEN_KEY);
//     localStorage.removeItem(REFRESH_TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//   },
// };
