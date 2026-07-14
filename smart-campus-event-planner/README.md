# Smart Campus Event Planner - SOEN 287 Summer 2026

Team: Joy, Eryne, Karina, Marie

## Folder structure (Deliverable 1)

```
smart-campus-event-planner/
├── public/                 <- things the browser loads directly
│   ├── css/
│   │   └── style.css       <- THE shared stylesheet. One file, everyone uses it.
│   ├── js/
│   │   └── main.js         <- shared frontend JS (fake event data lives here in week 2)
│   └── images/             <- logos, event pictures
│
├── views/                  <- one .html file per page
│   ├── template.html       <- COPY THIS to start any new page
│   ├── index.html          <- home            (Eryne)
│   ├── login.html          <- login           (Eryne)
│   ├── register.html       <- sign up         (Eryne)
│   ├── contact.html        <- contact/about   (Eryne)
│   ├── student-dashboard.html                 (Marie)
│   ├── events.html         <- events list     (Marie)
│   ├── event-details.html                     (Marie)
│   ├── my-registrations.html                  (Marie)
│   ├── admin-dashboard.html                   (Karina)
│   ├── create-event.html                      (Karina)
│   └── manage-events.html                     (Karina)
│
└── README.md               <- this file
```

Why `public/` and `views/` instead of one big folder? Because in
Deliverable 2 our Node.js server will serve `public/` as static files
and route requests to pages in `views/`. Using this structure now means
zero reorganizing later. The `routes/`, `models/`, `controllers/`, and
`database/` folders from the project spec get added in D2.

## How to start a new page

1. Copy `views/template.html` and rename it to your page's filename
   (use the exact filenames in the tree above so links work).
2. Change the `<title>`.
3. In the navbar, move `class="active"` onto your page's link.
4. Build inside `<main>` using the components already in `style.css`
   (open template.html in a browser to see them all).
5. Do not invent new colors or fonts. Use the CSS variables.

## Git workflow (read this twice)

One-time setup:

```
git clone https://github.com/Erynity/SOEN287-TBDTeam.git
cd smart-campus-event-planner
```

Every single time you sit down to work:

```
git pull                          <- get everyone's latest work FIRST
... do your work ...
git add .
git commit -m "Add events list page with filter bar"
git pull                          <- pull again in case someone pushed while you worked
git push
```

Rules:

- **Pull before you work. Pull before you push.** This avoids 90% of
  conflicts.
- Commit messages say what you did: "Add login form validation", not
  "stuff" or "changes".
- Commit small and often (each page section is a fine commit), not one
  giant commit per week.
- We each mostly touch our own files, so conflicts should be rare. If
  git reports a conflict, do not force anything. Post in the group chat.
- Never commit directly from someone else's laptop or account. The
  contribution sheet must match the git history.

## Deliverable 1 checklist (due July 29, we submit July 28)

- [ ] All 11 pages exist and use the shared template
- [ ] Every navbar link works from every page (no dead links)
- [ ] Every page looks right on a phone (open dev tools, toggle device toolbar)
- [ ] Forms are visible and usable (login, register, create event)
- [ ] Hard-coded sample data is consistent across pages (same fake events)
- [ ] Feature list + planned-features list written
- [ ] Installation guide written (short: "unzip, open views/index.html")
- [ ] User guide written
- [ ] Contribution sheet completed honestly
- [ ] Zipped and submitted on Moodle by ONE person, July 28
