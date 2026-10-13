/* Optional Cradle CSS table sorting. Native buttons support keyboard activation. */
(() => {
  const initialized = new WeakSet();
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  // Also usable by applications that redraw tables from typed records.
  function order(items, key, direction = 'ascending', language) {
    const text = language ? new Intl.Collator(language, { numeric: true, sensitivity: 'base' }) : collator;
    const missing = value => value == null || value === '' || (typeof value === 'number' && !Number.isFinite(value));
    return items.map((item, index) => ({ item, index, value: key(item, index) })).sort((a, b) => {
      if (missing(a.value) !== missing(b.value)) return missing(a.value) ? 1 : -1;
      if (missing(a.value)) return a.index - b.index;
      const comparison = typeof a.value === 'number' && typeof b.value === 'number'
        ? a.value - b.value : text.compare(String(a.value), String(b.value));
      return (direction === 'descending' ? -comparison : comparison) || a.index - b.index;
    }).map(entry => entry.item);
  }

  const interactive = 'a,button,input,select,textarea,summary,[contenteditable],[tabindex],[role="button"],[role="link"]';
  const numeric = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
  const isoDate = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?$/;
  const rawValue = cell => (cell?.dataset.sortValue ?? cell?.textContent ?? '').trim();
  function inferType(rows, column) {
    const values = rows.map(row => rawValue(row.cells[column])).filter(Boolean);
    if (values.length && values.every(value => numeric.test(value) && Number.isFinite(Number(value)))) return 'number';
    if (values.length && values.every(value => isoDate.test(value) && Number.isFinite(Date.parse(value)))) return 'date';
    return 'text';
  }

  function init(root = document) {
    const tables = [...root.querySelectorAll('table')];
    if (root.matches?.('table')) tables.unshift(root);
    for (const table of tables) {
      if (initialized.has(table) || !table.closest('.cradle') || table.dataset.sortable === 'false' || table.tBodies.length !== 1 || table.tHead?.rows.length !== 1 || table.querySelector('table') || table.parentElement?.closest('table')) continue;
      const body = table.tBodies[0];
      const headers = [...(table.tHead?.rows[0]?.cells ?? [])];
      // Keep merged headers/rows outside this deliberately small helper's scope.
      if (!headers.length || headers.some(cell => cell.tagName !== 'TH') || [...body.rows].some(row => row.cells.length !== headers.length) || [...headers, ...body.querySelectorAll('td,th')].some(cell => cell.colSpan !== 1 || cell.rowSpan !== 1)) continue;
      const controls = [];
      headers.forEach((header, column) => {
        const configuredType = header.dataset.sort || 'auto';
        if (!['auto', 'text', 'number', 'date'].includes(configuredType) || header.matches(interactive) || header.querySelector(interactive)) return;
        const label = header.textContent.trim();
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cr-sort';
        button.append(...header.childNodes);
        button.setAttribute('aria-label', `${label}: sort ascending`);
        header.append(button);
        header.setAttribute('aria-sort', 'none');
        controls.push({ header, button, label });
        button.addEventListener('click', () => {
          const descending = header.getAttribute('aria-sort') === 'ascending';
          const currentRows = [...body.rows];
          // A later render can introduce merged/uneven rows; never reorder those.
          if (table.dataset.sortable === 'false' || table.tBodies.length !== 1 || table.tBodies[0] !== body || currentRows.some(row => row.cells.length !== headers.length || [...row.cells].some(cell => cell.colSpan !== 1 || cell.rowSpan !== 1)) || table.querySelector('table')) return;
          const type = configuredType === 'auto' ? inferType(currentRows, column) : configuredType;
          const rows = currentRows.map((row, index) => {
            const cell = row.cells[column];
            const raw = rawValue(cell);
            let value = raw;
            if (type === 'number') value = raw === '' ? NaN : Number(raw);
            if (type === 'date') value = Date.parse(raw);
            const missing = raw === '' || (type !== 'text' && !Number.isFinite(value));
            return { row, index, value, missing };
          });
          const sorted = order(rows, entry => entry.missing ? null : entry.value, descending ? 'descending' : 'ascending');
          const fragment = document.createDocumentFragment();
          for (const entry of sorted) fragment.append(entry.row);
          body.append(fragment);
          for (const control of controls) {
            const selected = control.header === header;
            control.header.setAttribute('aria-sort', selected ? (descending ? 'descending' : 'ascending') : 'none');
            control.button.setAttribute('aria-label', `${control.label}: sort ${selected && !descending ? 'descending' : 'ascending'}`);
          }
        });
      });
      if (controls.length) initialized.add(table);
    }
  }
  window.CradleTables = { init, order };
  function start() {
    init();
    // Newly rendered tables gain controls without application-specific initialization.
    const observer = new MutationObserver(records => {
      const roots = new Set();
      for (const record of records) for (const node of record.addedNodes) {
        if (node.nodeType !== 1) continue;
        roots.add(node.closest('table') || node);
      }
      for (const root of roots) init(root);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
