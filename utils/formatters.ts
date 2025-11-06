export const FormatarMoeda = (valor: number | null | undefined): string => {
  if (valor === null || valor === undefined) return "R$ 0,00";
  const safeValor = Number(valor);

  if (isNaN(safeValor) || !isFinite(safeValor)) return "Valor inválido";

  return safeValor.toLocaleString('pt-br', {
    style: "currency",
    currency: "BRL"
  })
}
