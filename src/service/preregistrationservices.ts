// import interceptor from "@/service/interceptor";
// import { URLs } from "@/constants";

// /* ----------------------------- types ---------------------------------- */

// export interface ApiResponse<T> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   errors?: Record<string, unknown>;
// }

// export interface Pagination {
//   page: number;
//   page_size: number;
//   total_records: number;
//   total_pages: number;
// }

// export interface NamedRef {
//   guid: string;
//   name: string;
// }

// // One approver: a user of the site whose role has the Approval menu enabled
// export interface ApproverRecord {
//   id: number;
//   full_name: string;
//   email: string;
//   role: NamedRef | null;
//   site: NamedRef | null;
// }

// export type PreRegKind = "Visitor" | "Contractor";

// export interface PreRegistrationRecord {
//   guid: string;
//   kind: PreRegKind;
//   status: string; // Pending / Approved / Rejected
//   person: {
//     id: number;
//     person_name: string;
//     identity_type: string;
//     identity_number: string;
//     phone_number: string;
//     email?: string | null;
//   };
//   site: { guid: string; name: string };
//   location: { guid: string; name: string } | null;
//   company: string;
//   company_phone: string;
//   from_date: string | null;
//   to_date: string | null;
//   approver_email: string | null;
//   pass_no: string;
//   key_no: string;
//   vehicle_number: string;
//   remark: string;
// }

// export interface PreRegistrationListParams {
//   page: number;
//   page_size: number;
//   search: string;
//   site_guid: string | null;
//   status: string;
//   from_date: string | null;
//   to_date: string | null;
// }

// export interface PreRegistrationCreatePayload {
//   kind: PreRegKind;
//   site: string;
//   location: string;
//   from_date: string;
//   to_date: string;
//   person_id: number | null;
//   person_name: string;
//   identity_type: string;
//   identity_number: string;
//   phone_number: string;
//   email: string;
//   company: string;
//   company_phone: string;
//   pass_no: string;
//   key_no: string;
//   vehicle_number: string;
//   remark: string;
//   approver_email: string;
// }

// /* ----------------------------- service -------------------------------- */

// export const preRegistrationService = {
//   // Approvers of a site: payload { site_guid }, response email + role + site
//   async approverDropdown(
//     siteGuid: string
//   ): Promise<ApiResponse<{ results: ApproverRecord[] }>> {
//     const res = await interceptor.post<ApiResponse<{ results: ApproverRecord[] }>>(
//         URLs.approval.approvers,
//       { site_guid: siteGuid }
//     );
//     return res.data;
//   },


// };



import interceptor from "@/service/interceptor";
import { URLs } from "@/constants";
import type { PersonRecord } from "@/service/visitorservices";

export type VisitKind = "Visitor" | "Contractor";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PreRegistrationRecord {
  guid: string;
  id: number;
  kind: VisitKind;
  visitor_type: { guid: string; name: string } | null;
  person: PersonRecord;
  site: { guid: string; name: string };
  location: { guid: string; name: string } | null;
  company: string;
  company_phone: string;
  source: "PRE_REGISTRATION" | "PRE_REGISTRATION_BULK" | string;
  bulk_id: string | null;
  approval_status: ApprovalStatus | null;
  status: "Pending" | "Approved" | "Rejected";
  requester_email: string | null;
  approver_email: string | null;
  approved_by: string | null;
  approved_at: string | null;
  decision_remark: string;
  from_date: string | null; // YYYY-MM-DD
  to_date: string | null;
  from_time: string | null; // HH:MM:SS
  to_time: string | null;
  pass_no: string;
  key_no: string;
  vehicle_number: string;
  remark: string;
  created_at: string;
  // computed by the server for the logged-in user
  can_edit?: boolean;
  can_delete?: boolean;
}

export interface PreRegistrationListParams {
  page: number | null;
  page_size: number | null;
  search?: string;
  site_guid?: string | null;
  visitor_type_guid?: string | null;
  status?: string; // "" | Pending | Approved | Rejected
  from_date?: string | null; // YYYY-MM-DD
  to_date?: string | null;
}

export interface PreRegistrationPayload {
  site: string; // site guid
  location: string; // tenant guid
  visitor_type: string; // visitor type guid (server derives Visitor / Contractor)
  from_date: string;
  to_date: string;
  from_time?: string | null; // HH:MM
  to_time?: string | null;
  person_id?: number | null;
  person_name: string;
  identity_type: string;
  identity_number: string;
  phone_number: string;
  email?: string;
  company?: string;
  company_phone?: string;
  pass_no?: string;
  key_no?: string;
  vehicle_number?: string;
  remark?: string;
  approver_email: string;
}

export interface ApproverRecord {
  id: number;
  full_name: string;
  email: string;
  role: { guid: string; name: string } | null;
  site: { guid: string; name: string } | null;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[] | string>;
}

interface ListData {
  results: PreRegistrationRecord[];
  pagination?: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
  };
}

export const preRegistrationService = {
  list: async (params: PreRegistrationListParams): Promise<ApiResponse<ListData>> => {
    const response = await interceptor.post<ApiResponse<ListData>>(
      URLs.preRegistration.list,
      {
        page: params.page,
        page_size: params.page_size,
        search: params.search ?? "",
        site_guid: params.site_guid || null,
        visitor_type_guid: params.visitor_type_guid || null,
        status: params.status ?? "",
        from_date: params.from_date || null,
        to_date: params.to_date || null,
      }
    );
    return response.data;
  },

  create: async (
    payload: PreRegistrationPayload
  ): Promise<ApiResponse<PreRegistrationRecord>> => {
    const response = await interceptor.post<ApiResponse<PreRegistrationRecord>>(
      URLs.preRegistration.create,
      payload
    );
    return response.data;
  },

  update: async (
    guid: string,
    payload: PreRegistrationPayload
  ): Promise<ApiResponse<PreRegistrationRecord>> => {
    const response = await interceptor.post<ApiResponse<PreRegistrationRecord>>(
      URLs.preRegistration.update,
      { guid, ...payload }
    );
    return response.data;
  },

  remove: async (guid: string): Promise<ApiResponse<null>> => {
    const response = await interceptor.post<ApiResponse<null>>(
      URLs.preRegistration.delete,
      { guid }
    );
    return response.data;
  },

  // Users of the site whose role has the Approval menu enabled.
  approverDropdown: async (
    siteGuid: string
  ): Promise<ApiResponse<{ results: ApproverRecord[] }>> => {
    const response = await interceptor.post<ApiResponse<{ results: ApproverRecord[] }>>(
      URLs.approval.approvers,
      { site_guid: siteGuid }
    );
    return response.data;
  },
};