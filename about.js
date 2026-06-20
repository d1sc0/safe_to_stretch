/* ==========================================================================
   SAFE TO STRETCH - ABOUT PAGE JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Load and apply YAML Configuration
  function loadConfig() {
    fetch('config.yml', { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(yamlText => {
        const config = jsyaml.load(yamlText);
        if (config) {
          applyConfig(config);
        }
      })
      .catch(err => {
        console.warn('Failed to load config.yml, using default text fallback:', err);
      });
  }

  function applyConfig(config) {
    // Brand Identity Header
    if (config.brand) {
      const brandTitle = document.getElementById('brand-title');
      const brandTagline = document.getElementById('brand-tagline');
      
      if (brandTitle && config.brand.title) brandTitle.textContent = config.brand.title;
      if (brandTagline && config.brand.tagline) brandTagline.textContent = config.brand.tagline;
    }

    if (config.links) {
      const btnBackDashboard = document.getElementById('btn-back-dashboard');
      const linkBackDashboard = document.getElementById('link-back-dashboard');
      const linkFeedback = document.getElementById('link-to-feedback');
      const btnToggleA11y = document.getElementById('btn-toggle-a11y');
      
      if (btnBackDashboard && config.links.back_button) btnBackDashboard.textContent = config.links.back_button;
      if (linkBackDashboard && config.links.back_to_dashboard) linkBackDashboard.textContent = config.links.back_to_dashboard;
      if (linkFeedback && config.links.feedback) linkFeedback.textContent = config.links.feedback;
      if (btnToggleA11y && config.links.a11y_settings) btnToggleA11y.textContent = config.links.a11y_settings;
    }
  }

  // Execute config load
  loadConfig();

  // ------------------------------------------------------------------------
  // 1. Accessibility State & Controls
  // ------------------------------------------------------------------------
  let textScale = 1.0;
  const maxScale = 1.75;
  const minScale = 0.75;
  
  const root = document.documentElement;
  const btnSizeDec = document.getElementById('btn-size-dec');
  const btnSizeReset = document.getElementById('btn-size-reset');
  const btnSizeInc = document.getElementById('btn-size-inc');
  
  const btnThemeDark = document.getElementById('btn-theme-dark');
  const btnThemeLight = document.getElementById('btn-theme-light');
  const btnThemeHc = document.getElementById('btn-theme-hc');

  // Load A11y settings from localStorage
  const savedScale = localStorage.getItem('s2s-text-scale');
  if (savedScale) {
    textScale = parseFloat(savedScale);
    updateTextScale();
  }

  const savedTheme = localStorage.getItem('s2s-theme') || 'light';
  applyTheme(savedTheme);

  // Text Sizing Listeners
  btnSizeInc.addEventListener('click', () => {
    if (textScale < maxScale) {
      textScale += 0.125;
      updateTextScale();
    }
  });

  btnSizeDec.addEventListener('click', () => {
    if (textScale > minScale) {
      textScale -= 0.125;
      updateTextScale();
    }
  });

  btnSizeReset.addEventListener('click', () => {
    textScale = 1.0;
    updateTextScale();
  });

  function updateTextScale() {
    root.style.setProperty('--text-base-ratio', textScale);
    localStorage.setItem('s2s-text-scale', textScale);
    announceToScreenReader(`Text size adjusted to ${Math.round(textScale * 100)}%`);
  }

  // Theme Selectors
  btnThemeDark.addEventListener('click', () => applyTheme('dark'));
  btnThemeLight.addEventListener('click', () => applyTheme('light'));
  btnThemeHc.addEventListener('click', () => applyTheme('hc'));

  function applyTheme(theme) {
    document.body.classList.remove('theme-dark', 'theme-light', 'theme-hc');
    btnThemeDark.classList.remove('active');
    btnThemeLight.classList.remove('active');
    btnThemeHc.classList.remove('active');

    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
      btnThemeDark.classList.add('active');
    } else if (theme === 'light') {
      document.body.classList.add('theme-light');
      btnThemeLight.classList.add('active');
    } else if (theme === 'hc') {
      document.body.classList.add('theme-hc');
      btnThemeHc.classList.add('active');
    }
    localStorage.setItem('s2s-theme', theme);
    announceToScreenReader(`Theme changed to ${theme}`);
  }

  function announceToScreenReader(message) {
    let announcer = document.getElementById('a11y-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'a11y-announcer';
      announcer.setAttribute('aria-live', 'assertive');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.padding = '0';
      announcer.style.margin = '-1px';
      announcer.style.overflow = 'hidden';
      announcer.style.clip = 'rect(0, 0, 0, 0)';
      announcer.style.border = '0';
      document.body.appendChild(announcer);
    }
    announcer.textContent = message;
  }

  // ------------------------------------------------------------------------
  // 1b. Toggle A11y Panel in Footer
  // ------------------------------------------------------------------------
  const btnToggleA11y = document.getElementById('btn-toggle-a11y');
  const a11yControlsPanel = document.getElementById('a11y-controls-panel');

  btnToggleA11y?.addEventListener('click', () => {
    const isExpanded = btnToggleA11y.getAttribute('aria-expanded') === 'true';
    btnToggleA11y.setAttribute('aria-expanded', !isExpanded);
    a11yControlsPanel.hidden = isExpanded;

    if (!isExpanded) {
      setTimeout(() => {
        a11yControlsPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }

    announceToScreenReader(`Accessibility settings ${!isExpanded ? 'opened' : 'closed'}`);
  });

  // ------------------------------------------------------------------------
  // 2. Fetch and Render about.md Content
  // ------------------------------------------------------------------------
  function loadAboutContent() {
    const container = document.getElementById('about-markdown-container');
    if (!container || typeof marked === 'undefined') return;

    fetch('./content/about.md', { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(markdown => {
        marked.setOptions({ gfm: true, breaks: true, headerIds: true, mangle: false });
        container.innerHTML = marked.parse(markdown);
      })
      .catch(err => {
        console.error('Failed to load about.md:', err);
        container.innerHTML = `
          <div class="card" style="border-color: var(--accent-coral); background-color: var(--accent-coral-glow); padding: 16px;">
            <h4>Error loading about content</h4>
            <p>Could not fetch <code>./content/about.md</code>.</p>
          </div>
        `;
      });
  }

  loadAboutContent();

});
