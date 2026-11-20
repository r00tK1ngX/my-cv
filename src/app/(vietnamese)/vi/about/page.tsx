import { AboutPage } from "@/components/about-page";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("vi", "about");
export default function Page() {
  return (
    <SiteShell locale="vi" page="about">
      <AboutPage locale="vi" />
    </SiteShell>
  );
}
