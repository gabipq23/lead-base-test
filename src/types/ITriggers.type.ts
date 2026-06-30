export type TriggersType =
  | "BUTTON_CLICKED_MESSAGE"
  | "BUTTON_CLICKED_CALL"
  | "ORDER_COMPLETED"
  | "ORDER_CREATED"
  | "SUPPORT_REQUESTED"
  | "CONTACT_US_REQUESTED"
  | "OPEN_ORDER_FOLLOW_UP";

export interface ITriggers {
  id: number;
  company_id: number;
  partner_id: number;
  type: TriggersType;
  enabled: boolean;
  delay_minutes: number;
  message: string;
}

export interface ITriggersFilters {
  company_id?: number;
  partner_id?: number;
  type?: TriggersType;
  enabled?: boolean;
}

export interface ITriggersListResponse {
  success: boolean;
  configs: ITriggers[];
  available_variables_by_type: Record<string, string[]>;
}

export interface ICreateTriggersAdmin {
  company_id: number;
  partner_id: number;
  type: TriggersType;
  enabled: boolean;
  delay_minutes: number;
  message: string;
}

export interface ICreateTriggersGestor {
  type: TriggersType;
  enabled: boolean;
  delay_minutes: number;
  message: string;
}

export type ICreateTriggers = ICreateTriggersAdmin | ICreateTriggersGestor;

export interface IUpdateTriggers {
  id: number;
  type?: TriggersType;
  enabled?: boolean;
  delay_minutes?: number;
  message?: string;
}
