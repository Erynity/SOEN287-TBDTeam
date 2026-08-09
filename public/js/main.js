// Runs once the page has loaded. Calls the setup functions for
// features that appear on multiple pages (each checks if its
// element exists, so it's safe to run everywhere).

document.addEventListener("DOMContentLoaded", () => {
  setupNavToggle();
  setupNavLinks();
  setupEditEvent();
});

window.addEventListener("pageshow", (e) => {
  if (e.persisted) window.location.reload();
});

// ============================================================
//  SHARED HELPERS
// ============================================================

// Picks the coloured badge class (open/full/cancelled/completed) for a status.
//helper function for the status badge switch
//translates the event status to the right badge class
function getBadgeClass(status) {
  switch (status) {
    case "Open":
      return "badge-open";
    case "Full":
      return "badge-full";
    case "Cancelled":
      return "badge-cancelled";
    case "Completed":
      return "badge-completed";
    case "Registered":
      return "badge-open";
    case "Attended":
      return "badge-completed";
    case "Event cancelled":
      return "badge-cancelled";
    case "You cancelled":
      return "badge-cancelled";
    default:
      return "";
  }
}

// Fetch events from a given endpoint and map DB column names to display names.
async function fetchEventsFrom(url) {
  const raw = await fetch(url).then((r) => r.json());
  return raw.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    organizer: e.organizer,
    date: e.event_date,
    startTime: e.start_time,
    location: e.location,
    capacity: e.capacity,
    status:
      e.status === "Open" && e.registered >= e.capacity ? "Full" : e.status,
    description: e.description,
    registered: e.registered,
  }));
}

async function fetchEvents() {
  return fetchEventsFrom("/api/events");
}
async function fetchAdminEvents() {
  return fetchEventsFrom("/admin/events");
}

// Builds the HTML for one public event card (title, badge, details, button).
// Returned as a string that gets dropped into the events grid.
//helper function to create event card for any page that needs it
function createEventCard(event) {
  //get the correct badge class for the event status
  const badgeClass = getBadgeClass(event.status);

  return `
        <div class="card event-card">

        <div class="event-card-head">  
        <h3>${event.title}</h3>
        <span class="badge ${badgeClass}">${event.status}</span>
      </div>

            <p class="event-meta muted">
                ${event.category} ·
                ${event.date} 
            </p>
            <p class="event-meta muted">
                ${event.startTime} ·
                ${event.location}
            </p>

            <p class="event-desc">${event.description}</p>
                
            <div class="event-card-foot">
              <span class="muted">
                ${event.registered}/${event.capacity} spots filled
              </span>
                <a class="btn" href="event-details?id=${event.id}">View details</a>

            </div>

        </div>
    `;
}

// Fills a container with event cards by looping over a list of events.
//helper function for displaying a list of event cards
function displayEventCards(containerId, eventList) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = "";
  //loop through the event list and create a card for each event
  eventList.forEach((event) => {
    container.innerHTML += createEventCard(event);
  });
}

//helper function to create event card for any page that needs it
function createAdminEventCard(event) {
  //get the correct badge class for the event status
  const badgeClass = getBadgeClass(event.status);

  return `
        <div class="card event-card">

        <div class="event-card-head">  
        <h3>${event.title}</h3>
        <span class="badge ${badgeClass}">${event.status}</span>
      </div>

            <p class="event-meta muted">
                ${event.category} ·
                ${event.date} 
            </p>
            <p class="event-meta muted">
                ${event.startTime} ·
                ${event.location}
            </p>

            <p class="event-desc">${event.description}</p>
                
            
              <p class="muted">
                ${event.registered}/${event.capacity} spots filled
              </p>
              <div class="event-card-foot">
              <a class="btn" href="event-details?id=${event.id}">View details</a>
              <a class="btn" href="edit-event?id=${event.id}">Edit</a>
            </div>

        </div>
    `;
}

//helper function for displaying a list of event cards
function displayADMINEventCards(containerId, eventList) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = "";
  //loop through the event list and create a card for each event
  eventList.forEach((event) => {
    container.innerHTML += createAdminEventCard(event);
  });
}

