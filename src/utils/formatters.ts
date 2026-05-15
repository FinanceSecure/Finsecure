export const FormatarMoeda = (valor: number | null | undefined): string => {
  if (valor === null || valor === undefined) return "R$ 0,00";

  const safeValor = Number(valor);

  if (isNaN(safeValor) || !isFinite(safeValor)) return "R$ 0,00";

  return safeValor.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
};

export const FormatarPercentual = (valor: number | null | undefined): string => {
  if (valor === null || valor === undefined) return "0,00%";

  const safeValor = Number(valor);

  return `${safeValor.toLocaleString("pt-br", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
};

export const FormatarData = (data: string | Date | null | undefined): string => {
  if (!data) return "--/--/----";

  const date = new Date(data);
  if (isNaN(date.getTime())) return "Data inválida";

  return date.toLocaleDateString("pt-br");
};

export const FormatarCompacto = (valor: number): string => {
  return Intl.NumberFormat("pt-br", {
    notation: "compact",
    compactDisplay: "short",
  }).format(valor);
};
