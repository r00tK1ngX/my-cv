"use client";
import { useEffect, useRef, useState } from "react";

import { research, researchFor, type ResearchCategory } from "@/data/portfolio";
import { routeFor, type Locale } from "@/lib/routes";
import { reducedMotion } from "@/lib/motion";
import { SectionHeading } from "./section-heading";
import { ResearchCard } from "./research-card";
import { Icon } from "./icon";
const categories: ResearchCategory[] = ["cves", "exploits", "bounties"];
export function ResearchPage({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  // One committed category owns selection, panel identity, label and content.
  // A request does not become active until the outgoing panel has exited.
  const [{ category, phase: panelPhase, epoch }, setView] = useState<{
    category: ResearchCategory;
    requested: ResearchCategory;
    phase: "idle" | "exit" | "enter";
    epoch: number;
  }>({ category: "cves", requested: "cves", phase: "idle", epoch: 0 });
  const [focusedCategory, setFocusedCategory] = useState<ResearchCategory>("cves");
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const changeCategory = (next: ResearchCategory) => {
    const reduce = matchMedia(reducedMotion).matches;
    // Functional updates also see category commits already queued in this task.
    setView((previous) => {
      if (next === previous.requested) return previous;
      if (reduce || next === previous.category)
        return { category: next, requested: next, phase: "idle", epoch: previous.epoch + 1 };
      return { ...previous, requested: next, phase: "exit", epoch: previous.epoch + (previous.phase === "exit" ? 0 : 1) };
    });
  };
  useEffect(() => {
    if (panelPhase === "idle") return;
    // Intent changes during exit do not restart its deadline or leave a
    // completed opacity:0 animation waiting for another 150ms timeout.
    const timer = setTimeout(() => {
      setView((previous) => {
        if (previous.phase !== panelPhase || previous.epoch !== epoch) return previous;
        return panelPhase === "exit"
          ? { ...previous, category: previous.requested, phase: "enter", epoch: previous.epoch + 1 }
          : { ...previous, phase: "idle", epoch: previous.epoch + 1 };
      });
    }, panelPhase === "exit" ? 150 : 300);
    return () => clearTimeout(timer);
  }, [panelPhase, epoch]);
  useEffect(() => {
    const motion = matchMedia(reducedMotion);
    const stop = () => {
      if (motion.matches) {
        setView((previous) => ({ ...previous, category: previous.requested, phase: "idle", epoch: previous.epoch + 1 }));
      }
    };
    motion.addEventListener("change", stop);
    return () => {
      motion.removeEventListener("change", stop);
    };
  }, []);
  const tabs = [
    {
      key: "cves" as const,
      label: "CVEs",
      icon: "shield",
      empty: vi ? "Chưa có CVE được công bố" : "No published CVE entries yet",
    },
    {
      key: "exploits" as const,
      label: vi ? "Khai thác" : "Exploits",
      icon: "code",
      empty: vi
        ? "Chưa có bản khai thác được công bố"
        : "No published exploit entries yet",
    },
    {
      key: "bounties" as const,
      label: "Bug bounties",
      icon: "research",
      empty: vi
        ? "Chưa có báo cáo bug bounty được công bố"
        : "No published bug bounty entries yet",
    },
  ];
  const items = researchFor(category);
  const current = tabs.find((t) => t.key === category)!;
  const select = (index: number) => {
    changeCategory(categories[index]);
    buttons.current[index]?.focus();
  };
  return (
    <section className="page-section research-page">
      <div className="container">
        <SectionHeading
          eyebrow={vi ? "Nghiên cứu bảo mật" : "Security research"}
          title={vi ? "Nghiên cứu &" : "Research &"}
          accent={vi ? "Khám phá" : "Discoveries"}
          description={
            vi
              ? "Không gian dành cho nghiên cứu bảo mật và các kết quả công khai trong tương lai."
              : "A space for security research and future public findings."
          }
        />
        <div className="stats-grid">
          {tabs.map((tab, i) => (
            <div
              className={`panel stat ${["cyan", "pink", "green"][i]}`}
              key={tab.key}
            >
              <strong>{researchFor(tab.key).length}</strong>
              <span>
                {vi ? "Mục đã đăng · " : "Published · "}
                {tab.label}
              </span>
            </div>
          ))}
          <div className="panel stat amber">
            <strong>{research.length}</strong>
            <span>{vi ? "Tổng mục đã đăng" : "Total published entries"}</span>
          </div>
        </div>
        <div
          className="research-tabs"
          role="tablist"
          aria-label={vi ? "Danh mục nghiên cứu" : "Research categories"}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              id={`tab-${tab.key}`}
              className="research-tab"
              role="tab"
              type="button"
              aria-selected={category === tab.key}
              aria-controls={`panel-${category}`}
              tabIndex={focusedCategory === tab.key ? 0 : -1}
              onFocus={() => setFocusedCategory(tab.key)}
              onClick={() => changeCategory(tab.key)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  select((index + 1) % 3);
                } else if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  select((index + 2) % 3);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  select(0);
                } else if (event.key === "End") {
                  event.preventDefault();
                  select(2);
                }
              }}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              <span className="count">{researchFor(tab.key).length}</span>
            </button>
          ))}
        </div>
        <div
          id={`panel-${category}`}
          className="research-panel"
          data-motion-phase={panelPhase}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`tab-${category}`}
        >
          {items.length === 0 ? (
            <div className="panel empty-state">
              <div className="icon-box">
                <Icon name={current.icon} size={28} />
              </div>
              <h2>{current.empty}</h2>
              <p>
                {vi
                  ? "Đây là danh sách nội dung hiện được công bố trên website, không phải tuyên bố thành tích hay chứng nhận. Bạn có thể xem các dự án thực hành của tôi."
                  : "This is the website’s current public listing, not an achievement or qualification claim. Explore my practical projects while this collection grows."}
              </p>
              <a
                className="button button-outline"
                href={routeFor(locale, "projects")}
              >
                <Icon name="projects" size={16} />
                {vi ? "Xem dự án" : "Explore projects"}
              </a>
            </div>
          ) : (
            <div className="project-grid">
              {items.map((item) => (
                <ResearchCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
