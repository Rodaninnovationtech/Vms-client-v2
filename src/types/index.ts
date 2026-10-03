import type React from "react";

export interface NavChild {
  label: string;
  path: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  children?: NavChild[];
}

export interface User {
  user_id: number;
  login_id: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  site_logo?: string | null;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";



export interface User {
  user_id: number;
  login_id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  profile_photo: string | null;
  role: string;
  site: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_super_admin: boolean;
  permissions: {
    menu_key: string;
    view: boolean;
    enabled: boolean;
  }[];
}