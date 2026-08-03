# Smart Campus Event Planner

A web application for discovering, creating, and managing campus events, built for **SOEN 287 – Web Programming (Summer 2026)** at Concordia University.

**Team (TBD Team):** Marie Eryne Yow Chok Nee, Karina Gubaidullina, Marie-Ann LaRoche, Jiteshwar (Joy) Gill

---

## About

Smart Campus Event Planner lets students browse and register for campus events, and lets admins (event organizers) create, edit, and manage events and view registrations and statistics. This repository contains **Deliverable 1**: the complete front end (HTML, CSS, and vanilla JavaScript) using hard-coded sample data. Deliverable 2 will add a Node.js backend with a database, real authentication, and role-based access.

---

## Features

**For students**
- Browse all events with live search, category / organizer / status filters, and sorting
- View full event details (date, time, location, description, capacity, status)
- Register for events and cancel registrations
- A personal dashboard with statistics, upcoming events, and suggested events
- View and edit their profile

**For admins (organizers)**
- Create, edit, and delete events
- Manage their events from a dashboard
- View event registrations and past-event attendance
- See site statistics
- View and edit their profile

**Shared**
- A navigation bar that changes based on the logged-in role (guest / student / admin)
- Form validation across all forms (login, register, profile, contact, create/edit event)
- Responsive layout that works on desktop and mobile
- A fake login using two demo accounts (see below)

---

## Tech stack

- **HTML5** – page structure
- **CSS3** – styling, layout (flexbox/grid), and responsive design, all in one shared stylesheet
- **Vanilla JavaScript** – interactivity, sample data, and form validation (no frameworks)

Deliverable 1 uses no backend; all data is hard-coded in `public/js/main.js`.

---

## Project structure

```
SOEN287-TBDTeam/
├── public/                     <- assets the browser loads directly
│   ├── css/
│   │   └── style.css           <- THE shared stylesheet (one file, used by every page)
│   ├── js/
│   │   ├── main.js             <- shared JS: sample data, navbar, event cards, tables
│   │   └── formValidation.js   <- form validation for every form on the site
│   └── images/                 <- logo and favicon (SVG)
│
├── views/                      <- one HTML file per page
│   ├── index.html              <- home page
│   ├── login.html              <- log in (demo accounts)
│   ├── register.html           <- sign up
│   ├── contact.html            <- contact / about
│   ├── events.html             <- events list with search, filters, and sort
│   ├── event-details.html      <- single event details (buttons vary by role)
│   ├── student-dashboard.html  <- student home
│   ├── student-profile.html    <- student profile + edit form
│   ├── my-registrations.html   <- a student's registrations
│   ├── admin-dashboard.html    <- admin home
│   ├── manage-events.html      <- admin: manage events
│   ├── create-event.html       <- admin: create an event
│   ├── edit-event.html         <- admin: edit / delete an event
│   ├── admin-registrations.html<- admin: registrations + attendance
│   ├── admin-statistics.html   <- admin: statistics
│   ├── admin-profile.html      <- admin profile + edit form
│   └── view-all-student-ids.html <- students registered for an event
│
├── README.md                   <- this file
│
└── (Deliverable 2 – not used yet) app.js, package.json, routes/,
    controllers/, models/, database/
```

