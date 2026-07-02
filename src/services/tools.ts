import { apiBase2b, apiCheckOperadora, apiPurchase } from "@/http/api";

export class ToolsService {
  async base2bEmpresas(cnpj: string): Promise<any> {
    const res = await apiBase2b.get(`/estabelecimentos/${cnpj}`);
    return res.data;
  }

  async base2bSociosCPF(cpf: string): Promise<any> {
    const res = await apiBase2b.get(`/socios/cpf/${cpf}`);
    return res.data;
  }
  async base2bSociosCNPJ(cnpj: string): Promise<any> {
    const res = await apiBase2b.get(`/socios/empresa/${cnpj}`);
    return res.data;
  }

  async checkOperadora(phone: string): Promise<any> {
    const res = await apiCheckOperadora.get(`/check/portabilidade/${phone}`);
    return res.data;
  }

  async zapChecker(phones: string[]): Promise<any> {
    const res = await apiPurchase.post(`/contatos/verificar-whatsapp`, {
      numeros: phones,
    });
    return res.data;
  }
}
