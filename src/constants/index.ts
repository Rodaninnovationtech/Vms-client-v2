//src/constants/insex.ts

export const API_BASE_URL = "http://127.0.0.1:8000";

// ================= FRONTEND ROUTES =================
// export const VmstURls = {
//   loginPage: "http://localhost:5173/login",
//   errorPage: "http://localhost:5173/error-page",
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
    refreshToken: "/accounts/token/refresh/",
  },
  siteType:{
    create:"/site-types/create/",
    update:"site-types/update/",
    list:"site-types/list/",
    delete:"site-types/delete/",
  },
  siteModel: {
    create: "/site-models/create/",
    update: "/site-models/update/",
    list: "/site-models/list/",
    delete: "/site-models/delete/",
  },
   site: {
    create: "/sites/create/",
    update: "/sites/update/",
    list: "/sites/list/",
    delete: "/sites/delete/",
    parentList: "/sites/parent-list/",
    dropdown: "/sites/dropdown/",
  },
  category: {
    create: "/categories/create/",
    list: "/categories/list/",
    update: "/categories/update/",
    delete: "/categories/delete/",
  },
   role: {
    create: "/roles/create/",
    update: "/roles/update/",
    list: "/roles/list/",
    delete: "/roles/delete/",
  },
  rolePermission: {
    get: "/role-permissions/get/",
    save: "/role-permissions/save/",
    mine: "/accounts/my-permissions/",
  },
  user: {
    create: "/users/create/",
    update: "/users/update/",
    list: "/users/list/",
    delete: "/users/delete/",
  },
  tenant: {
    create: "/tenants/create/",
    list: "/tenants/list/",
    update: "/tenants/update/",
    delete: "/tenants/delete/",
  },

  identityType: {
    create: "/identity-types/create/",
    list: "/identity-types/list/",
    update: "/identity-types/update/",
    delete: "/identity-types/delete/",
  },

  key: {
    create: "/keys/create/",
    list: "/keys/list/",
    update: "/keys/update/",
    delete: "/keys/delete/",
  },
  visitorType: {
    create: "/visitor-types/create/",
    list: "/visitor-types/list/",
    update: "/visitor-types/update/",
    delete: "/visitor-types/delete/",
  },
  pass: {
    create: "/passes/create/",
    list: "/passes/list/",
    update: "/passes/update/",
    delete: "/passes/delete/",
  },
  tenantNotification: {
    create: "/tenant-notifications/create/",
    list: "/tenant-notifications/list/",
    update: "/tenant-notifications/update/",
    delete: "/tenant-notifications/delete/",
    checkAvailability: "tenant-notifications/check-availability/",
  },
  visitor: {
    checkIn: "/visitors/check-in/",
    list: "/visitors/list/",
    checkOut: "/visitors/check-out/",
    identitySearch: "/visitors/identity-search/",
    passLookup: "/visitors/pass-lookup/",
    preRegApprovedList: "/pre-registrations/approved-list/",
    preRegApprovedCheckIn: "/pre-registrations/approved-check-in/",
  },
  ban: {
    create: "/bans/create/",
    list: "/bans/list/",
    update: "/bans/update/",
    lift: "/bans/lift/",
    delete: "/bans/delete/",
  },
  // approval: {
  //   approvers: "/approvals/approvers/",
  // },

  preRegistration: {
    create: "/pre-registrations/create/",
    list: "/pre-registrations/list/",
    update: "/pre-registrations/update/",
    delete: "/pre-registrations/delete/",
  },
  approval: {
    approvers: "/approvals/approvers/",
    list: "/approvals/list/", // pending only
    history: "/approvals/history/", // NEW: approved + rejected
    action: "/approvals/action/", // NEW
  },
};

