# Project Plan: Safe to Stretch Toolkit Web App

**Live Site**: [https://d1sc0.github.io/safe_to_stretch/](https://d1sc0.github.io/safe_to_stretch/)

The **Safe to Stretch** toolkit is a lightweight, responsive, mobile-first static web application designed to help facilitators and learning designers proactively flatten workplace power dynamics before, during, and after training sessions. 

---

## 1. Core Architecture

The toolkit runs entirely client-side, making it easy to host on static platforms like GitHub Pages.

*   **`index.html`**: Main frame containing the brand header, home panel hero banner, navigation tabs, active tab panels, and the global footer.
*   **`style.css`**: Unified design system defining CSS custom variables for themes, text scaling ratios, responsive cards, dynamic accordions, and footer layout links.
*   **`config.yml`**: Central YAML file configuring UI text strings (tab navigation, links, back buttons, footer descriptions, homepage cards, and accessibility settings button labels).
*   **`app.js`**: Core engine loading tab selections, dynamic markdown fetches, markdown-to-accordion DOM generation, local storage scales, page layouts, and client-side YAML configuration mapping.
*   **`feedback.html` / `feedback.js`**: Standalone feedback page integrating the contact mailto form, visual themes, and local storage size scaling.
*   **`content/`**: Folder containing modular Markdown contents (`home.md`, `before.md`, `during.md`, `after.md`, `resources.md`).

---

## 2. Dynamic Accordions & Content Generation

To keep content maintainable:
*   `marked.js` compiles Markdown into standard HTML.
*   `app.js` captures `<h3>` subheadings at load-time and wraps them along with their sibling nodes inside collapsible, keyboard-accessible accordion panels.
*   Introductory content elements (titles, subtexts) residing before the first `<h3>` trigger are rendered directly above the accordions.

---

## 3. Dynamic YAML Configuration & Merged Footer Links

To support easy labels customization without editing project source code:
*   A browser-compatible library `js-yaml` loads via CDN.
*   Upon launch, the script retrieves `config.yml` and updates all configured headers, links, footer paragraphs, and Home page action cards inside the DOM.
*   **Unified Global Footer Links**: To prevent screen clutter, the *Underpinning Theories & Resources* link, the *Suggest Additions & Feedback Form* link, and the *Accessibility Settings* toggle button are merged into a single horizontal links row (`.global-text-links-container`) inside the footer, visible on all pages. 
*   **Inline Settings Toggle**: Clicking the inline "♿ Accessibility Settings" text link smoothly expands the text sizing and theme contrast controls inside a collapsible card directly underneath the navigation link row.
*   **Asynchronous Web3Forms Submission**: Configured a `feedback` options block in `config.yml` to specify a Web3Forms public Access Key (`access_key: "YOUR_ACCESS_KEY_HERE"`). On form submit, JavaScript performs an asynchronous `POST` request to Web3Forms' API. This validates honeypots, handles loading states natively, and triggers email notifications without page redirects or exposing private tokens.
*   HTML hardcoded layout defaults serve as reliable fallback strings if config files fail to fetch.

---

## 4. Final Refactoring & Quality Optimizations

To prepare the repository for final deployment to GitHub Pages, the following code optimizations were performed:
*   **CSS Cleanup**: Removed unused classes (such as `.a11y-footer-wrapper`) to reduce visual weight and improve loading time.
*   **Focus Ring Accessibility**: Replaced standard solid outlines with highly visible custom dashed outlines (`--focus-ring: 3px dashed var(--accent-teal)`) for keyboard users across light, dark, and high contrast themes. This aligns directly with strict accessibility requirements.
*   **Form Input Enhancements**: Added discrete `:focus-visible` styles to text fields, checkboxes, select lists, and textareas, maintaining native styling for mouse users but giving keyboard focus clear visual styling.
*   **Layout & Spacing Calibration**: Resolved border collisions and removed redundant containers/margins to create a seamless aesthetic flow above the footer borders.

