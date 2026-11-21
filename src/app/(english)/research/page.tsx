import { ResearchPage } from "@/components/research-page";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("en", "research");
export default function Page() {
  return (
    <SiteShell locale="en" page="research">
      <ResearchPage locale="en" />
    </SiteShell>
  );
}
