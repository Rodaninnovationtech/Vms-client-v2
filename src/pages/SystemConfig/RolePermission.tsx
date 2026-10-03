// // import { useMemo, useState } from "react";
// // import { Save } from "lucide-react";
// // import { Card, PageHeader, Select, Button, Switch } from "@/components/ui";
// // import { navItems } from "@/components/layout/Sidebar/navConfig";

// // const roles = [
// //   { label: "Super Admin", value: "Super Admin" },
// //   { label: "Site Admin", value: "Site Admin" },
// //   { label: "Security Guard", value: "Security Guard" },
// //   { label: "Front Desk", value: "Front Desk" },
// // ];

// // // Flatten the sidebar nav config: parent items with children (Property Management,
// // // System Config) are NOT shown as rows themselves — only their submenus are listed.
// // interface MenuRow {
// //   key: string;
// //   label: string;
// //   parent?: string;
// // }

// // const menuRows: MenuRow[] = navItems.flatMap((item) => {
// //   if (item.children?.length) {
// //     return item.children.map((child) => ({
// //       key: child.path,
// //       label: child.label,
// //       parent: item.label,
// //     }));
// //   }
// //   return [{ key: item.path, label: item.label }];
// // });

// // interface PermissionEntry {
// //   view: boolean;
// //   enabled: boolean;
// // }

// // type PermissionState = Record<string, PermissionEntry>;

// // const buildDefault = (): PermissionState =>
// //   Object.fromEntries(menuRows.map((m) => [m.key, { view: true, enabled: true }]));

// // const RolePermission = () => {
// //   const [selectedRole, setSelectedRole] = useState("Super Admin");
// //   // Keep permission sets per role so switching roles doesn't lose changes.
// //   const [permissionsByRole, setPermissionsByRole] = useState<Record<string, PermissionState>>(
// //     () => Object.fromEntries(roles.map((r) => [r.value, buildDefault()]))
// //   );

// //   const permissions = permissionsByRole[selectedRole];

// //   const toggleView = (key: string) => {
// //     setPermissionsByRole((prev) => ({
// //       ...prev,
// //       [selectedRole]: {
// //         ...prev[selectedRole],
// //         [key]: { ...prev[selectedRole][key], view: !prev[selectedRole][key].view },
// //       },
// //     }));
// //   };

// //   const toggleEnabled = (key: string, value: boolean) => {
// //     setPermissionsByRole((prev) => ({
// //       ...prev,
// //       [selectedRole]: {
// //         ...prev[selectedRole],
// //         [key]: { ...prev[selectedRole][key], enabled: value },
// //       },
// //     }));
// //   };

// //   const enabledCount = useMemo(
// //     () => Object.values(permissions).filter((p) => p.enabled).length,
// //     [permissions]
// //   );

// //   return (
// //     <div>
// //       <PageHeader
// //         title="Role Permission"
// //         description="Control page access and sidebar menu visibility for each role."
// //         actions={
// //           <Button icon={<Save size={16} />} size="sm">
// //             Save Permissions
// //           </Button>
// //         }
// //       />

// //       <Card noPadding>
// //         <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-col sm:flex-row sm:items-end gap-3 sm:justify-between">
// //           <div className="flex flex-col sm:flex-row sm:items-end gap-3">
// //             <div className="max-w-xs w-full">
// //               <Select
// //                 label="Select Role"
// //                 options={roles}
// //                 value={selectedRole}
// //                 onChange={(e) => setSelectedRole(e.target.value)}
// //               />
// //             </div>
// //             <p className="text-xs text-slate-400 sm:mb-2.5">
// //               Toggle permissions for <span className="font-medium text-primary-700">{selectedRole}</span>
// //             </p>
// //           </div>
// //           <p className="text-xs text-slate-400 sm:mb-2.5">
// //             {enabledCount} of {menuRows.length} menus enabled
// //           </p>
// //         </div>

