document.getElementById('year').textContent = new Date().getFullYear();
const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-nav');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!navigation.contains(event.target) && !menu.contains(event.target)) closeMenu();
});
document.querySelector('.hero-copy').classList.add('reveal');

// Keep the navigation in sync with the section being read.
const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const linkedSections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
function updateCurrentSection() {
  // Use the same offset as anchor scrolling, including the sticky header.
  const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
  const marker = Math.max(scrollPadding, headerBottom) + 2;
  let current = null;
  for (const section of linkedSections) {
    if (section.getBoundingClientRect().top <= marker) current = section.id;
  }
  for (const link of sectionLinks) {
    if (link.getAttribute('href') === '#' + current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
let navigationFramePending = false;
window.addEventListener('scroll', () => {
  if (navigationFramePending) return;
  navigationFramePending = true;
  window.requestAnimationFrame(() => {
    updateCurrentSection();
    navigationFramePending = false;
  });
}, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 1000) closeMenu();
  updateCurrentSection();
});
window.addEventListener('load', updateCurrentSection);
updateCurrentSection();
