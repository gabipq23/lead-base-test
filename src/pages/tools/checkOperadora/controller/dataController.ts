import { ToolsService } from "@/services/tools";
import { useQuery } from "@tanstack/react-query";

export function useCheckOperadoraController(phone: string) {
  const toolsService = new ToolsService();

  const { data: checkOperadora, isLoading: isLoadingCheckOperadora } =
    useQuery<any>({
      refetchOnWindowFocus: false,
      queryKey: ["checkOperadora", phone],
      queryFn: async (): Promise<any> => {
        const response = await toolsService.checkOperadora(phone);
        return response;
      },
      enabled: !!phone,
    });
  return { checkOperadora, isLoadingCheckOperadora };
}