// ============================================================
//  NAVIGATION
// ============================================================
// Hamburger menu: opens/closes the nav, and also closes it when
// you click outside the menu or press Escape.

function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".navbar-links");
  if (!toggle || !links) return;

  function setMenu(open) {
    toggle.classList.toggle("open", open);
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  }

  // Click the button to open/close
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(!toggle.classList.contains("open"));
  });

  // Click anywhere outside the menu to close it
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navbar")) setMenu(false);
  });

  // Press Escape to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
}

//navigation links for each user role
// The navigation links each type of user sees. guest = logged out,
// student and admin see their own menus. Used by setupNavLinks below.
const links = {
  guest: [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Contact/About us", href: "/contact" },
    { name: "Log in", href: "/auth/login" },
    { name: "Sign up", href: "/auth/register" },
  ],

  student: [
    { name: "Dashboard", href: "/student-dashboard" },
    { name: "Events", href: "/events" },
    { name: "My Registrations", href: "/my-registrations" },
    { name: "Profile", href: "/student-profile" },
    { name: "Contact/About us", href: "/contact" },
    { name: "Log out", href: "/auth/logout" },
  ],

  admin: [
    { name: "Dashboard", href: "/admin-dashboard" },
    { name: "Events", href: "/events" },
    { name: "Manage Events", href: "/manage-events" },
    { name: "Registrations", href: "/admin-registrations" },
    { name: "Statistics", href: "/admin-statistics" },
    { name: "Contact/About us", href: "/contact" },
    { name: "Log out", href: "/auth/logout" },
  ],
};

// Build the navbar from the role the SERVER reports (from the session)
async function setupNavLinks() {
  const navbarLinks = document.getElementById("navbar-links");
  if (!navbarLinks) return;

  // ask the server who is logged in (reads the session)
  const me = await fetch("/api/me").then((r) => r.json());
  const role = me.role || "guest";

  // highlight the link for the page we're on
  const currentPath = window.location.pathname;

  navbarLinks.innerHTML = links[role]
    .map((link) => {
      const isActive = link.href === currentPath ? ' class="active"' : "";

      // Log out is styled as a button
      if (link.name === "Log out") {
        return `<li><a class="btn" style="padding: 0.3rem 0.9rem" href="${link.href}">${link.name}</a></li>`;
      }

      return `<li><a href="${link.href}"${isActive}>${link.name}</a></li>`;
    })
    .join("");
}

// ============================================================
//  PUBLIC PAGES  (events list, event details)
// ============================================================

//to populate event grid on events.html
// Events page: show all events, then re-show a filtered list when the
// user searches or changes the category/status/sort dropdowns.

//get container where all event cards are displayed
const EVENT_GRID = document.getElementById("EVENT_GRID");

// Fetch events from the server and render them
async function loadEventsFromServer() {
  const events = await fetchEvents();
  displayEventCards("EVENT_GRID", events);
}

// Fills the event-details page with one event's information.
function fillEventDetails(event) {
  document.getElementById("eventTitle").textContent = event.title;

  const badge = document.getElementById("eventStatus");
  badge.textContent = event.status;
  badge.className = `badge ${getBadgeClass(event.status)}`;

  document.getElementById("eventCategory").textContent = event.category;

  document.getElementById("eventOrganizer").textContent = event.organizer;

  document.getElementById("eventDateTime").textContent =
    `${event.date} · ${event.startTime} to ${event.endTime}`;

  document.getElementById("eventLocation").textContent = `at ${event.location}`;

  document.getElementById("eventDescription").textContent = event.description;

  document.getElementById("eventCapacity").textContent =
    `${event.registered}/${event.capacity} spots filled`;
}

