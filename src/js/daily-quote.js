import { fetchDailyQuote } from './http-client.js';

const QUOTE_CACHE_KEY = 'dailyQuote';

function todayKey() {
  return new Date().toDateString();
}

function readCachedQuote() {
  try {
    const raw = localStorage.getItem(QUOTE_CACHE_KEY);
    if (!raw) return null;
    const { quote, author, date } = JSON.parse(raw);
    if (date !== todayKey()) return null;
    return { quote, author };
  } catch {
    return null;
  }
}

function writeCachedQuote(quote, author) {
  try {
    localStorage.setItem(
      QUOTE_CACHE_KEY,
      JSON.stringify({ quote, author, date: todayKey() })
    );
  } catch {}
}

export function setupDailyQuote() {
  const textEl = document.querySelector('.quote-card-quote');
  const nameEl = document.querySelector('.quote-card-author');
  if (!textEl || !nameEl) return;

  const cached = readCachedQuote();
  if (cached) {
    textEl.textContent = cached.quote;
    nameEl.textContent = cached.author;
    return;
  }

  fetchDailyQuote()
    .then(data => {
      textEl.textContent = data.quote;
      nameEl.textContent = data.author;
      writeCachedQuote(data.quote, data.author);
    })
    .catch(() => {});
}
