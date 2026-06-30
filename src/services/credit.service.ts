import { httpClientAxios } from "@/http/api";

export interface CreditRequestItem {
  id: number;
  partner_id: number;
  company_id: number;
  user_id?: number;
  credit_value: number;
  type_of_payment: "pix" | "boleto";
  status: "PENDENTE" | "APROVADO" | "CANCELADO";
  payment_code?: string | null;
  image?: string | null;
  created_at: string;
  updated_at?: string;
  partner?: {
    partner_id: number;
    partner_name: string;
  };
  company?: {
    company_id: number;
    company_name: string;
  };
  user?: {
    user_id: number;
    user_name: string;
  };
}

export interface CreditRequestsResponse {
  success: boolean;
  requests: CreditRequestItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CreateCreditRequestPayload {
  partner_id: number;
  company_id: number;
  credit_value: number;
  type_of_payment: "pix" | "boleto";
  payment_code?: string;
  image?: string;
}

export interface CreditRequest {
  id: number;
  partner_id: number;
  company_id: number;
  credit_value: number;
  type_of_payment: "pix" | "boleto";
  payment_code?: string;
  image?: string;
  status: "PENDENTE" | "APROVADO" | "CANCELADO";
  created_at: string;
  user_name?: string;
}

export interface UpdateCreditRequestStatusPayload {
  status: "PENDENTE" | "APROVADO" | "CANCELADO";
}

export interface UpdateCreditRequestPaymentPayload {
  payment_code: string;
  image: string;
}

export class CreditRequestsService {
  static async getAll(params?: {
    partner_id?: number;
    company_id?: number;
    page?: number;
    per_page?: number;
  }) {
    const { data } = await httpClientAxios.get("/telecom/credit-requests", {
      params,
    });

    return data as CreditRequestsResponse;
  }

  static async create(entity: CreateCreditRequestPayload) {
    const { data } = await httpClientAxios.post(
      "/telecom/credit-requests",
      entity,
    );

    return data;
  }

  static async updateStatus(
    id: number,
    payload: UpdateCreditRequestStatusPayload,
  ) {
    const { data } = await httpClientAxios.patch(
      `/telecom/credit-requests/${id}/status`,
      payload,
    );

    return data;
  }

  static async updatePayment(
    id: number,
    payload: UpdateCreditRequestPaymentPayload,
  ) {
    const { data } = await httpClientAxios.put(
      `/telecom/credit-requests/${id}`,
      payload,
    );

    return data;
  }
}
