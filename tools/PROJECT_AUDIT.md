# PC Builder Project Audit & Recommendations

This document outlines the current state of the project, identifying areas for improvement, missing features, and technical debt. It is intended for future AI agents and developers.

## 1. Data Structure & Compatibility Logic (High Priority)
The most critical issue right now is missing properties in `data.js` that cause compatibility checks in `compatibility.js` to fail silently.
*   **Cases (`case`) are missing constraints:** Current entries only have `formFactor` and `maxRadiatorSize`. They MUST include:
    *   `mbSizes`: Array of supported motherboard form factors (e.g., `['ATX', 'Micro-ATX', 'Mini-ITX']`). *Note: Without this, `compatibility.js` silently skips the form factor check.*
    *   `maxGpuLength`: Number in mm.
    *   `maxCoolerHeight`: Number in mm.
    *   `psuTypes`: Array of supported PSU types (e.g., `['ATX', 'SFX']`).
*   **GPUs (`gpu`) are missing constraints:** Need `length` (in mm) for clearance checks against the case.
*   **Motherboards (`motherboard`):** Need to ensure that `ramType` logic fully matches memory selection (`DDR4` vs `DDR5`), which is currently handled, but should be strictly enforced.

## 2. Frontend & UI/UX Improvements
*   **Mobile Responsiveness:** At `<= 768px`, the `.toolbar-right` uses `grid-template-columns: repeat(3, 1fr)` for 6 buttons. This works but can be visually cramped. Consider hiding some secondary actions (like Timelapse) inside a dropdown menu on mobile.
*   **Currency Rates:** `app.js` has hardcoded exchange rates (`PLN: 4.05`). This should either be fetched from an API on load, or made easier to update centrally so the prices remain accurate.
*   **Error Handling in LocalStorage:** `storage.js` and `app.js` interact with `localStorage` without `try...catch` blocks. In private/incognito modes of some browsers, this will throw an error and break the app.
*   **URL Sharing Validation:** `loadBuildFromUrl()` decodes base64 strings from the URL. Needs proper `try...catch` and schema validation so malformed URLs don't crash the application state.

## 3. SEO & Accessibility (HTML)
*   **Meta Tags:** The app features a "Share" button, but lacks Open Graph (`og:`) and Twitter Card meta tags in `index.html`. Adding these will make shared links look much better in messengers.
*   **NoScript Fallback:** Missing a `<noscript>` tag to inform users that JavaScript is required to use the configurator.
*   **Language Attribute:** The `<html lang="ru">` attribute is static. When the user changes the language via the UI, `app.js` should dynamically update this attribute to `lang="en"`, `lang="pl"`, etc. for screen readers.

## 4. Code Architecture
*   **Modularity:** The project has been refactored into a nice modular ES structure (`app.js`, `data.js`, `compatibility.js`, etc.). However, `app.js` is quite large (~1100 lines). In the future, DOM manipulation logic could be separated from State Management.
*   **Inline SVGs:** `index.html` contains a large block of inline SVG for the chassis schematic. Extracting it or generating it dynamically via JS could clean up the HTML skeleton.

## 5. UI Design Evolution ("Depth without Complexity")
To evolve the utilitarian/minimalist design without making it cluttered:
*   **Elevation & Shadows:** Introduce layered, diffuse drop-shadows (Apple-style) for floating elements (drawer, modals, hovered cards). Replace flat borders on active items with subtle spatial elevation.
*   **Glassmorphism:** Add backdrop-filter (blur) to the sticky header, drawer overlay, and modals to create a sense of depth and hierarchy over the main content.
*   **Micro-interactions:** Add spring-physics-like transitions. Elements shouldn't just change color; they should subtly scale (e.g., `transform: scale(1.02)`) on hover or click.
*   **Lighting/Gradients:** Use extremely subtle, low-opacity radial gradients on backgrounds (like a soft spotlight) instead of pure solid flat colors, giving a premium feel.
*   **Typography:** Enhance hierarchy with varying opacities and tighter letter-spacing for headings to create a sleeker, more polished look.

## 6. Functional Additions & Features
*   **Auto-Builder "Magic Wizard":** Allow users to select a budget (e.g., $1000) and target resolution (1440p), and auto-generate an optimal build.
*   **PSU Efficiency Curve:** Don't just show total wattage; visualize if the system load falls within the optimal 50-70% efficiency curve of the chosen Power Supply.
*   **Color Matching Filters:** Add 'color' properties to parts (White/Black/Silver) and allow filtering in the drawer so users can easily assemble a pure white or stealth black build.
*   **Undo/Redo Stack:** Implement a basic history state for accidental part removals or swaps.
*   **Thermal/Airflow Estimate:** Basic calculation showing whether the chosen case and cooling solution provide positive, neutral, or negative air pressure, and a rough thermal rating.
*   **Advanced Drawer Filters:** Filtering by brand, socket type, form factor, or DDR standard directly in the parts drawer.

**Note to future agents:** Do NOT implement these changes without explicit user approval. Treat this as a backlog.
