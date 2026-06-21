/**
 * @specRef seo/per-route-metadata
 * Per-route head metadata. Sets unique <title> and <meta description>
 * for each route via react-helmet-async.
 */
import { Helmet } from "react-helmet-async";

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
}

const OG_IMAGE = "https://glass-project-flow.lovable.app/og-image.jpg";

export function PageMeta({ title, description, path }: PageMetaProps) {
  const url = path ? `https://glass-project-flow.lovable.app${path}` : undefined;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
      {url && <meta property="og:url" content={url} />}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
}
