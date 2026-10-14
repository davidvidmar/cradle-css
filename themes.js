/* Optional palette loader: fetches only the selected theme-<name>.css, next to this script. */
(() => {
  const base = document.currentScript ? new URL('.', document.currentScript.src).href : '';
  const known = /^[a-z0-9-]+$/;
  let latest = 0;
  // Keep only the given palette link (or none); earlier or abandoned links are dropped.
  const prune = keep => document.querySelectorAll('link[data-cr-theme]').forEach(link => { if (link !== keep) link.remove(); });
  function select(skin) {
    const root = document.documentElement;
    const request = ++latest;
    if (!skin || skin === 'cradle' || !known.test(skin)) { root.dataset.skin = 'cradle'; prune(null); return Promise.resolve(); }
    const current = document.querySelector(`link[data-cr-theme="${skin}"][data-loaded]`);
    if (current) { root.dataset.skin = skin; prune(current); return Promise.resolve(); }
    return new Promise(resolve => {
      const link = document.createElement('link'); link.rel = 'stylesheet'; link.dataset.crTheme = skin;
      link.href = `${base}theme-${skin}.css`;
      // Switch the attribute only once the new file applies, then drop the previous one: no unstyled flash.
      // A newer selection wins; a missing file (e.g. a removed palette) falls back to the built-in default.
      link.onload = () => {
        link.dataset.loaded = '';
        if (request === latest) { root.dataset.skin = skin; prune(link); } else link.remove();
        resolve();
      };
      link.onerror = () => {
        link.remove();
        if (request === latest) { root.dataset.skin = 'cradle'; prune(null); }
        resolve();
      };
      document.head.append(link);
    });
  }
  window.CradleThemes = { select };
  select(document.documentElement.dataset.skin);
})();