async function setupEventDetails() {
  if (!document.getElementById("eventTitle")) return;

  //read event id from url
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  //find matching event id in events array
  const raw = await fetch(`/api/events/${id}`).then((r) => r.json());
  const event = {
    id: raw.id,
    title: raw.title,
    category: raw.category,
    organizer: raw.organizer,
    date: raw.event_date,
    startTime: raw.start_time,
    endTime: raw.end_time,
    location: raw.location,
    capacity: raw.capacity,
    status:
      raw.status === "Open" && raw.registered >= raw.capacity
        ? "Full"
        : raw.status,
    description: raw.description,
    registered: raw.registered ?? 0,
  };
  fillEventDetails(event);

  //check user role
  const me = await fetch("/api/me").then((r) => r.json());
  const userRole = me.role || "guest";

  //guest controls
  if (userRole === "guest") {
    const guestControls = document.getElementById("guestControls");
    guestControls.hidden = false;
  }

  //student controls
  if (userRole === "student") {
    const studentControls = document.getElementById("studentControls");

    const registerBtn = document.getElementById("registerBtn");
    const cancelBtn = document.getElementById("cancelRegistrationBtn");

    studentControls.hidden = false;
    const myRegs = await fetch("/registrations/mine").then((r) => r.json());
    const registration = myRegs.find(
      (reg) => reg.event_id === event.id && reg.status === "Registered",
    );

    //if student is already registered, hide register button and show cancel button
    if (registration) {
      registerBtn.hidden = true;
      cancelBtn.hidden = false;
    }
    //if student is not registered, show register button and hide cancel button
    else {
      registerBtn.hidden = false;
      cancelBtn.hidden = true;

      if (event.status !== "Open") {
        registerBtn.disabled = true;
        registerBtn.textContent = "Registration Unavailable";
      }
    }
    registerBtn.addEventListener("click", async () => {
      const result = await fetch("/registrations/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id }),
      }).then((r) => r.json());

      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
    cancelBtn.addEventListener("click", async () => {
      const result = await fetch("/registrations/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: registration.id }),
      }).then((r) => r.json());

      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  }

  //admin controls
  if (userRole === "admin") {
    const adminControls = document.getElementById("adminControls");

    adminControls.hidden = false;

    //send admin to edit page for this event
    const editBtn = document.getElementById("editEventBtn");
    //send admin to manage registrations page for this event
    const manageBtn = document.getElementById("viewRegistrationsBtn");

    const takeAttendanceBtn = document.getElementById("takeAttendanceBtn");

    editBtn.href = `edit-event?id=${event.id}`;
    takeAttendanceBtn.href = `view-all-student-ids?id=${event.id}`;
  }
}

// ============================================================
//  STUDENT PAGES
// ============================================================

async function loadStudentDashboard() {
  if (!document.getElementById("upcomingEvents")) return;

  const myRegistrations = await fetch("/registrations/mine").then((r) =>
    r.json(),
  );
  const allEvents = await fetchEvents();

  //stat cards for student dashboard
  document.getElementById("registeredCount").textContent =
    myRegistrations.length;
  document.getElementById("upcomingCount").textContent = myRegistrations.filter(
    (r) => r.status === "Registered",
  ).length;
  document.getElementById("attendedCount").textContent = myRegistrations.filter(
    (r) => r.status === "Attended",
  ).length;

  //upcoming events for student dashboard
  //get all events that the current user is registered for and sort by date
  const upcomingEvents = myRegistrations
    .filter((reg) => reg.status === "Registered")
    .map((reg) => allEvents.find((event) => event.id === reg.event_id))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  //display upcoming events in the student dashboard
  displayEventCards("upcomingEvents", upcomingEvents);

  //suggested events for student dashboard
  const suggestedContainer = document.getElementById("suggestedEvents");

  if (suggestedContainer) {
    //get events that the current user is not registered for, sort by date, make sure theyre open status, and take the first 2
    const today = new Date().toISOString().split("T")[0];
    const suggestions = allEvents
      .filter(
        (event) =>
          event.date >= today &&
          event.status === "Open" &&
          !myRegistrations.some((reg) => reg.event_id === event.id),
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 2);

    if (suggestions.length === 0) {
      suggestedContainer.innerHTML = `<p class="muted">No suggestions right now.</p>`;
    } else {
      displayEventCards("suggestedEvents", suggestions);
    }
  }

  //registrations table for student dashboard
  const upcomingRegistrations = myRegistrations.filter(
    (reg) => reg.status === "Registered",
  );

  const regTable = document.getElementById("registrationTable");

  if (regTable) {
    regTable.innerHTML = "";
    //loop through the upcoming registrations and add a row for each event
    upcomingRegistrations.forEach((item) => {
      regTable.innerHTML += `
            <tr>
                <td>${item.title}</td>
                <td>${item.event_date}</td>
                <td>${item.start_time}</td>
                <td>${item.location}</td>
                <td>
                    <span class="badge badge-open">
                        Registered
                    </span>
                </td>
                <td>
                    <button class="btn btn-danger" onclick="cancelRegistration(${item.id})">
                        Cancel
                    </button>
                </td>
            </tr>
        `;
    });
  }
}

const myRegistrationTable = document.getElementById("myRegistrationTable");

//get all registrations for the current user and sort by date
async function loadMyRegistrations() {
  if (!myRegistrationTable) return;
  const studentRegistrations = await fetch("/registrations/mine").then((r) =>
    r.json(),
  );

  myRegistrationTable.innerHTML = "";

  studentRegistrations.forEach((item) => {
    let displayStatus;
    if (item.event_status === "Cancelled") {
      displayStatus = "Event cancelled";
    } else if (item.status === "Cancelled") {
      displayStatus = "You cancelled";
    } else if (item.registered >= item.capacity) {
      displayStatus = "Full";
    } else {
      displayStatus = item.status;
    }

    let actionButton;
    if (item.status === "Registered") {
      actionButton = `<button class="btn btn-danger" onclick="cancelRegistration(${item.id})">Cancel</button>`;
    } else {
      actionButton = `<button class="btn" onclick="registerAgain(${item.event_id})">Register</button>`;
    }
    myRegistrationTable.innerHTML += `
      <tr>
        <td>${item.title}</td>
        <td>${item.event_date}</td>
        <td>${item.start_time}</td>
        <td>${item.location}</td>
        <td>${item.registration_date}</td>
        <td><span class="badge ${getBadgeClass(displayStatus)}">${displayStatus}</span></td>
        <td>${item.attended ? "Attended" : "Not attended"}</td>
        <td>${actionButton}</td>      
      </tr>
    `;
  });
}

//cancelRegistrations
async function cancelRegistration(id) {
  const result = await fetch("/registrations/cancel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registrationId: id }),
  }).then((r) => r.json());

  if (result.success) {
    window.location.reload();
  } else {
    alert(result.error);
  }
}

//Register again after pressing cancel button on my registration table
async function registerAgain(eventId) {
  const result = await fetch("/registrations/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId: eventId }),
  }).then((r) => r.json());

  if (result.success) {
    window.location.reload();
  } else {
    alert(result.error);
  }
}

