import { ToolsService } from "@/services/tools";
import { useQuery } from "@tanstack/react-query";

export function useBase2bSocioController(cpf: string, cnpj: string) {
  const toolsService = new ToolsService();

  const { data: base2bSociosCPF, isLoading: isLoadingSociosCPF } =
    useQuery<any>({
      refetchOnWindowFocus: false,
      queryKey: ["base2bSociosCPF", cpf],
      queryFn: async (): Promise<any> => {
        const response = await toolsService.base2bSociosCPF(cpf);
        return response;
      },
      enabled: !!cpf,
    });

  const { data: base2bSociosCNPJ, isLoading: isLoadingSociosCNPJ } =
    useQuery<any>({
      refetchOnWindowFocus: false,
      queryKey: ["base2bSociosCNPJ", cnpj],
      queryFn: async (): Promise<any> => {
        const response = await toolsService.base2bSociosCNPJ(cnpj);
        return response;
      },
      enabled: !!cnpj,
    });
  return {
    base2bSociosCPF,
    isLoadingSociosCPF,
    base2bSociosCNPJ,
    isLoadingSociosCNPJ,
  };
}
