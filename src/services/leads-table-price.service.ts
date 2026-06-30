import { httpClientAxios } from "@/http/api";
import type {
  ILeadPrice,
  ILeadPriceResponse,
  ICreateLeadPrice,
  IUpdateLeadPrice,
} from "@/types/ILeadPrice.type";

export interface LeadTablePriceQueryParams {
  partner_id?: number;
  company_id?: number;
}

export class LeadTablePricesService {
  static async getAll(
    params: LeadTablePriceQueryParams,
  ): Promise<ILeadPriceResponse> {
    const { data } = await httpClientAxios.get<ILeadPriceResponse>(
      "/telecom/prices",
      {
        params,
      },
    );

    return data;
  }

  static async create(entity: ICreateLeadPrice): Promise<ILeadPrice> {
    const { data } = await httpClientAxios.post<ILeadPrice>(
      "/telecom/prices",
      entity,
    );

    return data;
  }

  static async update(id: number, entity: IUpdateLeadPrice): Promise<void> {
    await httpClientAxios.put(`/telecom/prices/${id}`, entity);
  }

  static async delete(id: number): Promise<void> {
    await httpClientAxios.delete(`/telecom/prices/${id}`);
  }
}
