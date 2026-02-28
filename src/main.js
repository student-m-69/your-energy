import { setupDailyQuote } from './js/daily-quote.js';
import { setupCategories } from './js/categories.js';
import { setupBookmarksPage } from './js/bookmarks.js';
import { setupNewsletter } from './js/newsletter.js';
import { setupDetailPopup } from './js/detail-popup.js';
import { setupReviewPopup } from './js/review-popup.js';

function initMobileNav() {
  const openBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const drawer = document.querySelector('[data-menu]');
  if (!openBtn || !closeBtn || !drawer) return;

  openBtn.addEventListener('click', () => {
    drawer.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      drawer.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

function setCurrentYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}

initMobileNav();
setCurrentYear();

setupDailyQuote();
setupNewsletter();
setupDetailPopup();
setupReviewPopup();

if (document.querySelector('.exercises')) {
  setupCategories();
}

if (document.querySelector('.favorites')) {
  setupBookmarksPage();
  window.__reinitBookmarks = setupBookmarksPage;
}
