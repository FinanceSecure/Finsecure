export const investmentKeys = {
  all: ["investments"] as const,
  statement: () => [...investmentKeys.all, "statement"] as const,
  investedAmount: () => [...investmentKeys.all, "investedAmount"] as const,
  types: () => [...investmentKeys.all, "types"] as const,
  typeDetails: (id: string, amount: number) =>
    [...investmentKeys.types(), id, amount] as const,
};
