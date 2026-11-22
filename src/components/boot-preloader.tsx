"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/routes";

declare global {
  interface Window {
    __r00tBootDone?: boolean;
  }
}

interface BootStep {
  readonly ts: string;
  readonly tag: string;
  readonly text: string;
  readonly atPct: number;
  readonly timeMs: number;
  readonly ready?: boolean;
}

interface BootCopy {
  readonly sub: string;
  readonly kverInit: string;
  readonly kverReady: string;
  readonly welcome: string;
  readonly offline: string;
  readonly online: string;
  readonly ariaLabel: string;
  readonly steps: readonly BootStep[];
}

const BOOT_COPY: Record<Locale, BootCopy> = {
  en: {
    sub: "SECURITY WORKSTATION",
    kverInit: "LINUX // KERNEL_INIT · INITIALIZING",
    kverReady: "LINUX // KERNEL_INIT · ONLINE",
    welcome: "WELCOME TO THE PORTFOLIO OF r00tK1ngX",
    offline: "OFFLINE",
    online: "ONLINE",
    ariaLabel: "System boot sequence",
    steps: [
      {
        ts: "00.18s",
        tag: "[  OK  ]",
        text: "Initializing cybersecurity environment...",
        atPct: 15,
        timeMs: 260,
      },
      {
        ts: "00.46s",
        tag: "[  OK  ]",
        text: "Loading system modules...",
        atPct: 30,
        timeMs: 560,
      },
      {
        ts: "00.78s",
        tag: "[  OK  ]",
        text: "Establishing secure network interfaces...",
        atPct: 45,
        timeMs: 880,
      },
      {
        ts: "01.12s",
        tag: "[  OK  ]",
        text: "Initializing binary analysis toolkit...",
        atPct: 60,
        timeMs: 1200,
      },
      {
        ts: "01.48s",
        tag: "[  OK  ]",
        text: "Loading Linux security environment...",
        atPct: 75,
        timeMs: 1520,
      },
      {
        ts: "01.82s",
        tag: "[  OK  ]",
        text: "Preparing portfolio interface...",
        atPct: 90,
        timeMs: 1840,
      },
      {
        ts: "02.15s",
        tag: "[ READY ]",
        text: "System initialization complete.",
        atPct: 100,
        timeMs: 2220,
        ready: true,
      },
    ],
  },
  vi: {
    sub: "TRẠM LÀM VIỆC BẢO MẬT",
    kverInit: "LINUX // KERNEL_INIT · ĐANG KHỞI TẠO",
    kverReady: "LINUX // KERNEL_INIT · TRỰC TUYẾN",
    welcome: "CHÀO MỪNG ĐẾN VỚI PORTFOLIO CỦA r00tK1ngX",
    offline: "NGOẠI TUYẾN",
    online: "TRỰC TUYẾN",
    ariaLabel: "Màn hình khởi động hệ thống",
    steps: [
      {
        ts: "00.18s",
        tag: "[  OK  ]",
        text: "Khởi tạo môi trường an ninh mạng...",
        atPct: 15,
        timeMs: 260,
      },
      {
        ts: "00.46s",
        tag: "[  OK  ]",
        text: "Đang nạp các mô-đun hệ thống...",
        atPct: 30,
        timeMs: 560,
      },
      {
        ts: "00.78s",
        tag: "[  OK  ]",
        text: "Thiết lập giao diện mạng an toàn...",
        atPct: 45,
        timeMs: 880,
      },
      {
        ts: "01.12s",
        tag: "[  OK  ]",
        text: "Khởi tạo bộ công cụ phân tích nhị phân...",
        atPct: 60,
        timeMs: 1200,
      },
      {
        ts: "01.48s",
        tag: "[  OK  ]",
        text: "Đang tải môi trường bảo mật Linux...",
        atPct: 75,
        timeMs: 1520,
      },
      {
        ts: "01.82s",
        tag: "[  OK  ]",
        text: "Chuẩn bị giao diện portfolio...",
        atPct: 90,
        timeMs: 1840,
      },
      {
        ts: "02.15s",
        tag: "[ READY ]",
        text: "Khởi tạo hệ thống hoàn tất.",
        atPct: 100,
        timeMs: 2220,
        ready: true,
      },
    ],
  },
};

type Phase = "booting" | "ready" | "exiting" | "done";

