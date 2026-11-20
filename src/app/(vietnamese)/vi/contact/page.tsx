import { ContactPage } from "@/components/contact-page";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("vi", "contact");
export default function Page() {
  return (
    <SiteShell locale="vi" page="contact">
      <ContactPage locale="vi" />
    </SiteShell>
  );
}
