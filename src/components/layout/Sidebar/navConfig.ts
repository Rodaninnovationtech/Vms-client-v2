import type { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Visitor / Contractor",
    path: "/visitor",
    icon: "Users",
  },
  {
    label: "Pre-Registration",
    path: "/pre-registration",
    icon: "ClipboardList",
  },
  {
    label: "Approval",
    path: "/approval",
    icon: "CheckSquare",
  },
  {
    label: "Ban",
    path: "/ban",
    icon: "Ban",
  },
  {
    label: "Property Management",
    path: "/property-management",
    icon: "Building2",
    children: [
      { label: "Key", path: "/property-management/key" },
      { label: "Pass", path: "/property-management/pass" },
    ],
  },
  {
    label: "System Config",
    path: "/system-config",
    icon: "Settings2",
    children: [
      { label: "Site Type Creation", path: "/system-config/site-type" },
      { label: "Site Model Creation", path: "/system-config/site-model"},
      { label: "Category Creation", path: "/system-config/category" },
      { label: "Site Creation", path: "/system-config/site" },
      { label: "Tenant Creation", path: "/system-config/tenant" },
      { label: "Tenant Notification", path: "/system-config/tenant-notification" },
      { label: "Role Creation", path: "/system-config/role" },
      { label: "Role Permission", path: "/system-config/role-permission" },
      { label: "User Creation", path: "/system-config/user" },
      { label: "Identity Type Creation", path: "/system-config/identity-type" },
      { label: "Visitor Type Creation", path: "/system-config/visitor-type" },
    ],
  },
  {
    label: "Report",
    path: "/report",
    icon: "FileBarChart2",
  },
  {
    label: "Settings",
    path: "/settings",
    icon: "Settings",
  },
];
