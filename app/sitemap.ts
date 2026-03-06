import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://worldsentinel.io';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/dashboard`, lastModified: now, changeFrequency: 'always', priority: 0.9 },
    { url: `${base}/for-investors`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/for-security`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/for-curious`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/morning-brief`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];
}
