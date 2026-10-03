import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  AlertCircle,
  ImagePlus,
} from "lucide-react";

import { Card, PageHeader, Button, Spinner, Badge } from "@/components/ui";
import { API_BASE_URL } from "@/constants";

import { roleService } from "@/service/rolescreationservice";
import type { RoleRecord } from "@/service/rolescreationservice";

import { userService } from "@/service/usercreationservices";
import type {
  UserRecord,
  SiteDropdownItem,
} from "@/service/usercreationservices";


// ============================================================
// TYPES & CONSTANTS
// ============================================================

interface FormState {
  login_id: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  gender: string;
  role: string;
  site: string;
  status: "Active" | "Inactive";
  profile_photo: File | null;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const PAGE_SIZE = 10;

const emptyForm: FormState = {
  login_id: "",
  password: "",
  first_name: "",
  last_name: "",
  email: "",
  job_title: "",
  gender: "",
  role: "",
  site: "",
  status: "Active",
  profile_photo: null,
};

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400";


// ============================================================
// SMALL FIELD WRAPPER (outside the component so inputs keep focus)
// ============================================================

const Field = ({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);


// ============================================================
// USER CREATION
// ============================================================

const UserCreation = () => {
  // ---------------- list ----------------
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ---------------- dropdowns ----------------
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [sites, setSites] = useState<SiteDropdownItem[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);
  const [dropdownError, setDropdownError] = useState("");

  // ---------------- form modal ----------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ---------------- delete modal ----------------
  const [deleteTarget, setDeleteTarget] = useState<UserRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");


  // ==========================================================
  // SEARCH DEBOUNCE
  // ==========================================================

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);


  // ==========================================================
  // LOAD USERS
  // ==========================================================

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setListError("");

    try {
      const response = await userService.list(page, PAGE_SIZE, debouncedSearch);

      if (response.success && response.data) {
        const results = response.data.results ?? [];
        setUsers(results);
        setTotalPages(response.data.pagination?.total_pages ?? 1);
        setTotalRecords(
          response.data.pagination?.total_records ?? results.length
        );
      } else {
        setListError(response.message || "Could not load users.");
      }
    } catch (error: any) {
      // deleted the last row of the last page: step back one page
      if (error?.response?.status === 404 && page > 1) {
        setPage((p) => p - 1);
        return;
      }
      setListError(
        error?.response?.data?.message ||
          "Could not load users. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  // ==========================================================
  // LOAD ROLE + SITE DROPDOWNS
  // ==========================================================

  useEffect(() => {
    const loadDropdowns = async () => {
      setIsLoadingDropdowns(true);
      setDropdownError("");

      try {
        const [roleRes, siteRes] = await Promise.all([
          roleService.list(1, 100),
          userService.siteDropdown(),
        ]);

        if (roleRes.success && roleRes.data) {
          setRoles(roleRes.data.results ?? []);
        } else {
          setDropdownError(roleRes.message || "Could not load roles.");
        }

        if (siteRes.success && siteRes.data) {
          setSites(siteRes.data.results ?? []);
        } else {
          setDropdownError(siteRes.message || "Could not load sites.");
        }
      } catch (error: any) {
        setDropdownError(
          error?.response?.data?.message ||
            "Could not load roles or sites. Please try again."
        );
      } finally {
        setIsLoadingDropdowns(false);
      }
    };

    loadDropdowns();
  }, []);


  // ==========================================================
  // PHOTO PREVIEW
  // ==========================================================

  useEffect(() => {
    if (!form.profile_photo) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(form.profile_photo);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [form.profile_photo]);

  const shownPhoto =
    previewUrl ??
    (editing?.profile_photo ? `${API_BASE_URL}${editing.profile_photo}` : null);


  // ==========================================================
  // FORM HELPERS
  // ==========================================================

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setFormError("");
    setIsModalOpen(true);
  };

  const openEdit = (user: UserRecord) => {
    setEditing(user);
    setForm({
      login_id: user.login_id,
      password: "",
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      job_title: user.job_title,
      gender: user.gender,
      role: user.role?.guid ?? "",
      site: user.site?.guid ?? "",
      status: user.is_active ? "Active" : "Inactive",
      profile_photo: null,
    });
    setErrors({});
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setEditing(null);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.login_id.trim()) e.login_id = "Login ID is required";

    if (!editing && !form.password) {
      e.password = "Password is required";
    } else if (form.password && form.password.length < 8) {
      e.password = "Password must be at least 8 characters";
    }

    if (!form.first_name.trim()) e.first_name = "First name is required";
    if (!form.last_name.trim()) e.last_name = "Last name is required";

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      e.email = "Enter a valid email";
    }

    if (!form.job_title.trim()) e.job_title = "Job title is required";
    if (!form.role) e.role = "Role is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };


  // ==========================================================
  // SAVE (create / update)
  // ==========================================================

  const handleSave = async () => {
    setFormError("");
    if (!validate()) return;

    setIsSaving(true);

    const payload = {
      login_id: form.login_id.trim(),
      password: form.password,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      job_title: form.job_title.trim(),
      gender: form.gender,
      role: form.role,
      site: form.site,
      is_active: form.status === "Active",
      profile_photo: form.profile_photo,
    };

    try {
      const response = editing
        ? await userService.update(editing.id, payload)
        : await userService.create(payload);

      if (response.success) {
        setIsModalOpen(false);
        setEditing(null);
        fetchUsers();
      } else {
        setFormError(response.message || "Could not save user.");
      }
    } catch (error: any) {
      const data = error?.response?.data;

      // field errors from the backend serializer: { login_id: ["..."], ... }
      if (data?.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(data.errors).forEach(([key, value]) => {
          mapped[key] = Array.isArray(value) ? String(value[0]) : String(value);
        });
        setErrors(mapped as FormErrors);
      }

      setFormError(data?.message || "Could not save user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await userService.delete(deleteTarget.id);

      if (response.success) {
        setDeleteTarget(null);
        fetchUsers();
      } else {
        setDeleteError(response.message || "Could not delete user.");
      }
    } catch (error: any) {
      setDeleteError(
        error?.response?.data?.message ||
          "Could not delete user. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div>
      <PageHeader
        title="User Creation"
        description="Create system users and assign roles and sites."
        actions={
          <Button icon={<Plus size={16} />} size="sm" onClick={openCreate}>
            Add User
          </Button>
        }
      />

      <Card noPadding>
        {/* ---------- toolbar ---------- */}
        <div className="p-4 sm:p-5 border-b border-primary-50 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className={`${inputCls} pl-9`}
            />
          </div>

          <p className="text-xs text-slate-400">{totalRecords} users</p>
        </div>

        {(listError || dropdownError) && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 m-4">
            <AlertCircle size={16} />
            {listError || dropdownError}
          </div>
        )}

        {/* ---------- table ---------- */}
        <div className="p-4 sm:p-5 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-8 justify-center">
              <Spinner size={16} />
              Loading users...
            </div>
          ) : (
            <table className="w-full text-sm border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-primary-50/70">
                  {["User", "Login ID", "Role", "Site", "Status", "Actions"].map(
                    (h, i, arr) => (
                      <th
                        key={h}
                        className={`px-4 py-3 text-left font-semibold text-primary-800 text-xs uppercase tracking-wide
                        ${i === 0 ? "rounded-l-lg" : ""} ${
                          i === arr.length - 1 ? "rounded-r-lg text-right" : ""
                        }`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-slate-400"
                    >
                      No users found.
                    </td>
                  </tr>
                )}

                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {u.profile_photo ? (
                          <img
                            src={`${API_BASE_URL}${u.profile_photo}`}
                            alt={u.full_name}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                            {(u.first_name[0] || u.login_id[0] || "?").toUpperCase()}
                            {(u.last_name[0] || "").toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-slate-700 font-medium">
                            {u.full_name || u.login_id}
                          </p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-600">{u.login_id}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {u.role?.name ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {u.site?.name ?? "-"}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant={u.is_active ? "success" : "neutral"}>
                        {u.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-2 rounded-lg text-slate-500 hover:bg-primary-50 hover:text-primary-700"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteError("");
                            setDeleteTarget(u);
                          }}
                          className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ---------- pagination ---------- */}
        <div className="px-4 sm:px-5 pb-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-primary-50"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-primary-50"
            >
              Next
            </button>
          </div>
        </div>
      </Card>


      {/* ====================================================== */}
      {/* ADD / EDIT MODAL                                        */}
      {/* ====================================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {editing ? "Edit User" : "Add User"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {formError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
                  <AlertCircle size={16} />
                  {formError}
                </div>
              )}

              {/* profile photo */}
              <div className="flex items-center gap-4">
                {shownPhoto ? (
                  <img
                    src={shownPhoto}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-50 text-primary-400 flex items-center justify-center">
                    <ImagePlus size={22} />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-primary-700 cursor-pointer hover:underline">
                    {shownPhoto ? "Change photo" : "Upload photo"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      className="hidden"
                      onChange={(e) =>
                        setField("profile_photo", e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                  <p className="text-xs text-slate-400 mt-0.5">
                    PNG or JPG, up to 2 MB
                  </p>
                  {errors.profile_photo && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.profile_photo}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Login ID" required error={errors.login_id}>
                  <input
                    className={inputCls}
                    value={form.login_id}
                    onChange={(e) => setField("login_id", e.target.value)}
                    placeholder="Enter login id"
                    autoComplete="off"
                  />
                </Field>

                <Field
                  label={editing ? "New Password" : "Password"}
                  required={!editing}
                  error={errors.password}
                >
                  <input
                    type="password"
                    className={inputCls}
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder={
                      editing ? "Leave blank to keep current" : "Enter password"
                    }
                    autoComplete="new-password"
                  />
                </Field>

                <Field label="First Name" required error={errors.first_name}>
                  <input
                    className={inputCls}
                    value={form.first_name}
                    onChange={(e) => setField("first_name", e.target.value)}
                    placeholder="Enter first name"
                  />
                </Field>

                <Field label="Last Name" required error={errors.last_name}>
                  <input
                    className={inputCls}
                    value={form.last_name}
                    onChange={(e) => setField("last_name", e.target.value)}
                    placeholder="Enter last name"
                  />
                </Field>

                <Field label="Email" required error={errors.email}>
                  <input
                    type="email"
                    className={inputCls}
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="Enter email"
                  />
                </Field>

                <Field label="Job Title" required error={errors.job_title}>
                  <input
                    className={inputCls}
                    value={form.job_title}
                    onChange={(e) => setField("job_title", e.target.value)}
                    placeholder="Enter job title"
                  />
                </Field>

                <Field label="Gender" error={errors.gender}>
                  <select
                    className={inputCls}
                    value={form.gender}
                    onChange={(e) => setField("gender", e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </Field>

                <Field label="Status" error={errors.status}>
                  <select
                    className={inputCls}
                    value={form.status}
                    onChange={(e) =>
                      setField("status", e.target.value as "Active" | "Inactive")
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </Field>

                <Field label="Role" required error={errors.role}>
                  <select
                    className={inputCls}
                    value={form.role}
                    onChange={(e) => setField("role", e.target.value)}
                    disabled={isLoadingDropdowns}
                  >
                    <option value="">
                      {isLoadingDropdowns ? "Loading roles..." : "Select Role"}
                    </option>
                    {roles.map((r) => (
                      <option key={r.guid} value={r.guid}>
                        {r.is_active ? r.name : `${r.name} (inactive)`}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Site Name" error={errors.site}>
                  <select
                    className={inputCls}
                    value={form.site}
                    onChange={(e) => setField("site", e.target.value)}
                    disabled={isLoadingDropdowns}
                  >
                    <option value="">
                      {isLoadingDropdowns ? "Loading sites..." : "Select Site..."}
                    </option>
                    {sites.map((s) => (
                      <option key={s.guid} value={s.guid}>
                        {s.site_name} ({s.site_model.name})
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
              <button
                onClick={closeModal}
                disabled={isSaving}
                className="px-4 h-9 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : editing ? "Update User" : "Create User"}
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* ====================================================== */}
      {/* DELETE CONFIRM                                          */}
      {/* ====================================================== */}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Delete user?
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              <span className="font-medium text-slate-700">
                {deleteTarget.full_name || deleteTarget.login_id}
              </span>{" "}
              will be removed and can no longer log in.
            </p>

            {deleteError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 mt-4">
                <AlertCircle size={16} />
                {deleteError}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 h-9 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 h-9 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCreation;
