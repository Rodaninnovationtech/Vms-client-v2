import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { rolePermissionService } from "@/service/rolepermissionservice";
import { navItems } from "@/components/layout/Sidebar/navConfig";

interface Entry {
  view: boolean;
  enabled: boolean;
}

interface PermissionContextValue {
  isLoading: boolean;
  isSuperAdmin: boolean;
  canSeeMenu: (path: string) => boolean;
  canViewSubsites: (path: string) => boolean;
  canAccessPath: (pathname: string) => boolean;
  firstAllowedPath: string | null;
  reload: () => void;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

// Every leaf menu path, in sidebar order
const leafPaths: string[] = navItems.flatMap((item) =>
  item.children?.length ? item.children.map((c) => c.path) : [item.path]
);

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [map, setMap] = useState<Record<string, Entry>>({});
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      setMap({});
      setIsSuperAdmin(false);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    rolePermissionService
      .mine()
      .then((res) => {
        if (cancelled) return;

        if (res.success && res.data) {
          setIsSuperAdmin(res.data.is_super_admin);
          setMap(
            Object.fromEntries(
              res.data.permissions.map((p) => [
                p.menu_key,
                { view: p.view, enabled: p.enabled },
              ])
            )
          );
        } else {
          setIsSuperAdmin(false);
          setMap({});
        }
      })
      .catch(() => {
        if (cancelled) return;
        setIsSuperAdmin(false);
        setMap({});
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, tick]);

  const canSeeMenu = useCallback(
    (path: string) => isSuperAdmin || map[path]?.enabled === true,
    [isSuperAdmin, map]
  );

  const canViewSubsites = useCallback(
    (path: string) => isSuperAdmin || map[path]?.view === true,
    [isSuperAdmin, map]
  );

  // Also covers inner pages such as /property-management/key/bulk-upload
  const canAccessPath = useCallback(
    (pathname: string) =>
      isSuperAdmin ||
      Object.entries(map).some(
        ([key, v]) =>
          v.enabled && (pathname === key || pathname.startsWith(key + "/"))
      ),
    [isSuperAdmin, map]
  );

  const firstAllowedPath = useMemo(
    () => leafPaths.find((p) => canSeeMenu(p)) ?? null,
    [canSeeMenu]
  );

  const value = useMemo(
    () => ({
      isLoading,
      isSuperAdmin,
      canSeeMenu,
      canViewSubsites,
      canAccessPath,
      firstAllowedPath,
      reload: () => setTick((t) => t + 1),
    }),
    [
      isLoading,
      isSuperAdmin,
      canSeeMenu,
      canViewSubsites,
      canAccessPath,
      firstAllowedPath,
    ]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error("usePermissions must be used inside PermissionProvider");
  }
  return ctx;
};