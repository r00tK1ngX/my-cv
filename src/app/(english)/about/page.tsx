import { AboutPage } from "@/components/about-page";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("en", "about");
export default function Page() {
  return (
    <SiteShell locale="en" page="about">
      <AboutPage locale="en" />
    </SiteShell>
  );
}
