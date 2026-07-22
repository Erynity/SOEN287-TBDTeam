// Shared frontend JavaScript - Smart Campus Event Planner
// Week 2: our fake event data will live here as one array that
// every page loops over, so all pages show the same sample events.
// Deliverable 2: this file will fetch real data from the backend instead.

// Example of what's coming (do not build yet - week 2 lesson):
// const events = [
//   { id: 1, title: "Intro to Rock Climbing", category: "Sports", ... },
// ];

document.addEventListener('DOMContentLoaded', () => {
    setupNavToggle();
    setupLoginForm();
    addBackButton();
});

function setupNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.navbar-links');
  if (!toggle || !links) return;

  function setMenu(open) {
    toggle.classList.toggle('open', open);
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  }

  // Click the button to open/close
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setMenu(!toggle.classList.contains('open'));
  });

  // Click anywhere outside the menu to close it
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) setMenu(false);
  });

  // Press Escape to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
}

function addBackButton() {
  const main = document.querySelector('main');
  if (!main) return;
  if (document.body.dataset.page === 'home') return;   // skip home

  const back = document.createElement('button');
  back.innerHTML = '<span style="font-size:1.5em; line-height:1;">←</span> Back';
  back.className = 'btn btn-secondary back-btn';
  back.addEventListener('click', () => {
    if (history.length > 1) history.back();
    else window.location.href = '../index.html';
  });
  main.prepend(back);
}

const TEST_ACCOUNTS = [
  { email: 'student@campus.ca', password: 'student123', redirect: 'student-dashboard.html' },
  { email: 'admin@campus.ca',   password: 'admin123',   redirect: 'admin-dashboard.html'  },
];

function setupLoginForm() {
  const form = document.querySelector('#login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value.trim().toLowerCase();
    const password = document.querySelector('#password').value;
    const error = document.querySelector('#login-error');

    const match = TEST_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (match) window.location.href = match.redirect;
    else { error.textContent = 'Invalid username or password.'; error.hidden = false; }
  });
}