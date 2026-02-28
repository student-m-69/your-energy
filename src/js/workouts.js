import { fetchWorkouts } from './http-client.js';
import { trainingCardTemplate } from './templates.js';
import { buildPager } from './pager.js';

let queryParams = {};
let activePage = 1;
let listEl, pagerEl, onBack;

let searchWrap = null;
let searchCallback = null;

function activateSearch(onSearch) {
  searchWrap = document.querySelector('.exercises-search');
  if (!searchWrap) return;
  searchWrap.hidden = false;
  searchCallback = onSearch;

  const field = searchWrap.querySelector('.exercises-search-input');
  const trigger = searchWrap.querySelector('.exercises-search-btn');

  field.addEventListener('keydown', onKeydown);
  trigger.addEventListener('click', onTriggerClick);
}

function deactivateSearch() {
  if (!searchWrap) return;
  searchWrap.hidden = true;
  const field = searchWrap.querySelector('.exercises-search-input');
  const trigger = searchWrap.querySelector('.exercises-search-btn');
  field.value = '';
  field.removeEventListener('keydown', onKeydown);
  trigger.removeEventListener('click', onTriggerClick);
  searchWrap = null;
  searchCallback = null;
}

function onKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    executeSearch();
  }
}

function onTriggerClick() {
  executeSearch();
}

function executeSearch() {
  if (!searchWrap || !searchCallback) return;
  const field = searchWrap.querySelector('.exercises-search-input');
  searchCallback(field.value.trim());
}

export function displayWorkouts(
  categoryName,
  paramKey,
  heading,
  _listEl,
  _pagerEl,
  _onBack
) {
  listEl = _listEl;
  pagerEl = _pagerEl;
  onBack = _onBack;
  activePage = 1;
  queryParams = { [paramKey]: categoryName, page: 1, limit: 10 };

  if (heading) {
    heading.innerHTML = `<span class="exercises-title-back">Exercises</span> / <span class="exercises-title-category">${categoryName}</span>`;
    const backEl = heading.querySelector('.exercises-title-back');
    if (backEl) {
      backEl.style.cursor = 'pointer';
      backEl.addEventListener(
        'click',
        () => {
          clearWorkouts();
          if (heading) heading.innerHTML = 'Exercises';
          onBack();
        },
        { once: true }
      );
    }
  }

  activateSearch(term => {
    queryParams.keyword = term || undefined;
    activePage = 1;
    queryParams.page = 1;
    loadWorkouts();
  });

  loadWorkouts();
}

export function clearWorkouts() {
  deactivateSearch();
  if (listEl) listEl.classList.remove('exercises-list--workouts');
}

async function loadWorkouts() {
  if (!listEl) return;
  try {
    const params = { ...queryParams, page: activePage };
    for (const key of Object.keys(params)) {
      if (params[key] === undefined) delete params[key];
    }
    const data = await fetchWorkouts(params);
    const entries = data.results || [];

    listEl.innerHTML =
      entries.length === 0
        ? '<li class="workout-card"><p style="padding:20px;text-align:center;">No exercises found.</p></li>'
        : entries.map(ex => trainingCardTemplate(ex)).join('');

    listEl.classList.add('exercises-list--workouts');

    const totalPages = parseInt(data.totalPages, 10) || 1;
    if (pagerEl) {
      buildPager(pagerEl, activePage, totalPages, pg => {
        activePage = pg;
        loadWorkouts();
      });
    }
  } catch {
    listEl.innerHTML =
      '<li class="workout-card"><p style="padding:20px;text-align:center;">Failed to load exercises.</p></li>';
  }
}
