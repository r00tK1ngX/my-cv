import Image from "next/image";
import type { Locale } from "@/lib/routes";
import { profile } from "@/data/portfolio";
import { Icon } from "./icon";
import { ParticleField, Typewriter } from "./home-effects";
import {
  ExperienceSection,
  SkillsSection,
  ProjectsSection,
} from "./content-sections";
export function HomePage({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <ParticleField />
        <div className="hero-glow one" />
        <div className="hero-glow two" />
        <div className="hero-inner">
          <div className="hero-copy reveal">
            <div className="hero-pretitle">
              {profile.position[locale]} · {vi ? "Việt Nam" : "Vietnam"}
            </div>
            <div>
              <p className="hello">{vi ? "Xin chào, tôi là" : "Hey, I’m"}</p>
              <h1 className="hero-name">
                <span className="glitch-name" data-text="Châu Anh">
                  Châu Anh
                </span>{" "}
                <span className="accent">Dũng</span>
              </h1>
            </div>
            <div className="type-line">
              <span className="prompt" aria-hidden="true">
                ~/
              </span>
              <Typewriter locale={locale} />
            </div>
            <p className="hero-description">{profile.objective[locale]}</p>
            <div className="hero-buttons">
              <a href="#projects" className="button">
                ⬡ {vi ? "Xem dự án" : "View projects"}
              </a>
              <a href="#experience" className="button button-outline">
                ⬡ {vi ? "Hành trình" : "My journey"}
              </a>
              <div className="social-links">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Icon name="github" />
                </a>
                <a
                  href={profile.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Icon name="linkedin" />
                </a>
              </div>
            </div>
            <div className="hero-focus">
              <div>
                <b>PWN</b>
                <small>
                  {vi ? "Khai thác nhị phân" : "Binary exploitation"}
                </small>
              </div>
              <div>
                <b>Red Team</b>
                <small>
                  {vi ? "Học tập & thực hành" : "Learning & practice"}
                </small>
              </div>
              <div>
                <b>AI + Security</b>
                <small>{vi ? "Tự động hóa" : "Automation"}</small>
              </div>
            </div>
          </div>
          <div className="hero-visual reveal" aria-hidden="true">
            <div className="orbit" />
            <div className="orbit second" />
            <div className="hero-blob" />
            <div className="hero-emblem">
              <Image
                className="hero-portrait"
                src="/images/chau-anh-dung-avatar.webp"
                width={512}
                height={512}
                alt=""
                loading="eager"
                unoptimized
              />
            </div>
            <div className="scan-brackets">
              <i />
              <i />
              <i />
              <i />
            </div>
            <span className="float-tag cyan">◆ PWN / BINARY</span>
            <span className="float-tag pink">◆ RED TEAM</span>
            <span className="float-tag green">◆ LINUX</span>
            <span className="float-tag amber">◆ AI & SECURITY</span>
          </div>
        </div>
        <a className="scroll-cue" href="#experience">
          {vi ? "Cuộn xuống" : "Scroll"}
          <i />
        </a>
      </section>
      <div className="cyber-divider">◈ Portfolio ◈</div>
      <div className="home-section" id="experience">
        <ExperienceSection locale={locale} home />
      </div>
      <div className="home-section" id="skills">
        <SkillsSection locale={locale} home />
      </div>
      <div className="home-section" id="projects">
        <ProjectsSection locale={locale} home />
      </div>
    </>
  );
}
