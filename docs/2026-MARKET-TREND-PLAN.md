# 2026 Market Trend Style — Implementation Plan

Plan for aligning VerbaFlow with current web/product design trends (2026). Use this to track what’s done and what to do next.

---

## Reference: Trends We're Aligning To

| Trend | Goal |
|-------|------|
| **Performance-first** | Fast load, minimal assets, no layout shift |
| **Organic / human aesthetics** | Soft shapes, gradients, warmth; less rigid grids |
| **Minimalism with intent** | White space, clear hierarchy, strong typography, limited palette |
| **Motion with purpose** | Micro-interactions for feedback; respect `prefers-reduced-motion` |
| **Accessibility-first** | Skip link, landmarks, focus, live regions, contrast |
| **Trust / privacy-by-design** | Clear data messaging (e.g. "not stored") |
| **Proprietary visual system** | Ownable tokens (color, radius, shadow, type) |

---

## Phase 0: Already Implemented

No further work needed unless you want to refine.

| Item | Where |
|------|--------|
| **Organic / soft** | `app/globals.css`: `--gradient-soft` on `body::before`, `--radius-organic`; empty state and icon use organic radius |
| **Reduced motion** | `app/globals.css`: `@media (prefers-reduced-motion: reduce)`; `components/RewriteOptions.tsx`: `.hover-lift` on cards |
| **Accessibility** | `app/page.tsx`: Skip link, `main#main-content`, `aria-label` on sections, `aria-live="polite"` on output; "Copied" has `role="status"` |
| **Typography (soft maximalism)** | `app/page.tsx`: Value line "Turn rough words into clear, natural expression." above input |
| **Trust** | `app/page.tsx`: Footer "Your text is not stored. Processed only for rewriting." |
| **Visual system** | `app/globals.css`: Color, shadow, radius, type tokens; `app/layout.tsx`: Plus Jakarta Sans |

---

## Phase 1: Hardening and Consistency (Recommended)

Small, high-impact passes.

### 1.1 Contrast and focus
- [x] Audit muted text (`--color-muted`, `--color-muted-strong`) for WCAG AA (4.5:1 body, 3:1 large). Comment added in `globals.css`.
- [x] Confirm every interactive element has a visible focus style (buttons, tone pills, option cards, refinement input). Focus ring uses `--shadow-focus`; skip link has focus ring offset.

### 1.2 Motion
- [x] Add a short (200ms) fade-in when the error message appears (`.error-message-enter` in `globals.css`); error block has `role="alert"`.
- [x] Loading skeleton and reduced-motion already in place.

### 1.3 Semantic HTML
- [x] One `<h1>` on the page: value line "Turn rough words into clear, natural expression." in the input section.
- [x] Heading order: h1 then h2 ("Your text", "Rewritten options").

---

## Phase 2: Optional Enhancements

Only if you want to go further.

### 2.1 Dark mode
- [ ] Add `prefers-color-scheme: dark` (or a toggle) and dark tokens in `app/globals.css`.
- [ ] Use CSS variables for surfaces so components don’t need structural changes.

### 2.2 Variable font
- [ ] Plus Jakarta is already multi-weight. If you adopt a variable font later, expose weight/axis via tokens for smoother type scaling.

### 2.3 One “craft” detail
- [ ] Optional: very subtle texture or noise on background, or a hand-drawn stroke on the logo, to reinforce "human craft."

### 2.4 Performance
- [ ] Run Lighthouse (LCP, CLS); confirm next/font doesn’t cause layout shift.
- [ ] Use `priority` or `fetchPriority` only where needed for above-the-fold content.

---

## Phase 3: Documentation and Handoff

- [ ] **Design tokens:** Short reference (e.g. `docs/design-tokens.md`) listing CSS variables and usage.
- [ ] **Accessibility checklist:** What’s done (skip link, landmarks, focus, live regions, reduced motion) plus a step to run axe or WAVE before release.

---

## Summary

- **Phase 0:** Done — app already reflects 2026 trends.
- **Phase 1:** Next — contrast/focus audit, error transition, one clear h1/semantic pass.
- **Phase 2:** Optional — dark mode, variable font, craft detail, performance.
- **Phase 3:** Optional — tokens doc and a11y checklist for handoff.

Implementing **Phase 1** completes alignment with the 2026 market trend style; Phases 2–3 are optional polish.
