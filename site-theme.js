(function(){
  document.addEventListener('DOMContentLoaded', function(){
    // Mobile nav toggle
    const menuToggle = document.getElementById('menu-toggle');
    if(menuToggle){
      menuToggle.addEventListener('click', function(e){
        const links = document.querySelector('.nav-links');
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', (!expanded).toString());
        links && links.classList.toggle('open');
      });
    }

    // Close open nav when resizing to desktop
    window.addEventListener('resize', function(){
      const links = document.querySelector('.nav-links');
      const menuToggle = document.getElementById('menu-toggle');
      if(window.innerWidth > 720 && links && links.classList.contains('open')){
        links.classList.remove('open');
      }
      if(menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    });

    // Close nav when clicking outside (on small screens)
    document.addEventListener('click', function(e){
      const links = document.querySelector('.nav-links');
      const menuToggle = document.getElementById('menu-toggle');
      if(!menuToggle || !links) return;
      if(links.classList.contains('open') && !links.contains(e.target) && e.target !== menuToggle){
        links.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

  });
})();

/* ---------- Build accessible custom selects (keeps native select for form & compatibility) ---------- */
(function () {
  const SELECT_SELECTOR = 'select.filter-item';

  function createCustomSelect(select) {
    if (select.dataset.customized === 'true') return;
    // wrap and hide native select
    const wrapper = document.createElement('div');
    wrapper.className = 'select-wrapper';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);
    select.classList.add('native-hidden');
    select.dataset.customized = 'true';

    // create custom shell
    const cs = document.createElement('div');
    cs.className = 'custom-select';
    cs.setAttribute('role', 'combobox');
    cs.setAttribute('aria-haspopup', 'listbox');
    cs.setAttribute('tabindex', 0);

    const trigger = document.createElement('div');
    trigger.className = 'cs-trigger';
    trigger.setAttribute('tabindex', 0);

    const label = document.createElement('div');
    label.className = 'cs-label cs-placeholder';
    label.textContent = select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : select.getAttribute('placeholder') || select.id;

    const caret = document.createElement('div');
    caret.className = 'cs-caret';
    caret.innerHTML = '&#9662;';

    trigger.appendChild(label);
    trigger.appendChild(caret);

    const opts = document.createElement('div');
    opts.className = 'cs-options';
    opts.setAttribute('role', 'listbox');
    opts.setAttribute('tabindex', -1);

    // populate options (skipping disabled placeholder-only options)
    function populateOptions() {
      opts.innerHTML = '';
      const options = Array.from(select.options)
      if (options.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'cs-empty';
        empty.textContent = 'No options';
        opts.appendChild(empty);
        return;
      }
      options.forEach((o, idx) => {
        const item = document.createElement('div');
        item.className = 'cs-option';
        item.setAttribute('role', 'option');
        item.dataset.value = o.value;
        item.innerText = o.text;
        if (o.disabled) item.style.opacity = 0.6;
        if (o.selected) item.setAttribute('aria-selected', 'true');
        item.addEventListener('click', (ev) => {
          select.value = o.value;
          // trigger change on native select so existing handlers run
          select.dispatchEvent(new Event('change', { bubbles: true }));
          label.textContent = o.text;
          closeAll();
          trigger.focus();
        });
        item.addEventListener('mouseenter', () => {
          setFocused(item);
        });
        opts.appendChild(item);
      });
    }

    cs.appendChild(trigger);
    cs.appendChild(opts);
    wrapper.appendChild(cs);

    // keyboard navigation
    let focusedIndex = -1;
    function setFocused(el) {
      const all = opts.querySelectorAll('.cs-option');
      all.forEach(a => a.classList.remove('focused'));
      if (!el) { focusedIndex = -1; return; }
      el.classList.add('focused');
      focusedIndex = Array.from(all).indexOf(el);
      // ensure visible
      el.scrollIntoView({ block: 'nearest' });
    }

    function open() {
      cs.classList.add('open');
      populateOptions();
      document.addEventListener('click', outsideClose);
    }
    function closeAll() { close(); }
    function close() {
      cs.classList.remove('open');
      focusedIndex = -1;
      setFocused(null);
      document.removeEventListener('click', outsideClose);
    }
    function outsideClose(e) {
      if (!cs.contains(e.target)) close();
    }

    // clicking trigger opens options
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (cs.classList.contains('open')) close(); else open();
    });

    // keyboard events on trigger
    trigger.addEventListener('keydown', (e) => {
      const items = opts.querySelectorAll('.cs-option');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!cs.classList.contains('open')) { open(); return; }
        focusedIndex = Math.min(items.length - 1, (focusedIndex === -1 ? 0 : focusedIndex + 1));
        setFocused(items[focusedIndex]);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!cs.classList.contains('open')) { open(); return; }
        focusedIndex = Math.max(0, (focusedIndex === -1 ? items.length - 1 : focusedIndex - 1));
        setFocused(items[focusedIndex]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!cs.classList.contains('open')) { open(); } else {
          const items = opts.querySelectorAll('.cs-option');
          if (items[focusedIndex]) items[focusedIndex].click();
        }
      } else if (e.key === 'Escape') {
        close();
      }
    });

    // update label when native select changes (for external updates)
    const mo = new MutationObserver(() => {
      const opt = select.options[select.selectedIndex];
      if (opt) label.textContent = opt.text;
      populateOptions();
    });
    mo.observe(select, { childList: true, subtree: true, attributes: true, characterData: true });

    // initial populate
    populateOptions();
  }

  function setFocused(el) {
    if (!el) return;
    const wrapper = el.closest('.cs-options');
    if (!wrapper) return;
    wrapper.querySelectorAll('.cs-option').forEach(a => a.classList.remove('focused'));
    el.classList.add('focused');
  }

  function closeAll() {
    document.querySelectorAll('.custom-select.open').forEach(cs => cs.classList.remove('open'));
  }

  // build for existing and future selects
  function buildAll() {
    document.querySelectorAll(SELECT_SELECTOR).forEach(s => createCustomSelect(s));
  }

  // observe DOM for newly added selects (since options are populated dynamically)
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes && m.addedNodes.forEach(node => {
        if (node.nodeType === 1 && node.matches && node.matches(SELECT_SELECTOR)) createCustomSelect(node);
        else if (node.querySelectorAll) {
          node.querySelectorAll && node.querySelectorAll(SELECT_SELECTOR).forEach(s => createCustomSelect(s));
        }
      });
      // if options changed on an existing select, MutationObserver inside createCustomSelect updates it
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // close on outside click and ESC at document level
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-select')) closeAll();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

  // run on DOM ready (and again after a short delay to catch dynamic population)
  document.addEventListener('DOMContentLoaded', () => {
    buildAll();
    setTimeout(buildAll, 250); // catch late-populated options
  });

  // also expose for manual call if needed
  window.rebuildCustomFilterSelects = buildAll;
})();
