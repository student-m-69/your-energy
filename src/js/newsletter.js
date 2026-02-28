import { subscribeEmail } from './http-client.js';

export function setupNewsletter() {
  const formEl = document.querySelector('.footer-form');
  if (!formEl) return;

  formEl.addEventListener('submit', async e => {
    e.preventDefault();
    const inputEl = formEl.querySelector('.footer-input');
    const address = inputEl.value.trim();
    if (!address) return;

    const pattern =
      /^\w+(\.\w+)?@[a-zA-Z_]+(\.[a-zA-Z_]+)*\.[a-zA-Z]{2,3}$/;

    let msgEl = formEl.querySelector('.footer-form-message');
    if (!msgEl) {
      msgEl = document.createElement('p');
      msgEl.classList.add('footer-form-message');
      formEl.appendChild(msgEl);
    }

    if (!pattern.test(address)) {
      msgEl.textContent = 'Please enter a valid email address.';
      msgEl.className = 'footer-form-message footer-form-message--error';
      msgEl.hidden = false;
      return;
    }

    try {
      const result = await subscribeEmail(address);
      msgEl.textContent = result.message || 'Subscription successful!';
      msgEl.className = 'footer-form-message footer-form-message--success';
      msgEl.hidden = false;
      inputEl.value = '';
    } catch (err) {
      msgEl.textContent =
        err.message || 'Subscription failed. Please try again.';
      msgEl.className = 'footer-form-message footer-form-message--error';
      msgEl.hidden = false;
    }
  });
}
