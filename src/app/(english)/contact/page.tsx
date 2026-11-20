import { ContactPage } from "@/components/contact-page";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("en", "contact");
export default function Page() {
  return (
    <SiteShell locale="en" page="contact">
      <ContactPage locale="en" />
    </SiteShell>
  );
}
