import { afterEach, describe, expect, it, vi } from 'vitest';
import handler from './article-preview';

const createResponse = (
  body: unknown,
  status = 200,
): {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
} => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
  text: async () => String(body),
});

const createVercelResponse = () => {
  const state: {
    headers: Record<string, string>;
    statusCode: number;
    body: string;
  } = { headers: {}, statusCode: 200, body: '' };

  const response = {
    setHeader: (name: string, value: string) => {
      state.headers[name] = value;
    },
    status: (statusCode: number) => {
      state.statusCode = statusCode;
      return response;
    },
    send: (body: string) => {
      state.body = body;
    },
  };

  return { response, state };
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('article share preview handler', () => {
  it('renders article metadata and uses the cover as the share image', async () => {
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'portfolio-project');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      createResponse([
        { document: { name: 'projects/portfolio-project/documents/users/user-1' } },
      ]) as Response,
    );
    fetchMock.mockResolvedValueOnce(
      createResponse([
        {
          document: {
            fields: {
              title: { stringValue: 'Título do artigo' },
              description: { stringValue: 'Descrição do artigo' },
              image: { stringValue: 'https://images.example.test/cover.png' },
            },
          },
        },
      ]) as Response,
    );
    fetchMock.mockResolvedValueOnce(
      createResponse(
        '<!doctype html><html><head><title>Meu Portfólio</title></head><body><div id="root"></div></body></html>',
      ) as Response,
    );
    const { response, state } = createVercelResponse();

    await handler(
      {
        headers: { host: 'www.meu-portfolio.app.br' },
        query: { slug: 'lucas-gomes', articleSlug: 'meu-artigo' },
      },
      response,
    );

    expect(state.statusCode).toBe(200);
    expect(state.headers['Content-Type']).toBe('text/html; charset=utf-8');
    expect(state.body).toContain('<title>Título do artigo</title>');
    expect(state.body).toContain('content="Descrição do artigo"');
    expect(state.body).toContain(
      'property="og:image" content="https://images.example.test/cover.png"',
    );
    expect(state.body).toContain(
      'property="og:site_name" content="Meu Portfólio"',
    );
    expect(state.body).toContain(
      'href="https://www.meu-portfolio.app.br/u/lucas-gomes/articles/meu-artigo"',
    );
  });

  it('uses the site logo when the article does not have a cover', async () => {
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'portfolio-project');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      createResponse([
        { document: { name: 'projects/portfolio-project/documents/users/user-1' } },
      ]) as Response,
    );
    fetchMock.mockResolvedValueOnce(
      createResponse([
        {
          document: {
            fields: { title: { stringValue: 'Artigo sem capa' } },
          },
        },
      ]) as Response,
    );
    fetchMock.mockResolvedValueOnce(
      createResponse('<html><head></head><body></body></html>') as Response,
    );
    const { response, state } = createVercelResponse();

    await handler(
      {
        headers: { host: 'www.meu-portfolio.app.br' },
        query: { slug: 'lucas-gomes', articleSlug: 'artigo-sem-capa' },
      },
      response,
    );

    expect(state.statusCode).toBe(200);
    expect(state.body).toContain(
      'property="og:image" content="https://www.meu-portfolio.app.br/logo.svg"',
    );
  });
});
