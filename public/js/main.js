// Runs once the page has loaded. Calls the setup functions for
// features that appear on multiple pages (each checks if its
// element exists, so it's safe to run everywhere).

document.addEventListener("DOMContentLoaded", () => {
  setupNavToggle();
  setupNavLinks();
  setupProfileForm();
  setupEditEvent();
});

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

//navigation bar that changes depending on userRoles
// The navigation links each type of user sees. guest = logged out,
// student and admin see their own menus. Used by setupNavLinks below.
//to log in as a student: localStorage.setItem("userRole", "student");
//to log in as an admin: localStorage.setItem("userRole", "admin");
//to log out: localStorage.removeItem("userRole");

//navigation links for each user role
// The navigation links each type of user sees. guest = logged out,
// student and admin see their own menus. Used by setupNavLinks below.
const links = {
  guest: [
    { name: "Home", href: `index.html` },
    { name: "Events", href: `events.html` },
    { name: "Contact/About us", href: `contact.html` },
    { name: "Log in", href: `login.html` },
    { name: "Sign up", href: `register.html` },
  ],

  student: [
    { name: "Dashboard", href: `student-dashboard.html` },
    { name: "Events", href: `events.html` },
    { name: "My Registrations", href: `my-registrations.html` },
    { name: "Profile", href: `student-profile.html` },
    { name: "Contact/About us", href: `contact.html` },
    { name: "Log out", href: "#" },
  ],

  admin: [
    { name: "Dashboard", href: `admin-dashboard.html` },
    { name: "Events", href: `events.html` },
    { name: "Manage Events", href: `manage-events.html` },
    { name: "My Registrations", href: `admin-registrations.html` },
    { name: "Statistics", href: `admin-statistics.html` },
    { name: "Contact/About us", href: `contact.html` },
    { name: "Log out", href: "#" },
  ],
};

//setup navbar links
// Builds the navbar based on who is "logged in" (from localStorage).
// Deliverable 1 fakes the role; Deliverable 2 the server decides.
function setupNavLinks() {
  //get user role from localStorage, default to guest if not set
  const role = localStorage.getItem("userRole") || "guest";
  //get navbar links container
  const navbarLinks = document.getElementById("navbar-links");
  //get current page name to highlight active link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  //if navbar links container not found, exit
  if (!navbarLinks) return;

  //populate navbar links based on user role
  navbarLinks.innerHTML = links[role]
    .map((link) => {
      //check if link is active
      const isActive =
        link.href.split("/").pop() === currentPage ? ' class="active"' : "";

      //special case for logout link to add id for event listener
      if (link.name === "Log out") {
        return `<li><a class="btn" style="padding: 0.3rem 0.9rem" href="#" id="logout-btn">${link.name}</a></li>`;
      }
      //return link html
      return `<li><a href="${link.href}"${isActive}>${link.name}</a></li>`;
    })
    .join("");

  //logout feature
  const logoutBtn = document.getElementById("logout-btn");
  //if logout button exists, add click event listener to log out user
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      //remove login user
      localStorage.removeItem("userRole");
      //return to home page
      window.location.href = "index.html";
    });
  }
}

// --------------------------------------------------------------------- Home Page ---------------------------------------------------------------------

// --------------------------------------------------------------------- Events ---------------------------------------------------------------------
// Sample event data for Deliverable 1 (hard-coded). Every page reads
// from this one array. Deliverable 2 replaces it with data from the database.
// Event categories:
// Academic workshops, Career events, Club activities, Sports events,
// Cultural events, Volunteering events, Social events,
// Guest lectures, Networking events, Other

//status:
//"Open" : registered < capacity
//"Full" : registered == capacity
//"Cancelled" : registration whatever
//"Completed" : date in the past

//rating:
//keep rating as null until an event is completed
// once completed, give fake ratings out of 5

