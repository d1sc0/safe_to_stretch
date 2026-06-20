# Safe to Stretch Workspace Rules & Conventions

This project contains rules and conventions to help agentic coding assistants maintain, edit, or extend the **Safe to Stretch** toolkit.

---

## 🛠️ Tech Stack & Philosophy
*   **Zero Compile Step**: The application runs entirely client-side using native HTML5, vanilla CSS, and vanilla JS. Do not introduce compile systems, bundlers (Vite/Webpack), or frameworks (React/Vue/Next.js) unless explicitly requested.
*   **CDN Dependencies**: Keep dependencies minimal and load via clean CDNs (e.g., `marked.js` for markdown compilation).
*   **Static Local Development**: All files must load properly via a lightweight Python server. Always assume CORS browser restrictions are in place for dynamic fetches.

---

## 🎨 Design System & CSS Rules
*   **Theme Tokens**: All layout sizing, colors, borders, and margins must reference the custom CSS custom properties (variables) defined in `style.css` (e.g., `var(--bg-primary)`, `var(--text-primary)`, `var(--accent-teal)`).
*   **Light Theme Default**: Light Mode is the default workspace setting. When introducing new components, verify they look harmonious in both Light, Dark, and High Contrast configurations.
*   **Touch Targets**: Interactive items (buttons, tab selectors, accordion headings) must maintain a minimum target size of `44px` with sufficient padding for mobile touch areas.
*   **A11y Panel Rules**: Do not add dyslexia font-face overrides or Web Speech read-aloud buttons. Visual focus outlines must remain clear (using highly visible dotted/dashed borders on `:focus-visible`).

---

## 📂 Content Generation & Accordions
*   **Markdown Source Files**: The directory `content/` holds all guidelines. Never hardcode modular guidance text directly into `index.html`.
*   **Accordion Wrapper**: In `app.js`, headers tagged with `<h3>` are parsed and converted to interactive accordion cards. When modifying layout templates or accordion scripts, ensure headers map correctly, `aria-expanded` and `hidden` states update, and screen readers are notified of panels expanding via `announceToScreenReader()`.

---

## 💡 Navigation & Routing
*   **Tab System**: Tabs toggle visibility on corresponding panels using `hidden` and `.active` classes.
*   **Direct Routing**: When directing to panels without visual tab buttons (like the Resources section), use `switchTabDirectly(panelId)` which sets the active tab indices, toggles panel visibility, updates URL hashes, and handles focus alignment.

---

## ⚙️ Configuration & YAML Parsing
*   **YAML Config File**: All customizable UI strings (navigation tabs, text links, footer descriptions, back buttons) are declared inside [config.yml](file:///Users/d1sc0/Projects/safe_to_stretch/config.yml). Never hardcode layout text variables into the main code base.
*   **Dynamic Loader**: `js-yaml` parses the file client-side. Make sure any additional customized UI variables are mapped cleanly in `applyConfig(config)` within `app.js` and `feedback.js`, retaining valid hardcoded HTML strings as fail-safes.
