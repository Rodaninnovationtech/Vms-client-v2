// import type { ReactNode } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";

// const ProtectedRoute = ({ children }: { children: ReactNode }) => {
//   const { isAuthenticated } = useAuth();
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   return <>{children}</>;
// };

// export default ProtectedRoute;


import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/context/PermissionContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { isLoading, canAccessPath, firstAllowedPath } = usePermissions();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="p-8 text-sm text-slate-500">Loading permissions...</div>
    );
  }

  if (!canAccessPath(location.pathname)) {
    // Send the user to the first page their role can open
    if (firstAllowedPath && firstAllowedPath !== location.pathname) {
      return <Navigate to={firstAllowedPath} replace />;
    }

    return (
      <div className="p-8 text-sm text-red-600">
        You do not have access to any page. Please contact your administrator.
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;