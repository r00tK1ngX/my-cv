import type { MetadataRoute } from "next";
import { pageKeys, routeFor, siteOrigin } from "@/lib/routes";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return (["en", "vi"] as const).flatMap((locale) =>
    pageKeys.map((key) => ({
      url: siteOrigin + routeFor(locale, key),
      alternates: {
        languages: {
          en: siteOrigin + routeFor("en", key),
          vi: siteOrigin + routeFor("vi", key),
          "x-default": siteOrigin + routeFor("en", key),
        },
      },
    })),
  );
}
