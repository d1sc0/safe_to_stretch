/* ==========================================================================
   SAFE TO STRETCH - JS ENGINE (SIMPLIFIED & REFACTORED)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Load and apply YAML Configuration
  function loadConfig() {
    fetch('config.yml')
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
    // Navigation Tabs
    if (config.navigation) {
      const tabHome = document.getElementById('tab-home');
      const tabBefore = document.getElementById('tab-before');
      const tabDuring = document.getElementById('tab-during');
      const tabAfter = document.getElementById('tab-after');
      
      if (tabHome && config.navigation.home) tabHome.textContent = config.navigation.home;
      if (tabBefore && config.navigation.before) tabBefore.textContent = config.navigation.before;
      if (tabDuring && config.navigation.during) tabDuring.textContent = config.navigation.during;
      if (tabAfter && config.navigation.after) tabAfter.textContent = config.navigation.after;
    }

    // Links
    if (config.links) {
      const linkResources = document.getElementById('link-to-resources');
      const linkFeedback = document.getElementById('link-to-feedback');
      const btnToggleA11y = document.getElementById('btn-toggle-a11y');
      
      if (linkResources && config.links.resources) linkResources.textContent = config.links.resources;
      if (linkFeedback && config.links.feedback) linkFeedback.textContent = config.links.feedback;
      if (btnToggleA11y && config.links.a11y_settings) btnToggleA11y.textContent = config.links.a11y_settings;
    }

    // Footer
    if (config.footer) {
      const footerCredits = document.getElementById('footer-credits');
      const footerSubtext = document.getElementById('footer-subtext');
      
      if (footerCredits && config.footer.credits) footerCredits.innerHTML = config.footer.credits;
      if (footerSubtext && config.footer.subtext) footerSubtext.textContent = config.footer.subtext;
    }

    // Action Cards on Homepage
    if (config.cards) {
      const phases = ['before', 'during', 'after'];
      phases.forEach(phase => {
        const cardData = config.cards[phase];
        if (cardData) {
          const badge = document.getElementById(`card-${phase}-badge`);
          const title = document.getElementById(`card-${phase}-title`);
          const desc = document.getElementById(`card-${phase}-desc`);
          const link = document.getElementById(`card-${phase}-link`);
          const cardBtn = document.getElementById(`card-${phase}`);
          
          if (badge && cardData.badge) badge.textContent = cardData.badge;
          if (title && cardData.title) title.textContent = cardData.title;
          if (desc && cardData.description) desc.textContent = cardData.description;
          
          if (link) {
            const exploreText = config.cards.explore_text || 'Explore Guidelines';
            link.innerHTML = `${exploreText} &rarr;`;
          }
          
          if (cardBtn) {
            const cleanTitle = (cardData.title || '').replace(/\p{Extended_Pictographic}/gu, '').trim();
            const exploreText = config.cards.explore_text || 'Explore Guidelines';
            cardBtn.setAttribute('aria-label', `${exploreText} ${cleanTitle} guidelines`);
          }
        }
      });
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

  // Screen Reader Announcer helper
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
  // 3. Accessible Tab Navigation & Routing
  // ------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-nav .tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach((tab, index) => {
    tab.addEventListener('click', () => switchTab(tab));

    tab.addEventListener('keydown', (e) => {
      let targetTab = null;
      if (e.key === 'ArrowRight') {
        targetTab = tabButtons[(index + 1) % tabButtons.length];
      } else if (e.key === 'ArrowLeft') {
        targetTab = tabButtons[(index - 1 + tabButtons.length) % tabButtons.length];
      } else if (e.key === 'Home') {
        targetTab = tabButtons[0];
      } else if (e.key === 'End') {
        targetTab = tabButtons[tabButtons.length - 1];
      }

      if (targetTab) {
        targetTab.focus();
        switchTab(targetTab);
        e.preventDefault();
      }
    });
  });

  function switchTab(activeTab) {
    const panelId = activeTab.getAttribute('aria-controls');
    switchTabDirectly(panelId);
  }

  function switchTabDirectly(panelId) {
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    });

    tabPanels.forEach(panel => {
      panel.classList.remove('active');
      panel.hidden = true;
    });

    const matchingBtn = document.querySelector(`.tab-btn[aria-controls="${panelId}"]`);
    if (matchingBtn) {
      matchingBtn.classList.add('active');
      matchingBtn.setAttribute('aria-selected', 'true');
      matchingBtn.setAttribute('tabindex', '0');
    }

    const activePanel = document.getElementById(panelId);
    if (activePanel) {
      activePanel.classList.add('active');
      activePanel.hidden = false;
      
      // Auto-focus active panel header or fallback to panel itself
      const header = activePanel.querySelector('h2');
      if (header) {
        header.setAttribute('tabindex', '-1');
        header.focus();
      } else {
        activePanel.focus();
      }
    }

    // Handle hash state updates for all panels dynamically
    const panelHashMap = {
      'panel-home': '',
      'panel-before': '#before',
      'panel-during': '#during',
      'panel-after': '#after',
      'panel-resources': '#resources'
    };
    const targetHash = panelHashMap[panelId] !== undefined ? panelHashMap[panelId] : '';
    
    if (window.location.hash !== targetHash) {
      if (targetHash === '') {
        // Clear hash cleanly from URL bar without adding duplicate history stack
        history.pushState(null, null, window.location.pathname + window.location.search);
      } else {
        history.pushState(null, null, targetHash);
      }
    }
  }

  // Set up click-card links on Home screen to switch tabs
  document.querySelectorAll('.clickable-card').forEach(card => {
    card.addEventListener('click', () => {
      const targetTabId = card.getAttribute('data-target');
      const targetTab = document.getElementById(targetTabId);
      if (targetTab) {
        switchTab(targetTab);
        window.scrollTo({ top: targetTab.offsetTop - 50, behavior: 'smooth' });
      }
    });
  });

  // Handle URL hashes for routing
  function handleHashRoute() {
    const hash = window.location.hash;
    if (hash === '#resources') {
      switchTabDirectly('panel-resources');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (hash === '#before') {
      switchTabDirectly('panel-before');
    } else if (hash === '#during') {
      switchTabDirectly('panel-during');
    } else if (hash === '#after') {
      switchTabDirectly('panel-after');
    } else {
      // Default fallback (e.g. empty hash or #home)
      switchTabDirectly('panel-home');
    }
  }

  window.addEventListener('hashchange', handleHashRoute);

  // ------------------------------------------------------------------------
  // 4. Dynamic Markdown loading & Accordion renderer
  // ------------------------------------------------------------------------
  const pageFiles = [
    { file: './content/home.md', containerId: 'home-markdown-container', isAccordion: false },
    { file: './content/before.md', containerId: 'before-markdown-container', isAccordion: true },
    { file: './content/during.md', containerId: 'during-markdown-container', isAccordion: true },
    { file: './content/after.md', containerId: 'after-markdown-container', isAccordion: true },
    { file: './content/resources.md', containerId: 'resources-markdown-container', isAccordion: true }
  ];

  pageFiles.forEach(page => {
    fetch(page.file)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then(markdown => {
        if (page.isAccordion) {
          renderAccordionMarkdown(markdown, page.containerId);
        } else {
          renderStandardMarkdown(markdown, page.containerId);
        }
      })
      .catch(err => {
        console.error(`Failed to fetch ${page.file}:`, err);
        document.getElementById(page.containerId).innerHTML = `
          <div class="card" style="border-color: var(--accent-coral); background-color: var(--accent-coral-glow); padding: 16px;">
            <h4>Error loading page content</h4>
            <p>Could not fetch <code>${page.file}</code>.</p>
          </div>
        `;
      });
  });

  function renderStandardMarkdown(markdown, containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof marked === 'undefined') return;
    
    marked.setOptions({ gfm: true, breaks: true, headerIds: true, mangle: false });
    container.innerHTML = marked.parse(markdown);
  }

  function renderAccordionMarkdown(markdown, containerId) {
    const container = document.getElementById(containerId);
    if (!container || typeof marked === 'undefined') return;
    
    marked.setOptions({ gfm: true, breaks: true, headerIds: true, mangle: false });
    const rawHtml = marked.parse(markdown);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;
    
    container.innerHTML = '';
    
    const children = Array.from(tempDiv.children);
    let currentContent = null;
    let index = 0;
    
    children.forEach(child => {
      if (child.tagName === 'H3') {
        index++;
        const item = document.createElement('div');
        item.className = 'accordion-item';
        
        const trigger = document.createElement('button');
        trigger.className = 'accordion-trigger';
        trigger.setAttribute('aria-expanded', 'false');
        
        const contentId = `${containerId}-acc-${index}`;
        trigger.setAttribute('aria-controls', contentId);
        
        const headingText = child.textContent;
        trigger.innerHTML = `
          <span>${escapeHTML(headingText)}</span>
          <span class="accordion-icon" aria-hidden="true">▶</span>
        `;
        
        item.appendChild(trigger);
        
        const content = document.createElement('div');
        content.id = contentId;
        content.className = 'accordion-content';
        content.hidden = true;
        
        item.appendChild(content);
        container.appendChild(item);
        
        currentContent = content;
        
        trigger.addEventListener('click', () => {
          const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
          trigger.setAttribute('aria-expanded', !isExpanded);
          content.hidden = isExpanded;
          
          if (!isExpanded) {
            announceToScreenReader(`${headingText} expanded.`);
          }
        });
      } else if (child.tagName === 'H1' || child.tagName === 'H2') {
        container.appendChild(child.cloneNode(true));
      } else {
        if (currentContent) {
          currentContent.appendChild(child.cloneNode(true));
        } else {
          container.appendChild(child.cloneNode(true));
        }
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. Resources Link Routing (Global text link)
  // ------------------------------------------------------------------------
  document.getElementById('link-to-resources')?.addEventListener('click', (e) => {
    e.preventDefault();
    switchTabDirectly('panel-resources');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Execute hash router on load
  handleHashRoute();

  // Global utilities
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

});
