import { httpClientAxios } from "@/http/api";
import type { ILead, ILeadsResponse } from "@/types/ILead.type";

export type LeadModule = "telecom" | "finances" | "benefits";

export interface LeadQueryParams {
  page?: number;
  per_page?: number;
  company_id?: number;
  partner_id?: number;
  region?: string;
  uf?: string;
  city?: string;
  provider?: string;
  date_from?: string;
  date_to?: string;
}

export interface LeadReserveManyPayload {
  lead_ids: number[];
}

export interface LeadReserveResponse {
  success: boolean;
  message?: string;
  reserved_count?: number;
}

function resolveLeadsBasePath(module: LeadModule, operator?: string): string {
  if (!operator) {
    return `/${module}/leads`;
  }

  return `/${module}/${operator}/leads`;
}

function resolveMyLeadsPath(module: LeadModule, operator: string): string {
  return `/${module}/${operator}/leads/mine`;
}

function resolveReserveLeadPath(
  module: LeadModule,
  operator: string,
  leadId: number,
): string {
  return `/${module}/${encodeURIComponent(operator)}/leads/${leadId}/reserve`;
}

function resolveReserveManyPath(module: LeadModule, operator: string): string {
  return `/${module}/${encodeURIComponent(operator)}/leads/reserve`;
}
function resolveUpdateLeadPath(
  module: LeadModule,
  operator: string,
  leadId: number,
): string {
  return `/${module}/${encodeURIComponent(operator)}/leads/${leadId}`;
}
export class LeadsService {
  static async getAll<T = ILeadsResponse>(
    module: LeadModule,
    operator?: string,
    params?: LeadQueryParams,
  ): Promise<T> {
    const { data } = await httpClientAxios.get<T>(
      resolveLeadsBasePath(module, operator),
      { params },
    );
    return data;
  }

  static async getMine<T = ILeadsResponse>(
    module: LeadModule,
    operator: string,
    params?: LeadQueryParams,
  ): Promise<T> {
    const { data } = await httpClientAxios.get<T>(
      resolveMyLeadsPath(module, encodeURIComponent(operator)),
      { params },
    );
    return data;
  }

  static async reserve<T = ILead>(
    module: LeadModule,
    operator: string,
    leadId: number,
  ): Promise<T> {
    const { data } = await httpClientAxios.post<T>(
      resolveReserveLeadPath(module, operator, leadId),
    );
    return data;
  }

  static async reserveMany<T = LeadReserveResponse>(
    module: LeadModule,
    operator: string,
    payload: LeadReserveManyPayload,
  ): Promise<T> {
    const { data } = await httpClientAxios.post<T>(
      resolveReserveManyPath(module, operator),
      payload,
    );

    return data;
  }

  static async update<T = ILead>(
    module: LeadModule,
    operator: string,
    leadId: number,
    payload: any,
  ): Promise<T> {
    const { data } = await httpClientAxios.put<T>(
      resolveUpdateLeadPath(module, operator, leadId),
      payload,
    );

    return data;
  }
}
