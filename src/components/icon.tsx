import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Cpu,
  ExternalLink,
  FlaskConical,
  FolderGit2,
  Globe,
  GraduationCap,
  Info,
  Mail,
  MapPin,
  Menu,
  Network,
  Shield,
  Terminal,
  Wrench,
  X,
  Search,
  FileCode2,
  Check,
  ChevronRight,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
const icons = {
  about: Info,
  experience: BriefcaseBusiness,
  skills: Code2,
  projects: FolderGit2,
  blog: BookOpen,
  research: FlaskConical,
  contact: Mail,
  code: Code2,
  cpu: Cpu,
  network: Network,
  terminal: Terminal,
  shield: Shield,
  wrench: Wrench,
  globe: Globe,
  education: GraduationCap,
  external: ExternalLink,
  arrow: ArrowUpRight,
  github: Code2,
  linkedin: BriefcaseBusiness,
  mail: Mail,
  location: MapPin,
  menu: Menu,
  close: X,
  search: Search,
  file: FileCode2,
  check: Check,
  chevron: ChevronRight,
};
export type IconName = keyof typeof icons;
export function Icon({
  name,
  size = 18,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  if (name === "github" || name === "linkedin") {
    const Brand = name === "github" ? FaGithub : FaLinkedin;
    return (
      <Brand
        size={size}
        aria-hidden="true"
        className={`brand-icon ${className}`}
      />
    );
  }
  const Component = icons[name as IconName] ?? Terminal;
  return (
    <Component
      size={size}
      strokeWidth={1.6}
      aria-hidden="true"
      className={className}
    />
  );
}
