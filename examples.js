// Gallery behavior only. Applications can use the CSS without this file.
const root = document.documentElement;
document.querySelector('#theme').addEventListener('change', event => {
  if (event.target.value === 'auto') root.removeAttribute('data-theme');
  else root.dataset.theme = event.target.value;
});
document.querySelector('#skin').addEventListener('change', event => {
  window.CradleThemes.select(event.target.value);
});
document.querySelector('#font').addEventListener('change', event => {
  window.CradleFonts.select(event.target.value);
});
const dialog = document.querySelector('#example-dialog');
document.querySelector('#open-dialog').addEventListener('click', () => {
  dialog.returnValue = '';
  dialog.showModal();
});
dialog.addEventListener('close', () => {
  document.querySelector('#feedback').textContent = dialog.returnValue === 'save'
    ? 'Project saved in this example.' : 'Dialog closed.';
});
document.querySelector('#sample-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = new FormData(event.target).get('name');
  document.querySelector('#form-status').textContent = `Settings saved for ${name}.`;
});
document.querySelector('.cr-nav').addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  document.querySelectorAll('.cr-nav a').forEach(item => item.removeAttribute('aria-current'));
  link.setAttribute('aria-current', 'location');
});

window.CradleFonts.load('mono');

// Fictional table action feedback, independent of the sorting helper.
document.querySelector('#tables').addEventListener('click', event => {
  const button = event.target.closest('[data-example-source]');
  if (button) document.querySelector('#table-action-status').textContent = `${button.dataset.exampleSource} selected for editing in this example.`;
});

// The catalogue itself is static HTML; this optional control only filters it.
const iconSearch = document.querySelector('#icon-search');
const iconTiles = [...document.querySelectorAll('[data-icon-name]')];
iconSearch.disabled = false;
const iconClear = document.querySelector('#icon-clear');
iconClear.disabled = false;
function filterIcons() {
  document.querySelector('#icon-library').open = true;
  const query = iconSearch.value.trim().toLowerCase().replace(/\s+/g, '-');
  let visible = 0;
  iconTiles.forEach(tile => {
    tile.hidden = !tile.dataset.iconName.includes(query);
    if (!tile.hidden) visible++;
  });
  document.querySelector('#icon-catalogue').scrollTop = 0;
  document.querySelector('#icon-count').textContent = visible
    ? `${visible} of ${iconTiles.length} icons` : 'No icons match. Try another name.';
}
iconSearch.addEventListener('input', filterIcons);
iconClear.addEventListener('click', () => {
  iconSearch.value = '';
  filterIcons();
  iconSearch.focus();
});
