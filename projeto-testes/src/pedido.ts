import { Cliente } from './cliente';
import { aplicarDesconto, calcularDesconto } from './desconto';

/**
 * RN05 — Status
 * Um pedido pode possuir os seguintes status:
 * CRIADO, EM_PREPARACAO, PRONTO, ENTREGUE, CANCELADO
 */
export enum StatusPedido {
  CRIADO = 'CRIADO',
  EM_PREPARACAO = 'EM_PREPARACAO',
  PRONTO = 'PRONTO',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
}

export interface ItemPedido {
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
}

// Cardápio de referência (não obrigatório de usar, mas útil como fonte da verdade)
export const CARDAPIO = {
  HAMBURGUER: 20.0,
  BATATA: 10.0,
  REFRIGERANTE: 7.0,
  SOBREMESA: 8.0,
} as const;

export class Pedido {
  readonly cliente: Cliente;
  private itens: ItemPedido[] = [];
  private status: StatusPedido = StatusPedido.CRIADO;

  constructor(cliente: Cliente) {
    this.cliente = cliente;
  }

  /**
   * RN04 — Valor negativo
   * O sistema não pode aceitar preço ou quantidade menor que zero.
   */
  adicionarProduto(nomeProduto: string, precoUnitario: number, quantidade: number): void {
    if (!nomeProduto || nomeProduto.trim().length === 0) {
      throw new Error('O nome do produto não pode estar vazio.');
    }

    if (precoUnitario < 0) {
      throw new Error('O preço do produto não pode ser negativo.');
    }

    if (quantidade < 0) {
      throw new Error('A quantidade do produto não pode ser negativa.');
    }

    if (quantidade === 0) {
      throw new Error('A quantidade do produto deve ser maior que zero.');
    }

    this.itens.push({ nomeProduto, precoUnitario, quantidade });
  }

  listarItens(): ItemPedido[] {
    return [...this.itens];
  }

  /**
   * RN02 — Pedido
   * Um pedido precisa possuir pelo menos um produto.
   */
  private validarPossuiProduto(): void {
    if (this.itens.length === 0) {
      throw new Error('O pedido precisa possuir pelo menos um produto.');
    }
  }

  calcularSubtotal(): number {
    this.validarPossuiProduto();
    const subtotal = this.itens.reduce(
      (total, item) => total + item.precoUnitario * item.quantidade,
      0
    );
    return arredondar(subtotal);
  }

  calcularValorDesconto(): number {
    return calcularDesconto(this.calcularSubtotal());
  }

  /**
   * RN03 — Desconto aplicado sobre o subtotal.
   */
  calcularValorFinal(): number {
    return aplicarDesconto(this.calcularSubtotal());
  }

  consultarStatus(): StatusPedido {
    return this.status;
  }

  /**
   * RN06 — Cancelamento: um pedido ENTREGUE não pode ser cancelado.
   * RN07 — Pedido pronto: só pode ir para ENTREGUE depois de estar PRONTO.
   */
  alterarStatus(novoStatus: StatusPedido): void {
    if (this.status === StatusPedido.ENTREGUE && novoStatus === StatusPedido.CANCELADO) {
      throw new Error('Um pedido entregue não pode ser cancelado.');
    }

    if (this.status === StatusPedido.CANCELADO) {
      throw new Error('Um pedido cancelado não pode ter seu status alterado.');
    }

    if (this.status === StatusPedido.ENTREGUE) {
      throw new Error('Um pedido entregue não pode ter seu status alterado.');
    }

    if (novoStatus === StatusPedido.ENTREGUE && this.status !== StatusPedido.PRONTO) {
      throw new Error('Um pedido só pode ser marcado como ENTREGUE depois de estar PRONTO.');
    }

    this.status = novoStatus;
  }
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}
