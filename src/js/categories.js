import { fetchCategories } from './http-client.js';
import { categoryCardTemplate } from './templates.js';
import { buildPager } from './pager.js';
import { displayWorkouts, clearWorkouts } from './workouts.js';

const CATEGORY_LABELS = {
  muscles: 'Muscles',
  'body-parts': 'Body parts',
  equipment: 'Equipment',
};

const CATEGORY_PARAMS = {
  muscles: 'muscles',
  'body-parts': 'bodypart',
  equipment: 'equipment',
};

let activeCategory = 'muscles';
let activePage = 1;

export function setupCategories() {
  const tabsWrap = document.querySelector('.exercises-tabs');
  const listEl = document.querySelector('.exercises-list');
  const pagerEl = document.querySelector('.exercises-grid .pagination');
  const heading = document.querySelector('.exercises-title');
  if (!tabsWrap || !listEl) return;

  tabsWrap.addEventListener('click', e => {
    const tab = e.target.closest('.exercises-tab');
    if (!tab) return;

    for (const t of tabsWrap.querySelectorAll('.exercises-tab')) {
      t.classList.remove('is-active');
    }
    tab.classList.add('is-active');

    activeCategory = tab.dataset.filter;
    activePage = 1;
    clearWorkouts();
    if (heading) heading.innerHTML = 'Exercises';
    loadCategories();
  });

  listEl.addEventListener('click', e => {
    const card = e.target.closest('.exercise-card');
    if (!card) return;
    e.preventDefault();
    const label = card.dataset.name;
    const param = CATEGORY_PARAMS[activeCategory];
    displayWorkouts(label, param, heading, listEl, pagerEl, () => {
      loadCategories();
    });
  });

  function loadCategories() {
    renderCategories(activeCategory, activePage, listEl, pagerEl);
  }

  loadCategories();
}

async function renderCategories(category, page, listEl, pagerEl) {
  try {
    const data = await fetchCategories(CATEGORY_LABELS[category], page, 12);
    const entries = data.results || [];
    listEl.innerHTML =
      entries.length === 0
        ? '<li class="exercise-card"><p style="padding:20px;text-align:center;">No categories found.</p></li>'
        : entries.map(categoryCardTemplate).join('');

    const pages = parseInt(data.totalPages, 10);
    if (pagerEl) {
      buildPager(pagerEl, page, pages, nextPage => {
        activePage = nextPage;
        renderCategories(category, nextPage, listEl, pagerEl);
      });
    }
  } catch {
    listEl.innerHTML =
      '<li class="exercise-card"><p style="padding:20px;text-align:center;">Failed to load filters.</p></li>';
  }
}