const EVENTS = [
  // Academic Workshops
  {
    id: 1,
    title: "Career Fair Networking & Pitch Essentials",
    description:
      "Learn how to craft an impactful elevator pitch, navigate career fairs, and connect effectively with recruiters.",
    category: "Career events",
    date: "2026-09-08",
    startTime: "1:00 PM",
    endTime: "3:00 PM",
    location: "EV 6.305",
    capacity: 40,
    organizer: "Career Services",
    status: "Open",
    registered: 0,
    image: "images/web-development.jpg",
    rating: null,
  },
  {
    id: 2,
    title: "Study Skills Bootcamp",
    description:
      "Learn effective note-taking, time management, and exam preparation strategies.",
    category: "Academic workshops",
    date: "2026-09-14",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    location: "Library LB-101",
    capacity: 50,
    organizer: "Student Success Centre",
    status: "Open",
    registered: 31,
    image: "images/study-skills.jpg",
    rating: null,
  },

  // Career Events
  {
    id: 3,
    title: "Tech Industry Career Fair",
    description:
      "Meet recruiters from leading technology companies and explore internships.",
    category: "Career events",
    date: "2026-09-18",
    startTime: "11:00 AM",
    endTime: "4:00 PM",
    location: "Hall Building Atrium",
    capacity: 300,
    organizer: "Career Services",
    status: "Open",
    registered: 2,
    image: "images/career-fair.jpg",
    rating: null,
  },
  {
    id: 4,
    title: "Resume & LinkedIn Clinic",
    description:
      "Receive personalized feedback on your resume and LinkedIn profile from professionals.",
    category: "Career events",
    date: "2026-09-21",
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    location: "MB 2.130",
    capacity: 60,
    organizer: "Career Services",
    status: "Open",
    registered: 1,
    image: "images/resume-clinic.jpg",
    rating: null,
  },
  {
    id: 6,
    title: "Mock Interview Night",
    description:
      "Practice your interviewing skills with feedback from industry professionals.",
    category: "Career events",
    date: "2026-03-10",
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    location: "H-110",
    capacity: 80,
    organizer: "Career Services",
    status: "Completed",
    registered: 0,
    image: "images/mock-interview.jpg",
    rating: null,
  },

  // Club Activities
  {
    id: 5,
    title: "Board Game Night",
    description: "Relax and play a variety of classic and modern board games.",
    category: "Club activities",
    date: "2026-09-10",
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    location: "Student Centre Lounge",
    capacity: 80,
    organizer: "Board Game Club",
    status: "Open",
    registered: 45,
    image: "images/board-games.jpg",
    rating: null,
  },

  // Sports Events
  {
    id: 7,
    title: "Campus Soccer Tournament",
    description:
      "Compete with fellow students in a friendly soccer tournament.",
    category: "Sports events",
    date: "2026-09-26",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    location: "Athletics Field",
    capacity: 120,
    organizer: "Athletics Department",
    status: "Open",
    registered: 96,
    image: "images/soccer.jpg",
    rating: null,
  },
  {
    id: 8,
    title: "Morning Yoga Session",
    description: "Start your day with an instructor-led outdoor yoga class.",
    category: "Sports events",
    date: "2026-09-16",
    startTime: "8:00 AM",
    endTime: "9:00 AM",
    location: "Campus Green",
    capacity: 40,
    organizer: "Recreation Centre",
    status: "Open",
    registered: 22,
    image: "images/yoga.jpg",
    rating: null,
  },

  // Cultural Events
  {
    id: 9,
    title: "International Food Festival",
    description:
      "Celebrate cultures from around the world with food and performances.",
    category: "Cultural events",
    date: "2026-10-03",
    startTime: "12:00 PM",
    endTime: "5:00 PM",
    location: "Campus Plaza",
    capacity: 500,
    organizer: "International Students Association",
    status: "Open",
    registered: 287,
    image: "images/food-festival.jpg",
    rating: null,
  },
  {
    id: 10,
    title: "Latin Dance Night",
    description: "Enjoy beginner-friendly salsa and bachata lessons.",
    category: "Cultural events",
    date: "2026-10-07",
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    location: "Student Centre Ballroom",
    capacity: 150,
    organizer: "Latin Student Association",
    status: "Open",
    registered: 112,
    image: "images/dance-night.jpg",
    rating: null,
  },

  // Volunteering Events
  {
    id: 11,
    title: "Campus Clean-Up Day",
    description: "Help keep campus clean while meeting other volunteers.",
    category: "Volunteering events",
    date: "2026-09-19",
    startTime: "9:00 AM",
    endTime: "12:00 PM",
    location: "Campus Entrance",
    capacity: 80,
    organizer: "Green Campus Initiative",
    status: "Open",
    registered: 41,
    image: "images/cleanup.jpg",
    rating: null,
  },
  {
    id: 12,
    title: "Food Bank Packing Event",
    description: "Volunteer to package food donations for local families.",
    category: "Volunteering events",
    date: "2026-10-01",
    startTime: "1:00 PM",
    endTime: "4:00 PM",
    location: "Community Centre",
    capacity: 50,
    organizer: "Volunteer Hub",
    status: "Open",
    registered: 36,
    image: "images/food-bank.jpg",
    rating: null,
  },

  // Social Events
  {
    id: 13,
    title: "Outdoor Movie Night",
    description: "Watch a classic movie under the stars with free popcorn.",
    category: "Social events",
    date: "2026-09-11",
    startTime: "8:00 PM",
    endTime: "10:30 PM",
    location: "Campus Green",
    capacity: 250,
    organizer: "Student Union",
    status: "Open",
    registered: 184,
    image: "images/movie-night.jpg",
    rating: null,
  },
  {
    id: 14,
    title: "Welcome BBQ",
    description: "Meet new students while enjoying free food and live music.",
    category: "Social events",
    date: "2026-09-05",
    startTime: "12:00 PM",
    endTime: "3:00 PM",
    location: "University Courtyard",
    capacity: 400,
    organizer: "Student Union",
    status: "Open",
    registered: 325,
    image: "images/bbq.jpg",
    rating: null,
  },

  // Guest Lectures
  {
    id: 15,
    title: "The Future of Artificial Intelligence",
    description:
      "A keynote presentation discussing recent advances in AI research.",
    category: "Guest lectures",
    date: "2026-10-08",
    startTime: "5:00 PM",
    endTime: "6:30 PM",
    location: "H-110",
    capacity: 250,
    organizer: "Faculty of Engineering",
    status: "Open",
    registered: 172,
    image: "images/ai-lecture.jpg",
    rating: null,
  },
  {
    id: 16,
    title: "Climate Change and Urban Design",
    description: "Guest speaker explores sustainable city planning.",
    category: "Guest lectures",
    date: "2026-10-15",
    startTime: "2:00 PM",
    endTime: "3:30 PM",
    location: "EV Auditorium",
    capacity: 180,
    organizer: "Faculty of Arts",
    status: "Open",
    registered: 95,
    image: "images/climate-lecture.jpg",
    rating: null,
  },

  // Networking Events
  {
    id: 17,
    title: "Startup Networking Mixer",
    description: "Meet entrepreneurs, investors, and fellow innovators.",
    category: "Networking events",
    date: "2026-09-29",
    startTime: "6:00 PM",
    endTime: "8:00 PM",
    location: "John Molson Lounge",
    capacity: 120,
    organizer: "Entrepreneurship Club",
    status: "Open",
    registered: 73,
    image: "images/networking.jpg",
    rating: null,
  },
  {
    id: 18,
    title: "Women in STEM Networking Evening",
    description:
      "Connect with professionals, alumni, and students in STEM fields.",
    category: "Networking events",
    date: "2026-10-13",
    startTime: "5:30 PM",
    endTime: "8:00 PM",
    location: "MB Atrium",
    capacity: 100,
    organizer: "Women in STEM",
    status: "Open",
    registered: 69,
    image: "images/women-stem.jpg",
    rating: null,
  },

  // Other
  {
    id: 19,
    title: "Blood Donation Clinic",
    description: "Donate blood and help save lives in your community.",
    category: "Other",
    date: "2026-09-30",
    startTime: "9:00 AM",
    endTime: "4:00 PM",
    location: "Student Centre Hall",
    capacity: 100,
    organizer: "Canadian Blood Services",
    status: "Open",
    registered: 54,
    image: "images/blood-drive.jpg",
    rating: null,
  },
  {
    id: 20,
    title: "Campus Sustainability Expo",
    description:
      "Discover green initiatives, eco-friendly organizations, and sustainability projects.",
    category: "Other",
    date: "2026-10-20",
    startTime: "11:00 AM",
    endTime: "3:00 PM",
    location: "Hall Building",
    capacity: 200,
    organizer: "Sustainability Office",
    status: "Open",
    registered: 88,
    image: "images/sustainability.jpg",
    rating: null,
  },
];

