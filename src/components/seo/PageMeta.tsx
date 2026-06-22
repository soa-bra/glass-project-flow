/**
 * @specRef seo/per-route-metadata
 * Per-route head metadata. Sets unique <title> and metadata for each route.
 */
import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
}

const OG_IMAGE = "https://glass-project-flow.lovable.app/og-image.jpg";
const APP_ORIGIN = "https://glass-project-flow.lovable.app";

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
}

function upsertCanonical(url: string | undefined) {
  const selector = 'link[rel="canonical"]';
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!url) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", url);
}

export function PageMeta({ title, description, path }: PageMetaProps) {
  useEffect(() => {
    const url = path ? `${APP_ORIGIN}${path}` : undefined;

    document.title = title;
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: OG_IMAGE });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: OG_IMAGE });

    if (url) {
      upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    }

    upsertCanonical(url);
  }, [description, path, title]);

  return null;
}
