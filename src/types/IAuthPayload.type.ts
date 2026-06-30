import type { UserRole } from "./IUser.type";

export interface IAuthPayload {
  success: boolean;
  user: IAuthUser;
}

export interface IAuthUser {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  cpf?: string;
  telephone?: string;
  cnpj?: string;
  consultant_hash?: string;
  user_type: string;
  company_id?: number | null;
  partner_id?: number | null;
  team?: string;
  allow_email_notifications?: boolean;
  allow_sms_notifications?: boolean;
  allow_wpp_notifications?: boolean;
  partner_url_logo?: string;
  company?: {
    company_id: number;
    company_name: string;
  };
  partner?: {
    partner_id: number;
    partner_name: string;
    partner_hash?: string;
  };
  person_responsible?: {
    user_name: string;
    role: string;
  };
}
