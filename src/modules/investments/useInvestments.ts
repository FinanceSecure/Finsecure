import { getUiErrorMessage } from "@/api/apiError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { investmentKeys } from "./investments.keys";
import { investmentsService } from "./investments.service";
import { ApplyInvestmentDTO, RedeemInvestmentDTO } from "./investments.types";

const invalidateInvestmentData = async (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: investmentKeys.statement() }),
    queryClient.invalidateQueries({ queryKey: investmentKeys.investedAmount() }),
  ]);
};

export const useInvestmentStatement = () => {
  return useQuery({
    queryKey: investmentKeys.statement(),
    queryFn: investmentsService.getStatement,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
};

export const useInvestedAmount = () => {
  return useQuery({
    queryKey: investmentKeys.investedAmount(),
    queryFn: investmentsService.getInvestedAmount,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
};

export const useInvestmentTypes = () => {
  return useQuery({
    queryKey: investmentKeys.types(),
    queryFn: investmentsService.getTypes,
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
  });
};

export const useInvestmentTypeDetails = (id: string, amount: number) => {
  return useQuery({
    queryKey: investmentKeys.typeDetails(id, amount),
    queryFn: () => investmentsService.getTypeById(id, amount),
    enabled: Boolean(id) && amount > 0,
    staleTime: 15_000,
    gcTime: 2 * 60_000,
  });
};

export const useApplyInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApplyInvestmentDTO) => investmentsService.apply(data),
    onSuccess: () => invalidateInvestmentData(queryClient),
    meta: {
      getErrorMessage: (error: unknown) =>
        getUiErrorMessage(error, "Erro ao realizar investimento."),
    },
  });
};

export const useRedeemInvestment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RedeemInvestmentDTO) => investmentsService.redeem(data),
    onSuccess: () => invalidateInvestmentData(queryClient),
    meta: {
      getErrorMessage: (error: unknown) =>
        getUiErrorMessage(error, "Erro ao resgatar investimento."),
    },
  });
};