// ============================================================
//  ADMIN PAGES
// ============================================================
//upcoming events for admin dashboard
const adminEventsTable = document.getElementById("upcomingadminEvents");

//event registration table for admin registations page
const eventOverviewTable = document.getElementById("eventOverviewTable");
const pasteventOverviewTable = document.getElementById(
  "pasteventOverviewTable",
);
const cancelledEventsTable = document.getElementById("cancelledEventsTable");

async function loadAdminDashboard() {
  if (!adminEventsTable) return;
  const allEvents = await fetchAdminEvents();
  const stats = await fetch("/admin/stats").then((r) => r.json());
  const today = new Date().toISOString().split("T")[0];
  const me = await fetch("/api/me").then((r) => r.json());

  document.getElementById("profileName").textContent =
    me.firstName + " " + me.lastName;

  document.getElementById("statOverallAttendance").textContent =
    stats.attendanceRate + "%";

  document.getElementById("statTotalEvents").textContent = allEvents.length;

  document.getElementById("statUpcomingSoon").textContent = allEvents.filter(
    (e) => e.date >= today && e.status !== "Cancelled",
  ).length;

  document.getElementById("statFullEvents").textContent =
    allEvents.filter((e) => e.registered >= e.capacity).length + " Event(s)";

  document.getElementById("statCancelledEvents").textContent =
    allEvents.filter((e) => e.status === "Cancelled").length + " Event(s)";

  const catBox = document.getElementById("statPopularCategory");
  if (stats.topPerCategory.length === 0) {
    catBox.innerHTML = `<p class="muted">No registrations yet.</p>`;
  } else {
    catBox.innerHTML = stats.topPerCategory
      .slice(0, 3)
      .map(
        (c) => `<div class="flex-between">
        <strong>${c.category}:</strong>
        <span class="muted">${c.title}: ${c.total} regs</span>
      </div>`,
      )
      .join("");
  }

  adminEventsTable.innerHTML = "";

  const upcomingEvents = allEvents
    .filter((event) => event.status === "Open" || event.status === "Full")
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  upcomingEvents.forEach((event) => {
    const badgeClass = getBadgeClass(event.status);

    adminEventsTable.innerHTML += `
      <tr>
        <td><strong>${event.title}</strong></td>
        <td>${event.category}</td>
        <td>${event.date}</td>
        <td>${event.location}</td>
        <td>${event.registered} / ${event.capacity}</td>
        <td>
          <span class="badge ${badgeClass}">${event.status}</span>
        </td>
      </tr>
    `;
  });
}

