// import { useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   ClipboardList,
//   CheckSquare,
//   Ban,
//   Building2,
//   Settings2,
//   FileBarChart2,
//   Settings,
//   ChevronDown,
//   ShieldCheck,
//   X,
// } from "lucide-react";
// import { navItems } from "./navConfig";

// const iconMap: Record<string, React.ElementType> = {
//   LayoutDashboard,
//   Users,
//   ClipboardList,
//   CheckSquare,
//   Ban,
//   Building2,
//   Settings2,
//   FileBarChart2,
//   Settings,
// };

// interface SidebarProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
//   const location = useLocation();
//   const [expanded, setExpanded] = useState<string[]>(() =>
//     navItems
//       .filter((item) => item.children?.some((c) => location.pathname.startsWith(c.path)))
//       .map((item) => item.path)
//   );

//   const toggleExpand = (path: string) => {
//     setExpanded((prev) =>
//       prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
//     );
//   };

//   const isParentActive = (path: string) => location.pathname.startsWith(path);

//   return (
//     <>
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
//           onClick={onClose}
//         />
//       )}
//       <aside
//         className={`fixed lg:static top-0 left-0 h-full w-[260px] bg-white border-r border-primary-50
//         flex flex-col z-40 transition-transform duration-200 ease-in-out
//         ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
//       >
//         <div className="h-16 flex items-center justify-between px-5 border-b border-primary-50 shrink-0">
//           <div className="flex items-center gap-2.5">
//             <div className="w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center">
//               <ShieldCheck size={18} className="text-white" />
//             </div>
//             <div className="leading-tight">
//               <p className="text-sm font-bold text-slate-900">VMS 2.0</p>
//               <p className="text-[11px] text-slate-400">Visitor Management</p>
//             </div>
//           </div>
//           <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
//             <X size={20} />
//           </button>
//         </div>

//         <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
//           {navItems.map((item) => {
//             const Icon = iconMap[item.icon];
//             const hasChildren = !!item.children?.length;
//             const active = isParentActive(item.path);
//             const isExpanded = expanded.includes(item.path);

//             if (!hasChildren) {
//               return (
//                 <NavLink
//                   key={item.path}
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
//                     ${
//                       isActive
//                         ? "bg-primary-100 text-primary-800"
//                         : "text-slate-600 hover:bg-primary-50 hover:text-primary-700"
//                     }`
//                   }
//                 >
//                   <Icon size={18} />
//                   <span>{item.label}</span>
//                 </NavLink>
//               );
//             }

//             return (
//               <div key={item.path}>
//                 <button
//                   onClick={() => toggleExpand(item.path)}
//                   className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
//                   ${
//                     active
//                       ? "bg-primary-100 text-primary-800"
//                       : "text-slate-600 hover:bg-primary-50 hover:text-primary-700"
//                   }`}
//                 >
//                   <span className="flex items-center gap-3">
//                     <Icon size={18} />
//                     {item.label}
//                   </span>
//                   <ChevronDown
//                     size={15}
//                     className={`transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {isExpanded && (
//                   <div className="mt-1 ml-[34px] pl-3 border-l border-primary-100 space-y-0.5">
//                     {item.children!.map((child) => (
//                       <NavLink
//                         key={child.path}
//                         to={child.path}
//                         className={({ isActive }) =>
//                           `block px-3 py-2 rounded-md text-sm transition-colors
//                           ${
//                             isActive
//                               ? "bg-primary-100 text-primary-800 font-medium"
//                               : "text-slate-500 hover:bg-primary-50 hover:text-primary-700"
//                           }`
//                         }
//                       >
//                         {child.label}
//                       </NavLink>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-primary-50 shrink-0">
//           <div className="rounded-lg bg-primary-50 px-3 py-2.5 text-xs text-primary-700">
//             VMS 2.0 · v2.0.0
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;





import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CheckSquare,
  Ban,
  Building2,
  Settings2,
  FileBarChart2,
  Settings,
  ChevronDown,
  ShieldCheck,
  X,
} from "lucide-react";
import { navItems } from "./navConfig";
import { usePermissions } from "@/context/PermissionContext";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/constants";
const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  ClipboardList,
  CheckSquare,
  Ban,
  Building2,
  Settings2,
  FileBarChart2,
  Settings,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { canSeeMenu } = usePermissions();

    const { user } = useAuth();

  // backend returns a relative path like /media/...; prefix the API host
  const logoSrc = user?.site_logo
    ? user.site_logo.startsWith("http")
      ? user.site_logo
      : `${API_BASE_URL}${user.site_logo}`
    : null;

  const [expanded, setExpanded] = useState<string[]>(() =>
    navItems
      .filter((item) => item.children?.some((c) => location.pathname.startsWith(c.path)))
      .map((item) => item.path)
  );

  // Only the menus the logged-in user's role is allowed to see
  const visibleItems = useMemo(
    () =>
      navItems.flatMap((item) => {
        if (item.children?.length) {
          const children = item.children.filter((c) => canSeeMenu(c.path));
          // Hide the parent when none of its children are allowed
          return children.length ? [{ ...item, children }] : [];
        }
        return canSeeMenu(item.path) ? [item] : [];
      }),
    [canSeeMenu]
  );

  const toggleExpand = (path: string) => {
    setExpanded((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isParentActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-[260px] bg-white border-r border-primary-50
        flex flex-col z-40 transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-primary-50 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* <div className="w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div> */}
            {logoSrc ? (
              <img
                src={logoSrc}
                alt="Site logo"
                className="w-9 h-9 rounded-lg object-contain shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-primary-700 flex items-center justify-center">
                <ShieldCheck size={18} className="text-white" />
              </div>
            )}
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900">VMS 2.0</p>
              <p className="text-[11px] text-slate-400">Visitor Management</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
          {visibleItems.map((item) => {
            const Icon = iconMap[item.icon];
            const hasChildren = !!item.children?.length;
            const active = isParentActive(item.path);
            const isExpanded = expanded.includes(item.path);

            if (!hasChildren) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-primary-100 text-primary-800"
                        : "text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            }

            return (
              <div key={item.path}>
                <button
                  onClick={() => toggleExpand(item.path)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-primary-100 text-primary-800"
                      : "text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.label}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {isExpanded && (
                  <div className="mt-1 ml-[34px] pl-3 border-l border-primary-100 space-y-0.5">
                    {item.children!.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-md text-sm transition-colors
                          ${
                            isActive
                              ? "bg-primary-100 text-primary-800 font-medium"
                              : "text-slate-500 hover:bg-primary-50 hover:text-primary-700"
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary-50 shrink-0">
          <div className="rounded-lg bg-primary-50 px-3 py-2.5 text-xs text-primary-700">
            VMS 2.0 · v2.0.0
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;