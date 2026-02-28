import { svgAssets } from './assets.js';

function generateStars(rating) {
  const filled = Math.round(rating);
  return [1, 2, 3, 4, 5]
    .map(
      i =>
        `<img src="${i <= filled ? svgAssets.starActive : svgAssets.starInactive}" alt="" width="14" height="14" />`
    )
    .join('');
}

export function categoryCardTemplate({ name, filter, imgURL }) {
  return `<li class="exercise-card" data-name="${name}" data-filter="${filter}">
  <a class="exercise-card-link" href="#">
    <img src="${imgURL}" alt="${name}" class="exercise-card-img" loading="lazy" />
    <div class="exercise-card-overlay">
      <p class="exercise-card-name">${name}</p>
      <p class="exercise-card-subtitle">${filter}</p>
    </div>
  </a>
</li>`;
}

export function trainingCardTemplate(item, { showTrash = false } = {}) {
  const removeBtn = showTrash
    ? `<button class="workout-card-trash" type="button" aria-label="Remove from favorites" data-remove-id="${item._id}">
        <img src="${svgAssets.trash}" alt="" width="16" height="16" />
      </button>`
    : '';

  const score = item.rating ? item.rating.toFixed(1) : '0.0';

  return `<li class="workout-card" data-exercise-id="${item._id}">
  <div class="workout-card-top">
    <span class="workout-card-badge">WORKOUT</span>
    <span class="workout-card-rating">${score}<img src="${svgAssets.starActive}" alt="rating" /></span>
    ${removeBtn}
    <button class="workout-card-start" type="button" data-start-id="${item._id}">Start <img src="${svgAssets.arrowForward}" alt="" /></button>
  </div>
  <div class="workout-card-body">
    <div class="workout-card-icon">
      <img src="${svgAssets.runnerLight}" alt="" width="24" height="24" />
    </div>
    <h3 class="workout-card-name">${item.name}</h3>
  </div>
  <div class="workout-card-meta">
    <span>Burned calories: <strong>${item.burnedCalories} / ${item.time} min</strong></span>
    <span>Body part: <strong>${item.bodyPart}</strong></span>
    <span>Target: <strong>${item.target}</strong></span>
  </div>
</li>`;
}

export function detailPopupTemplate(item, isSaved) {
  const starsHtml = generateStars(item.rating);
  const btnLabel = isSaved ? 'Remove' : 'Add to favorites';
  const heartSrc = isSaved ? svgAssets.heartSolid : svgAssets.heartOutline;

  return `<div class="modal-exercise-content">
  <button class="modal-close" type="button" aria-label="Close" data-modal-close>
    <img class="modal-close-icon" src="${svgAssets.closeLight}" alt="" width="24" height="24" />
  </button>
  <div class="modal-exercise-gif">
    <img src="${item.gifUrl}" alt="${item.name}" />
  </div>
  <div class="modal-exercise-info">
    <h3 class="modal-exercise-title">${item.name}</h3>
    <div class="modal-exercise-rating">
      <span class="modal-exercise-rating-value">${item.rating.toFixed(1)}</span>
      <div class="modal-exercise-stars">${starsHtml}</div>
    </div>
    <div class="modal-exercise-details">
      <div class="modal-exercise-detail-item">
        <span class="modal-exercise-detail-label">Target</span>
        <span class="modal-exercise-detail-value">${item.target}</span>
      </div>
      <div class="modal-exercise-detail-item">
        <span class="modal-exercise-detail-label">Body Part</span>
        <span class="modal-exercise-detail-value">${item.bodyPart}</span>
      </div>
      <div class="modal-exercise-detail-item">
        <span class="modal-exercise-detail-label">Equipment</span>
        <span class="modal-exercise-detail-value">${item.equipment}</span>
      </div>
      <div class="modal-exercise-detail-item">
        <span class="modal-exercise-detail-label">Popular</span>
        <span class="modal-exercise-detail-value">${item.popularity}</span>
      </div>
      <div class="modal-exercise-detail-item">
        <span class="modal-exercise-detail-label">Burned calories</span>
        <span class="modal-exercise-detail-value">${item.burnedCalories}/${item.time} min</span>
      </div>
    </div>
    <p class="modal-exercise-desc">${item.description}</p>
    <div class="modal-exercise-actions">
      <button class="modal-btn modal-btn-fav" type="button" data-fav-id="${item._id}">
        <span>${btnLabel}</span>
        <img class="modal-btn-fav-icon" src="${heartSrc}" alt="" width="18" height="18" />
      </button>
      <button class="modal-btn modal-btn-rating" type="button" data-rating-id="${item._id}">Give a rating</button>
    </div>
  </div>
</div>`;
}

export function reviewPopupTemplate(workoutId) {
  return `<div class="modal-rating-content">
  <button class="modal-close" type="button" aria-label="Close" data-modal-close>
    <img class="modal-close-icon" src="${svgAssets.closeLight}" alt="" width="28" height="28" />
  </button>
  <p class="modal-rating-label">Rating</p>
  <div class="modal-rating-row">
    <span class="modal-rating-value">0.0</span>
    <div class="modal-rating-stars">
      ${[1, 2, 3, 4, 5]
        .map(
          n =>
            `<img class="modal-star" src="${svgAssets.starInactive}" alt="${n} star" width="24" height="24" data-star="${n}" />`
        )
        .join('')}
    </div>
  </div>
  <form class="modal-rating-form" data-exercise-id="${workoutId}">
    <input class="modal-rating-email" type="email" name="email" placeholder="Email" pattern="^\\w+(\\.\\w+)?@[a-zA-Z_]+(\\.[a-zA-Z_]+)*\\.[a-zA-Z]{2,3}$" required/>
    <textarea class="modal-rating-comment" name="review" placeholder="Your comment" rows="4" required></textarea>
    <button class="modal-rating-submit" type="submit">Send</button>
    <p class="modal-rating-message" hidden></p>
  </form>
</div>`;
}
