import type { Locale } from "@/lib/routes";
export type Translated = Record<Locale, string>;
export const profile = {
  name: "Châu Anh Dũng",
  handle: "r00tK1ngX",
  initials: "CAD",
  position: { en: "Cybersecurity Student", vi: "Sinh viên An ninh mạng" },
  location: { en: "Da Nang, Vietnam", vi: "Đà Nẵng, Việt Nam" },
  objective: {
    en: "Seeking internship opportunities in cybersecurity and developing practical skills in offensive security, software security and security research.",
    vi: "Tìm kiếm cơ hội thực tập an ninh mạng, phát triển kỹ năng thực hành về bảo mật tấn công, bảo mật phần mềm và nghiên cứu bảo mật.",
  },
  email: "chauanhdung@gmail.com",
  github: "https://github.com/r00tK1ngX",
  linkedIn: "https://www.linkedin.com/in/anh-d%C5%A9ng-ch%C3%A2u-533b98364/",
  website: "https://chauanhdung.id.vn/",
  education: {
    school: { en: "Duy Tan University", vi: "Đại học Duy Tân" },
    degree: {
      en: "Bachelor’s degree in Cybersecurity — in progress",
      vi: "Cử nhân An ninh mạng — đang theo học",
    },
    period: "2024 – Present",
    periodVi: "2024 – Hiện tại",
    year: { en: "Third-year student", vi: "Sinh viên năm ba" },
  },
  interests: [
    { en: "PWN / Binary Exploitation", vi: "PWN / Khai thác nhị phân" },
    { en: "Red Team / Offensive Security", vi: "Red Team / Bảo mật tấn công" },
    { en: "AI & Security Automation", vi: "AI & Tự động hóa bảo mật" },
  ],
} as const;
export const skills: {
  id: string;
  title: Translated;
  items: string[];
  icon: string;
  accent: string;
}[] = [
  {
    id: "programming",
    title: { en: "Programming", vi: "Lập trình" },
    items: ["C", "C++", "Python", "Java"],
    icon: "code",
    accent: "cyan",
  },
  {
    id: "computer-science",
    title: { en: "Computer Science", vi: "Khoa học máy tính" },
    items: [
      "Data Structures and Algorithms",
      "Java Object-Oriented Programming",
    ],
    icon: "cpu",
    accent: "pink",
  },
  {
    id: "networking",
    title: { en: "Networking", vi: "Mạng máy tính" },
    items: ["OSI Model", "TCP/IP", "UDP", "Network Protocol Fundamentals"],
    icon: "network",
    accent: "green",
  },
  {
    id: "systems",
    title: { en: "Operating Systems", vi: "Hệ điều hành" },
    items: ["Linux / Unix", "Command-line tools"],
    icon: "terminal",
    accent: "amber",
  },
  {
    id: "security",
    title: { en: "Cybersecurity Foundations", vi: "Nền tảng an ninh mạng" },
    items: [
      "Network Security",
      "Penetration Testing Fundamentals",
      "Red Team learning",
      "PWN / Binary Exploitation practice",
    ],
    icon: "shield",
    accent: "cyan",
  },
  {
    id: "tools",
    title: {
      en: "Security & Development Tools",
      vi: "Công cụ bảo mật & Phát triển",
    },
    items: [
      "Wireshark",
      "Nmap",
      "Metasploit",
      "Burp Suite Professional",
      "Aircrack-ng",
      "Git",
      "GitHub",
    ],
    icon: "wrench",
    accent: "pink",
  },
];
export const skillTranslations: Record<string, string> = {
  "Data Structures and Algorithms": "Cấu trúc dữ liệu và giải thuật",
  "Java Object-Oriented Programming": "Lập trình hướng đối tượng Java",
  "OSI Model": "Mô hình OSI",
  "Network Protocol Fundamentals": "Nền tảng giao thức mạng",
  "Command-line tools": "Công cụ dòng lệnh",
  "Network Security": "Bảo mật mạng",
  "Penetration Testing Fundamentals": "Nền tảng kiểm thử xâm nhập",
  "Red Team learning": "Học tập Red Team",
  "PWN / Binary Exploitation practice": "Thực hành PWN / Khai thác nhị phân",
};
export type Project = {
  id: string;
  title: string;
  subtitle: Translated;
  description: Translated;
  technologies: string[];
  highlights: Translated[];
  href: string;
  code?: string;
  icon: string;
  accent: string;
  sourceCommit?: string;
};
export const projects: Project[] = [
  {
    id: "mini-edr",
    title: "Mini EDR for Linux",
    subtitle: {
      en: "Academic security project",
      vi: "Dự án an ninh mạng học thuật",
    },
    description: {
      en: "A Linux Endpoint Detection and Response project with endpoint monitoring, telemetry collection, rule-based detection and a SOC-style web dashboard.",
      vi: "Dự án phát hiện và phản ứng tại điểm cuối Linux, gồm giám sát endpoint, thu thập telemetry, phát hiện theo luật và dashboard web kiểu SOC.",
    },
    technologies: [
      "Python",
      "Flask",
      "SQLite",
      "Linux",
      "psutil",
      "HTML",
      "CSS",
      "JavaScript",
    ],
    highlights: [
      {
        en: "Linux agent collects system and process telemetry for a Flask ingestion API.",
        vi: "Agent Linux thu thập telemetry hệ thống và tiến trình, gửi đến API Flask.",
      },
      {
        en: "SHA-256 file integrity monitoring and SQLite persistence.",
        vi: "Giám sát toàn vẹn tệp bằng SHA-256 và lưu trữ SQLite.",
      },
      {
        en: "Rule-based detection, correlation and endpoint/event/alert views.",
        vi: "Phát hiện theo luật, tương quan và giao diện endpoint, sự kiện, cảnh báo.",
      },
    ],
    href: "https://github.com/r00tK1ngX/mini-edr-linux",
    code: "https://github.com/r00tK1ngX/mini-edr-linux",
    icon: "shield",
    accent: "cyan",
    sourceCommit: "e31617ca2716665e992c475238f321e90252dd17",
  },
  {
    id: "happy-house",
    title: "Happy House Laundry",
    subtitle: {
      en: "Family business website",
      vi: "Website doanh nghiệp gia đình",
    },
    description: {
      en: "A responsive promotional website for a family laundry business, with clear service information and a mobile-friendly presentation.",
      vi: "Website giới thiệu dịch vụ giặt ủi của gia đình, trình bày thông tin dịch vụ rõ ràng và tương thích thiết bị di động.",
    },
    technologies: [
      "HTML",
      "CSS",
      "Git",
      "GitHub",
      "GitHub Pages",
      "Cloudflare DNS",
    ],
    highlights: [
      {
        en: "Responsive frontend and service presentation.",
        vi: "Giao diện responsive và giới thiệu dịch vụ.",
      },
      {
        en: "Development and deployment using Git/GitHub and GitHub Pages.",
        vi: "Phát triển, quản lý phiên bản và triển khai với Git/GitHub, GitHub Pages.",
      },
      {
        en: "Custom domain configuration through Cloudflare DNS.",
        vi: "Cấu hình tên miền qua Cloudflare DNS.",
      },
    ],
    href: "https://happyhouselaundry.com/",
    icon: "globe",
    accent: "pink",
  },
  {
    id: "portfolio",
    title: "Personal Portfolio",
    subtitle: {
      en: "Frontend & deployment project",
      vi: "Dự án frontend & triển khai website",
    },
    description: {
      en: "A personal portfolio demonstrating frontend development, version control, domain/DNS configuration and website deployment.",
      vi: "Website portfolio cá nhân thể hiện quá trình phát triển frontend, quản lý phiên bản, cấu hình tên miền/DNS và triển khai website.",
    },
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "Git",
      "GitHub Pages",
      "Cloudflare DNS",
    ],
    highlights: [
      {
        en: "Personal pages and responsive web presentation.",
        vi: "Các trang cá nhân và giao diện web responsive.",
      },
      {
        en: "Source versioning with Git and GitHub.",
        vi: "Quản lý mã nguồn bằng Git và GitHub.",
      },
      {
        en: "Custom domain and static website deployment.",
        vi: "Tên miền riêng và triển khai website tĩnh.",
      },
    ],
    href: "https://chauanhdung.id.vn/",
    code: "https://github.com/r00tK1ngX/my-cv",
    icon: "terminal",
    accent: "green",
  },
];
export type ResearchCategory = "cves" | "exploits" | "bounties";
export type ResearchRecord = {
  id: string;
  category: ResearchCategory;
  identifier?: string;
  vendor?: string;
  platform?: string;
  severity?: "Critical" | "High" | "Medium" | "Low";
  status?:
    | "Patched"
    | "Published"
    | "Under Review"
    | "Resolved"
    | "Triaged"
    | "Pending";
  score?: number;
  reward?: string;
  verified?: boolean;
  details?: Translated[];
  title: Translated;
  description: Translated;
  href: string;
  date: string;
};
export const research: ResearchRecord[] = [];
export type BlogPost = {
  id: string;
  title: Translated;
  description: Translated;
  href: string;
  date: string;
  tags: string[];
};
export const posts: BlogPost[] = [];
export function researchFor(category: ResearchCategory): ResearchRecord[] {
  return research.filter((item) => item.category === category);
}
