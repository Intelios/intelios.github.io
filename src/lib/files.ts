import type { ImageMetadata } from 'astro';

const shotsGlob = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/apps/*/shots/*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

const iconGlob = import.meta.glob<{ default: ImageMetadata | string }>(
  '../assets/apps/*/icon.{png,jpg,jpeg,webp,avif,svg}',
  { eager: true },
);

/** Screenshot metadata for an app, from src/assets/apps/<slug>/shots/. */
export function getScreenshots(slug: string): ImageMetadata[] {
  const prefix = `../assets/apps/${slug}/shots/`;
  return Object.keys(shotsGlob)
    .filter((k) => k.startsWith(prefix))
    .sort()
    .map((k) => shotsGlob[k].default);
}

/** Icon for an app, from src/assets/apps/<slug>/icon.*.
 *  Raster formats resolve to ImageMetadata; SVGs resolve to a URL string. */
export function getIcon(slug: string): ImageMetadata | string | undefined {
  const prefix = `../assets/apps/${slug}/icon.`;
  const key = Object.keys(iconGlob).find((k) => k.startsWith(prefix));
  return key ? iconGlob[key].default : undefined;
}
