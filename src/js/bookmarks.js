import { trainingCardTemplate } from './templates.js';
import { buildPager } from './pager.js';

const BOOKMARKS_KEY = 'favorites';
const PAGE_SIZE = 8;

export function loadBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveBookmark(workout) {
  const list = loadBookmarks();
  if (list.some(entry => entry._id === workout._id)) return;
  list.push(workout);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
}

export function deleteBookmark(id) {
  const list = loadBookmarks().filter(entry => entry._id !== id);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
}

export function isBookmarked(id) {
  return loadBookmarks().some(entry => entry._id === id);
}

export function setupBookmarksPage() {
  const listEl = document.querySelector('.favorites-list');
  const pagerEl = document.querySelector('.favorites-content .pagination');
  if (!listEl) return;

  let activePage = 1;

  function render(page) {
    activePage = page;
    const items = loadBookmarks();

    if (items.length === 0) {
      listEl.innerHTML =
        '<li class="favorites-empty"><p>It appears that you haven\'t added any exercises to your favorites yet. Start exploring and add exercises that you enjoy to your favorites for easy access in the future.</p></li>';
      if (pagerEl) pagerEl.innerHTML = '';
      return;
    }

    const totalPages = Math.ceil(items.length / PAGE_SIZE);
    if (activePage > totalPages) activePage = totalPages;
    const offset = (activePage - 1) * PAGE_SIZE;
    const visible = items.slice(offset, offset + PAGE_SIZE);

    listEl.innerHTML = visible
      .map(entry => trainingCardTemplate(entry, { showTrash: true }))
      .join('');

    if (pagerEl) {
      buildPager(pagerEl, activePage, totalPages, render);
    }
  }

  listEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-remove-id]');
    if (!btn) return;
    deleteBookmark(btn.dataset.removeId);
    render(activePage);
  });

  render(1);
}
