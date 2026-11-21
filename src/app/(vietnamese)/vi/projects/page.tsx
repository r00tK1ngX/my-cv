import { ProjectsSection } from "@/components/content-sections";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("vi", "projects");
export default function Page() {
  return (
    <SiteShell locale="vi" page="projects">
      <ProjectsSection locale="vi" />
    </SiteShell>
  );
}
