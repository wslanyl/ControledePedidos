# Projeto Testes — Sistema de Pedidos de Lanchonete

Sistema em **TypeScript**, com testes automatizados em **Jest**, para controle de pedidos de uma lanchonete: cadastro de cliente, criação de pedido, adição de produtos, cálculo de subtotal/desconto/valor final e controle de status do pedido.

## Estrutura do projeto

```
projeto-testes/
│
├── src/
│   ├── cliente.ts      # Classe Cliente (RN01)
│   ├── pedido.ts        # Classe Pedido, itens e status (RN02, RN04, RN05, RN06, RN07)
│   └── desconto.ts      # Cálculo/aplicação de desconto (RN03)
│
├── tests/
│   ├── cliente.test.ts
│   ├── pedido.test.ts
│   └── desconto.test.ts
│
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Produtos (cardápio)

| Produto       | Preço    |
|---------------|----------|
| Hambúrguer    | R$ 20,00 |
| Batata        | R$ 10,00 |
| Refrigerante  | R$ 7,00  |
| Sobremesa     | R$ 8,00  |

As constantes correspondentes estão disponíveis em `src/pedido.ts` (`CARDAPIO`), mas o método `adicionarProduto` aceita qualquer nome/preço, para manter a classe `Pedido` desacoplada de um cardápio fixo.

## Regras de negócio implementadas

| Regra | Descrição | Onde está |
|-------|-----------|-----------|
| RN01  | Nome do cliente não pode ser vazio e deve ter ao menos 3 caracteres | `Cliente` (construtor) |
| RN02  | Um pedido precisa ter pelo menos um produto | `Pedido.calcularSubtotal()` |
| RN03  | Desconto de 10% para pedidos acima de R$ 100,00; nenhum desconto para pedidos ≤ R$ 100,00 | `desconto.ts` / `Pedido.calcularValorFinal()` |
| RN04  | Preço e quantidade não podem ser negativos (nem quantidade zero) | `Pedido.adicionarProduto()` |
| RN05  | Status possíveis: `CRIADO`, `EM_PREPARACAO`, `PRONTO`, `ENTREGUE`, `CANCELADO` | `enum StatusPedido` |
| RN06  | Pedido `ENTREGUE` não pode ser cancelado | `Pedido.alterarStatus()` |
| RN07  | Só pode ir para `ENTREGUE` se estiver `PRONTO` | `Pedido.alterarStatus()` |

## Requisitos

- Node.js 18+
- npm

## Instalação

```bash
npm install
```

## Como rodar os testes

```bash
npm test              # roda todos os testes
npm run test:watch    # roda os testes em modo watch
npm run test:coverage # roda os testes com relatório de cobertura
```

## API principal

```ts
import { Cliente } from './src/cliente';
import { Pedido, StatusPedido, CARDAPIO } from './src/pedido';

// 1. Cadastrar cliente
const cliente = new Cliente('Maria Souza');

// 2. Criar pedido
const pedido = new Pedido(cliente);

// 3. Adicionar produtos
pedido.adicionarProduto('Hambúrguer', CARDAPIO.HAMBURGUER, 2);
pedido.adicionarProduto('Refrigerante', CARDAPIO.REFRIGERANTE, 2);

// 4. Calcular subtotal
pedido.calcularSubtotal();      // 54

// 5/6. Desconto e valor final
pedido.calcularValorDesconto(); // 0 (não passou de R$ 100)
pedido.calcularValorFinal();    // 54

// 7. Consultar status
pedido.consultarStatus();       // 'CRIADO'

// 8. Alterar status (respeitando RN06 e RN07)
pedido.alterarStatus(StatusPedido.EM_PREPARACAO);
pedido.alterarStatus(StatusPedido.PRONTO);
pedido.alterarStatus(StatusPedido.ENTREGUE);
```

## Cobertura de testes

- **cliente.test.ts**: nome válido, remoção de espaços nas bordas, nome vazio, nome só com espaços, nome com menos de 3 caracteres, nome com exatamente 3 caracteres.
- **desconto.test.ts**: valores abaixo, igual e acima de R$ 100,00; valores quebrados; subtotal negativo.
- **pedido.test.ts**: pedido sem produto, cálculo de subtotal com múltiplos itens, preço/quantidade negativos, quantidade zero, desconto aplicado (ou não) ao pedido, status inicial, transição correta de status até `ENTREGUE`, bloqueio de `ENTREGUE` sem passar por `PRONTO`, bloqueio de cancelamento após `ENTREGUE`, cancelamento permitido antes da entrega.

## Tecnologias

- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/) + [ts-jest](https://kulshekhar.github.io/ts-jest/)
