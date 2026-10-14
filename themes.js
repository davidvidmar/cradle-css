/* Optional palette loader: fetches only the selected theme-<name>.css, next to this script. */
(() => {
  const base = document.currentScript ? new URL('.', document.currentScript.src).href : '';
  const known = /^[a-z0-9-]+$/;
  const ready = Promise.resolve();
  function select(skin) {
    const root = document.documentElement;
    const old = document.getElementById('cr-theme');
    if (!skin || skin === 'cradle' || !known.test(skin)) { root.dataset.skin = 'cradle'; old?.remove(); return ready; }
    if (old?.dataset.skin === skin) { root.dataset.skin = skin; return ready; }
    return new Promise(resolve => {
      const link = document.createElement('link'); link.id = 'cr-theme'; link.rel = 'stylesheet'; link.dataset.skin = skin;
      link.href = `${base}theme-${skin}.css`;
      // Switch the attribute only once the new file applies, then drop the previous one: no unstyled flash.
      const done = () => { root.dataset.skin = skin; old?.remove(); resolve(); };
      link.onload = done; link.onerror = () => { link.remove(); resolve(); };
      old?.removeAttribute('id'); document.head.append(link);
    });
  }
  window.CradleThemes = { select };
  select(document.documentElement.dataset.skin);
})();
