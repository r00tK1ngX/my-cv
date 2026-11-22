import type { Metadata } from "next";
import {
  pageLabels,
  routeFor,
  siteOrigin,
  type Locale,
  type PageKey,
} from "./routes";
import { profile } from "@/data/portfolio";
const descriptions: Record<Locale, Record<PageKey, string>> = {
  en: {
    home: "Châu Anh Dũng — Cybersecurity Student in Da Nang, Vietnam. PWN, offensive security, AI and security automation. Seeking internship opportunities.",
    about:
      "About Châu Anh Dũng, a Cybersecurity student at Duy Tan University in Da Nang, Vietnam.",
    experience:
      "Education and learning journey of Châu Anh Dũng, a Cybersecurity student seeking internship opportunities.",
    skills:
      "Programming, networking, Linux and cybersecurity foundations and tools studied by Châu Anh Dũng.",
    projects:
      "Mini EDR for Linux, Happy House Laundry and personal portfolio projects by Châu Anh Dũng.",
    blog: "Learning notes and cybersecurity writing by Châu Anh Dũng. No articles are currently published.",
    research:
      "Public security research entries from Châu Anh Dũng. Explore categories and the current public collection.",
    contact:
      "Contact Châu Anh Dũng about cybersecurity internships, learning and projects at chauanhdung@dtu.edu.vn.",
  },
  vi: {
    home: "Châu Anh Dũng — Sinh viên An ninh mạng tại Đà Nẵng. Định hướng PWN, bảo mật tấn công, AI và tự động hóa bảo mật. Tìm kiếm cơ hội thực tập.",
    about:
      "Giới thiệu Châu Anh Dũng, sinh viên An ninh mạng tại Đại học Duy Tân, Đà Nẵng.",
    experience:
      "Học vấn và hành trình phát triển của Châu Anh Dũng, sinh viên An ninh mạng tìm kiếm cơ hội thực tập.",
    skills:
      "Lập trình, mạng máy tính, Linux, nền tảng an ninh mạng và các công cụ Châu Anh Dũng đang học tập.",
    projects:
      "Dự án Mini EDR cho Linux, website Happy House Laundry và portfolio cá nhân của Châu Anh Dũng.",
    blog: "Ghi chép học tập và bài viết an ninh mạng của Châu Anh Dũng. Hiện chưa có bài viết được công bố.",
    research:
      "Không gian nghiên cứu bảo mật công khai của Châu Anh Dũng, với các danh mục và nội dung hiện có.",
    contact:
      "Liên hệ Châu Anh Dũng về thực tập an ninh mạng, học tập và dự án qua chauanhdung@dtu.edu.vn.",
  },
};
export const bootInitScript =
  'try{var ls=sessionStorage.getItem("r00t_lang_switch");if(ls){sessionStorage.removeItem("r00t_lang_switch");window.__r00tBootDone=true}else if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.bootPending="1"}}catch{}';

export const bootCriticalCss =
  'html[data-boot-pending="1"] body{background:#040810}html:not([data-boot-pending="1"]) .boot-preloader{display:none}';

export const siteIcons: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
    { url: "/icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
    { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
  ],
  shortcut: [{ url: "/favicon.ico" }],
  apple: [
    {
      url: "/icons/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
};

export function metadataFor(locale: Locale, key: PageKey): Metadata {
  const title = `${profile.name} · ${key === "home" ? profile.position[locale] : pageLabels[locale][key]}`;
  const url = siteOrigin + routeFor(locale, key);
  return {
    title,
    description: descriptions[locale][key],
    alternates: {
      canonical: url,
      languages: {
        en: siteOrigin + routeFor("en", key),
        vi: siteOrigin + routeFor("vi", key),
        "x-default": siteOrigin + routeFor("en", key),
      },
    },
    openGraph: {
      title,
      description: descriptions[locale][key],
      url,
      siteName: profile.name,
      locale: locale === "en" ? "en_US" : "vi_VN",
      alternateLocale: locale === "en" ? "vi_VN" : "en_US",
      type: "website",
    },
    twitter: { card: "summary", title, description: descriptions[locale][key] },
  };
}
