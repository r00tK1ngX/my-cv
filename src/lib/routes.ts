export const pageKeys = [
  "home",
  "about",
  "experience",
  "skills",
  "projects",
  "blog",
  "research",
  "contact",
] as const;
export type PageKey = (typeof pageKeys)[number];
export type Locale = "en" | "vi";
export const siteOrigin = "https://chauanhdung.id.vn";
export function routeFor(locale: Locale, key: PageKey): string {
  return `${locale === "vi" ? "/vi" : ""}/${key === "home" ? "" : `${key}/`}`;
}
export const allRoutes = (["en", "vi"] as const).flatMap((locale) =>
  pageKeys.map((key) => routeFor(locale, key)),
);
export function pageFromPath(path: string): PageKey {
  const segment =
    path
      .replace(/^\/vi(?:\/|$)/, "/")
      .split("/")
      .filter(Boolean)[0] ?? "home";
  return pageKeys.includes(segment as PageKey) ? (segment as PageKey) : "home";
}
export function equivalentRoute(path: string): string {
  return routeFor(
    path === "/vi" || path.startsWith("/vi/") ? "en" : "vi",
    pageFromPath(path),
  );
}
export const pageLabels: Record<Locale, Record<PageKey, string>> = {
  en: {
    home: "Home",
    about: "About",
    experience: "Experience",
    skills: "Skills",
    projects: "Projects",
    blog: "Blog",
    research: "Research",
    contact: "Contact",
  },
  vi: {
    home: "Trang chủ",
    about: "Giới thiệu",
    experience: "Hành trình",
    skills: "Kỹ năng",
    projects: "Dự án",
    blog: "Blog",
    research: "Nghiên cứu",
    contact: "Liên hệ",
  },
};
