'use strict';

import { aprox, raizq, sen, cos, tan, radiano, graus, pi, raiz } from '../eguamat';

describe('aprox', () => {
  it('atira exceção se num for nulo', () => {
    expect(() => aprox()).toThrow();
  })

  it('atira exceção se num é NaN', () => {
    expect(() => aprox('egua', 'outro-NaN')).toThrow();
  })

  it('arredonda um número', () => {
    expect(aprox(2.9999999999, 0)).toBe("3");
  })
})

describe('raizq', () => {
  it('atira exceção se num for nulo', () => {
    expect(() => raizq()).toThrow();
  })

  it('atira exceção se num é NaN', () => {
    expect(() => raizq('egua')).toThrow();
  })

  it('calcula a raiz quadrada', () => {
    expect(raizq(4)).toBe(2);
  })
})

describe('sen', () => {
  it('atira exceção se num for nulo', () => {
    expect(() => sen()).toThrow();
  })

  it('atira exceção se num é NaN', () => {
    expect(() => sen('egua')).toThrow();
  })

  it('calcula o seno', () => {
    expect(sen(90)).toBe(0.8939966636005579);
  })
})

describe('cos', () => {
  it('atira exceção se num for nulo', () => {
    expect(() => cos()).toThrow();
  })

  it('atira exceção se num é NaN', () => {
    expect(() => cos('egua')).toThrow();
  })

  it('calcula o cosseno', () => {
    expect(cos(90)).toBe(-0.4480736161291702);
  })
})

describe('radiano', () => {
  it('atira exceção se num for nulo', () => {
    expect(() => radiano()).toThrow();
  })

  it('atira exceção se num é NaN', () => {
    expect(() => radiano('egua')).toThrow();
  })

  it('calcula o radiano', () => {
    expect(radiano(180)).toBe(pi);
  })
})

describe('graus', () => {
  it('atira exceção se num for nulo', () => {
    expect(() => graus()).toThrow();
  })

  it('atira exceção se num é NaN', () => {
    expect(() => graus('egua')).toThrow();
  })

  it('calcula o ângulo', () => {
    expect(graus(pi)).toBe(180);
  })
})

describe('raizq', () => {
  it('atira exceção se num for nulo', () => {
    expect(() => raizq()).toThrow();
  })

  it('atira exceção se num é NaN', () => {
    expect(() => raizq('egua')).toThrow();
  })

  it('calcula a raiz', () => {
    expect(raizq(25)).toBeCloseTo(5, 2);
  })
})