// Sample student and registration data (hard-coded for D1). USERS holds
// students; REGISTRATIONS links a student to an event they signed up for.
//FAKE USER DATA TO POPULATE STUDENT DASHBOARD AND STUDENT REGISTRATION
const USERS = [
  {
    id: 101,
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
  },
  {
    id: 102,
    firstName: "Will",
    lastName: "Smith",
    email: "will.smith@example.com",
  },
  {
    id: 103,
    firstName: "Charles",
    lastName: "Barkley",
    email: "charles.barkley@example.com",
  },
];
//FAKE REGISTRATION DATA TO POPULATE STUDENT DASHBOARD AND STUDENT REGISTRATION
const REGISTRATIONS = [
  {
    registration_id: 1,
    user_id: 101,
    event_id: 2,
    registration_date: "2026-08-21",
    status: "Registered",
    attended: false,
  },
  {
    registration_id: 2,
    user_id: 101,
    event_id: 7,
    registration_date: "2026-08-22",
    status: "Cancelled",
    attended: false,
  },
  {
    registration_id: 3,
    user_id: 101,
    event_id: 14,
    registration_date: "2026-08-15",
    status: "Attended",
    attended: true,
  },
  {
    registration_id: 4,
    user_id: 101,
    event_id: 5,
    registration_date: "2026-08-20",
    status: "Registered",
    attended: false,
  },
  {
    registration_id: 5,
    user_id: 101,
    event_id: 3,
    registration_date: "2026-08-21",
    status: "Registered",
    attended: false,
  },
  {
    registration_id: 1,
    user_id: 102,
    event_id: 4,
    registration_date: "2026-08-21",
    status: "Registered",
    attended: false,
  },
  {
    registration_id: 2,
    user_id: 102,
    event_id: 3,
    registration_date: "2026-08-21",
    status: "Registered",
    attended: false,
  },
  {
    registration_id: 3,
    user_id: 103,
    event_id: 3,
    registration_date: "2026-08-21",
    status: "Registered",
    attended: false,
  },
];

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
                <a class="btn" href="event-details.html?id=${event.id}">View details</a>

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
    default:
      return "";
  }
}

