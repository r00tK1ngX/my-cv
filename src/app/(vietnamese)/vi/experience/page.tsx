import { ExperienceSection } from "@/components/content-sections";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("vi", "experience");
export default function Page() {
  return (
    <SiteShell locale="vi" page="experience">
      <ExperienceSection locale="vi" />
    </SiteShell>
  );
}
