import { Helmet } from 'react-helmet-async';
import {
  SITE_ORIGIN,
  ogImageParams,
  buildPersonJsonLd,
  buildWebSiteJsonLd,
  buildFaqPageJsonLd,
  HIRE_FAQ,
  SEO_COPY,
} from '../lib/seo';

interface SeoProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage: string;
  jsonLd?: Record<string, unknown>[];
}

export function Seo({ title, description, canonicalPath, ogImage, jsonLd }: SeoProps) {
  const path = canonicalPath === '/' ? '' : canonicalPath;
  const url = `${SITE_ORIGIN}${path}`;

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd?.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data).replace(/</g, '\\u003c')}
        </script>
      ))}
    </Helmet>
  );
}

export function SeoHome() {
  const { title, description, path } = SEO_COPY.home;
  return (
    <Seo
      title={title}
      description={description}
      canonicalPath={path}
      ogImage={ogImageParams('Adam Krupa', 'Frontend designer & UI engineer', 'globe')}
      jsonLd={[buildWebSiteJsonLd() as Record<string, unknown>]}
    />
  );
}

export function SeoIdentity() {
  const { title, description, path } = SEO_COPY.identity;
  return (
    <Seo
      title={title}
      description={description}
      canonicalPath={path}
      ogImage={ogImageParams('Adam Krupa', 'About — frontend designer', 'globe')}
      jsonLd={[buildPersonJsonLd() as Record<string, unknown>]}
    />
  );
}

export function SeoHire() {
  const { title, description, path } = SEO_COPY.hire;
  return (
    <Seo
      title={title}
      description={description}
      canonicalPath={path}
      ogImage={ogImageParams('Hire Adam Krupa', 'Frontend design & UI engineering', 'globe')}
      jsonLd={
        [
          buildPersonJsonLd() as Record<string, unknown>,
          buildFaqPageJsonLd(HIRE_FAQ) as Record<string, unknown>,
        ]
      }
    />
  );
}

export function SeoSecondary({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return (
    <Seo
      title={`${title} | Adam Krupa — pcstyle.dev`}
      description={description}
      canonicalPath={path}
      ogImage={ogImageParams(title, 'pcstyle.dev', 'globe')}
    />
  );
}
