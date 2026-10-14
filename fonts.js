/* Optional font selection helper. Fonts are self-hosted by fonts.css; no network loader is needed. */
(() => {
  const select = name => { document.documentElement.dataset.font = name; };
  // Kept for compatibility with earlier CDN-based releases: font files load on demand from fonts.css.
  window.CradleFonts = { load() {}, select };
})();
