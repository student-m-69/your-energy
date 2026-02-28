import { submitRating } from './http-client.js';
import { reviewPopupTemplate } from './templates.js';
import { svgAssets } from './assets.js';

let overlayEl;

export function setupReviewPopup() {
  overlayEl = document.querySelector('[data-modal-rating]');
  if (!overlayEl) return;

  overlayEl.addEventListener('click', e => {
    if (e.target === overlayEl || e.target.closest('[data-modal-close]')) {
      hideReviewPopup();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlayEl && !overlayEl.hidden) {
      hideReviewPopup();
    }
  });
}

export function showReviewPopup(workoutId) {
  if (!overlayEl) return;
  overlayEl.innerHTML = reviewPopupTemplate(workoutId);
  overlayEl.hidden = false;
  document.body.style.overflow = 'hidden';

  let chosenRating = 0;
  const starEls = overlayEl.querySelectorAll('[data-star]');
  const scoreEl = overlayEl.querySelector('.modal-rating-value');
  const formEl = overlayEl.querySelector('.modal-rating-form');

  for (const star of starEls) {
    star.style.cursor = 'pointer';
    star.addEventListener('click', () => {
      chosenRating = parseInt(star.dataset.star, 10);
      refreshStars(starEls, chosenRating);
      if (scoreEl) scoreEl.textContent = chosenRating.toFixed(1);
    });
  }

  if (formEl) {
    formEl.addEventListener('submit', async e => {
      e.preventDefault();
      const notice = formEl.querySelector('.modal-rating-message');
      const email = formEl.email.value.trim();
      const review = formEl.review.value.trim();

      if (!chosenRating || !email || !review) {
        if (notice) {
          notice.textContent =
            'Please fill in all fields: rating, email, and comment.';
          notice.hidden = false;
        }
        return;
      }

      try {
        await submitRating(workoutId, {
          rate: chosenRating,
          email,
          review,
        });
        if (notice) {
          notice.textContent = 'Thank you for your rating!';
          notice.className =
            'modal-rating-message modal-rating-message--success';
          notice.hidden = false;
        }
        setTimeout(async () => {
          hideReviewPopup();
          const { showDetailPopup } = await import('./detail-popup.js');
          showDetailPopup(workoutId);
        }, 1500);
      } catch (err) {
        if (notice) {
          notice.textContent =
            err.message || 'Failed to send rating. Please try again.';
          notice.className =
            'modal-rating-message modal-rating-message--error';
          notice.hidden = false;
        }
      }
    });
  }
}

function hideReviewPopup() {
  if (!overlayEl) return;
  overlayEl.hidden = true;
  overlayEl.innerHTML = '';
  document.body.style.overflow = '';
}

function refreshStars(starEls, rating) {
  for (const star of starEls) {
    const val = parseInt(star.dataset.star, 10);
    star.src = val <= rating ? svgAssets.starActive : svgAssets.starInactive;
  }
}
