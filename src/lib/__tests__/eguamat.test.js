'use strict';

import { aprox, raizq, sen, cos, tan, radiano, graus, pi, raiz } from '../eguamat';

describe('aprox', () => {
    it('throws when num is null', () => {
      expect(() => aprox()).toThrow();
    })

    it('throws when num is NaN', () => {
        expect(() => aprox('egua')).toThrow();
      })
  

    it('rounds a number', () => {
        expect(aprox(2.9999999999)).toBe(3);
    })
})

describe('raizq', () => {
    it('throws when num is null', () => {
      expect(() => raizq()).toThrow();
    })

    it('throws when num is NaN', () => {
        expect(() => raizq('egua')).toThrow();
      })
  

    it('calculates the square root', () => {
        expect(raizq(4)).toBe(2);
    })
})

describe('sen', () => {
    it('throws when num is null', () => {
      expect(() => sen()).toThrow();
    })

    it('throws when num is NaN', () => {
        expect(() => sen('egua')).toThrow();
      })
  

    it('calculates the sine', () => {
        expect(sen(90)).toBe(0.8939966636005579);
    })
})


describe('cos', () => {
    it('throws when num is null', () => {
      expect(() => cos()).toThrow();
    })

    it('throws when num is NaN', () => {
        expect(() => cos('egua')).toThrow();
      })
  

    it('calculates the cosine', () => {
        expect(cos(90)).toBe(-0.4480736161291702);
    })
})


describe('radiano', () => {
    it('throws when num is null', () => {
      expect(() => radiano()).toThrow();
    })

    it('throws when num is NaN', () => {
        expect(() => radiano('egua')).toThrow();
      })
  

    it('calculates the radian', () => {
        expect(radiano(180)).toBe(pi);
    })
})


describe('graus', () => {
    it('throws when num is null', () => {
      expect(() => graus()).toThrow();
    })

    it('throws when num is NaN', () => {
        expect(() => graus('egua')).toThrow();
      })
  

    it('calculates the angle', () => {
        expect(graus(pi)).toBe(180);
    })
})

describe('raiz', () => {
    it('throws when num is null', () => {
      expect(() => raiz()).toThrow();
    })

    it('throws when num is NaN', () => {
        expect(() => raiz('egua')).toThrow();
      })
  

    it('calculates the root', () => {
        expect(raiz(125, 3)).toBeCloseTo(5, 2);
    })
})
