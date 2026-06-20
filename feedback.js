/* ==========================================================================
   SAFE TO STRETCH - FEEDBACK PAGE JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // Default feedback settings
  let feedbackConfig = {
    access_key: 'YOUR_ACCESS_KEY_HERE'
  };

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
    if (config.links) {
      const btnBackDashboard = document.getElementById('btn-back-dashboard');
      const linkBackDashboard = document.getElementById('link-back-dashboard');
      const linkResources = document.getElementById('link-to-resources');
      const btnToggleA11y = document.getElementById('btn-toggle-a11y');
      
      if (btnBackDashboard && config.links.back_button) btnBackDashboard.textContent = config.links.back_button;
      if (linkBackDashboard && config.links.back_to_dashboard) linkBackDashboard.textContent = config.links.back_to_dashboard;
      if (linkResources && config.links.resources) linkResources.textContent = config.links.resources;
      if (btnToggleA11y && config.links.a11y_settings) btnToggleA11y.textContent = config.links.a11y_settings;
    }

    // Footer
    if (config.footer) {
      const footerCredits = document.getElementById('footer-credits');
      const footerSubtext = document.getElementById('footer-subtext');
      
      if (footerCredits && config.footer.credits) footerCredits.innerHTML = config.footer.credits;
      if (footerSubtext && config.footer.subtext) footerSubtext.textContent = config.footer.subtext;
    }

    // Override target Web3Forms access key dynamically from config
    if (config.feedback && config.feedback.access_key) {
      feedbackConfig.access_key = config.feedback.access_key;
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

  const savedTheme = localStorage.getItem('s2s-theme') || 'light'; // Default is light now
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
  // 3. Feedback Form AJAX Submission via Web3Forms API
  // ------------------------------------------------------------------------
  const formFeedback = document.getElementById('form-feedback');
  const feedbackSuccessMsg = document.getElementById('feedback-success-msg');
  const btnSubmitFeedback = document.getElementById('btn-submit-feedback');

  formFeedback?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot spam check
    const botcheck = document.getElementById('botcheck');
    if (botcheck && botcheck.checked) {
      console.warn('Botcheck triggered. Submission aborted.');
      return;
    }

    const name = document.getElementById('feedback-name').value.trim();
    const email = document.getElementById('feedback-email').value.trim();
    const type = document.getElementById('feedback-type').value;
    const message = document.getElementById('feedback-message').value.trim();

    const subject = `[Safe to Stretch Feedback] - ${type} from ${name}`;

    // Disable submit button and show loading state
    if (btnSubmitFeedback) {
      btnSubmitFeedback.disabled = true;
      btnSubmitFeedback.textContent = '⏱️ Sending Suggestion...';
    }

    // Prepare JSON payload
    const payload = {
      access_key: feedbackConfig.access_key,
      name: name,
      email: email,
      subject: subject,
      message: message,
      from_name: 'Safe to Stretch Facilitator Toolkit'
    };

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(async (res) => {
      let json = {};
      try {
        json = await res.json();
      } catch (err) {}
      
      if (res.status === 200 && json.success) {
        // Show success card and hide form
        formFeedback.style.display = 'none';
        if (feedbackSuccessMsg) {
          feedbackSuccessMsg.hidden = false;
        }
        announceToScreenReader('Feedback successfully submitted. Thank you!');
      } else {
        throw new Error(json.message || 'Server error occurred during submission.');
      }
    })
    .catch((err) => {
      console.error('Submission failed:', err);
      alert(`Oops! Something went wrong: ${err.message || 'Could not submit suggestion.'}\n\nPlease check your internet connection or verify your config.yml Web3Forms Access Key.`);
      
      // Re-enable button
      if (btnSubmitFeedback) {
        btnSubmitFeedback.disabled = false;
        btnSubmitFeedback.textContent = '✉️ Submit Feedback';
      }
    });
  });

});
