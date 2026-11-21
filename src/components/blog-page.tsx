import { posts } from "@/data/portfolio";
import { routeFor, type Locale } from "@/lib/routes";
import { SectionHeading } from "./section-heading";
import { Icon } from "./icon";
export function BlogPage({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  return (
    <section className="page-section">
      <div className="container">
        <SectionHeading
          eyebrow={vi ? "Ghi chép & chia sẻ" : "Knowledge & insights"}
          title={vi ? "Blog &" : "Blog &"}
          accent={vi ? "Ghi chép" : "Write-ups"}
          description={
            vi
              ? "Không gian dành cho ghi chép học tập, bài viết kỹ thuật và chia sẻ về an ninh mạng."
              : "A space for learning notes, technical writing and cybersecurity write-ups."
          }
        />
        {posts.length === 0 ? (
          <div className="panel empty-state blog-empty">
            <div className="icon-box">
              <Icon name="blog" size={28} />
            </div>
            <h2>
              {vi
                ? "Chưa có bài viết được công bố"
                : "No articles published yet"}
            </h2>
            <p>
              {vi
                ? "Các bài viết sẽ xuất hiện tại đây khi sẵn sàng. Trong lúc chờ, bạn có thể khám phá các dự án hiện tại của tôi."
                : "New articles will appear here when they’re ready. In the meantime, explore the projects I’m building and learning from."}
            </p>
            <a
              href={routeFor(locale, "projects")}
              className="button button-outline"
            >
              <Icon name="projects" size={16} />
              {vi ? "Khám phá dự án" : "Explore projects"}
            </a>
          </div>
        ) : (
          <div className="project-grid">
            {posts.map((post) => (
              <article className="panel project-card" key={post.id}>
                <div className="project-body">
                  <span className="project-label">{post.date}</span>
                  <h2>{post.title[locale]}</h2>
                  <p>{post.description[locale]}</p>
                  <div className="tags">
                    {post.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="project-links">
                  <a href={post.href} target="_blank" rel="noopener noreferrer">
                    {vi ? "Đọc bài viết" : "Read article"}
                    <Icon name="arrow" size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="stats-grid blog-stats">
          <div className="panel stat cyan">
            <strong>{posts.length}</strong>
            <span>{vi ? "Bài viết đã đăng" : "Published posts"}</span>
          </div>
          <div className="panel stat pink">
            <strong>{new Set(posts.flatMap((p) => p.tags)).size}</strong>
            <span>{vi ? "Chủ đề đã đăng" : "Published topics"}</span>
          </div>
          <div className="panel stat green">
            <strong>—</strong>
            <span>{vi ? "Cập nhật gần nhất" : "Latest update"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
