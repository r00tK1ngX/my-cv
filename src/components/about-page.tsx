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
            <i />
            <i />
            <Image
              className="about-portrait"
              src="/images/chau-anh-dung-avatar.webp"
              width={512}
              height={512}
              alt=""
              loading="eager"
              unoptimized
            />
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
