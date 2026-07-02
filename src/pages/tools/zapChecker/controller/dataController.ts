import { ToolsService } from "@/services/tools";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useZapCheckerController() {
  const toolsService = new ToolsService();
  const queryClient = useQueryClient();

  const {
    mutate: checkZap,
    isPending: isLoadingZapChecker,
    data: zapChecker,
  } = useMutation({
    mutationFn: async (phone: string) => {
      const response = await toolsService.zapChecker([phone]);
      return response;
    },
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["zapChecker"] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zapChecker"] });
    },
    onError: (error: any) => {
      console.error("Erro ao verificar WhatsApp:", error.message);
    },
  });

  return { checkZap, isLoadingZapChecker, zapChecker };
}
