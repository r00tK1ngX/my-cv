"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { mountMotion } from "@/lib/motion";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  pageKeys,
  pageLabels,
  routeFor,
  type Locale,
  type PageKey,
} from "@/lib/routes";
import { profile } from "@/data/portfolio";
import { Icon } from "./icon";
import { CyberCursor } from "./cyber-cursor";

function availableFocusTarget(element: HTMLElement | null): element is HTMLElement {
  return !!element?.isConnected && !element.closest("[inert]") &&
    !element.matches(":disabled") && element.getClientRects().length > 0 &&
    getComputedStyle(element).visibility === "visible";
}

export function SiteShell({
  locale,
  page,
  children,
}: {
  locale: Locale;
  page: PageKey;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const main = useRef<HTMLElement>(null);
  const closeMenu = useCallback((immediate = false) => {
    restoreFocus.current = !immediate;
    setClosing(
      !immediate && !matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    setOpen(false);
  }, []);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const focusFrame = useRef(0);
  const focusGeneration = useRef(0);
  const drawer = useRef<HTMLDivElement>(null);
  const modal = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<EventTarget | null>(null);
  const restoreMenuFocus = useCallback((generation = focusGeneration.current) => {
    cancelAnimationFrame(focusFrame.current);
    const activeBefore = document.activeElement;
    const path = location.pathname;
    focusFrame.current = requestAnimationFrame(() => {
      const scope = modal.current;
      const active = document.activeElement;
      if (focusGeneration.current !== generation || !scope?.isConnected ||
          scope.getAttribute("role") === "dialog" || location.pathname !== path) return;
      // A newer valid focus choice takes precedence over deferred restoration.
      if (active instanceof HTMLElement && active !== document.body &&
          active !== toggle.current && !drawer.current?.contains(active) &&
          availableFocusTarget(active)) return;
      if (active !== activeBefore && active !== document.body && active !== toggle.current) return;
      const target = availableFocusTarget(toggle.current)
        ? toggle.current
        : scope.querySelector<HTMLElement>(".wordmark");
      if (availableFocusTarget(target)) target.focus();
    });
  }, []);
  const vi = locale === "vi";
  useEffect(() => {
    const focused = (event: FocusEvent) => { lastFocused.current = event.target; };
    document.addEventListener("focusin", focused);
    return () => {
      document.removeEventListener("focusin", focused);
      cancelAnimationFrame(focusFrame.current);
      ++focusGeneration.current;
    };
  }, []);
  useEffect(() => {
    if (main.current) return mountMotion(main.current);
  }, [locale, page]);
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => setClosing(false), 300);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (motion.matches) setClosing(false);
    };
    motion.addEventListener("change", stop);
    return () => {
      clearTimeout(timer);
      motion.removeEventListener("change", stop);
    };
  }, [closing]);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    const media = matchMedia("(min-width: 1180px)");
    const resize = () => {
      if (media.matches) {
        const active = document.activeElement;
        const hiddenToggleHadFocus = active === toggle.current ||
          (active === document.body && lastFocused.current === toggle.current);
        setOpen(false);
        setClosing(false);
        if (hiddenToggleHadFocus) restoreMenuFocus();
      }
    };
    media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, [restoreMenuFocus]);
  useEffect(() => {
    if (!open) return;
    cancelAnimationFrame(focusFrame.current);
    const generation = ++focusGeneration.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLElement>("a,button")?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
      if (event.key === "Tab") {
        const elements = [
          ...(modal.current?.querySelectorAll<HTMLElement>(
            "a[href],button:not([disabled])",
          ) ?? []),
        ].filter((element) => element.tabIndex >= 0 && !element.closest("[inert]") && element.getClientRects().length > 0);
        const first = elements[0],
          last = elements[elements.length - 1];
        const active = document.activeElement;
        if (!elements.some((element) => element === active)) {
          // Pointer focus can land on the header close control (tabIndex -1).
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const containFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !modal.current?.contains(event.target))
        drawer.current?.querySelector<HTMLElement>("a,button")?.focus();
    };
    document.addEventListener("keydown", key);
    document.addEventListener("focusin", containFocus);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
      document.removeEventListener("focusin", containFocus);
      if (restoreFocus.current || matchMedia("(min-width: 1180px)").matches) {
        restoreFocus.current = false;
        restoreMenuFocus(generation);
      }
    };
  }, [open, closeMenu, restoreMenuFocus]);
  const nav = pageKeys.filter((p) => p !== "home");
  return (
    <>
      <CyberCursor />
      <a className="skip-link" href="#main-content" inert={open} aria-hidden={open || undefined}>
        {vi ? "Bỏ qua đến nội dung" : "Skip to content"}
      </a>
      <div className="global-grid" aria-hidden="true" />
      <div className="ambient ambient-cyan" aria-hidden="true" />
      <div className="ambient ambient-pink" aria-hidden="true" />
      <div
        ref={modal}
        style={open ? { position: "fixed", inset: 0, zIndex: 1000 } : undefined}
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-label={open ? (vi ? "Menu điều hướng" : "Navigation menu") : undefined}
      >
      <header role={open ? "none" : undefined} className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <nav
          role={open ? "none" : undefined}
          className="header-inner"
          aria-label={open ? undefined : vi ? "Điều hướng chính" : "Main navigation"}
        >
          <Link
            href={routeFor(locale, "home")}
            className="wordmark"
            inert={open}
            aria-hidden={open || undefined}
            aria-label={
              `${profile.handle} / portfolio — Châu Anh Dũng — ${vi ? "Trang chủ" : "Home"}`
            }
          >
            <span>[</span>
            <b>{profile.handle}</b>
            <span>@</span>
            <b>portfolio</b>
            <span>]</span>
            <i>
              $<em>_</em>
            </i>
          </Link>
          <ul className="desktop-nav" inert={open} aria-hidden={open || undefined}>
            {nav.map((key) => (
              <li key={key}>
                <Link
                  href={routeFor(locale, key)}
                  aria-current={page === key ? "page" : undefined}
                >
                  <Icon name={key} size={14} />
                  {pageLabels[locale][key]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="header-actions" inert={open} aria-hidden={open || undefined}>
            <span className="availability">
              <i />
              {vi ? "Thực tập" : "Available"}
            </span>
            <Link
              className="button button-small"
              href={routeFor(locale, "contact")}
            >
              <Icon name="mail" size={14} />
              {vi ? "Liên hệ" : "Hire me"}
            </Link>
          </div>
          <a
            className="language-switch"
            inert={open}
            aria-hidden={open || undefined}
            href={routeFor(vi ? "en" : "vi", page)}
            lang={vi ? "en" : "vi"}
            hrefLang={vi ? "en" : "vi"}
            aria-label={vi ? "Switch to English" : "Chuyển sang Tiếng Việt"}
          >
            {vi ? "EN" : "VI"}
          </a>
          <button
            ref={toggle}
            className="menu-toggle"
            onClick={() => {
              if (open) {
                closeMenu();
              } else {
                setClosing(false);
                setOpen(true);
              }
            }}
            aria-label={
              open
                ? vi
                  ? "Đóng menu điều hướng"
                  : "Close navigation menu"
                : vi
                  ? "Mở menu"
                  : "Open menu"
            }
            aria-expanded={open}
            aria-controls={open || closing ? "mobile-navigation" : undefined}
            tabIndex={open ? -1 : undefined}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </nav>
      </header>
      {(open || closing) && (
        <div
          className="mobile-overlay"
          data-state={open ? "open" : "closing"}
          inert={!open}
          aria-hidden={!open}
          onClick={() => closeMenu()}
        >
          <div
            id="mobile-navigation"
            ref={drawer}
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-heading">
              <span>◈ {vi ? "Điều hướng" : "Navigation"}</span>
              <button
                aria-label={vi ? "Đóng menu" : "Close menu"}
                onClick={() => closeMenu()}
              >
                <Icon name="close" />
              </button>
            </div>
            <nav aria-label={vi ? "Điều hướng di động" : "Mobile navigation"}>
              {nav.map((key) => (
                <Link
                  key={key}
                  href={routeFor(locale, key)}
                  aria-current={page === key ? "page" : undefined}
                  onClick={() => closeMenu(true)}
                >
                  <Icon name={key} />
                  {pageLabels[locale][key]}
                  {page === key && (
                    <span className="active-badge">
                      {vi ? "Hiện tại" : "Active"}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <p className="availability">
              <i />
              {vi
                ? "Tìm kiếm cơ hội thực tập"
                : "Open to internship opportunities"}
            </p>
            <Link
              className="button"
              href={routeFor(locale, "contact")}
              onClick={() => closeMenu(true)}
            >
              <Icon name="mail" />
              {vi ? "Kết nối với tôi" : "Get in touch"}
            </Link>
          </div>
        </div>
      )}
      </div>
      <noscript>
        <nav
          className="static-navigation"
          aria-label={vi ? "Điều hướng tĩnh" : "Static navigation"}
        >
          {pageKeys.map((key) => (
            <a
              key={key}
              href={routeFor(locale, key)}
              aria-current={page === key ? "page" : undefined}
            >
              {pageLabels[locale][key]}
            </a>
          ))}
        </nav>
      </noscript>
      <main ref={main} id="main-content" className="site-main" inert={open} aria-hidden={open || undefined}>
        {children}
      </main>
      <footer className="site-footer" inert={open} aria-hidden={open || undefined}>
        <div className="footer-inner">
          <span className="footer-mark">[CHÂU ANH DŨNG]</span>
          <span className="footer-copyright">
            © {new Date().getFullYear()} · {profile.position[locale]}
          </span>
          <div>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <Link href={routeFor(locale, "blog")}>Blog</Link>
            <Link href={routeFor(locale, "contact")}>
              {vi ? "Liên hệ" : "Contact"}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
