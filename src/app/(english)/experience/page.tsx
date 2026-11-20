import { ExperienceSection } from "@/components/content-sections";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("en", "experience");
export default function Page() {
  return (
    <SiteShell locale="en" page="experience">
      <ExperienceSection locale="en" />
    </SiteShell>
  );
}