// Renders a table of events into `table`, filtered by `filterFn`.
async function loadEventTable(table, filterFn) {
  if (!table) return;
  const allEvents = await fetchAdminEvents();

  const events = allEvents
    .filter(filterFn)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  table.innerHTML = events
    .map(
      (event) => `
      <tr>
        <td>${event.title}</td>
        <td>${event.date}</td>
        <td>${event.registered} / ${event.capacity}</td>
        <td>
          <a class="btn btn-primary" href="view-all-student-ids?id=${event.id}">
            View All Students
          </a>
        </td>
        <td>
          <a class="btn btn-outline" href="event-details?id=${event.id}">
            View details
          </a>
        </td>
      </tr>`,
    )
    .join("");
}

// Renders event cards into a grid, filtered by filterFn.
async function loadEventGrid(gridId, filterFn) {
  if (!document.getElementById(gridId)) return;
  const allEvents = await fetchAdminEvents();
  displayADMINEventCards(gridId, allEvents.filter(filterFn));
}

// Registered students table for the event from the admin registrations page
const studentsTable = document.getElementById("registeredStudentsTable");

async function loadRegisteredStudents() {
  if (!studentsTable) return;
  studentsTable.innerHTML = "";
  const params = new URLSearchParams(window.location.search);
  const eventId = Number(params.get("id"));

  const registeredStudents = await fetch(
    `/admin/events/${eventId}/registrations`,
  ).then((r) => r.json());

  if (registeredStudents.error) {
    studentsTable.innerHTML = `<tr><td colspan="4">${registeredStudents.error}</td></tr>`;
    return;
  }

  if (registeredStudents.length === 0) {
    studentsTable.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center;">No students registered for this event.</td>
        </tr>`;
  } else {
    registeredStudents.forEach((student) => {
      studentsTable.innerHTML += `
          <tr>
            <td>${student.first_name}</td>
            <td>${student.last_name}</td>
            <td>${student.email}</td>
            <td><input type="checkbox" id="attended-${student.id}" name="attended-${student.id}" ${student.attended ? "checked" : ""} onchange="markAttendance(${student.id}, this.checked)" ></td>
          </tr>
        `;
    });
  }
}

async function markAttendance(registrationId, attended) {
  const result = await fetch(
    `/admin/registrations/${registrationId}/attendance`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attended }),
    },
  ).then((r) => r.json());

  if (!result.success) {
    alert(result.error || "Could not save attendance");
  }
}

async function loadAdminStatistics() {
  if (!document.getElementById("statAttendanceRate")) return;
  const stats = await fetch("/admin/stats").then((r) => r.json());

  document.getElementById("statTotalRegistrations").textContent =
    stats.totalRegistrations;
  document.getElementById("statTotalEvents").textContent = stats.totalEvents;
  document.getElementById("statFullEvents").textContent = stats.fullEvents;
  document.getElementById("statHighestRatedEvent").textContent =
    stats.mostRegistered;
  document.getElementById("statLowestRatedEvent").textContent =
    stats.leastRegistered;
  document.getElementById("statAttendanceRate").textContent =
    stats.attendanceRate + "%";
}

// EDIT EVENT page - load the chosen event into the form, then handle save
async function setupEditEvent() {
  const form = document.querySelector("#edit-event-form");
  if (!form) return; // only runs on the edit page

  // Read the event id from the URL, e.g. edit-event.html?id=3
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const raw = await fetch(`/api/events/${id}`).then((r) => r.json());

  // If the id is missing or wrong, tell the user and stop
  if (raw.error) {
    document.querySelector("main").innerHTML = "<p>Event not found.</p>";
    return;
  }

  const event = {
    id: raw.id,
    title: raw.title,
    category: raw.category,
    date: raw.event_date,
    startTime: raw.start_time,
    endTime: raw.end_time,
    location: raw.location,
    capacity: raw.capacity,
    status:
      raw.status === "Open" && raw.registered >= raw.capacity
        ? "Full"
        : raw.status,
    description: raw.description,
    registered: raw.registered ?? 0,
  };

  // Fill the form with this event's current details
  document.querySelector("#event-name").value = event.title;
  document.querySelector("#event-date").value = event.date;
  document.querySelector("#event-location").value = event.location;
  document.querySelector("#capacity").value = event.capacity;
  document.querySelector("#event-description").value = event.description;
  document.querySelector("#event-category").value = event.category;
  document.querySelector("#event-status").value = event.status;
  document.querySelector("#start-time").value = event.startTime;
  document.querySelector("#end-time").value = event.endTime;

  form.action = `/api/events/${id}/edit`;
  form.method = "post";
}

function setupEditEventButtons() {
  const deleteBtn = document.getElementById("delete-event-btn");
  const cancelBtn = document.getElementById("cancel-event-btn");

  if (!deleteBtn || !cancelBtn) return;

  //helper function to show delete event confirmation and redirect to manage-events.html

  deleteBtn.addEventListener("click", async () => {
    const sure = confirm(
      "Are you sure you want to delete this event? This cannot be undone.",
    );
    if (!sure) return;

    const id = Number(new URLSearchParams(window.location.search).get("id"));
    const res = await fetch(`/api/events/${id}/delete`, { method: "POST" });
    if (!res.ok) {
      alert("Could not delete this event.");
      return;
    }
    window.location.href = "/manage-events";
  });

  cancelBtn.addEventListener("click", async () => {
    const sure = confirm(
      "Are you sure you want to cancel this event? This cannot be undone.",
    );
    if (!sure) return;

    const id = Number(new URLSearchParams(window.location.search).get("id"));
    await fetch(`/api/events/${id}/cancel`, { method: "POST" });
    window.location.reload();
  });
}
// ============================================================
//  PROFILE
// ============================================================

async function loadProfileDetails() {
  if (!document.getElementById("profileEmail")) return;
  const me = await fetch("/api/me").then((r) => r.json());
  document.getElementById("profileName").textContent =
    me.firstName + " " + me.lastName;
  document.getElementById("profileEmail").textContent = me.email;
  document.getElementById("profileRole").textContent = me.role;
  document.getElementById("firstname").value = me.firstName;
  document.getElementById("lastname").value = me.lastName;
  document.getElementById("email").value = me.email;
}

// ============================================================
//  PAGE INITIALISERS
//  Every loader below exits immediately if the element it needs
//  isn't on the current page, so this list is safe to run everywhere.
// ============================================================
if (EVENT_GRID) {
  // load real events from the database, then show them
  loadEventsFromServer();
}
setupEventDetails();
setupEditEventButtons();
loadStudentDashboard();
loadAdminDashboard();
loadRegisteredStudents();
loadMyRegistrations();
loadProfileDetails();
loadAdminStatistics();
loadEventGrid(
  "ADMIN_EVENT_GRID",
  (e) => e.status === "Open" || e.status === "Full",
);
loadEventGrid("ADMIN_PAST_EVENT_GRID", (e) => e.status === "Completed");
loadEventGrid("ADMIN_CANCELLED_EVENT_GRID", (e) => e.status === "Cancelled");

loadEventTable(
  eventOverviewTable,
  (e) => e.status === "Open" || e.status === "Full",
);
loadEventTable(pasteventOverviewTable, (e) => e.status === "Completed");
loadEventTable(cancelledEventsTable, (e) => e.status === "Cancelled");
