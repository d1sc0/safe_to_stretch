# Safe to Stretch - Workplace Power Dynamics Toolkit 🧘

**Safe to Stretch** is a lightweight, responsive, mobile-first static web application designed to help facilitators and learning designers proactively flatten workplace power dynamics before, during, and after training sessions. 

Using educational frameworks, Universal Design for Learning (UDL) principles, and social safety structures, the toolkit provides prompts and actionable tools to dismantle rank-based communication barriers.

---

## 🎯 Site Purpose & Features

*   **Phase-Based Tabbed Dashboard**: Facilitators can step through the three core phases of session design:
    *   🛑 **Before the Session**: Planning parameters, cohort reporting audit, content risk analysis, and facilitation alignment.
    *   📢 **During the Session**: Real-time flat status co-creation, Community Compact, silent brainstorm timers, and airtime metrics.
    *   🔄 **After the Session**: Blueprint measurements, power splits, risk audit evaluations, and anxiety care.
*   **📚 Dynamic Underpinning Theories & Resources**: Access cognitive safety frameworks, David Rock's SCARF model context, and Paulo Freire's critical pedagogy details.
*   **💡 Dedicated Suggestion & Feedback Portal**: A separate form allows facilitators to draft general remarks, propose content additions, or report accessibility feedback, submitting suggestions securely and asynchronously directly to your inbox via a zero-code API, complete with bot honeypot spam protection.
*   **♿ Adaptive Accessibility Controls**: A collapsible settings panel in the footer supports:
    *   **Text Sizing**: Dynamically scale font layouts from `0.75x` up to `1.75x` of base size.
    *   **Visual Themes**: Toggle between **Sleek Light Mode (Default)**, **Cyber Slate Dark Mode**, and a WCAG-compliant **High Contrast Mode** with enhanced focus borders.

---

## 🏗️ Architecture & File Structure

The application is built as a **Single Page Application (SPA)** with zero build tools or dependencies, allowing it to be hosted easily on static environments (e.g., GitHub Pages).

```
├── index.html                   # Main dashboard UI shell with tabs and global links
├── feedback.html                # Separate page for feedback submissions
├── config.yml                   # Central YAML configuration file for navbar, links, and footer text
├── app.js                       # Primary SPA engine (markdown parsing, tab router, state config)
├── feedback.js                  # Javascript script for the feedback Web3Forms API submission handler
├── style.css                    # Unified CSS layout, design tokens, and theme settings
├── content/                     # Core Markdown content source files
│   ├── home.md                  # Homepage overview markdown
│   ├── before.md                # Phase 1 modules markdown
│   ├── during.md                # Phase 2 modules markdown
│   ├── after.md                 # Phase 3 modules markdown
│   └── resources.md             # Theoretical resources & bibliography markdown
└── assets/                      # Media directory (e.g., hero.jpg header illustration)
```

### Global YAML Configuration
The text contents for key navigation tabs, global links, back buttons, and footer descriptions are entirely configurable inside [config.yml](file:///Users/d1sc0/Projects/safe_to_stretch/config.yml). 

At runtime, `js-yaml` parses this file, and the Javascript engines dynamically update elements across the site. If the configuration fetch fails or is blockaged, the engine falls back to standard text values hardcoded inside the HTML frames, ensuring zero downtime.

### Dynamic Accordion Generator
To keep the toolkit content readable and easy for anyone to edit without rewriting HTML:
1. Content is written in standard Markdown files within the `/content` folder.
2. At runtime, `marked.js` fetches and converts the markdown to HTML.
3. The custom JS engine in `app.js` captures all level-3 subheadings (`<h3>`) and automatically nests their sibling contents inside an interactive, keyboard-accessible accordion component.

---

## 🛠️ Local Development & Running

Because the engine dynamically fetches local Markdown files using AJAX requests (`fetch()`), standard browsers block runtime loads when opening `index.html` directly as a local file (`file:///`) due to CORS policies.

To run the application locally, run a lightweight static web server in the project directory:

### Run with Python (Mac/Linux/Windows):
```bash
python3 -m http.server 8000
```
Open **`http://localhost:8000`** in your browser.

### Run with Node.js:
```bash
npx http-server -p 8000
```
Open **`http://localhost:8000`** in your browser.

---

## 🌐 Deployment to GitHub Pages

Since the app consists of flat static files, deploying takes seconds:

1. Initialize a git repository and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initialize Safe to Stretch Web App"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/safe-to-stretch.git
   git push -u origin main
   ```
2. Navigate to your repository **Settings** > **Pages**.
3. Under **Build and deployment**, set the Source to **Deploy from a branch**.
4. Select the **main** branch and root `/` directory, then click **Save**.
5. The site is live at: **[https://d1sc0.github.io/safe_to_stretch/](https://d1sc0.github.io/safe_to_stretch/)**
