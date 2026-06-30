import { httpClientAxios } from "@/http/api";

export interface StatementItem {
  id: number;
  partner_id: number;
  user_id?: number | null;
  amount: number;
  balance_before: number;
  balance_after: number;
  type: "ADICIONAR" | "REMOVER" | "REEMBOLSAR" | "BONUS" | "OUTRO";
  description: string;
  created_at: string;
  user?: {
    user_id: number;
    user_name: string;
  };
}

export interface StatementResponse {
  success: boolean;
  partner_name: string;
  current_credit: number;
  bonus_credit: number;
  total_balance: number;
  transactions: StatementItem[];

  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface GetStatementParams {
  page?: number;
  per_page?: number;
}

export class StatementService {
  static async getByPartnerId(partnerId: number, params?: GetStatementParams) {
    const { data } = await httpClientAxios.get(
      `/telecom/partners/${partnerId}/statement`,
      {
        params,
      },
    );

    return data as StatementResponse;
  }
}
