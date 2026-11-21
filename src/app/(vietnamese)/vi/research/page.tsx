import { ResearchPage } from "@/components/research-page";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("vi", "research");
export default function Page() {
  return (
    <SiteShell locale="vi" page="research">
      <ResearchPage locale="vi" />
    </SiteShell>
  );
}
