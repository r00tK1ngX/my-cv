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
            <div className="home-identity-core">
              <svg
                className="home-hud"
                viewBox="0 0 420 420"
                focusable="false"
                fill="none"
              >
                <circle
                  className="home-core-recess"
                  cx="210"
                  cy="210"
                  r="140"
                />
                <circle className="home-core-guide" cx="210" cy="210" r="122" />
                <circle className="home-core-guide" cx="210" cy="210" r="176" />
                <circle
                  className="home-core-rim"
                  cx="210"
                  cy="210"
                  r="202"
                  pathLength="360"
                  strokeDasharray="76 18 26 60"
                />
                <circle
                  className="home-core-calibration"
                  cx="210"
                  cy="210"
                  r="184"
                  pathLength="360"
                  strokeDasharray="18 12 3 57"
                  strokeDashoffset="-18"
                />
                <g className="home-core-ticks">
                  {Array.from({ length: 36 }, (_, index) => (
                    <path
                      key={index}
                      d={index % 3 === 0 ? "M210 46v10" : "M210 50v6"}
                      transform={`rotate(${index * 10} 210 210)`}
                    />
                  ))}
                </g>
                <g className="home-core-nodes">
                  <path d="M30 210h12m336 0h12M210 30v10m0 340v10" />
                  <rect x="24" y="208" width="4" height="4" />
                  <rect x="392" y="208" width="4" height="4" />
                  <rect x="208" y="24" width="4" height="4" />
                  <rect x="208" y="392" width="4" height="4" />
                </g>
              </svg>
              <svg
                className="home-hud home-core-inner"
                viewBox="0 0 420 420"
                focusable="false"
                fill="none"
              >
                <circle
                  cx="210"
                  cy="210"
                  r="138"
                  pathLength="360"
                  strokeDasharray="52 8 2 28"
                />
                <circle
                  className="home-core-accent"
                  cx="210"
                  cy="210"
                  r="138"
                  pathLength="360"
                  strokeDasharray="32 328"
                  strokeDashoffset="-14"
                />
              </svg>
              <svg
                className="home-hud home-core-orbit orbit"
                viewBox="0 0 420 420"
                focusable="false"
                fill="none"
              >
                <circle
                  cx="210"
                  cy="210"
                  r="196"
                  pathLength="360"
                  strokeDasharray="58 16 6 48 32 40 20 140"
                />
                <g className="home-core-marker" transform="rotate(32 210 210)">
                  <circle
                    cx="210"
                    cy="14"
                    r="6"
                    className="home-core-marker-halo"
                  />
                  <circle cx="210" cy="14" r="2.5" />
                </g>
                <g className="home-core-marker" transform="rotate(212 210 210)">
                  <circle
                    cx="210"
                    cy="14"
                    r="5"
                    className="home-core-marker-halo"
                  />
                  <circle cx="210" cy="14" r="2" />
                </g>
              </svg>
              <svg
                className="home-hud home-core-scan"
                viewBox="0 0 420 420"
                focusable="false"
                fill="none"
              >
                <circle
                  cx="210"
                  cy="210"
                  r="122"
                  pathLength="360"
                  strokeDasharray="26 334"
                  strokeDashoffset="-40"
                />
              </svg>
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
            </div>
            <span className="float-tag cyan">
              <svg
                className="node-link"
                viewBox="0 0 64 32"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M2 2 52 24" />
                <circle className="node-anchor" cx="52" cy="24" r="2" />
              </svg>
              <span className="node-capsule">
                <Icon name="cpu" size={13} className="node-icon" />
                PWN / BINARY
                <i className="node-status" aria-hidden="true" />
              </span>
            </span>
            <span className="float-tag pink">
              <svg
                className="node-link"
                viewBox="0 0 40 32"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M32 30 4 6" />
                <circle className="node-anchor" cx="4" cy="6" r="2" />
              </svg>
              <span className="node-capsule">
                <Icon name="shield" size={13} className="node-icon" />
                RED TEAM
                <i className="node-status" aria-hidden="true" />
              </span>
            </span>
            <span className="float-tag green">
              <svg
                className="node-link"
                viewBox="0 0 20 32"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M1 16h5" />
                <circle className="node-anchor" cx="9" cy="16" r="2" />
              </svg>
              <span className="node-capsule">
                <Icon name="terminal" size={13} className="node-icon" />
                LINUX
                <i className="node-status" aria-hidden="true" />
              </span>
            </span>
            <span className="float-tag amber">
              <svg
                className="node-link"
                viewBox="0 0 64 32"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M2 2 52 24" />
                <circle className="node-anchor" cx="52" cy="24" r="2" />
              </svg>
              <span className="node-capsule">
                <Icon name="network" size={13} className="node-icon" />
                AI & SECURITY
                <i className="node-status" aria-hidden="true" />
              </span>
            </span>
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
