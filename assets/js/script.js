// NEXORA — site script
// Flowbite's own bundle handles the navbar toggle, accordions and modals via
// their data-attributes, so this file only covers the bits that are specific
// to this project.

document.addEventListener('DOMContentLoaded', () => {
  markActiveNavLink();
  wireNewsletterForm();
  wireContactForm();
  wireSignupForm();
  wireSigninForm();
});

// Give the nav link matching the current page a highlighted state instead of
// hardcoding it separately on every page (which is how these things end up
// out of sync).
function markActiveNavLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const target = link.getAttribute('data-nav-link');
    if (target === current) {
      link.classList.add('text-gold');
      link.classList.remove('text-bone/80');
      link.setAttribute('aria-current', 'page');
    }
  });
}

function showFieldNote(el, message, isError) {
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden', 'text-red-400', 'text-emerald-400');
  el.classList.add(isError ? 'text-red-400' : 'text-emerald-400');
}

function wireNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  const note = document.getElementById('newsletter-note');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    if (!email) {
      showFieldNote(note, 'Add an email address first.', true);
      return;
    }
    showFieldNote(note, `You're on the list — we'll write to ${email} when there's something worth reading.`, false);
    form.reset();
  });
}

// Progressive enhancement for the Formspree contact form: if JS is available
// we submit via fetch so the visitor gets an inline confirmation instead of
// being bounced to a bare Formspree success page. If anything goes wrong we
// just let the native form submission (already configured with action +
// method) carry on as the fallback.
function wireContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('contact-status');
  const submitBtn = document.getElementById('contact-submit');

  form.addEventListener('submit', async (e) => {
    if (!form.checkValidity()) {
      return; // let the browser show native validation messages
    }
    e.preventDefault();

    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    showFieldNote(status, '', false);
    status.classList.add('hidden');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        showFieldNote(status, "Message sent. We usually reply within a couple of business days.", false);
        form.reset();
      } else {
        showFieldNote(status, "That didn't go through — please try again or email us directly.", true);
      }
    } catch (err) {
      showFieldNote(status, "That didn't go through — please try again or email us directly.", true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      status.classList.remove('hidden');
    }
  });
}

// The sign-up page has no backend behind it, so this just checks the two
// password fields agree and gives the visitor a clear reason when the form
// can't proceed — the same courtesy a working backend would give.
function wireSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;
  const password = document.getElementById('signup-password');
  const confirm = document.getElementById('signup-confirm');
  const note = document.getElementById('signup-note');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (password.value !== confirm.value) {
      showFieldNote(note, 'Those passwords don\u2019t match — check both fields.', true);
      confirm.focus();
      return;
    }
    if (password.value.length < 8) {
      showFieldNote(note, 'Use at least 8 characters for your password.', true);
      password.focus();
      return;
    }
    showFieldNote(note, 'Account details look good. This demo form isn\u2019t connected to a live server yet.', false);
  });
}

function wireSigninForm() {
  const form = document.getElementById('signin-form');
  if (!form) return;
  const note = document.getElementById('signin-note');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showFieldNote(note, 'Checks out on this end — this demo form isn\u2019t wired to a live server yet.', false);
  });
}
