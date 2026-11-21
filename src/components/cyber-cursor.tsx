"use client";

import { useEffect, useRef } from "react";

type CursorState = "default" | "interactive" | "button" | "image";

export function CyberCursor() {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = cursor.current;
    if (!root || typeof matchMedia !== "function" || typeof requestAnimationFrame !== "function") return;
    const core = root.querySelector<HTMLElement>(".cyber-cursor__core")!;
    const ring = root.querySelector<HTMLElement>(".cyber-cursor__ring")!;
    const glow = root.querySelector<HTMLElement>(".cyber-cursor__glow")!;
    const trails = Array.from(root.querySelectorAll<HTMLElement>(".cyber-cursor__trail"));
    const ripple = root.querySelector<HTMLElement>(".cyber-cursor__ripple")!;
    const pulse = ripple.firstElementChild as HTMLElement;
    const input = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1180px)");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, lastTime = 0, x = 0, y = 0, ringX = 0, ringY = 0;
    let active = false, pressed = false, dragging = false, disposed = false;
    let hover: CursorState = "default";
    let clickAnimation: Animation | undefined;
    const points = trails.map(() => ({ x: 0, y: 0 }));
    const setState = (value: string) => {
      if (root.dataset.state !== value) root.dataset.state = value;
    };
    const place = (element: HTMLElement, px: number, py: number) => {
      element.style.setProperty("--cursor-x", `${px}px`);
      element.style.setProperty("--cursor-y", `${py}px`);
    };
    const enabled = () => !disposed && input.matches && !motion.matches && !document.hidden;
    const hide = () => {
      cancelAnimationFrame(frame);
      frame = lastTime = 0;
      active = pressed = false;
      clickAnimation?.cancel();
      root.dataset.active = "false";
      root.dataset.initialized = "false";
      root.style.visibility = "hidden";
      setState("default");
      document.documentElement.removeAttribute("data-cyber-cursor");
    };
    const stateFor = (target: Element): CursorState | "native" => {
      // Preserve I-beam, disabled, resize and drag affordances instead of faking them.
      if (target.closest("input, textarea, select, [contenteditable]:not([contenteditable='false']), :disabled, [aria-disabled='true'], [draggable='true'], [data-cursor='native']")) return "native";
      const override = target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      if (override === "button" || override === "interactive" || override === "image") return override;
      if (target.closest("button, [role='button'], a.button")) return "button";
      if (target.closest("a[href], summary, [role='link'], [role='tab'], [tabindex]:not([tabindex='-1'])")) return "interactive";
      // Hero ornaments can be the hit target; never change the approved avatar DOM/CSS.
      if (target.closest("img, .hero-visual")) return "image";
      return "default";
    };
    const tick = (time: number) => {
      frame = 0;
      if (!active || !enabled()) { hide(); return; }
      const elapsed = lastTime ? Math.min(time - lastTime, 40) : 16.667;
      lastTime = time;
      const follow = 1 - Math.exp(-elapsed / 65);
      ringX += (x - ringX) * follow;
      ringY += (y - ringY) * follow;
      place(ring, ringX, ringY);
      place(glow, ringX, ringY);
      let leaderX = x, leaderY = y, moving = Math.hypot(x - ringX, y - ringY) > 0.1;
      points.forEach((point, index) => {
        const step = 1 - Math.exp(-elapsed / 38);
        point.x += (leaderX - point.x) * step;
        point.y += (leaderY - point.y) * step;
        const gap = Math.hypot(leaderX - point.x, leaderY - point.y);
        if (gap > 14) {
          point.x = leaderX + (point.x - leaderX) * 14 / gap;
          point.y = leaderY + (point.y - leaderY) * 14 / gap;
        }
        place(trails[index], point.x, point.y);
        trails[index].style.opacity = String(Math.min(Math.hypot(x - point.x, y - point.y) / 16, 1) * (0.42 - index * 0.1));
        moving ||= Math.hypot(x - point.x, y - point.y) > 0.1;
        leaderX = point.x; leaderY = point.y;
      });
      if (moving) frame = requestAnimationFrame(tick);
      else {
        place(ring, x, y); place(glow, x, y);
        trails.forEach(trail => { trail.style.opacity = "0"; });
        lastTime = 0;
      }
    };
    const move = (event: PointerEvent) => {
      if (!enabled() || event.pointerType !== "mouse" || dragging) { hide(); return; }
      const target = event.target instanceof Element ? event.target : null;
      if (!target) { hide(); return; }
      const state = stateFor(target);
      if (state === "native" || (event.buttons === 1 && hover === "default")) { hide(); return; }
      // CSS must be present before removing the native cursor, including failed-load fallback.
      if (getComputedStyle(root).getPropertyValue("--cyber-cursor-css").trim() !== "1") { hide(); return; }
      x = event.clientX; y = event.clientY; hover = state;
      place(core, x, y); // No React state or delayed transform on the actual hit point.
      if (!active) {
        ringX = x; ringY = y;
        place(ring, x, y); place(glow, x, y);
        points.forEach(point => { point.x = x; point.y = y; });
        trails.forEach(trail => { place(trail, x, y); trail.style.opacity = "0"; });
        root.style.visibility = "visible";
        root.dataset.active = "true";
        root.dataset.initialized = "true";
        document.documentElement.setAttribute("data-cyber-cursor", "ready");
        active = true;
      }
      setState(pressed ? "pressed" : hover);
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const down = (event: PointerEvent) => {
      if (!active || !enabled() || event.pointerType !== "mouse" || event.button !== 0) return;
      pressed = true;
      setState("pressed");
      place(ripple, event.clientX, event.clientY);
      clickAnimation?.cancel();
      if (typeof pulse.animate === "function") {
        clickAnimation = pulse.animate([{ transform: "scale(.45)", opacity: .65 }, { transform: "scale(2.5)", opacity: 0 }], { duration: 380, easing: "cubic-bezier(.16,1,.3,1)" });
      }
    };
    const up = () => { pressed = false; if (active) setState(hover); };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    const preference = () => { if (!enabled()) hide(); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Tab") hide(); };
    const dragStart = () => { dragging = true; hide(); };
    const dragEnd = () => { dragging = false; hide(); };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("pointercancel", hide, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    document.addEventListener("keydown", keyboard);
    document.addEventListener("dragstart", dragStart);
    document.addEventListener("dragend", dragEnd);
    document.addEventListener("visibilitychange", preference);
    window.addEventListener("blur", hide);
    input.addEventListener("change", preference);
    motion.addEventListener("change", preference);
    return () => {
      disposed = true;
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", hide);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("dragstart", dragStart);
      document.removeEventListener("dragend", dragEnd);
      document.removeEventListener("visibilitychange", preference);
      window.removeEventListener("blur", hide);
      input.removeEventListener("change", preference);
      motion.removeEventListener("change", preference);
      hide();
    };
  }, []);

  return (
    <div ref={cursor} className="cyber-cursor" aria-hidden="true" data-state="default" data-active="false" data-initialized="false" style={{ visibility: "hidden" }}>
      <i className="cyber-cursor__glow" />
      <i className="cyber-cursor__ring" />
      <i className="cyber-cursor__core" />
      {[1, 2, 3].map(index => <i key={index} className={`cyber-cursor__trail cyber-cursor__trail--${index}`} />)}
      <i className="cyber-cursor__ripple"><i /></i>
    </div>
  );
}
