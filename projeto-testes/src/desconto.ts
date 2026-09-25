/**
 * RN03 — Desconto
 * Pedidos acima de R$ 100,00 recebem desconto de 10%.
 * Pedidos de R$ 100,00 ou menos não recebem desconto.
 */
export const PERCENTUAL_DESCONTO = 0.1;
export const LIMITE_PARA_DESCONTO = 100;

/**
 * Calcula o valor do desconto (em reais) sobre um subtotal.
 * Não altera o subtotal, apenas retorna o valor a ser abatido.
 */
export function calcularDesconto(subtotal: number): number {
  if (subtotal < 0) {
    throw new Error('O subtotal não pode ser negativo.');
  }

  if (subtotal > LIMITE_PARA_DESCONTO) {
    return arredondar(subtotal * PERCENTUAL_DESCONTO);
  }

  return 0;
}

/**
 * Aplica o desconto sobre o subtotal e retorna o valor final do pedido.
 */
export function aplicarDesconto(subtotal: number): number {
  const desconto = calcularDesconto(subtotal);
  return arredondar(subtotal - desconto);
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}
