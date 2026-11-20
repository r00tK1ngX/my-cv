import { HomePage } from "@/components/home-page";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("vi", "home");
export default function Page() {
  return (
    <SiteShell locale="vi" page="home">
      <HomePage locale="vi" />
    </SiteShell>
  );
}
