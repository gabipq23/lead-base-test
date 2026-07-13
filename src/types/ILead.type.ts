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

export interface ILeadCRMManagement {
  operator_name: string;
  transhipment_operator: boolean; // sim/não true/false
  transhipment_operator_name: string;
  input_at_operator: {
    input: string; // não realizado/realizado com sucesso/registro com pendências
    note: string;
  };
  debt_with_operator: {
    debt_with_operator: string; //sem registro/não/sim
    number_of_open_invoices: string;
    debt_with_operator_amount: string;
  };
  score_serasa: string; // sem registro/ valor do score
  score_boa_vista: string; // sem registro/ valor do score

  credit_analysis: string; // sem análise/aprovado/negado/em análise

  antifraude: string; //sem análise/ok/reprovado

  pap_availability: string;

  operator_history: {
    history: boolean;
    description: string;
  };

  lows_history: {
    history: boolean;
    amout_of_days: string;
  };

  reregistration: boolean;
  re_registration_info: {
    document: boolean; // cpf/cnpj
    data: any; // vale usar um json ??  pq pode receber qualquer tipo de dado de recadastro(nome, endereço,.....) me da sua opinião aqui por favor
    note: string;
  };

  submission_of_documents: {
    is_submitted: boolean;
    documents: string[];
  };

  biometrics: string; //(ok/pendente/cancelado/dispensado
  contract: string; // pendente/enviado

  installation: {
    installation: string; // não agendado/agendado/reagendado/cliente não encontrado/ sem viabilidade no local/pendente/cancelado
    scheduled_date: string;
    rescheduled_date: string;
    client_not_found_date: string;
    notes: string;
  };
  order_status: string; //aberto/fechado/cancelado
  sales_status: string; //venda realizada/venda não realizada
  contact_history: {
    attempt_number: string; // 1/2/3/...
    date: string;
    channel: string;
    consultant_name: string;
    status: string; // atendido/não atendido ou sem resposta
    note: string;
    return: string; // positivo/negativo/neutro
    future_return: boolean; // sim/não
    future_return_date: string;
  }[];
  consultant_name: string;
  id_corp: string;
  id_operator: string;
  id_crm: string;
  team: string;
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
  whatsapp: boolean;

  rg: {
    rg: string;
    date_of_issue: string;
    issuing_authority: string;
  };

  link_to_registration_form: string;
  link_to_reregistration_form: string;
  link_to_transhipment_form: string;

  crm_management: ILeadCRMManagement;
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
