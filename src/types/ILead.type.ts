export type LeadStatus = "DISPONIVEL" | "RESERVADO" | "VENDIDO" | string;

export type LeadGender = "M" | "F" | "O" | string;

export interface ILeadPhoneValidation {
  valid: boolean;
  reason: string;
  telefone: string;
  operadora: string;
  portabilidade: string;
  data_portabilidade: string | null;
}

export interface ILeadEmailValidation {
  email: string;
  valid: boolean;
  reason: string;
  email_status: string;
  is_email_valid: number;
}

export interface ILeadOperatorAvailabilityItem {
  available: boolean;
  range_max: string | null;
  range_min: string | null;
  found_via_range: boolean;
}

export type ILeadOperatorsAvailability = Record<
  string,
  ILeadOperatorAvailabilityItem
>;

export interface ILeadGeolocation {
  success: boolean;
  latitude: string;
  longitude: string;
  maps_link: string;
  precision: string;
  queried_at: string;
  street_view_link: string;
  formatted_address: string;
}

export interface ILead {
  id: number;
  address: string;
  status: LeadStatus;
  consultant_notes?: {
    id: string;
    obs: string;
    user: string;
    role: string;
    created_at: string;
  }[];
  channel: string;
  campaign: string;
  purchase_intent: string;
  purchase_intent_plan_price: number | null;
  client_type: string;

  landing_page: string;

  full_name: string;
  cpf: string;
  email: string;
  phone: string;

  rfb_name: string;

  gender: LeadGender;
  birth_date: string;
  age: number;
  mother_name: string;

  cep: string;
  uf: string;
  city: string;
  district: string;
  number: string;
  additional_phone: string | null;
  additional_phone_validation: ILeadPhoneValidation | null;
  phone_validation: ILeadPhoneValidation | null;
  email_validation: ILeadEmailValidation | null;

  operators_availability: ILeadOperatorsAvailability | null;

  geolocation: ILeadGeolocation | null;

  crm_status: string;
  consultant_note: string | null;

  company_id: number;
  partner_id: number | null;

  is_reserved: boolean;
  reserved_by_user_id: number | null;
  reserved_at: string | null;

  created_at: string;
  updated_at: string;
  origem: string;

  is_email_valid: boolean;
  is_cep_valid: boolean;
  is_phone_valid: boolean;
  is_additional_phone_valid: boolean;
}

export interface ILeadPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ILeadsResponse {
  success: boolean;
  leads: ILead[];
  pagination: ILeadPagination;
}
