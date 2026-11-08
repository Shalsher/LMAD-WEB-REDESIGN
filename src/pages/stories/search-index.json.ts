import type { APIRoute } from 'astro';
import { stories } from '~/lib/content';

/**
 * Full-story search index, emitted as a separate static file.
 *
 * Keeping it out of the stories page keeps that page light for the many
 * visitors who only browse; it is fetched the moment someone focuses the
 * search box, which is well before they finish typing a word.
 */
export const GET: APIRoute = () => {
  const index: Record<string, string> = {};
  for (const s of stories) index[s.slug] = s.keywords;
  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
