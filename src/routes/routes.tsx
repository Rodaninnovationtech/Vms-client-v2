import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";

import { Dashboard } from "@/pages/Dashboard";
import { Visitor } from "@/pages/Visitor";
import { PreRegistration, BulkUploads  } from "@/pages/PreRegistration";
import { Approval } from "@/pages/Approval";
import { Ban } from "@/pages/Ban";
import { KeyManagement, PassManagement, BulkUpload  } from "@/pages/PropertyManagement";
import {
  SiteTypeCreation,
  SiteModelCreation,
  CategoryCreation,
  SiteCreation,
  TenantCreation,
  BulkUploadTenant,
  RoleCreation,
  RolePermission,
  UserCreation,
  IdentityTypeCreation,
  VisitorTypeCreation,
  TenantNotification,
} from "@/pages/SystemConfig";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";

export interface AppRoute {
  path: string;
  element: ReactNode;
}

// All protected app routes live here. App.tsx just maps over this list —
// add/remove a page by editing this array only.
export const appRoutes: AppRoute[] = [
  { path: "/", element: <Navigate to="/dashboard" replace /> },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/visitor",
    element: (
      <ProtectedRoute>
        <Visitor />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pre-registration",
    element: (
      <ProtectedRoute>
        <PreRegistration />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pre-registration/bulk-uploads",
    element: (
      <ProtectedRoute>
        <BulkUploads />
      </ProtectedRoute>
    ),
  },
  {
    path: "/approval",
    element: (
      <ProtectedRoute>
        <Approval />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ban",
    element: (
      <ProtectedRoute>
        <Ban />
      </ProtectedRoute>
    ),
  },

    {
    path: "/property-management/key",
    element: (
      <ProtectedRoute>
        <KeyManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/property-management/key/bulk-upload",
    element: (
      <ProtectedRoute>
        <BulkUpload type="key" />
      </ProtectedRoute>
    ),
  },
  {
    path: "/property-management/pass",
    element: (
      <ProtectedRoute>
        <PassManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/property-management/pass/bulk-upload",
    element: (
      <ProtectedRoute>
        <BulkUpload type="pass" />
      </ProtectedRoute>
    ),
  },

  {
    path: "/system-config/site-type",
    element: (
      <ProtectedRoute>
        <SiteTypeCreation />
      </ProtectedRoute>
    ),
  },
 {
  path: "/system-config/site-model",
  element: (
    <ProtectedRoute>
      <SiteModelCreation />
    </ProtectedRoute>
  ),
},
  {
    path: "/system-config/category",
    element: (
      <ProtectedRoute>
        <CategoryCreation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/system-config/site",
    element: (
      <ProtectedRoute>
        <SiteCreation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/system-config/tenant",
    element: (
      <ProtectedRoute>
        <TenantCreation />
      </ProtectedRoute>
    ),
  },

  {
    path: "/system-config/tenant/bulk-upload",
    element: (
      <ProtectedRoute>
        <BulkUploadTenant />
      </ProtectedRoute>
    ),
  },
  {
    path: "/system-config/tenant-notification",
    element: (
      <ProtectedRoute>
        <TenantNotification />
      </ProtectedRoute>
    ),
  },
  {
    path: "/system-config/role",
    element: (
      <ProtectedRoute>
        <RoleCreation />
      </ProtectedRoute>
    ),
  },
  {
    path: "/system-config/role-permission",
    element: (
      <ProtectedRoute>
        <RolePermission />
      </ProtectedRoute>
    ),
  },
  {
    path: "/system-config/user",
    element: (
      <ProtectedRoute>
        <UserCreation />
      </ProtectedRoute>
    ),
  },
  {
  path: "/system-config/identity-type",
  element: (
    <ProtectedRoute>
      <IdentityTypeCreation />
    </ProtectedRoute>
  ),
},
{
  path: "/system-config/visitor-type",
  element: (
    <ProtectedRoute>
      <VisitorTypeCreation />
    </ProtectedRoute>
  ),
},

  {
    path: "/report",
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },

  { path: "*", element: <Navigate to="/dashboard" replace /> },
];