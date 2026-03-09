# App Market Design Trend — Implementation Plan

Plan to align VerbaFlow with current **app market** design/style trends (mobile + SaaS, 2025–2026). Complements [2026-MARKET-TREND-PLAN.md](2026-MARKET-TREND-PLAN.md) (web/visual) with app-specific UX and UI work.

---

## Trend Summary (App Market)

| Trend | What it means for VerbaFlow |
|-------|-----------------------------|
| **Experience over features** | One clear flow (paste → tone/context → options → refine); no clutter. |
| **Time-to-value (TTV)** | User sees value in one click after pasting; empty state and copy guide that. |
| **AI-native** | Rewrite and refine are the product, not an add-on; UI should feel built around AI. |
| **Minimal vs dense** | We use **minimal**: clarity, hierarchy, essentialism (right fit for writing tools). |
| **Glass / depth** | Functional glassmorphism: blur, soft shadows, layered cards where it aids hierarchy. |
| **Dark mode** | Expected in app market; optional or default for “AI” output area. |
| **Motion with purpose** | Micro-interactions for loading, success, focus; respect reduced-motion. |
| **Token-based system** | Single source of truth for color, spacing, type; supports theming and dark mode. |
| **Proactive / predictive UI** | Smart defaults, contextual hints, or suggestions that reduce steps. |
| **Performance** | Fast load, minimal DOM, CSS-based motion; no layout shift. |

---

## Phase 0: Already Aligned

These are already implemented; no action unless you want to refine.

| Trend | Current implementation |
|-------|------------------------|
| **Experience / one flow** | Single page: input panel → output panel; one primary CTA (Refine expression). |
| **TTV** | Paste + one click to see options; empty state explains the flow. |
| **AI-native** | Rewrite and refine are the core; no “AI section” bolt-on. |
| **Minimal** | Clear hierarchy, value line (h1), tokens, limited palette, white space. |
| **Glass / depth** | Header: `backdrop-blur`, card shadows (`--shadow-sm`/`--shadow-md`), soft gradient background. |
| **Motion with purpose** | Fade-in for options and error; loading skeleton; `prefers-reduced-motion` respected. |
| **Token system** | `app/globals.css`: color, shadow, radius, type scale; components use variables. |
| **Performance** | Next.js, next/font, CSS-only gradient; no heavy images. |
| **Accessibility & trust** | Skip link, landmarks, focus, aria-live, contrast, trust footer. See 2026 plan. |

---

## Phase 1: High-Impact Implementation

Concrete work that brings VerbaFlow in line with app-market expectations.

### 1.1 Dark mode

- **Goal:** Dark mode as a standard app-market expectation; supports “AI panel” default in trends.
- **Tasks:**
  - [x] In `app/globals.css`, add `@media (prefers-color-scheme: dark)` with `:root` overrides for all surface/color/shadow/gradient tokens. No component changes.
  - [ ] Optional: add a theme toggle (system / light / dark) in the header that sets `data-theme` or class on `html` and persists in `localStorage`.
- **Files:** `app/globals.css` (done).

### 1.2 Glass and depth refinement

- **Goal:** Functional glassmorphism: blur and depth where they clarify hierarchy.
- **Tasks:**
  - [x] Output panel: when `options.length > 0`, apply `bg-[var(--color-card)]/90 backdrop-blur-sm shadow-[var(--shadow-lg)]`; otherwise keep `shadow-sm` and solid card.
- **Files:** `app/page.tsx` (done).

### 1.3 Empty state / first-time experience (TTV)

- **Goal:** First-time users get to value faster; empty state doubles as lightweight “onboarding.”
- **Tasks:**
  - [x] Sharper copy: “Paste your text in the left panel, then click **Refine expression**…” in `EmptyState.tsx`.
  - [x] “Try sample” button that fills the textarea with “Revert the change when you can.” via `onTrySample` callback from `app/page.tsx`.
- **Files:** `components/EmptyState.tsx`, `app/page.tsx` (done).

---

## Phase 2: Proactive UI and Polish

Nice-to-have improvements that reinforce app-market trends.

### 2.1 Proactive / smart defaults

- **Goal:** UI anticipates context; fewer decisions for the user.
- **Tasks:**
  - [ ] Consider defaulting **Context** from clipboard or last used (e.g. remember last context in `localStorage` and pre-select it on load).
  - [ ] Optional: if the user pastes a long block, show a short hint like “We’ll rewrite the whole block” or “You can refine any option below” near the button or output panel.
- **Files:** `app/page.tsx` (context init from storage, optional hint state), `lib/types.ts` if you add a “last context” helper.

### 2.2 Variable font (optional)

- **Goal:** Align with “variable fonts for performance and flexibility” trend.
- **Tasks:**
  - [ ] Check if Plus Jakarta Sans is loaded as a variable font in `next/font/google`; if not, consider switching to the variable subset if available.
  - [ ] Document in design tokens that type scale uses the variable axis (if applicable).
- **Files:** `app/layout.tsx`, `docs/design-tokens.md` (if you create it).

### 2.3 Video or rich onboarding (optional)

- **Goal:** “Video-first” guidance trend without bloating the MVP.
- **Tasks:**
  - [ ] Add a small “How it works” or “?” link in the header or near the value line that opens a modal or drawer with 2–3 short bullets and, if you have it, one very short (e.g. 30s) Loom/video link. No PDFs.
- **Files:** New component (e.g. `HowItWorks.tsx`), `app/page.tsx` (trigger).

---

## Phase 3: Optional / Future

- **Spatial / AR/VR:** Not relevant for a writing app in the short term; skip unless product direction changes.
- **Bento grid:** Our flow is linear (input → output); bento layout is better for dashboards. No change unless we add a “library” or “history” view later.
- **Advanced AI UX:** E.g. inline suggestions, streaming rewrites, or “refine again” from the same card. Can be planned later as a separate feature set.

---

## Implementation Order

1. **Phase 1.1 — Dark mode** (biggest app-market signal).
2. **Phase 1.2 — Glass/depth** (small CSS tweaks).
3. **Phase 1.3 — Empty state / TTV** (copy + optional “Try sample”).
4. **Phase 2** items in any order, or as needed for launch.

---

## Checklist Summary

| Phase | Item | Status |
|-------|------|--------|
| 0 | Experience, TTV, AI-native, minimal, glass/depth, motion, tokens, performance, a11y, trust | Done |
| 1.1 | Dark mode (`prefers-color-scheme: dark` + tokens) | Done |
| 1.2 | Output panel glass/depth refinement | Done |
| 1.3 | Empty state copy + “Try sample” button | Done |
| 2.1 | Proactive defaults (e.g. last context) | Optional |
| 2.2 | Variable font check/docs | Optional |
| 2.3 | “How it works” + short video link | Optional |

Once Phase 1 is done, VerbaFlow will be fully aligned with current app-market design/style trends for a minimal, AI-native writing product.
