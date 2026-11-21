"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/routes";

const STORAGE_KEY = "r00t_boot_done";

const BOOT_LOGS: Record<Locale, readonly string[]> = {
  en: [
    "Initializing portfolio environment...",
    "Loading system interface...",
    "Initializing security modules...",
    "Establishing network environment...",
    "Loading cybersecurity components...",
    "Initializing Linux workspace...",
    "Loading portfolio modules...",
    "Preparing user interface...",
  ],
  vi: [
    "Khởi tạo môi trường portfolio...",
    "Đang tải giao diện hệ thống...",
    "Khởi tạo các mô-đun bảo mật...",
    "Thiết lập môi trường mạng...",
    "Đang tải thành phần an ninh mạng...",
    "Khởi tạo không gian làm việc Linux...",
    "Đang nạp các mô-đun hồ sơ...",
    "Chuẩn bị giao diện người dùng...",
  ],
};

type Phase = "idle" | "booting" | "ready" | "exiting" | "done";

export function BootPreloader({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  const finishBoot = useCallback(() => {
    clearTimers();
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore restricted storage contexts.
    }
    setPhase((prev) => (prev === "idle" || prev === "done" ? "done" : "exiting"));
    const exitId = window.setTimeout(() => setPhase("done"), 340);
    timers.current.push(exitId);
  }, [clearTimers]);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // Proceed when sessionStorage is unavailable.
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Ignore restricted storage contexts.
      }
      return;
    }

    const startId = window.setTimeout(() => setPhase("booting"), 0);
    timers.current.push(startId);
    const totalLines = BOOT_LOGS[locale].length;
    for (let i = 1; i <= totalLines; i++) {
      const id = window.setTimeout(() => {
        setVisibleLines(i);
        setProgress(Math.round((i / totalLines) * 100));
      }, 160 * i);
      timers.current.push(id);
    }

    const readyId = window.setTimeout(() => {
      setProgress(100);
      setPhase("ready");
    }, 1650);

    const exitId = window.setTimeout(() => {
      finishBoot();
    }, 2250);

    timers.current.push(readyId, exitId);

    return () => clearTimers();
  }, [locale, clearTimers, finishBoot]);

  useEffect(() => {
    if (phase !== "booting" && phase !== "ready") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishBoot();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, finishBoot]);

  if (phase === "idle" || phase === "done") return null;

  const logs = BOOT_LOGS[locale];
  const isReady = phase === "ready" || phase === "exiting";

  return (
    <div
      className={`boot-preloader ${phase === "exiting" ? "is-exiting" : ""}`}
      data-phase={phase}
      aria-label={
        vi ? "Màn hình khởi động hệ thống" : "System boot sequence"
      }
    >
      <div className="boot-grid" aria-hidden="true" />
      <div className="boot-ambient" aria-hidden="true" />

      <div className="boot-shell">
        <div className="boot-identity">
          <div className="boot-emblem-ring" aria-hidden="true">
            <Image
              src="/icons/icon-192x192.png"
              width={72}
              height={72}
              alt=""
              className="boot-emblem-img"
              loading="eager"
              unoptimized
            />
          </div>
          <div className="boot-title-group">
            <div className="boot-status-pill">
              <span className="boot-status-dot" aria-hidden="true" />
              <span className="boot-host">r00tK1ngX@portfolio</span>
            </div>
            <p className="boot-subtitle">
              {vi
                ? "KHỞI TẠO MÔI TRƯỜNG BẢO MẬT"
                : "SECURE ENVIRONMENT INITIALIZATION"}
            </p>
          </div>
        </div>

        <div className="boot-terminal" aria-hidden="true">
          <div className="boot-terminal-bar">
            <span className="boot-bar-label">
              {vi ? "KERNEL // BOOT_SEQ" : "KERNEL // BOOT_SEQ"}
            </span>
            <span className="boot-bar-state">
              {isReady
                ? vi
                  ? "TRỰC TUYẾN"
                  : "ONLINE"
                : vi
                  ? "ĐANG KHỞI CHẠY"
                  : "BOOTING"}
            </span>
          </div>

          <ul className="boot-log-list">
            {logs.map((line, index) => {
              const shown = index < visibleLines;
              const active = index === visibleLines - 1 && !isReady;
              return (
                <li
                  key={line}
                  className={`boot-log-line ${shown ? "is-visible" : ""} ${active ? "is-active" : ""}`}
                >
                  <span className="boot-ok">[ OK ]</span>
                  <span className="boot-msg">{line}</span>
                </li>
              );
            })}
          </ul>

          <div className="boot-progress-wrap">
            <div className="boot-progress-meta">
              <span>
                {vi ? "KHỞI TẠO HỆ THỐNG" : "SYSTEM INITIALIZATION"}
              </span>
              <span className="boot-progress-pct">{progress}%</span>
            </div>
            <div className="boot-progress-track">
              <div
                className="boot-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="boot-footer">
          <div className="boot-ready-banner" role="status" aria-live="polite">
            {isReady ? (
              <>
                <span className="boot-ready-tag">
                  {vi ? "HỆ THỐNG SẴN SÀNG" : "SYSTEM READY"}
                </span>
                <span className="boot-ready-welcome">
                  {vi
                    ? "CHÀO MỪNG ĐẾN VỚI PORTFOLIO CỦA r00tK1ngX"
                    : "WELCOME TO THE PORTFOLIO OF r00tK1ngX"}
                </span>
              </>
            ) : (
              <span className="boot-ready-init">
                {vi
                  ? "ĐANG KHỞI TẠO MÔI TRƯỜNG AN TOÀN..."
                  : "A SECURE ENVIRONMENT IS INITIALIZING."}
              </span>
            )}
          </div>

          <button
            type="button"
            className="boot-skip"
            onClick={finishBoot}
            aria-label={vi ? "Bỏ qua màn hình khởi động" : "Skip boot sequence"}
          >
            {vi ? "[ BỎ QUA ]" : "[ SKIP ]"}
          </button>
        </div>
      </div>
    </div>
  );
}
