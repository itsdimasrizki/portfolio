export interface SanityImageMeta {
  url: string;
  width: number;
  height: number;
}

export const DEFAULT_HERO_PORTRAIT: SanityImageMeta = {
  url: "/assets/dimas-pointing.png",
  width: 666,
  height: 375,
};

export const DEFAULT_ABOUT_PORTRAIT: SanityImageMeta = {
  url: "/assets/dimas-about.png",
  width: 375,
  height: 666,
};

export function resolvePortrait(
  image: Partial<SanityImageMeta> | null | undefined,
  fallback: SanityImageMeta
): SanityImageMeta {
  if (image?.url && typeof image.url === "string" && image.url.trim() !== "") {
    return {
      url: image.url,
      width: image.width && image.width > 0 ? image.width : fallback.width,
      height: image.height && image.height > 0 ? image.height : fallback.height,
    };
  }
  return fallback;
}
