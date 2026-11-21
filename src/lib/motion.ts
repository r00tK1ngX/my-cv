// Pending content is always visible. The reference-inspired tracks are bound
// to semantic roles, not a single generic .reveal animation.
const ease = "cubic-bezier(.4, 0, .2, 1)";
const wideHero = "(min-width: 640px)";
type Profile = {
  selector: string;
  duration: number;
  from: number;
  offset: [number, number];
  scale?: number;
  delay?: number;
  stagger?: number;
  threshold?: number;
};
const profiles = {
  "hero-copy": { selector: ".hero-copy", duration: 1000, from: 1, offset: [0, 24] },
  "hero-visual": { selector: ".hero-visual", duration: 1000, from: 0.12, offset: [0, 24], threshold: 0.5 },
  heading: { selector: ".section-heading", duration: 1000, from: 1, offset: [0, -32] },
  project: { selector: ".project-card", duration: 700, from: 1, offset: [0, 48], stagger: 120 },
  skill: { selector: ".skill-card", duration: 700, from: 1, offset: [0, 40], stagger: 60 },
  timeline: { selector: ".timeline-card", duration: 700, from: 1, offset: [-56, 0], stagger: 120 },
  stat: { selector: ".stat", duration: 500, from: 1, offset: [0, 0], scale: 0.9, stagger: 100 },
  portrait: { selector: ".about-avatar", duration: 1000, from: 0.38, offset: [-48, 0], delay: 200 },
  bio: { selector: ".bio", duration: 1000, from: 1, offset: [48, 0], delay: 300 },
  content: { selector: ".reveal,.highlight-card,.highlight-section > .subheading,.contact-card,.contact-form,.blog-empty,.research-tabs,.experience-empty,.learning-note,.page-cta", duration: 700, from: 1, offset: [0, 30], stagger: 80 },
} satisfies Record<string, Profile>;

type Role = keyof typeof profiles;
const tracks = Object.entries(profiles) as [Role, Profile][];
const selectors = tracks.map(([, p]) => p.selector).join(",");
const gridSelector = ".project-grid,.skill-grid,.highlight-grid,.stats-grid,.timeline,.contact-list";
export const reducedMotion = "(prefers-reduced-motion: reduce)";

