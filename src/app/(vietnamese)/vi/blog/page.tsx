import { BlogPage } from "@/components/blog-page";
import { SiteShell } from "@/components/site-shell";
import { metadataFor } from "@/lib/metadata";
export const metadata = metadataFor("vi", "blog");
export default function Page() {
  return (
    <SiteShell locale="vi" page="blog">
      <BlogPage locale="vi" />
    </SiteShell>
  );
}
