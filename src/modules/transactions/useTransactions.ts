import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "./transactions.service";
import { CreateTransactionDTO } from "./transactions.types";

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionDTO) => transactionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};
