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
    updateNavForRole();
    setupLoginForm();
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