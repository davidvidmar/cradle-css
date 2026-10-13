/* Optional CDN font loading shared by applications and the gallery. */
(() => {
  const families = { inter: 'Inter:wght@100..900', mono: 'JetBrains+Mono:ital,wght@0,100..800;1,100..800' };
  function load(name) {
    if (!families[name] || document.getElementById(`cr-font-${name}`)) return;
    if (!document.getElementById('cr-font-connect')) {
      for (const [host, id] of [['fonts.googleapis.com', 'cr-font-connect'], ['fonts.gstatic.com', 'cr-font-files']]) {
        const link = document.createElement('link'); link.id = id; link.rel = 'preconnect'; link.href = `https://${host}`;
        if (host.includes('gstatic')) link.crossOrigin = 'anonymous';
        document.head.append(link);
      }
    }
    const link = document.createElement('link'); link.id = `cr-font-${name}`; link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${families[name]}&display=swap`;
    document.head.append(link);
  }
  function select(name) {
    document.documentElement.dataset.font = name;
    if (name === 'inter') load('inter');
    if (name === 'native-mono') load('mono');
  }
  window.CradleFonts = { load, select };
  // Honour an explicit interface choice; otherwise load the default Inter family.
  const initial = document.documentElement.dataset.font || 'inter';
  if (initial === 'inter') load('inter');
  if (initial === 'native-mono') load('mono');
})();
