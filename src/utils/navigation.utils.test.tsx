import { renderHook } from '@testing-library/react';
import React from 'react';
import { RiGithubLine, RiMailLine } from 'react-icons/ri';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import {
  getSocialHref,
  getSocialIcon,
  useNavigationMenu,
  usePathName,
} from './navigation.utils';

describe('Navigation Utils & Hooks', () => {
  describe('usePathName', () => {
    it('deve extrair o slug corretamente de uma URL de usuário (/u/slug)', () => {
      const { result } = renderHook(() => usePathName(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <MemoryRouter initialEntries={['/u/lucas-dev']}>
            {children}
          </MemoryRouter>
        ),
      });

      expect(result.current.slug).toBe('lucas-dev');
      expect(result.current.basePath).toBe('/u/lucas-dev');
    });

    it('deve retornar basePath "/" quando não houver slug na URL', () => {
      const { result } = renderHook(() => usePathName(), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <MemoryRouter initialEntries={['/home']}>{children}</MemoryRouter>
        ),
      });

      expect(result.current.slug).toBeUndefined();
      expect(result.current.basePath).toBe('/');
    });
  });

  describe('useNavigationMenu', () => {
    const mockProfile: any = {
      slug: 'test-user',
      pages: {
        home: { label: 'Início', show: true, order: 1 },
        projects: { label: 'Projetos', show: true, order: 2 },
        secret: { label: 'Privado', show: false, order: 3 },
      },
    };

    it('deve formatar e ordenar os menus corretamente', () => {
      const { result } = renderHook(() => useNavigationMenu(mockProfile), {
        wrapper: ({ children }: { children: React.ReactNode }) => (
          <MemoryRouter>{children}</MemoryRouter>
        ),
      });

      expect(result.current.menus).toHaveLength(2);
      expect(result.current.menus[0].id).toBe('home');
      expect(result.current.menus[0].href).toBe('/u/test-user');
      expect(result.current.menus[1].id).toBe('projects');
      expect(result.current.menus[1].href).toBe('/u/test-user/projects');
    });
  });

  describe('getSocialIcon', () => {
    it('deve retornar o componente de ícone correto', () => {
      expect(getSocialIcon('github')).toBe(RiGithubLine);
      expect(getSocialIcon('Linkedin')).toBe(getSocialIcon('linkedin'));
    });

    it('deve retornar ícone de mail para variações de email', () => {
      expect(getSocialIcon('E-mail')).toBe(RiMailLine);
      expect(getSocialIcon('mail')).toBe(RiMailLine);
    });

    it('deve retornar null para nomes que não dão match', () => {
      expect(getSocialIcon('orkut')).toBeNull();
    });
  });

  describe('getSocialHref', () => {
    it('deve formatar link de email com mailto:', () => {
      const email = 'contato@lucas.dev';
      expect(getSocialHref('E-mail', email)).toBe(`mailto:${email}`);
    });

    it('deve manter o link original para outras redes sociais', () => {
      const link = 'https://github.com/lucas';
      expect(getSocialHref('GitHub', link)).toBe(link);
    });
  });
});