// //         <div className="p-4 sm:p-5 overflow-x-auto">
// //           <table className="w-full text-sm border-collapse min-w-[520px]">
// //             <thead>
// //               <tr className="bg-primary-50/70">
// //                 <th className="px-4 py-3 text-left font-semibold text-primary-800 text-xs uppercase tracking-wide rounded-l-lg">
// //                   Module
// //                 </th>
// //                 <th className="px-4 py-3 text-center font-semibold text-primary-800 text-xs uppercase tracking-wide">
// //                   View Sub-Site List
// //                 </th>
// //                 <th className="px-4 py-3 text-center font-semibold text-primary-800 text-xs uppercase tracking-wide rounded-r-lg">
// //                   Sidebar Menu Access
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {menuRows.map((row) => (
// //                 <tr key={row.key} className="border-t border-slate-100">
// //                   <td className="px-4 py-3 whitespace-nowrap">
// //                     <p className="text-slate-700 font-medium">{row.label}</p>
// //                     {row.parent && (
// //                       <p className="text-xs text-slate-400 mt-0.5">{row.parent}</p>
// //                     )}
// //                   </td>
// //                   <td className="px-4 py-3 text-center">
// //                     <input
// //                       type="checkbox"
// //                       checked={permissions[row.key].view}
// //                       onChange={() => toggleView(row.key)}
// //                       className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-300 cursor-pointer"
// //                     />
// //                   </td>
// //                   <td className="px-4 py-3">
// //                     <div className="flex justify-center">
// //                       <Switch
// //                         checked={permissions[row.key].enabled}
// //                         onChange={(val) => toggleEnabled(row.key, val)}
// //                       />
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default RolePermission;




// import { useEffect, useMemo, useState } from "react";
// import { Save, AlertCircle } from "lucide-react";
// import {
//   Card,
//   PageHeader,
//   Select,
//   Button,
//   Switch,
//   Spinner,
// } from "@/components/ui";
// import { navItems } from "@/components/layout/Sidebar/navConfig";
// import { roleService } from "@/service/rolescreationservice";
// import type { RoleRecord } from "@/service/rolescreationservice";

// interface MenuRow {
//   key: string;
//   label: string;
//   parent?: string;
// }

// const menuRows: MenuRow[] = navItems.flatMap((item) => {
//   if (item.children?.length) {
//     return item.children.map((child) => ({
//       key: child.path,
//       label: child.label,
//       parent: item.label,
//     }));
//   }

//   return [{ key: item.path, label: item.label }];
// });

// interface PermissionEntry {
//   view: boolean;
//   enabled: boolean;
// }

// type PermissionState = Record<string, PermissionEntry>;

// const buildDefault = (): PermissionState =>
//   Object.fromEntries(
//     menuRows.map((m) => [
//       m.key,
//       {
//         view: true,
//         enabled: true,
//       },
//     ])
//   );

// const RolePermission = () => {
//   const [roles, setRoles] = useState<RoleRecord[]>([]);
//   const [selectedRole, setSelectedRole] = useState("");

//   const [permissionsByRole, setPermissionsByRole] = useState<
//     Record<string, PermissionState>
//   >({});

//   const [isLoadingRoles, setIsLoadingRoles] = useState(true);
//   const [loadError, setLoadError] = useState("");

//   /**
//    * Fetch roles from Role Creation list API
//    */
//   useEffect(() => {
//     const fetchRoles = async () => {
//       setIsLoadingRoles(true);
//       setLoadError("");

//       try {
//         // page and page_size sent to backend
//         const response = await roleService.list(1, 100);

//         if (response.success && response.data) {
//           const roleList = response.data.results ?? [];

//           setRoles(roleList);

//           // Initialize permissions for every role
//           setPermissionsByRole((prev) => {
//             const updated = { ...prev };

//             roleList.forEach((role) => {
//               if (!updated[role.guid]) {
//                 updated[role.guid] = buildDefault();
//               }
//             });

//             return updated;
//           });

//           // Select first role by default
//           if (roleList.length > 0) {
//             setSelectedRole((prev) => prev || roleList[0].guid);
//           }
//         } else {
//           setLoadError(response.message || "Could not load roles.");
//         }
//       } catch (error: any) {
//         setLoadError(
//           error?.response?.data?.message ||
//             "Could not load roles. Please try again."
//         );
//       } finally {
//         setIsLoadingRoles(false);
//       }
//     };

//     fetchRoles();
//   }, []);

//   const permissions = permissionsByRole[selectedRole] ?? buildDefault();

//   const toggleView = (key: string) => {
//     setPermissionsByRole((prev) => ({
//       ...prev,
//       [selectedRole]: {
//         ...prev[selectedRole],
//         [key]: {
//           ...prev[selectedRole][key],
//           view: !prev[selectedRole][key].view,
//         },
//       },
//     }));
//   };

//   const toggleEnabled = (key: string, value: boolean) => {
//     setPermissionsByRole((prev) => ({
//       ...prev,
//       [selectedRole]: {
//         ...prev[selectedRole],
//         [key]: {
//           ...prev[selectedRole][key],
//           enabled: value,
//         },
//       },
//     }));
//   };

//   const enabledCount = useMemo(
//     () => Object.values(permissions).filter((p) => p.enabled).length,
//     [permissions]
//   );

//   const roleOptions = roles.map((role) => ({
//     label: role.name,
//     value: role.guid,
//   }));

//   return (
//     <div>
//       <PageHeader
//         title="Role Permission"
//         description="Control page access and sidebar menu visibility for each role."
//         actions={
//           <Button icon={<Save size={16} />} size="sm">
//             Save Permissions
//           </Button>
//         }
//       />

//       <Card noPadding>
//         <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-col sm:flex-row sm:items-end gap-3 sm:justify-between">
//           <div className="flex flex-col sm:flex-row sm:items-end gap-3">
//             <div className="max-w-xs w-full">
//               {isLoadingRoles ? (
//                 <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
//                   <Spinner size={16} />
//                   Loading roles...
//                 </div>
//               ) : (
//                 <Select
//                   label="Select Role"
//                   options={roleOptions}
//                   value={selectedRole}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                 />
//               )}
//             </div>

//             <p className="text-xs text-slate-400 sm:mb-2.5">
//               Toggle permissions for{" "}
//               <span className="font-medium text-primary-700">
//                 {roles.find((role) => role.guid === selectedRole)?.name || ""}
//               </span>
//             </p>
//           </div>

//           <p className="text-xs text-slate-400 sm:mb-2.5">
//             {enabledCount} of {menuRows.length} menus enabled
//           </p>
//         </div>

//         {loadError && (
//           <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 m-4">
//             <AlertCircle size={16} />
//             {loadError}
//           </div>
//         )}

//         <div className="p-4 sm:p-5 overflow-x-auto">
//           <table className="w-full text-sm border-collapse min-w-[520px]">
//             <thead>
//               <tr className="bg-primary-50/70">
//                 <th className="px-4 py-3 text-left font-semibold text-primary-800 text-xs uppercase tracking-wide rounded-l-lg">
//                   Module
//                 </th>

//                 <th className="px-4 py-3 text-center font-semibold text-primary-800 text-xs uppercase tracking-wide">
//                   View Sub-Site List
//                 </th>

//                 <th className="px-4 py-3 text-center font-semibold text-primary-800 text-xs uppercase tracking-wide rounded-r-lg">
//                   Sidebar Menu Access
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {menuRows.map((row) => (
//                 <tr key={row.key} className="border-t border-slate-100">
//                   <td className="px-4 py-3 whitespace-nowrap">
//                     <p className="text-slate-700 font-medium">
//                       {row.label}
//                     </p>

//                     {row.parent && (
//                       <p className="text-xs text-slate-400 mt-0.5">
//                         {row.parent}
//                       </p>
//                     )}
//                   </td>

//                   <td className="px-4 py-3 text-center">
//                     <input
//                       type="checkbox"
//                       checked={permissions[row.key]?.view ?? false}
//                       onChange={() => toggleView(row.key)}
//                       className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-300 cursor-pointer"
//                     />
//                   </td>

//                   <td className="px-4 py-3">
//                     <div className="flex justify-center">
//                       <Switch
//                         checked={permissions[row.key]?.enabled ?? false}
//                         onChange={(val) => toggleEnabled(row.key, val)}
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default RolePermission;




import { useEffect, useMemo, useState } from "react";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Card,
  PageHeader,
  Select,
  Button,
  Switch,
  Spinner,
} from "@/components/ui";
import { navItems } from "@/components/layout/Sidebar/navConfig";
import { roleService } from "@/service/rolescreationservice";
import type { RoleRecord } from "@/service/rolescreationservice";
import { rolePermissionService } from "../../service/rolepermissionservice";
import { usePermissions } from "../../context/PermissionContext";

interface MenuRow {
  key: string;
  label: string;
  parent?: string;
}

const menuRows: MenuRow[] = navItems.flatMap((item) => {
  if (item.children?.length) {
    return item.children.map((child) => ({
      key: child.path,
      label: child.label,
      parent: item.label,
    }));
  }
  return [{ key: item.path, label: item.label }];
});

interface PermissionEntry {
  view: boolean;
  enabled: boolean;
}

type PermissionState = Record<string, PermissionEntry>;

// Nothing is allowed until an admin saves it
const buildDefault = (): PermissionState =>
  Object.fromEntries(
    menuRows.map((m) => [m.key, { view: false, enabled: false }])
  );

const RolePermission = () => {
  const { reload } = usePermissions();

  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState<PermissionState>(buildDefault());

  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingPerms, setIsLoadingPerms] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  // 1. Roles for the dropdown
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      setLoadError("");
      try {
        const response = await roleService.list(1, 100);
        if (response.success && response.data) {
          const roleList = response.data.results ?? [];
          setRoles(roleList);
          if (roleList.length > 0) {
            setSelectedRole((prev) => prev || roleList[0].guid);
          }
        } else {
          setLoadError(response.message || "Could not load roles.");
        }
      } catch (error: any) {
        setLoadError(
          error?.response?.data?.message ||
            "Could not load roles. Please try again."
        );
      } finally {
        setIsLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  // 2. Saved permissions of the selected role
  useEffect(() => {
    if (!selectedRole) return;

    let cancelled = false;

    const fetchPermissions = async () => {
      setIsLoadingPerms(true);
      setLoadError("");
      setSaveMessage("");
      try {
        const response = await rolePermissionService.get(selectedRole);
        if (cancelled) return;

        if (response.success && response.data) {
          const next = buildDefault();
          response.data.permissions.forEach((p) => {
            if (next[p.menu_key]) {
              next[p.menu_key] = { view: p.view, enabled: p.enabled };
            }
          });
          setPermissions(next);
        } else {
          setLoadError(response.message || "Could not load permissions.");
        }
      } catch (error: any) {
        if (cancelled) return;
        setLoadError(
          error?.response?.data?.message ||
            "Could not load permissions. Please try again."
        );
      } finally {
        if (!cancelled) setIsLoadingPerms(false);
      }
    };

    fetchPermissions();
    return () => {
      cancelled = true;
    };
  }, [selectedRole]);

  const toggleView = (key: string) => {
    setSaveMessage("");
    setPermissions((prev) => ({
      ...prev,
      [key]: { ...prev[key], view: !prev[key].view },
    }));
  };

  const toggleEnabled = (key: string, value: boolean) => {
    setSaveMessage("");
    setPermissions((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: value },
    }));
  };

  const handleSave = async () => {
    if (!selectedRole) return;

    setIsSaving(true);
    setLoadError("");
    setSaveMessage("");

    try {
      const payload = menuRows.map((row) => ({
        menu_key: row.key,
        view: permissions[row.key]?.view ?? false,
        enabled: permissions[row.key]?.enabled ?? false,
      }));

      const response = await rolePermissionService.save(selectedRole, payload);

      if (response.success) {
        setSaveMessage("Permissions saved successfully.");
        reload(); // refresh sidebar in case this is the logged-in user's own role
      } else {
        setLoadError(response.message || "Could not save permissions.");
      }
    } catch (error: any) {
      setLoadError(
        error?.response?.data?.message ||
          "Could not save permissions. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const enabledCount = useMemo(
    () => Object.values(permissions).filter((p) => p.enabled).length,
    [permissions]
  );

  const roleOptions = roles.map((role) => ({
    label: role.name,
    value: role.guid,
  }));

  return (
    <div>
      <PageHeader
        title="Role Permission"
        description="Control page access and sidebar menu visibility for each role."
        actions={
          <Button
            icon={<Save size={16} />}
            size="sm"
            onClick={handleSave}
            disabled={isSaving || isLoadingPerms || !selectedRole}
          >
            {isSaving ? "Saving..." : "Save Permissions"}
          </Button>
        }
      />

      <Card noPadding>
        <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-col sm:flex-row sm:items-end gap-3 sm:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="max-w-xs w-full">
              {isLoadingRoles ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
                  <Spinner size={16} />
                  Loading roles...
                </div>
              ) : (
                <Select
                  label="Select Role"
                  options={roleOptions}
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
              )}
            </div>

            <p className="text-xs text-slate-400 sm:mb-2.5">
              Toggle permissions for{" "}
              <span className="font-medium text-primary-700">
                {roles.find((role) => role.guid === selectedRole)?.name || ""}
              </span>
            </p>
          </div>

          <p className="text-xs text-slate-400 sm:mb-2.5">
            {enabledCount} of {menuRows.length} menus enabled
          </p>
        </div>

        {loadError && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 m-4">
            <AlertCircle size={16} />
            {loadError}
          </div>
        )}

        {saveMessage && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-3.5 py-2.5 m-4">
            <CheckCircle2 size={16} />
            {saveMessage}
          </div>
        )}

        <div className="p-4 sm:p-5 overflow-x-auto">
          {isLoadingPerms ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-6 justify-center">
              <Spinner size={16} />
              Loading permissions...
            </div>
          ) : (
            <table className="w-full text-sm border-collapse min-w-[520px]">
              <thead>
                <tr className="bg-primary-50/70">
                  <th className="px-4 py-3 text-left font-semibold text-primary-800 text-xs uppercase tracking-wide rounded-l-lg">
                    Module
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-primary-800 text-xs uppercase tracking-wide">
                    View Sub-Site List
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-primary-800 text-xs uppercase tracking-wide rounded-r-lg">
                    Sidebar Menu Access
                  </th>
                </tr>
              </thead>

              <tbody>
                {menuRows.map((row) => (
                  <tr key={row.key} className="border-t border-slate-100">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-slate-700 font-medium">{row.label}</p>
                      {row.parent && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {row.parent}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={permissions[row.key]?.view ?? false}
                        onChange={() => toggleView(row.key)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-300 cursor-pointer"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Switch
                          checked={permissions[row.key]?.enabled ?? false}
                          onChange={(val) => toggleEnabled(row.key, val)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RolePermission;