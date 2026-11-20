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
  const vi = locale === "vi";
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
        setOpen(false);
        setClosing(false);
      }
    };
    media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, []);
  useEffect(() => {
    if (!open) return;
    cancelAnimationFrame(focusFrame.current);
    const generation = ++focusGeneration.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previousFocus = document.activeElement as HTMLElement | null;
    const opener = toggle.current;
    drawer.current?.querySelector<HTMLElement>("a,button")?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreFocus.current = true;
        closeMenu();
      }
      if (event.key === "Tab") {
        const elements = [
          ...(drawer.current?.querySelectorAll<HTMLElement>(
            "a[href],button:not([disabled])",
          ) ?? []),
        ];
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const containFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && !drawer.current?.contains(event.target))
        drawer.current?.querySelector<HTMLElement>("a,button")?.focus();
    };
    document.addEventListener("keydown", key);
    document.addEventListener("focusin", containFocus);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
      document.removeEventListener("focusin", containFocus);
      if (restoreFocus.current) {
        restoreFocus.current = false;
        focusFrame.current = requestAnimationFrame(() => {
          if (focusGeneration.current === generation && opener?.isConnected &&
              !drawer.current?.closest('[data-state="open"]')) opener.focus();
        });
      } else if (open) {
        previousFocus?.focus();
      }
    };
  }, [open, closeMenu]);
  const nav = pageKeys.filter((p) => p !== "home");
  return (
    <>
      <a className="skip-link" href="#main-content">
        {vi ? "Bỏ qua đến nội dung" : "Skip to content"}
      </a>
      <div className="global-grid" aria-hidden="true" />
      <div className="ambient ambient-cyan" aria-hidden="true" />
      <div className="ambient ambient-pink" aria-hidden="true" />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <nav
          className="header-inner"
          aria-label={vi ? "Điều hướng chính" : "Main navigation"}
        >
          <Link
            href={routeFor(locale, "home")}
            className="wordmark"
            aria-label={
              vi ? "Châu Anh Dũng — Trang chủ" : "Châu Anh Dũng — Home"
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
          <ul className="desktop-nav">
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
          <div className="header-actions">
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
              if (open) closeMenu();
              else {
                setClosing(false);
                setOpen(true);
              }
            }}
            aria-label={
              open
                ? vi
                  ? "Đóng menu"
                  : "Close menu"
                : vi
                  ? "Mở menu"
                  : "Open menu"
            }
            aria-expanded={open}
            aria-controls="mobile-navigation"
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
            role="dialog"
            aria-modal="true"
            aria-label={vi ? "Menu điều hướng" : "Navigation menu"}
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
      <main ref={main} id="main-content" className="site-main">
        {children}
      </main>
      <footer className="site-footer">
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
