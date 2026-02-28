import { fetchWorkoutById } from './http-client.js';
import { detailPopupTemplate } from './templates.js';
import { saveBookmark, deleteBookmark, isBookmarked } from './bookmarks.js';
import { showReviewPopup } from './review-popup.js';
import { svgAssets } from './assets.js';

let overlayEl;

export function setupDetailPopup() {
  overlayEl = document.querySelector('[data-modal-exercise]');
  if (!overlayEl) return;

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-start-id]');
    if (!btn) return;
    showDetailPopup(btn.dataset.startId);
  });

  overlayEl.addEventListener('click', e => {
    if (e.target === overlayEl || e.target.closest('[data-modal-close]')) {
      hideDetailPopup();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlayEl.hidden) {
      hideDetailPopup();
    }
  });
}

export async function showDetailPopup(id) {
  try {
    const workout = await fetchWorkoutById(id);
    const saved = isBookmarked(id);
    overlayEl.innerHTML = detailPopupTemplate(workout, saved);
    overlayEl.hidden = false;
    document.body.style.overflow = 'hidden';

    const favBtn = overlayEl.querySelector('[data-fav-id]');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const labelEl = favBtn.querySelector('span');
        const iconEl = favBtn.querySelector('img');
        if (isBookmarked(id)) {
          deleteBookmark(id);
          if (labelEl) labelEl.textContent = 'Add to favorites';
          if (iconEl) iconEl.src = svgAssets.heartOutline;
        } else {
          saveBookmark(workout);
          if (labelEl) labelEl.textContent = 'Remove';
          if (iconEl) iconEl.src = svgAssets.heartSolid;
        }
        if (
          document.querySelector('.favorites-list') &&
          document.querySelector('.favorites')
        ) {
          const reinit = window.__reinitBookmarks;
          if (reinit) reinit();
        }
      });
    }

    const rateBtn = overlayEl.querySelector('[data-rating-id]');
    if (rateBtn) {
      rateBtn.addEventListener('click', () => {
        hideDetailPopup();
        showReviewPopup(rateBtn.dataset.ratingId);
      });
    }
  } catch {}
}

function hideDetailPopup() {
  if (!overlayEl) return;
  overlayEl.hidden = true;
  overlayEl.innerHTML = '';
  document.body.style.overflow = '';
}
