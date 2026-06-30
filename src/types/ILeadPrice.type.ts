export interface ILeadPrice {
  id: number;
  company_id: number;
  partner_id: number;
  service_name: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ILeadPriceResponse {
  prices: ILeadPrice[];
}

export interface ICreateLeadPrice {
  company_id: number;
  partner_id: number;
  service_name: string;
  price: number;
}

export interface IUpdateLeadPrice {
  price: number;
  service_name: string;
}
