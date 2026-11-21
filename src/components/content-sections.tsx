import { profile, skills, projects, skillTranslations } from "@/data/portfolio";
import type { Locale } from "@/lib/routes";
import { Icon } from "./icon";
import { SectionHeading } from "./section-heading";
export function ExperienceSection({
  locale,
  home = false,
}: {
  locale: Locale;
  home?: boolean;
}) {
  const vi = locale === "vi";
  const Title = home ? "h3" : "h2";
  return (
    <section className="page-section">
      <div className="container">
        <SectionHeading
          home={home}
          eyebrow={vi ? "Hành trình học tập" : "My journey"}
          title={vi ? "Học tập &" : "Experience &"}
          accent={vi ? "Phát triển" : "Education"}
          description={
            vi
              ? "Nền tảng học thuật và định hướng phát triển trong an ninh mạng."
              : "Academic foundations and an ongoing journey into cybersecurity."
          }
        />
        <div className="timeline">
          <article className="panel timeline-card reveal">
            <div className="timeline-top">
              <span className="tag">
                <Icon name="education" size={14} />
                &nbsp; {vi ? "Đang theo học" : "Education · In progress"}
              </span>
              <span className="text-muted">
                {vi ? profile.education.periodVi : profile.education.period}
              </span>
            </div>
            <Title>{profile.education.degree[locale]}</Title>
            <p className="school">{profile.education.school[locale]}</p>
            <div className="timeline-meta">
              <span>{profile.location[locale]}</span>
              <span>{profile.education.year[locale]}</span>
            </div>
            <p>
              {vi
                ? "Xây dựng nền tảng về lập trình, thuật toán, mạng máy tính, Linux và an ninh mạng; phát triển kỹ năng thực hành qua học tập và dự án."
                : "Building foundations in programming, algorithms, networking, Linux and cybersecurity through study and practical projects."}
            </p>
            <div className="tags">
              <span className="tag">C / C++</span>
              <span className="tag">Python</span>
              <span className="tag">Linux</span>
              <span className="tag">Cybersecurity</span>
            </div>
          </article>
        </div>
        <div className="panel experience-empty">
          <Icon name="experience" />
          <div>
            <h3>
              {vi ? "Sẵn sàng cho bước tiếp theo" : "Ready for the next step"}
            </h3>
            <p>
              {vi
                ? "Tìm kiếm cơ hội thực tập an ninh mạng. Chưa có kinh nghiệm làm việc chuyên nghiệp được công bố tại đây."
                : "Seeking a cybersecurity internship. No professional employment entries are published here yet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export function SkillsSection({
  locale,
  home = false,
}: {
  locale: Locale;
  home?: boolean;
}) {
  const vi = locale === "vi";
  const Heading = home ? "h3" : "h2";
  return (
    <section className="page-section">
      <div className="container">
        <SectionHeading
          home={home}
          eyebrow={vi ? "Nền tảng kỹ thuật" : "Technical skills"}
          title={vi ? "Kỹ năng &" : "Skills &"}
          accent={vi ? "Công cụ" : "Toolkit"}
          description={
            vi
              ? "Các ngôn ngữ, nền tảng và công cụ tôi đang học tập và thực hành."
              : "Languages, foundations and tools I study and practise with."
          }
        />
        <div className="skill-grid">
          {skills.map((skill) => (
            <article
              key={skill.id}
              className={`panel skill-card reveal ${skill.accent}`}
            >
              <div className="icon-box">
                <Icon name={skill.icon} size={24} />
              </div>
              <Heading>{skill.title[locale]}</Heading>
              <ul>
                {skill.items.map((item) => (
                  <li key={item}>
                    {vi ? (skillTranslations[item] ?? item) : item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="learning-note">
          {vi
            ? "Thể hiện lĩnh vực học tập và thực hành, không phải thang đánh giá năng lực chuyên nghiệp."
            : "Areas of study and practice, not professional proficiency ratings."}
        </p>
      </div>
    </section>
  );
}
export function ProjectsSection({
  locale,
  home = false,
}: {
  locale: Locale;
  home?: boolean;
}) {
  const vi = locale === "vi";
  const Heading = home ? "h3" : "h2";
  return (
    <section className="page-section">
      <div className="container">
        <SectionHeading
          home={home}
          eyebrow={vi ? "Công việc thực hành" : "Selected work"}
          title={vi ? "Các dự án" : "Featured"}
          accent={vi ? "Tiêu biểu" : "Projects"}
          description={
            vi
              ? "Học tập qua xây dựng: công cụ an ninh mạng và các sản phẩm web thực tế."
              : "Learning by building: security tools and practical web projects."
          }
        />
        <div className="project-grid">
          {projects.map((project) => (
            <article
              key={project.id}
              className={`panel project-card reveal ${project.accent}`}
            >
              <div className="project-visual">
                <Icon name={project.icon} size={80} />
                <i className="project-scanline" aria-hidden="true" />
                <span className="project-visual-label">
                  {project.subtitle[locale]}
                </span>
              </div>
              <div className="project-body">
                <span className="project-label">
                  {project.subtitle[locale]}
                </span>
                <Heading>{project.title}</Heading>
                <p>{project.description[locale]}</p>
                <ul className="project-points">
                  {project.highlights.map((point, j) => (
                    <li key={j}>
                      <span>▸</span>
                      {point[locale]}
                    </li>
                  ))}
                </ul>
                <div className="tags">
                  {project.technologies.map((technology) => (
                    <span className="tag" key={technology}>
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
              <div className="project-links">
                {project.code && (
                  <a
                    href={project.code}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="code" size={14} />
                    {vi ? "Mã nguồn" : "Code"}
                  </a>
                )}
                {project.href !== project.code && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name="external" size={14} />
                    {vi ? "Website" : "Website"}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="page-cta">
          <a
            className="button button-outline"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="github" />
            {vi ? "Khám phá GitHub" : "View GitHub"}
          </a>
        </div>
      </div>
    </section>
  );
}
