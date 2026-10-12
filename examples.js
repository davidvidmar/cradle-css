// Gallery behavior only. Applications can use the CSS without this file.
const root = document.documentElement;
document.querySelector('#theme').addEventListener('change', event => {
  if (event.target.value === 'auto') root.removeAttribute('data-theme');
  else root.dataset.theme = event.target.value;
});
document.querySelector('#skin').addEventListener('change', event => {
  root.dataset.skin = event.target.value;
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
