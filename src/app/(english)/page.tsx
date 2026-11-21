import { HomePage } from "@/components/home-page";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("en", "home");
export default function Page() {
  return (
    <SiteShell locale="en" page="home">
      <HomePage locale="en" />
    </SiteShell>
  );
}
