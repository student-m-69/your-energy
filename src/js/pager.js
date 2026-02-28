import { svgAssets } from './assets.js';

function computePageRange(active, total) {
  if (total <= 4) {
    return Array.from({ length: total }, (_, idx) => idx + 1);
  }

  const half = Math.ceil(total / 2);
  let from = Math.max(1, active - 1);
  let to = Math.min(total, active + 1);

  if (to - from < 2) {
    if (from === 1) {
      to = Math.min(3, total);
    } else if (to === total) {
      from = Math.max(1, total - 2);
    }
  }

  const result = [];
  if (active <= half) {
    for (let i = from; i <= to; i++) result.push(i);
    if (to < total) result.push('...');
  } else {
    if (from > 1) result.push('...');
    for (let i = from; i <= to; i++) result.push(i);
  }

  return result;
}

export function buildPager(wrapper, activePage, totalPages, onNavigate) {
  wrapper.innerHTML = '';
  if (totalPages <= 1) return;

  const atStart = activePage === 1;
  const atEnd = activePage === totalPages;

  const prevArrows = document.createElement('div');
  prevArrows.classList.add('pagination-arrows');
  prevArrows.innerHTML = `
    <button class="pagination-arrow" data-page="first" ${atStart ? 'disabled' : ''} aria-label="First page">
      <img src="${atStart ? svgAssets.navDoubleLeftLight : svgAssets.navDoubleLeftDark}" alt="" class="pagination-arrow-icon">
    </button>
    <button class="pagination-arrow" data-page="prev" ${atStart ? 'disabled' : ''} aria-label="Previous page">
      <img src="${atStart ? svgAssets.navLeftLight : svgAssets.navLeftDark}" alt="" class="pagination-arrow-icon">
    </button>
  `;
  wrapper.appendChild(prevArrows);

  const numbersWrap = document.createElement('div');
  numbersWrap.classList.add('pagination-numbers');

  for (const pg of computePageRange(activePage, totalPages)) {
    if (pg === '...') {
      const dots = document.createElement('span');
      dots.classList.add('pagination-ellipsis');
      dots.textContent = '...';
      numbersWrap.appendChild(dots);
    } else {
      const num = document.createElement('span');
      num.classList.add('pagination-num');
      if (pg === activePage) num.classList.add('is-active');
      num.textContent = pg;
      num.dataset.page = pg;
      numbersWrap.appendChild(num);
    }
  }
  wrapper.appendChild(numbersWrap);

  const nextArrows = document.createElement('div');
  nextArrows.classList.add('pagination-arrows', 'pagination-arrows--right');
  nextArrows.innerHTML = `
    <button class="pagination-arrow" data-page="next" ${atEnd ? 'disabled' : ''} aria-label="Next page">
      <img src="${atEnd ? svgAssets.navLeftLight : svgAssets.navLeftDark}" alt="" class="pagination-arrow-icon">
    </button>
    <button class="pagination-arrow" data-page="last" ${atEnd ? 'disabled' : ''} aria-label="Last page">
      <img src="${atEnd ? svgAssets.navDoubleLeftLight : svgAssets.navDoubleLeftDark}" alt="" class="pagination-arrow-icon">
    </button>
  `;
  wrapper.appendChild(nextArrows);

  wrapper.onclick = e => {
    e.stopPropagation();
    const el = e.target.closest('[data-page]');
    if (!el || el.disabled) return;

    const val = el.dataset.page;
    let next;
    switch (val) {
      case 'first':
        next = 1;
        break;
      case 'prev':
        next = Math.max(1, activePage - 1);
        break;
      case 'next':
        next = Math.min(totalPages, activePage + 1);
        break;
      case 'last':
        next = totalPages;
        break;
      default:
        next = parseInt(val, 10);
    }

    if (next !== activePage) onNavigate(next);
  };
}