export function mountMotion(root: HTMLElement) {
  const reduced = matchMedia(reducedMotion);
  const wide = matchMedia(wideHero);
  const pending = new Map<HTMLElement, [Role, Profile]>();
  const active = new Map<HTMLElement, Animation>();
  let disposed = false;
  let scrollFrame = 0;

  const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target as HTMLElement;
      if (!pending.has(target)) continue;
      if (entry.isIntersecting) enter(target);
      else if (entry.boundingClientRect.bottom <= 0) settle(target);
    }
  }, { threshold: [0, 0.1, 0.5] });

  function settle(element: HTMLElement) {
    pending.delete(element);
    observer?.unobserve(element);
    element.dataset.motionState = "done";
    const motion = active.get(element);
    active.delete(element);
    motion?.cancel();
  }

  function follow(element: HTMLElement, motion: Animation) {
    pending.delete(element);
    observer?.unobserve(element);
    element.dataset.motionState = "entering";
    active.set(element, motion);
    const finish = () => {
      if (!disposed && active.get(element) === motion) settle(element);
    };
    void motion.finished.then(finish, finish);
  }

  function enter(element: HTMLElement) {
    const cue = pending.get(element);
    if (!cue || disposed || document.hidden) return;
    if (reduced.matches || element.contains(document.activeElement)) return settle(element);
    const [role, profile] = cue;
    const cssTrack = role === "hero-copy" ? "hero-copy-in"
      : role === "hero-visual" && wide.matches ? "hero-visual-in"
      : role === "heading" && element.querySelector(":scope > h1") ? "page-heading-in" : null;
    if (cssTrack) {
      // Adopt an in-flight first-paint entrance. Never restart it after hydration.
      const motion = element.getAnimations?.().find((a) => (a as CSSAnimation).animationName === cssTrack);
      if (motion) follow(element, motion);
      else settle(element);
      return;
    }
    const box = element.getBoundingClientRect();
    const visible = Math.min(innerHeight, box.bottom) - Math.max(0, box.top);
    if (visible < Math.min(box.height, innerHeight) * (profile.threshold ?? 0.1)) return;
    if (typeof element.animate !== "function") return settle(element);
    const parent = element.parentElement;
    const cohort = parent?.matches(gridSelector) ? Array.from(parent.children) : [];
    const index = Math.max(0, cohort.indexOf(element));
    // Use actual responsive rows; in one-column layouts scroll sets the rhythm.
    const preceding = cohort.slice(0, index).filter((child) => child instanceof HTMLElement && Math.abs(child.offsetTop - element.offsetTop) < 4).length;
    const delay = Math.min(300, (profile.delay ?? 0) + preceding * (profile.stagger ?? 0));
    let [x, y] = profile.offset;
    if (role === "timeline" && index % 2) x *= -1;
    if (!wide.matches && role !== "hero-visual") [x, y] = x ? [0, 24] : [0, Math.round(y * 0.62)];
    const from: Keyframe = { opacity: profile.from, translate: `${x}px ${y}px` };
    const to: Keyframe = { opacity: 1, translate: "0px 0px" };
    if (profile.scale) {
      from.scale = profile.scale;
      to.scale = 1;
    }
    // No retained transforms: hover/focus and ambient motion own separate tracks.
    try {
      follow(element, element.animate([from, to], { duration: profile.duration, delay, easing: ease, fill: "backwards" }));
    } catch {
      settle(element);
    }
  }

  for (const element of root.querySelectorAll<HTMLElement>(selectors)) {
    const cue = tracks.find(([, profile]) => element.matches(profile.selector));
    if (!cue) continue;
    const [role] = cue;
    element.dataset.motionRole = role;
    element.dataset.motionState = "pending";
    pending.set(element, cue);
    const box = element.getBoundingClientRect();
    if (reduced.matches || box.bottom <= 0) settle(element);
    else {
      observer?.observe(element);
      if (box.top < innerHeight) enter(element);
      if (!observer && pending.has(element)) settle(element);
    }
  }
  const catchSkipped = () => {
    scrollFrame = 0;
    for (const element of pending.keys()) if (element.getBoundingClientRect().bottom <= 0) settle(element);
    for (const element of active.keys()) if (element.getBoundingClientRect().bottom <= 0) settle(element);
  };
  const onScroll = () => {
    if (!scrollFrame && (pending.size || active.size)) scrollFrame = requestAnimationFrame(catchSkipped);
  };
  const onFocus = (event: FocusEvent) => {
    if (!(event.target instanceof HTMLElement)) return;
    for (const element of [...pending.keys(), ...active.keys()]) if (element.contains(event.target)) settle(element);
  };
  const onReduce = () => {
    if (reduced.matches) for (const element of [...pending.keys(), ...active.keys()]) settle(element);
  };
  const onVisibility = () => {
    if (document.hidden) {
      for (const element of active.keys()) settle(element);
    } else {
      for (const element of pending.keys()) enter(element);
    }
  };
  const onBreakpoint = () => {
    const visual = root.querySelector<HTMLElement>(".hero-visual");
    if (visual && (pending.has(visual) || active.has(visual))) settle(visual);
  };
  root.addEventListener("focusin", onFocus);
  window.addEventListener("scroll", onScroll, { passive: true });
  reduced.addEventListener("change", onReduce);
  wide.addEventListener("change", onBreakpoint);
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    disposed = true;
    observer?.disconnect();
    cancelAnimationFrame(scrollFrame);
    for (const animation of active.values()) animation.cancel();
    active.clear();
    pending.clear();
    root.removeEventListener("focusin", onFocus);
    window.removeEventListener("scroll", onScroll);
    reduced.removeEventListener("change", onReduce);
    wide.removeEventListener("change", onBreakpoint);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
