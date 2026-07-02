import { ToolsService } from "@/services/tools";
import { useQuery } from "@tanstack/react-query";

export function useBase2bEmpresaController(cnpj: string) {
  const toolsService = new ToolsService();

  const { data: base2bEmpresas, isLoading: isLoadingEmpresas } = useQuery<any>({
    refetchOnWindowFocus: false,
    queryKey: ["base2bEmpresas", cnpj],
    queryFn: async (): Promise<any> => {
      const response = await toolsService.base2bEmpresas(cnpj);
      return response;
    },
    enabled: !!cnpj,
  });
  return { base2bEmpresas, isLoadingEmpresas };
}
