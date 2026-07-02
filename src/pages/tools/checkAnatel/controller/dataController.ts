import { ToolsService } from "@/services/tools";
import { useQuery } from "@tanstack/react-query";

export function useCheckAnatelController(phone: string) {
  const toolsService = new ToolsService();

  const { data: checkAnatel, isLoading: isLoadingCheckAnatel } = useQuery<any>({
    refetchOnWindowFocus: false,
    queryKey: ["checkAnatel", phone],
    queryFn: async (): Promise<any> => {
      const response = await toolsService.checkOperadora(phone);
      return response;
    },
    enabled: !!phone,
  });
  return { checkAnatel, isLoadingCheckAnatel };
}
