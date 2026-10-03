// ================= API BASE =================
export const API_BASE_URL = "http://127.0.0.1:8000";

// ================= FRONTEND ROUTES =================
// export const VmstURls = {
//   loginPage: "http://localhost:5174/login",
//   errorPage: "http://localhost:5174/error-page",
// };

export const VmstURls = {
  loginPage: `${window.location.origin}/login`,
  errorPage: `${window.location.origin}/error-page`,
};

// ================= BACKEND APIs =================
export const URLs = {
  auth: {
    login: "/accounts/login/",
    logOut: "/accounts/logout/",
  },
};
