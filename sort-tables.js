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

  function init(root = document) {
    const tables = [...root.querySelectorAll('.cr-table[data-sortable]')];
    if (root.matches?.('.cr-table[data-sortable]')) tables.unshift(root);
    for (const table of tables) {
      if (initialized.has(table) || !table.closest('.cradle') || table.tBodies.length !== 1 || table.tHead?.rows.length !== 1) continue;
      const body = table.tBodies[0];
      const headers = [...(table.tHead?.rows[0]?.cells ?? [])];
      // Keep merged headers/rows outside this deliberately small helper's scope.
      if ([...headers, ...body.querySelectorAll('td,th')].some(cell => cell.colSpan !== 1 || cell.rowSpan !== 1)) continue;
      const controls = [];
      headers.forEach((header, column) => {
        const type = header.dataset.sort;
        if (!['text', 'number', 'date'].includes(type)) return;
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
          const rows = [...body.rows].map((row, index) => {
            const cell = row.cells[column];
            const raw = (cell?.dataset.sortValue ?? cell?.textContent ?? '').trim();
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
      initialized.add(table);
    }
  }
  window.CradleTables = { init, order };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init(), { once: true });
  else init();
})();