//helper function to show delete event confirmation and redirect to manage-events.html
const deleteBtn = document.getElementById("delete-event-btn");
if (deleteBtn) {
  deleteBtn.addEventListener("click", () => {
    const sure = confirm(
      "Are you sure you want to delete this event? This cannot be undone.",
    );
    if (!sure) return;

    // Deliverable 1: no backend, so we just confirm and go back.
    // Deliverable 2: send a delete request to the server here.
    alert("Event deleted successfully!");
    window.location.href = "manage-events.html";
  });
}

const cancelBtn = document.getElementById("cancel-event-btn");
if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    const sure = confirm(
      "Are you sure you want to cancel this event? This cannot be undone.",
    );
    if (!sure) return;

    // Deliverable 1: no backend, so we just confirm and go back.
    // Deliverable 2: send a delete request to the server here.
    alert("Event cancelled successfully!");
  });
}
//EVENTS.HTML
//to populate event grid on events.html
// Events page: show all events, then re-show a filtered list when the
// user searches or changes the category/status/sort dropdowns.

//get container where all event cards are displayed
const EVENT_GRID = document.getElementById("EVENT_GRID");

//Events search/filter function

if (EVENT_GRID) {
  //function to display the event list in the event grid
  displayEventCards("EVENT_GRID", EVENTS);

  //get references to all search and filter controls
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const organizerFilter = document.getElementById("organizerFilter");
  const statusFilter = document.getElementById("statusFilter");

  //populate organizer filter automatically using event data
  if (organizerFilter) {
    //create array of organizer names
    const organizers = [...new Set(EVENTS.map((event) => event.organizer))];
    //sort organizers alphabetically
    organizers.sort();
    //add each organizer option in the dropdown
    organizers.forEach((org) => {
      organizerFilter.innerHTML += `<option value="${org}">${org}</option>`;
    });
  }

  //filter function

  //filter events list based on selections
  function filterEvents() {
    //keep only what matches every filter
    let filtered = EVENTS.filter((event) => {
      //search by event title not case sensitive
      const matchesSearch = event.title
        .toLowerCase()
        .includes(searchInput.value.toLowerCase());
      //match category
      const matchesCategory =
        categoryFilter.value === "" || event.category === categoryFilter.value;
      //match organizer
      const matchesOrganizer =
        organizerFilter.value === "" ||
        event.organizer === organizerFilter.value;
      //match event status
      const matchesStatus =
        statusFilter.value === "" || event.status === statusFilter.value;
      //only keep events that match with every selection
      return (
        matchesSearch && matchesCategory && matchesOrganizer && matchesStatus
      );
    });
    //get sorting dropdown
    const sortFilter = document.getElementById("sortFilter");

    if (sortFilter) {
      //sort alphabetically by title
      if (sortFilter.value === "title") {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }
      //sort events by date
      if (sortFilter.value === "date") {
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    }
    //display filtered events
    displayEventCards("EVENT_GRID", filtered);
  }

  //event listeners

  //run filterEvents whenever the selection changes so that the event list updates automatically
  searchInput.addEventListener("input", filterEvents);

  categoryFilter.addEventListener("change", filterEvents);

  organizerFilter.addEventListener("change", filterEvents);

  statusFilter.addEventListener("change", filterEvents);
  //refilter when sorting option changes
  const sortFilter = document.getElementById("sortFilter");

  if (sortFilter) {
    sortFilter.addEventListener("change", filterEvents);
  }
}

// EVENTS-DETAILS.HTML
//to populate event-details.html for each event
// Event details page: reads the event id from the URL (?id=) and fills
// in that event's title, badge, and info.

//check to see if were on event-details.html
const title = document.getElementById("eventTitle");

if (title) {
  //read event id from url
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  //find matching event id in events array
  const event = EVENTS.find((e) => e.id === id);

  if (event) {
    //fill page with selected event info
    title.textContent = event.title;

    const badge = document.getElementById("eventStatus");
    badge.textContent = event.status;
    badge.className = `badge ${getBadgeClass(event.status)}`;

    document.getElementById("eventCategory").textContent = event.category;

    document.getElementById("eventOrganizer").textContent = event.organizer;

    document.getElementById("eventDateTime").textContent =
      `${event.date} · ${event.startTime} to ${event.endTime}`;

    document.getElementById("eventLocation").textContent =
      `at ${event.location}`;

    document.getElementById("eventDescription").textContent = event.description;

    document.getElementById("eventCapacity").textContent =
      `${event.registered}/${event.capacity} spots filled`;

    //check user role
    const userRole = localStorage.getItem("userRole") || "guest";

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
      const currentUser = 101; //hardcoded for now, will be dynamic later

      const registration = REGISTRATIONS.find(
        (reg) =>
          reg.user_id === currentUser &&
          reg.event_id === event.id &&
          reg.status === "Registered",
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
    }

    //admin controls
    if (userRole === "admin") {
      const adminControls = document.getElementById("adminControls");

      adminControls.hidden = false;

      //send admin to edit page for this event
      const editBtn = document.getElementById("editEventBtn");
      //send admin to manage registrations page for this event
      const manageBtn = document.getElementById("viewRegistrationsBtn");

      editBtn.href = `edit-event.html?id=${event.id}`;
    }
  }
}

// --------------------------------------------------------------------- Student ---------------------------------------------------------------------

if (document.getElementById("upcomingEvents")) {
  const currentUser = 101;
  //get all registrations for the current user
  const myRegistrations = REGISTRATIONS.filter(
    (reg) => reg.user_id === currentUser,
  );

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
  const upcoming = document.getElementById("upcomingEvents");
  //get all events that the current user is registered for and sort by date
  const upcomingEvents = myRegistrations
    .filter((reg) => reg.status === "Registered")
    .map((reg) => EVENTS.find((event) => event.id === reg.event_id))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  //display upcoming events in the student dashboard
  displayEventCards("upcomingEvents", upcomingEvents);

  //suggested events for student dashboard
  const suggestedContainer = document.getElementById("suggestedEvents");

  if (suggestedContainer) {
    //get events that the current user is not registered for, sort by date, make sure theyre open status, and take the first 2
    const suggestions = EVENTS.filter(
      (event) =>
        event.status === "Open" &&
        !myRegistrations.some((reg) => reg.event_id === event.id),
    )
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 2);

    displayEventCards("suggestedEvents", suggestions);
  }

  //registrations table for student dashboard
  const upcomingRegistrations = REGISTRATIONS.filter(
    (reg) => reg.user_id === currentUser && reg.status === "Registered",
  )
    .map((reg) => {
      return {
        registration: reg,
        event: EVENTS.find((e) => e.id === reg.event_id),
      };
    })
    .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));

  const regTable = document.getElementById("registrationTable");

  if (regTable) {
    regTable.innerHTML = "";
    //loop through the upcoming registrations and add a row for each event
    upcomingRegistrations.forEach((item) => {
      const event = item.event;

      regTable.innerHTML += `
            <tr>
                <td>${event.title}</td>
                <td>${event.date}</td>
                <td>${event.startTime}</td>
                <td>${event.location}</td>
                <td>
                    <span class="badge badge-open">
                        Registered
                    </span>
                </td>
                <td>
                    <button class="btn btn-danger">
                        Cancel
                    </button>
                </td>
            </tr>
        `;
    });
  }
}
// --------------------------------------------------------------------- Admin ---------------------------------------------------------------------
//upcoming events for admin dashboard
const adminEventsTable = document.getElementById("upcomingadminEvents");
if (adminEventsTable) {
  adminEventsTable.innerHTML = "";
  const upcomingEvents = EVENTS.filter(
    (event) =>
      (event.organizer === "Career Services" && event.status === "Open") ||
      event.status === "Full",
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
  upcomingEvents.forEach((event) => {
    const currentRegistrations =
      REGISTRATIONS.filter(
        (reg) => reg.event_id === event.id && reg.status === "Registered",
      ).length || event.registered;
    const badgeClass = getBadgeClass(event.status);

    adminEventsTable.innerHTML += `
      <tr>
        <td><strong>${event.title}</strong></td>
        <td>${event.category}</td>
        <td>${event.date}</td>
        <td>${event.location}</td>
        <td>${currentRegistrations} / ${event.capacity}</td>
        <td>
          <span class="badge ${badgeClass}">${event.status}</span>
        </td>
      </tr>
    `;
  });
}

//event registration table for admin registations page
const eventOverviewTable = document.getElementById("eventOverviewTable");
if (eventOverviewTable) {
  eventOverviewTable.innerHTML = "";
  const upcomingEvents = EVENTS.filter(
    (event) =>
      (event.organizer === "Career Services" && event.status === "Open") ||
      event.status === "Full",
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
  upcomingEvents.forEach((event) => {
    const currentRegistrations =
      REGISTRATIONS.filter(
        (reg) => reg.event_id === event.id && reg.status === "Registered",
      ).length || event.registered;
    const badgeClass = getBadgeClass(event.status);

    eventOverviewTable.innerHTML += `
      <tr>
        <td>${event.title}</td>
        <td>${event.date}</td>
        <td>${currentRegistrations}/ ${event.capacity}</td>
      <td>
              <a class="btn btn-primary" href="view-all-student-ids.html?id=${event.id}">
                View All Students
              </a>
            </td>
            <td>
              <a class="btn btn-outline" href="event-details.html?id=${event.id}">
                View details
              </a>
            </td>
      </tr>
    `;
  });
}
//event attendance table for admin registrations page
const pasteventOverviewTable = document.getElementById(
  "pasteventOverviewTable",
);
if (pasteventOverviewTable) {
  pasteventOverviewTable.innerHTML = "";
  const upcomingEvents = EVENTS.filter(
    (event) =>
      (event.organizer === "Career Services" && event.status === "Cancelled") ||
      event.status === "Completed",
  ).sort((a, b) => new Date(b.date) - new Date(a.date));
  upcomingEvents.forEach((event) => {
    const currentRegistrations =
      REGISTRATIONS.filter(
        (reg) => reg.event_id === event.id && reg.status === "Registered",
      ).length || event.registered;
    const badgeClass = getBadgeClass(event.status);

    pasteventOverviewTable.innerHTML += `
      <tr>
        <td>${event.title}</td>
        <td>${event.date}</td>
        <td>${currentRegistrations}/ ${event.capacity}</td>
      <td>
              <a class="btn btn-primary" href="view-all-student-ids.html?id=${event.id}">
                View All Students
              </a>
            </td>
            <td>
              <a class="btn btn-outline" href="event-details.html?id=${event.id}">
                View details
              </a>
            </td>
      </tr>
    `;
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
              <a class="btn" href="event-details.html?id=${event.id}">View details</a>
              <a class="btn" href="edit-event.html?id=${event.id}">Edit</a>
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
// Manage events upcoming events
const ADMIN_EVENT_GRID = document.getElementById("ADMIN_EVENT_GRID");

if (ADMIN_EVENT_GRID) {
  const careerServicesEvents = EVENTS.filter(
    (event) =>
      event.organizer === "Career Services" &&
      (event.status === "Open" || event.status === "Full"),
  );

  displayADMINEventCards("ADMIN_EVENT_GRID", careerServicesEvents);
}
// Manage events past events
const ADMIN_PAST_EVENT_GRID = document.getElementById("ADMIN_PAST_EVENT_GRID");

if (ADMIN_PAST_EVENT_GRID) {
  const careerServicesEvents = EVENTS.filter(
    (event) =>
      event.organizer === "Career Services" &&
      (event.status === "Cancelled" || event.status === "Completed"),
  );

  displayADMINEventCards("ADMIN_PAST_EVENT_GRID", careerServicesEvents);
}

// Registered students table for the event from the admin registrations page
const studentsTable = document.getElementById("registeredStudentsTable");

if (studentsTable) {
  studentsTable.innerHTML = "";
  const params = new URLSearchParams(window.location.search);
  const eventId = Number(params.get("id"));

  const registeredUserIds = REGISTRATIONS.filter(
    (reg) => reg.event_id === eventId && reg.status === "Registered",
  ).map((reg) => reg.user_id);
  const registeredStudents = USERS.filter((user) =>
    registeredUserIds.includes(user.id),
  );
  if (registeredStudents.length === 0) {
    studentsTable.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center;">No students registered for this event.</td>
        </tr>`;
  } else {
    registeredStudents.forEach((student) => {
      studentsTable.innerHTML += `
          <tr>
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.email}</td>
          </tr>
        `;
    });
  }
}

// --------------------------------------------------------------------- Registration  ---------------------------------------------------------------------

const myRegistrationTable = document.getElementById("myRegistrationTable");
//get all registrations for the current user and sort by date
if (myRegistrationTable) {
  const currentUser = 101;

  const studentRegistrations = REGISTRATIONS.filter(
    (reg) => reg.user_id === currentUser,
  )
    .map((reg) => {
      const event = EVENTS.find((event) => event.id === reg.event_id);
      return { registration: reg, event: event };
    })
    .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));

  myRegistrationTable.innerHTML = "";

  studentRegistrations.forEach((item) => {
    const event = item.event;
    const registration = item.registration;

    myRegistrationTable.innerHTML += `
      <tr>
        <td>${event.title}</td>
        <td>${event.date}</td>
        <td>${event.startTime}</td>
        <td>${event.location}</td>
        <td>${registration.registration_date}</td>
        <td><span class="badge ${getBadgeClass(event.status)}">${event.status}</span></td>
        <td>${registration.attended ? "Attended" : "Not attended"}</td>
        <td>
          <button class="btn btn-danger" onclick="cancelRegistration(${registration.registration_id})">
            Cancel
          </button>
        </td>
      </tr>
    `;
  });
}

// Student Profile page - check the edit form before saving
function setupProfileForm() {
  const form = document.querySelector("#profile-form");
  if (!form) return; // only runs on the profile page

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = document.querySelector("#fullname").value.trim();
    const email = document.querySelector("#email").value.trim();
    const currentPassword = document.querySelector("#current-password").value;
    const newPassword = document.querySelector("#new-password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;
    const msg = document.querySelector("#profile-msg");

    // Name and email are always required
    if (fullName === "") {
      showProfileMessage(msg, "Please enter your full name.", false);
      return;
    }
    if (email === "" || !email.includes("@") || !email.includes(".")) {
      showProfileMessage(msg, "Please enter a valid email address.", false);
      return;
    }

    // Only check the password if they are actually changing it
    if (newPassword !== "") {
      if (currentPassword === "") {
        showProfileMessage(
          msg,
          "Enter your current password to change it.",
          false,
        );
        return;
      }
      if (newPassword.length < 6) {
        showProfileMessage(
          msg,
          "New password must be at least 6 characters.",
          false,
        );
        return;
      }
      if (newPassword !== confirmPassword) {
        showProfileMessage(msg, "New passwords do not match.", false);
        return;
      }
    }

    showProfileMessage(msg, "Profile updated successfully!", true);
  });
}

// Show a message under the profile form: green for success, red for error
function showProfileMessage(box, text, ok) {
  box.textContent = text;
  box.style.color = ok ? "var(--status-open)" : "var(--status-cancelled)";
  box.hidden = false;
}
// --------------------------------------------------------------------- About ---------------------------------------------------------------------

// EDIT EVENT page - load the chosen event into the form, then handle save
function setupEditEvent() {
  const form = document.querySelector("#edit-event-form");
  if (!form) return; // only runs on the edit page

  // Read the event id from the URL, e.g. edit-event.html?id=3
  const id = Number(new URLSearchParams(window.location.search).get("id"));
  const event = EVENTS.find((e) => e.id === id);

  // If the id is missing or wrong, tell the user and stop
  if (!event) {
    document.querySelector("main").innerHTML = "<p>Event not found.</p>";
    return;
  }

  // Fill the form with this event's current details
  document.querySelector("#event-name").value = event.title;
  document.querySelector("#event-date").value = event.date;
  document.querySelector("#event-location").value = event.location;
  document.querySelector("#capacity").value = event.capacity;
  document.querySelector("#event-description").value = event.description;
}
// --------------------------------------------------------------------- About ---------------------------------------------------------------------
// --------------------------------------------------------------------- About -------------------------------------------------------------------
