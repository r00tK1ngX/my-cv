import { ProjectsSection } from "@/components/content-sections";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("en", "projects");
export default function Page() {
  return (
    <SiteShell locale="en" page="projects">
      <ProjectsSection locale="en" />
    </SiteShell>
  );
}
