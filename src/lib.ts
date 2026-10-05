import site from './data/site.json';
import { getCollection } from 'astro:content';

export { site };

export const wa = (message: string = site.defaultMessage) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export const tel = `tel:+${site.whatsapp}`;

export const abs = (path: string) => new URL(path, site.siteUrl).href;

export const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat('ms-MY', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);

export async function getArticles() {
  const all = await getCollection('artikel', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const readingMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 200));
