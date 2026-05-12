import { describe, expect, it } from 'vitest';
import { formatPhone } from './format-phone';

describe('formatPhone', () => {
  it('deve retornar +55 para entrada vazia', () => {
    expect(formatPhone('')).toBe('+55');
  });

  it('deve formatar um número completo com DDD e 9 dígitos', () => {
    expect(formatPhone('11999999999')).toBe('+55 (11) 99999-9999');
  });

  it('deve remover o prefixo 55 inicial se o usuário digitar manualmente', () => {
    expect(formatPhone('5511999999999')).toBe('+55 (11) 99999-9999');
  });

  it('deve lidar com números parciais aplicando a máscara progressivamente', () => {
    expect(formatPhone('1')).toBe('+55 (1');
    expect(formatPhone('11')).toBe('+55 (11');
    expect(formatPhone('119')).toBe('+55 (11) 9');
    expect(formatPhone('1199999')).toBe('+55 (11) 99999');
    expect(formatPhone('11999998')).toBe('+55 (11) 99999-8');
  });

  it('deve remover caracteres não numéricos antes de formatar', () => {
    expect(formatPhone('(11) 99999-9999')).toBe('+55 (11) 99999-9999');
    expect(formatPhone('abc11x99999y9999')).toBe('+55 (11) 99999-9999');
  });

  it('deve lidar corretamente com a string "+55" isolada', () => {
    expect(formatPhone('+55')).toBe('+55');
    expect(formatPhone('+')).toBe('+55');
  });

  it('deve formatar corretamente se o valor já contiver o prefixo formatado', () => {
    expect(formatPhone('+55 (11) 99999-9999')).toBe('+55 (11) 99999-9999');
  });
});
