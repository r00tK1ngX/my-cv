import { SkillsSection } from "@/components/content-sections";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("vi", "skills");
export default function Page() {
  return (
    <SiteShell locale="vi" page="skills">
      <SkillsSection locale="vi" />
    </SiteShell>
  );
}
