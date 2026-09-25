import { calcularDesconto, aplicarDesconto } from '../src/desconto';

describe('Desconto - RN03', () => {
  it('não deve aplicar desconto para valores abaixo de R$ 100,00', () => {
    expect(calcularDesconto(50)).toBe(0);
    expect(aplicarDesconto(50)).toBe(50);
  });

  it('não deve aplicar desconto para valores iguais a R$ 100,00', () => {
    expect(calcularDesconto(100)).toBe(0);
    expect(aplicarDesconto(100)).toBe(100);
  });

  it('deve aplicar 10% de desconto para valores acima de R$ 100,00', () => {
    expect(calcularDesconto(150)).toBe(15);
    expect(aplicarDesconto(150)).toBe(135);
  });

  it('deve aplicar o desconto corretamente para valores quebrados', () => {
    expect(calcularDesconto(101)).toBeCloseTo(10.1);
    expect(aplicarDesconto(101)).toBeCloseTo(90.9);
  });

  it('deve lançar erro para subtotal negativo', () => {
    expect(() => calcularDesconto(-10)).toThrow('O subtotal não pode ser negativo.');
  });
});
