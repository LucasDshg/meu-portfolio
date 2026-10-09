interface IVercelRequest {
  headers: Record<string, string | string[] | undefined>;
  method?: string;
  query: Record<string, string | string[] | undefined>;
}

interface IVercelResponse {
  setHeader(name: string, value: string): void;
  status(code: number): IVercelResponse;
  send(body: string): void;
}

interface IFirestoreDocument {
  name?: string;
  fields?: Record<string, { stringValue?: string }>;
}

const SITE_NAME = 'Meu Portfólio';
const DEFAULT_DESCRIPTION =
  'Conheça artigos, projetos e experiências profissionais.';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;');

const getQueryValue = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);

const runQuery = async (
  projectId: string,
  parent: string,
  collectionId: string,
  fieldPath: string,
  fieldValue: string,
): Promise<IFirestoreDocument[]> => {
  const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${parent}:runQuery`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId }],
        where: {
          fieldFilter: {
            field: { fieldPath },
            op: 'EQUAL',
            value: { stringValue: fieldValue },
          },
        },
        limit: 1,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Firestore metadata lookup failed (${response.status}).`);
  }

  const result = (await response.json()) as Array<{
    document?: IFirestoreDocument;
  }>;

  return result.flatMap((item) => (item.document ? [item.document] : []));
};

const getStringField = (
  document: IFirestoreDocument,
  fieldPath: string,
): string => document.fields?.[fieldPath]?.stringValue ?? '';

const absoluteHttpUrl = (value: string, origin: string): string => {
  try {
    const url = new URL(value, origin);
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.href
      : '';
  } catch {
    return '';
  }
};

const createMetadata = ({
  title,
  description,
  image,
  url,
  siteName,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  siteName: string;
}): string => {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safeUrl = escapeHtml(url);
  const safeSiteName = escapeHtml(siteName);

  return `
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${safeSiteName}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:alt" content="${safeTitle}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
    <link rel="canonical" href="${safeUrl}" />`;
};

export default async function handler(
  req: IVercelRequest,
  res: IVercelResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).send('Method Not Allowed');
    return;
  }

  const host =
    getQueryValue(req.headers['x-forwarded-host']) ??
    getQueryValue(req.headers.host);
  if (!host) {
    res.status(400).send('Host header is required.');
    return;
  }

  const forwardedProtocol = getQueryValue(req.headers['x-forwarded-proto']);
  const protocol = forwardedProtocol === 'http' ? 'http' : 'https';
  const origin = `${protocol}://${host}`;
  const slug = getQueryValue(req.query.slug);
  const articleSlug = getQueryValue(req.query.articleSlug);
  // eslint-disable-next-line no-undef
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  if (!slug || !articleSlug || !projectId) {
    res.status(400).send('Article metadata parameters are required.');
    return;
  }

  try {
    const users = await runQuery(projectId, '', 'users', 'slug', slug);
    const userDocumentName = users[0]?.name;
    const userId = userDocumentName?.split('/').pop();
    if (!userId)
      throw new Error('Portfolio was not found for the requested slug.');

    const userParent = `users/${encodeURIComponent(userId)}`;
    const articles = await runQuery(
      projectId,
      userParent,
      'articles',
      'slug',
      articleSlug,
    );
    const article = articles[0];
    if (!article)
      throw new Error('Article was not found for the requested slug.');

    const title = getStringField(article, 'title') || SITE_NAME;
    const description =
      getStringField(article, 'description') || DEFAULT_DESCRIPTION;
    const logoUrl = `${origin}/logo.svg`;
    const image =
      absoluteHttpUrl(getStringField(article, 'image'), origin) || logoUrl;
    const articleUrl = `${origin}/u/${encodeURIComponent(slug)}/articles/${encodeURIComponent(articleSlug)}`;

    const pageResponse = await fetch(`${origin}/index.html`);
    if (!pageResponse.ok) {
      throw new Error(`Could not load app HTML (${pageResponse.status}).`);
    }

    const page = await pageResponse.text();
    const metadata = createMetadata({
      title,
      description,
      image,
      url: articleUrl,
      siteName: SITE_NAME,
    });
    const html = page.replace('</head>', `${metadata}\n  </head>`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
    );
    res.status(200).send(html);
  } catch (error) {
    console.error('Failed to generate article share metadata:', error);
    res.status(500).send('Could not generate article preview.');
  }
}
