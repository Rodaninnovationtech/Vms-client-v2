
const ACCESS_TOKEN_KEY = "vms_access_token";
const REFRESH_TOKEN_KEY = "vms_refresh_token";
const USER_KEY = "vms_user";


export const tokenStorage = {
  getAccessToken: (): string | null => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    console.log(
      "[Storage] Access token:",
      token ? "SAVED" : "NOT FOUND"
    );

    return token;
  },

  getRefreshToken: (): string | null => {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);

    console.log(
      "[Storage] Refresh token:",
      token ? "SAVED" : "NOT FOUND"
    );

    return token;
  },

  setTokens: (
    accessToken: string,
    refreshToken: string
  ) => {
    console.log("[Storage] Saving tokens...");

    console.log(
      "[Storage] Access token received:",
      accessToken ? "YES" : "NO"
    );

    console.log(
      "[Storage] Refresh token received:",
      refreshToken ? "YES" : "NO"
    );

    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken
    );

    localStorage.setItem(
      REFRESH_TOKEN_KEY,
      refreshToken
    );

    console.log(
      "[Storage] Access token saved:",
      !!localStorage.getItem(ACCESS_TOKEN_KEY)
    );

    console.log(
      "[Storage] Refresh token saved:",
      !!localStorage.getItem(REFRESH_TOKEN_KEY)
    );
  },

  clearTokens: () => {
    console.log("[Storage] Clearing access + refresh tokens");

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    console.log(
      "[Storage] Access token after clear:",
      localStorage.getItem(ACCESS_TOKEN_KEY)
    );

    console.log(
      "[Storage] Refresh token after clear:",
      localStorage.getItem(REFRESH_TOKEN_KEY)
    );
  },
};



export const userStorage = {
  getUser: <T>(): T | null => {
    const raw = localStorage.getItem(USER_KEY);

    console.log(
      "[Storage] User:",
      raw ? "SAVED" : "NOT FOUND"
    );

    return raw ? (JSON.parse(raw) as T) : null;
  },

  setUser: (user: unknown) => {
    console.log("[Storage] Saving user:", user);

    localStorage.setItem(USER_KEY, JSON.stringify(user));

    console.log(
      "[Storage] User saved:",
      !!localStorage.getItem(USER_KEY)
    );
  },

  clearUser: () => {
    console.log("[Storage] Clearing user");

    localStorage.removeItem(USER_KEY);

    console.log(
      "[Storage] User after clear:",
      localStorage.getItem(USER_KEY)
    );
  },
};