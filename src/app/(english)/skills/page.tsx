import { SkillsSection } from "@/components/content-sections";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("en", "skills");
export default function Page() {
  return (
    <SiteShell locale="en" page="skills">
      <SkillsSection locale="en" />
    </SiteShell>
  );
}
