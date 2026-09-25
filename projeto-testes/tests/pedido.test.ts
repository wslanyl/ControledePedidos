import { Cliente } from '../src/cliente';
import { Pedido, StatusPedido, CARDAPIO } from '../src/pedido';

function criarPedidoComCliente(): Pedido {
  const cliente = new Cliente('Maria Souza');
  return new Pedido(cliente);
}

describe('Pedido - RN02 (pelo menos um produto)', () => {
  it('não deve calcular subtotal de um pedido sem produtos', () => {
    const pedido = criarPedidoComCliente();
    expect(() => pedido.calcularSubtotal()).toThrow(
      'O pedido precisa possuir pelo menos um produto.'
    );
  });

  it('deve calcular subtotal corretamente após adicionar produtos', () => {
    const pedido = criarPedidoComCliente();
    pedido.adicionarProduto('Hambúrguer', CARDAPIO.HAMBURGUER, 2); // 40
    pedido.adicionarProduto('Batata', CARDAPIO.BATATA, 1); // 10
    expect(pedido.calcularSubtotal()).toBe(50);
  });
});

describe('Pedido - RN04 (preço/quantidade negativos)', () => {
  it('não deve aceitar preço negativo', () => {
    const pedido = criarPedidoComCliente();
    expect(() => pedido.adicionarProduto('Refrigerante', -7, 1)).toThrow(
      'O preço do produto não pode ser negativo.'
    );
  });

  it('não deve aceitar quantidade negativa', () => {
    const pedido = criarPedidoComCliente();
    expect(() => pedido.adicionarProduto('Refrigerante', 7, -1)).toThrow(
      'A quantidade do produto não pode ser negativa.'
    );
  });

  it('não deve aceitar quantidade igual a zero', () => {
    const pedido = criarPedidoComCliente();
    expect(() => pedido.adicionarProduto('Refrigerante', 7, 0)).toThrow(
      'A quantidade do produto deve ser maior que zero.'
    );
  });
});

describe('Pedido - RN03 (desconto aplicado ao valor final)', () => {
  it('não deve aplicar desconto para pedidos de até R$ 100,00', () => {
    const pedido = criarPedidoComCliente();
    pedido.adicionarProduto('Hambúrguer', CARDAPIO.HAMBURGUER, 5); // 100
    expect(pedido.calcularSubtotal()).toBe(100);
    expect(pedido.calcularValorFinal()).toBe(100);
  });

  it('deve aplicar 10% de desconto para pedidos acima de R$ 100,00', () => {
    const pedido = criarPedidoComCliente();
    pedido.adicionarProduto('Hambúrguer', CARDAPIO.HAMBURGUER, 6); // 120
    expect(pedido.calcularSubtotal()).toBe(120);
    expect(pedido.calcularValorDesconto()).toBe(12);
    expect(pedido.calcularValorFinal()).toBe(108);
  });
});

describe('Pedido - RN05 (status inicial)', () => {
  it('deve iniciar com status CRIADO', () => {
    const pedido = criarPedidoComCliente();
    expect(pedido.consultarStatus()).toBe(StatusPedido.CRIADO);
  });
});

describe('Pedido - RN07 (só pode ser ENTREGUE depois de PRONTO)', () => {
  it('não deve permitir ir direto de CRIADO para ENTREGUE', () => {
    const pedido = criarPedidoComCliente();
    expect(() => pedido.alterarStatus(StatusPedido.ENTREGUE)).toThrow(
      'Um pedido só pode ser marcado como ENTREGUE depois de estar PRONTO.'
    );
  });

  it('deve permitir o fluxo completo até ENTREGUE', () => {
    const pedido = criarPedidoComCliente();
    pedido.alterarStatus(StatusPedido.EM_PREPARACAO);
    pedido.alterarStatus(StatusPedido.PRONTO);
    pedido.alterarStatus(StatusPedido.ENTREGUE);
    expect(pedido.consultarStatus()).toBe(StatusPedido.ENTREGUE);
  });
});

describe('Pedido - RN06 (pedido entregue não pode ser cancelado)', () => {
  it('não deve permitir cancelar um pedido já entregue', () => {
    const pedido = criarPedidoComCliente();
    pedido.alterarStatus(StatusPedido.EM_PREPARACAO);
    pedido.alterarStatus(StatusPedido.PRONTO);
    pedido.alterarStatus(StatusPedido.ENTREGUE);

    expect(() => pedido.alterarStatus(StatusPedido.CANCELADO)).toThrow(
      'Um pedido entregue não pode ser cancelado.'
    );
  });

  it('deve permitir cancelar um pedido que ainda não foi entregue', () => {
    const pedido = criarPedidoComCliente();
    pedido.alterarStatus(StatusPedido.EM_PREPARACAO);
    pedido.alterarStatus(StatusPedido.CANCELADO);
    expect(pedido.consultarStatus()).toBe(StatusPedido.CANCELADO);
  });
});
