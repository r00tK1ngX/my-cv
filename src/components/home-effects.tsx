"use client";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/routes";
import { reducedMotion } from "@/lib/motion";

const typeLines = {
  en: ["Cybersecurity Student", "PWN / Binary Exploitation", "Red Team learning", "AI & Security Automation"],
  vi: ["Sinh viên An ninh mạng", "PWN / Khai thác nhị phân", "Học tập Red Team", "AI & Tự động hóa bảo mật"],
} as const;

export function Typewriter({ locale }: { locale: Locale }) {
  const words = typeLines[locale];
  const [text, setText] = useState<string>(words[0]);
  const ref = useRef<HTMLSpanElement>(null);
  const ink = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLElement>(null);
  useEffect(() => {
    const box = ref.current, glyphs = ink.current, caret = cursor.current;
    const line = box?.parentElement;
    if (!box || !glyphs || !caret || !line) return;
    let active = true;
    const place = () => {
      if (!active) return;
      const styles = getComputedStyle(line);
      const prompt = line.querySelector<HTMLElement>(".prompt");
      const available = Math.max(0, line.clientWidth - (prompt?.offsetWidth ?? 0) - parseFloat(styles.columnGap) * 2 - caret.offsetWidth);
      glyphs.style.maxWidth = `${available}px`;
      // Reserve the original first phrase's box. The caret follows text using
      // transform rather than flex reflow, so typing cannot generate CLS.
      const distance = Math.min(glyphs.scrollWidth, available) - box.clientWidth;
      caret.style.transform = `translateX(${distance}px)`;
    };
    place();
    const resize = new ResizeObserver(place);
    resize.observe(line);
    void document.fonts.ready.then(place);
    return () => { active = false; resize.disconnect(); };
  }, [text]);
  useEffect(() => {
    const line = ref.current?.parentElement;
    if (!line) return;
    const motion = matchMedia(reducedMotion);
    const glyphs = words.map((word) => Array.from(word));
    const rect = line.getBoundingClientRect();
    let inView = rect.bottom > 0 && rect.top < innerHeight;
    let index = 0, pos = 0, deleting = false, interval = 80;
    let timer: ReturnType<typeof setTimeout>;
    let disposed = false;
    const canPlay = () => !disposed && !motion.matches && inView && !document.hidden;
    const sync = () => {
      clearTimeout(timer);
      if (canPlay()) timer = setTimeout(tick, interval);
    };
    const onPreference = () => {
      if (disposed) return;
      if (motion.matches) {
        index = pos = 0;
        interval = 80;
        deleting = false;
        setText(words[0]);
      }
      sync();
    };
    const tick = () => {
      if (disposed) return;
      if (motion.matches) return onPreference();
      if (!canPlay()) return;
      const phrase = glyphs[index];
      if (deleting) {
        setText(phrase.slice(0, --pos).join(""));
        interval = 40;
        if (pos === 0) {
          deleting = false;
          index = (index + 1) % words.length;
          interval = 80;
        }
      } else {
        setText(phrase.slice(0, ++pos).join(""));
        interval = 80;
        if (pos === phrase.length) {
          deleting = true;
          interval = 1800;
        }
      }
      sync();
    };
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      if (inView !== entry.isIntersecting) {
        inView = entry.isIntersecting;
        sync();
      }
    });
    observer?.observe(line);
    sync();
    motion.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      clearTimeout(timer);
      observer?.disconnect();
      motion.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [words]);
  return (
    <>
      <span ref={ref} className="type-text" data-reserved={words[0]} aria-hidden="true"><span ref={ink} className="type-ink">{text}</span></span>
      <span className="sr-only">{words.join(", ")}</span>
      <i ref={cursor} aria-hidden="true" className="type-cursor" />
    </>
  );
}
export function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0,
      height = 0,
      frame = 0,
      lastTime = 0;
    let inView = true;
    let disposed = false;
    const particles = Array.from({ length: 60 }, (_, i) => ({
      x: ((i * 73) % 997) / 997,
      y: ((i * 191) % 991) / 991,
      vx: Math.sin(i * 1.7) * 0.15,
      vy: Math.cos(i * 2.1) * 0.15,
      radius: 0.3 + ((i * 37) % 61) / 40,
      alpha: 0.1 + ((i * 11) % 41) / 100,
    }));
    const motion = matchMedia(reducedMotion);
    let reduced = motion.matches;
    const resize = () => {
      if (disposed) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      const pixelWidth = Math.round(width * dpr), pixelHeight = Math.round(height * dpr);
      if (canvas.width === pixelWidth && canvas.height === pixelHeight) return;
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced || !inView || document.hidden) draw(performance.now());
    };
    const draw = (time: number) => {
      if (disposed) return;
      const moving = !reduced && inView && !document.hidden;
      const elapsed = lastTime ? Math.min(time - lastTime, 40) : 16.667;
      if (moving && lastTime && elapsed < 30) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastTime = moving ? time : 0;
      const step = elapsed / 16.667;
      ctx.clearRect(0, 0, width, height);
      const count = width < 640 ? 46 : particles.length;
      if (moving && width && height) for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx * step / width;
        p.y += p.vy * step / height;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        p.x = Math.min(1, Math.max(0, p.x));
        p.y = Math.min(1, Math.max(0, p.y));
      }
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        ctx.fillStyle = `rgba(0,245,255,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.radius, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < count; j++) {
          const q = particles[j];
          const dx = (p.x - q.x) * width, dy = (p.y - q.y) * height;
          const squared = dx * dx + dy * dy;
          if (squared < 120 * 120) {
            ctx.strokeStyle = `rgba(0,245,255,${0.06 * (1 - Math.sqrt(squared) / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x * width, p.y * height);
            ctx.lineTo(q.x * width, q.y * height);
            ctx.stroke();
          }
        }
      }
      if (moving) frame = requestAnimationFrame(draw);
    };
    const syncMotion = () => {
      if (disposed) return;
      reduced = motion.matches;
      cancelAnimationFrame(frame);
      lastTime = 0;
      draw(performance.now());
    };
    const bounds = canvas.getBoundingClientRect();
    inView = bounds.bottom > 0 && bounds.top < innerHeight;
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            if (inView !== entry.isIntersecting) {
              inView = entry.isIntersecting;
              syncMotion();
            }
          });
    observer?.observe(canvas);
    const dimensions = new ResizeObserver(resize);
    dimensions.observe(canvas);
    resize();
    if (!reduced && inView && !document.hidden) draw(performance.now());
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", syncMotion);
    motion.addEventListener("change", syncMotion);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      dimensions.disconnect();
      document.removeEventListener("visibilitychange", syncMotion);
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", syncMotion);
    };
  }, []);
  return (
    <canvas
      ref={ref}
      className="particle-canvas w-full h-full"
      aria-hidden="true"
    />
  );
}
