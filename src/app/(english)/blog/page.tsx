import { BlogPage } from "@/components/blog-page";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("en", "blog");
export default function Page() {
  return (
    <SiteShell locale="en" page="blog">
      <BlogPage locale="en" />
    </SiteShell>
  );
}