function computeProgressAtElapsed(
  elapsedMs: number,
  steps: readonly BootStep[],
): number {
  const totalDurationMs = steps[steps.length - 1].timeMs;
  if (elapsedMs <= 0) return 0;
  if (elapsedMs >= totalDurationMs) return 100;

  let prevPct = 0;
  let prevTime = 0;
  for (const step of steps) {
    if (elapsedMs <= step.timeMs) {
      const seg = (elapsedMs - prevTime) / (step.timeMs - prevTime);
      const eased = 1 - Math.pow(1 - seg, 1.35);
      return prevPct + (step.atPct - prevPct) * eased;
    }
    prevPct = step.atPct;
    prevTime = step.timeMs;
  }
  return 100;
}

export function BootPreloader({ locale }: { locale: Locale }) {
  const copy = BOOT_COPY[locale];
  const [phase, setPhase] = useState<Phase>("booting");
  const [exactProgress, setExactProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const timers = useRef<number[]>([]);
  const finishedRef = useRef(false);

  const clearScheduled = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  const finishBoot = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearScheduled();
    window.__r00tBootDone = true;
    setPhase((prev) => (prev === "done" ? "done" : "exiting"));
    const exitId = window.setTimeout(() => {
      delete document.documentElement.dataset.bootPending;
      setPhase("done");
    }, 340);
    timers.current.push(exitId);
  }, [clearScheduled]);

  useEffect(() => {
    finishedRef.current = false;
    let shouldBypass = false;

    if (window.__r00tBootDone === true) {
      shouldBypass = true;
    } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.__r00tBootDone = true;
      shouldBypass = true;
    }

    if (shouldBypass) {
      delete document.documentElement.dataset.bootPending;
      const doneId = window.setTimeout(() => setPhase("done"), 0);
      timers.current.push(doneId);
      return () => clearScheduled();
    }

    const steps = BOOT_COPY[locale].steps;
    const totalDurationMs = steps[steps.length - 1].timeMs;
    const startTs = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTs;
      const pct = computeProgressAtElapsed(elapsed, steps);
      setExactProgress(pct);

      if (elapsed < totalDurationMs) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        setExactProgress(100);
        setPhase("ready");
        rafRef.current = null;
        const holdId = window.setTimeout(() => {
          finishBoot();
        }, 420);
        timers.current.push(holdId);
      }
    };

    rafRef.current = window.requestAnimationFrame(tick);
    return () => clearScheduled();
  }, [locale, clearScheduled, finishBoot]);

  useEffect(() => {
    if (phase !== "booting" && phase !== "ready") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishBoot();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, finishBoot]);

  if (phase === "done") return null;

  const displayPct = exactProgress >= 100 ? 100 : Math.floor(exactProgress);
  const isComplete = displayPct === 100;

  return (
    <div
      className={`boot-preloader ${phase === "exiting" ? "is-exiting" : ""}`}
      data-phase={phase}
      aria-label={copy.ariaLabel}
    >
      <div className="boot-grid" aria-hidden="true" />

      <div className="boot-wrap">
        <header className="boot-top">
          <div className="boot-top-left">
            <Image
              src="/icons/icon-192x192.png"
              width={48}
              height={48}
              alt=""
              className="boot-shield"
              loading="eager"
              unoptimized
            />
            <div>
              <div className="boot-host">r00tK1ngX@portfolio</div>
              <div className="boot-sub">{copy.sub}</div>
            </div>
          </div>
          <div className={`boot-kver ${isComplete ? "is-ready" : ""}`}>
            {isComplete ? copy.kverReady : copy.kverInit}
          </div>
        </header>

        <ul className="boot-logs" aria-hidden="true">
          {copy.steps.map((step) => {
            const visible = step.ready
              ? isComplete
              : exactProgress >= step.atPct;
            return (
              <li
                key={step.text}
                className={`boot-log ${step.ready ? "is-ready" : ""} ${visible ? "is-visible" : ""}`}
              >
                <span className="boot-ts">{step.ts}</span>
                <span className="boot-tag">{step.tag}</span>
                <span className="boot-msg">
                  {step.text}
                  {step.ready ? <span className="boot-cur" /> : null}
                </span>
              </li>
            );
          })}
        </ul>

        <div
          className={`boot-pbar ${isComplete ? "is-complete" : ""}`}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={displayPct}
        >
          <div
            className="boot-pfill"
            style={{ width: `${exactProgress.toFixed(2)}%` }}
          />
        </div>

        <footer className="boot-foot">
          <span className="boot-welcome">{copy.welcome}</span>
          <span
            className={`boot-status-live ${isComplete ? "is-online" : ""}`}
            role="status"
            aria-live="polite"
          >
            <span className="boot-status-indicator" aria-hidden="true" />
            <span className="boot-status-label">
              {isComplete ? copy.online : copy.offline}
            </span>
            <span className="boot-status-pct">{displayPct}%</span>
          </span>
        </footer>
      </div>
    </div>
  );
}
