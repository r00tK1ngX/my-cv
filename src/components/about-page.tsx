import Image from "next/image";
import type { Locale } from "@/lib/routes";
import { profile } from "@/data/portfolio";
import { SectionHeading } from "./section-heading";
import { Icon } from "./icon";
export function AboutPage({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  const highlights = [
    {
      icon: "terminal",
      title: vi ? "PWN / Nhị phân" : "PWN / Binary",
      text: vi
        ? "Học tập và thực hành khai thác nhị phân."
        : "Learning and practising binary exploitation.",
    },
    {
      icon: "shield",
      title: "Red Team",
      text: vi
        ? "Nền tảng bảo mật tấn công và mạng máy tính."
        : "Offensive security and network foundations.",
    },
    {
      icon: "code",
      title: vi ? "Lập trình" : "Development",
      text: vi
        ? "C, C++, Python và Java qua học tập, dự án."
        : "C, C++, Python and Java through study and projects.",
    },
    {
      icon: "cpu",
      title: "AI & Security Automation",
      text: vi
        ? "Định hướng kết hợp AI và tự động hóa bảo mật."
        : "Exploring AI-assisted security automation.",
    },
  ];
  return (
    <section className="page-section about">
      <div className="container">
        <SectionHeading
          eyebrow={vi ? "Giới thiệu" : "About me"}
          title={vi ? "Tôi là" : "Who I"}
          accent={vi ? "Ai" : "Am"}
          description={
            vi
              ? "Sinh viên an ninh mạng, tập trung học tập bảo mật tấn công, bảo mật phần mềm và nghiên cứu bảo mật."
              : "A cybersecurity student developing practical skills in offensive security, software security and security research."
          }
        />
        <div className="about-grid">
          <div className="about-avatar" aria-hidden="true">
            <span className="identity-core">
              <svg
                className="identity-hud"
                viewBox="0 0 288 288"
                focusable="false"
                fill="none"
              >
                <circle className="identity-recess" cx="144" cy="144" r="99" />
                <circle className="identity-guide" cx="144" cy="144" r="88" />
                <circle className="identity-guide" cx="144" cy="144" r="120" />
                <circle
                  className="identity-rim"
                  cx="144"
                  cy="144"
                  r="140"
                  pathLength="360"
                  strokeDasharray="86 22 22 50"
                />
                <g className="identity-ticks">
                  {Array.from({ length: 24 }, (_, index) => (
                    <path
                      key={index}
                      d={index % 3 === 0 ? "M144 29v7" : "M144 32v4"}
                      transform={`rotate(${index * 15} 144 144)`}
                    />
                  ))}
                </g>
                <g className="identity-brackets">
                  <path d="M54 75V54h21" />
                  <path d="M213 54h21v21" />
                  <path d="M234 213v21h-21" />
                  <path d="M75 234H54v-21" />
                </g>
                <g className="identity-nodes">
                  <path d="M34 144h10m200 0h10" />
                  <rect x="28" y="142" width="4" height="4" />
                  <rect x="256" y="142" width="4" height="4" />
                </g>
              </svg>
              <svg
                className="identity-hud identity-inner"
                viewBox="0 0 288 288"
                focusable="false"
                fill="none"
              >
                <circle
                  cx="144"
                  cy="144"
                  r="100"
                  pathLength="360"
                  strokeDasharray="48 12 3 27"
                />
                <circle
                  className="identity-accent"
                  cx="144"
                  cy="144"
                  r="100"
                  pathLength="360"
                  strokeDasharray="36 324"
                  strokeDashoffset="-12"
                />
              </svg>
              <svg
                className="identity-hud identity-orbit"
                viewBox="0 0 288 288"
                focusable="false"
                fill="none"
              >
                <circle
                  cx="144"
                  cy="144"
                  r="133"
                  pathLength="360"
                  strokeDasharray="64 12 6 42 34 44 18 140"
                />
                <g className="identity-marker" transform="rotate(32 144 144)">
                  <circle
                    cx="144"
                    cy="11"
                    r="5"
                    className="identity-marker-halo"
                  />
                  <circle cx="144" cy="11" r="2" />
                </g>
                <g className="identity-marker" transform="rotate(212 144 144)">
                  <circle
                    cx="144"
                    cy="11"
                    r="4"
                    className="identity-marker-halo"
                  />
                  <circle cx="144" cy="11" r="1.5" />
                </g>
              </svg>
              <svg
                className="identity-hud identity-scan"
                viewBox="0 0 288 288"
                focusable="false"
                fill="none"
              >
                <circle
                  cx="144"
                  cy="144"
                  r="88"
                  pathLength="360"
                  strokeDasharray="28 332"
                  strokeDashoffset="-40"
                />
              </svg>
              <Image
                className="about-portrait"
                src="/images/chau-anh-dung-avatar.webp"
                width={512}
                height={512}
                alt=""
                loading="eager"
                unoptimized
              />
            </span>
          </div>
          <div className="bio reveal">
            <p>
              {vi
                ? "Tôi là Châu Anh Dũng, sinh viên năm ba ngành An ninh mạng tại Đại học Duy Tân, Đà Nẵng, Việt Nam. Tôi bắt đầu chương trình cử nhân vào năm 2024 và hiện đang theo học."
                : "I’m Châu Anh Dũng, a third-year Cybersecurity student at Duy Tan University in Da Nang, Vietnam. I began my bachelor’s degree in 2024 and am currently studying."}
            </p>
            <p>
              {vi
                ? "Định hướng chính của tôi là PWN / Khai thác nhị phân, tiếp theo là Red Team / Bảo mật tấn công và AI & Tự động hóa bảo mật. Tôi xây dựng nền tảng về lập trình, cấu trúc dữ liệu, mạng máy tính và Linux."
                : "My primary interest is PWN / Binary Exploitation, followed by Red Team / Offensive Security and AI & Security Automation. I’m building foundations in programming, data structures, networking and Linux."}
            </p>
            <p>
              {vi
                ? "Qua dự án Mini EDR cho Linux và các website thực tế, tôi kết nối kiến thức học thuật với việc xây dựng phần mềm, quản lý phiên bản và triển khai web."
                : "Through the Mini EDR for Linux project and practical websites, I connect academic study with building software, version control and web deployment."}
            </p>
            <p>{profile.objective[locale]}</p>
            <div className="hero-buttons">
              <a
                className="button button-outline"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="github" size={16} />
                GitHub
              </a>
              <a
                className="button button-plain"
                href={profile.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="linkedin" size={16} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="highlight-section">
          <h2 className="subheading">
            {vi ? "Điều tôi đang" : "What I’m"}{" "}
            <span className="accent">{vi ? "Khám phá" : "Exploring"}</span>
          </h2>
          <div className="highlight-grid">
            {highlights.map((item) => (
              <article className="panel highlight-card" key={item.title}>
                <div className="icon-box">
                  <Icon name={item.icon} size={24} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
