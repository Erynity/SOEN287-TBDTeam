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

//events code!!

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
    title: "Introduction to Web Development",
    description: "Build your first responsive webpage using HTML, CSS, and JavaScript.",
    category: "Academic workshops",
    date: "2026-09-08",
    startTime: "1:00 PM",
    endTime: "3:00 PM",
    location: "EV 6.305",
    capacity: 40,
    organizer: "Computer Science Society",
    status: "Full",
    registered: 40,
    image: "images/web-development.jpg",
    rating: null
  },
  {
    id: 2,
    title: "Study Skills Bootcamp",
    description: "Learn effective note-taking, time management, and exam preparation strategies.",
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
    rating: null
  },

  // Career Events
  {
    id: 3,
    title: "Tech Industry Career Fair",
    description: "Meet recruiters from leading technology companies and explore internships.",
    category: "Career events",
    date: "2026-09-18",
    startTime: "11:00 AM",
    endTime: "4:00 PM",
    location: "Hall Building Atrium",
    capacity: 300,
    organizer: "Career Services",
    status: "Open",
    registered: 214,
    image: "images/career-fair.jpg",
    rating: null
  },
  {
    id: 4,
    title: "Resume & LinkedIn Clinic",
    description: "Receive personalized feedback on your resume and LinkedIn profile.",
    category: "Career events",
    date: "2026-09-21",
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    location: "MB 2.130",
    capacity: 60,
    organizer: "Career Services",
    status: "Open",
    registered: 48,
    image: "images/resume-clinic.jpg",
    rating: null
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
    rating: null
  },
  {
    id: 6,
    title: "Photography Walk",
    description: "Explore campus while learning composition and photography techniques.",
    category: "Club activities",
    date: "2026-09-24",
    startTime: "4:00 PM",
    endTime: "6:00 PM",
    location: "Campus Quad",
    capacity: 25,
    organizer: "Photography Club",
    status: "Open",
    registered: 18,
    image: "images/photography.jpg",
    rating: null
  },

  // Sports Events
  {
    id: 7,
    title: "Campus Soccer Tournament",
    description: "Compete with fellow students in a friendly soccer tournament.",
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
    rating: null
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
    rating: null
  },

  // Cultural Events
  {
    id: 9,
    title: "International Food Festival",
    description: "Celebrate cultures from around the world with food and performances.",
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
    rating: null
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
    rating: null
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
    rating: null
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
    rating: null
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
    rating: null
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
    rating: null
  },

  // Guest Lectures
  {
    id: 15,
    title: "The Future of Artificial Intelligence",
    description: "A keynote presentation discussing recent advances in AI research.",
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
    rating: null
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
    rating: null
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
    rating: null
  },
  {
    id: 18,
    title: "Women in STEM Networking Evening",
    description: "Connect with professionals, alumni, and students in STEM fields.",
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
    rating: null
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
    rating: null
  },
  {
    id: 20,
    title: "Campus Sustainability Expo",
    description: "Discover green initiatives, eco-friendly organizations, and sustainability projects.",
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
    rating: null
  }
];

//helper function for the status badge switch
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

//to populate event grid on events.html
const EVENT_GRID = document.getElementById("EVENT_GRID");

if(EVENT_GRID) {

  EVENTS.forEach(event => {

      const badgeClass = getBadgeClass(event.status);

      EVENT_GRID.innerHTML += `
          <div class="card">

              <div class="flex-between">
                  <h3>${event.title}</h3>

                  <span class="badge ${badgeClass}">
                      ${event.status}
                  </span>
              </div>

              <p class="muted">
                  ${event.category} ·
                  ${event.date} ·
                  ${event.startTime} ·
                  ${event.location}
              </p>

              <p>${event.description}</p>

              <div class="flex-between">
                  <span class="muted">
                      ${event.registered} / ${event.capacity} spots filled
                  </span>

                  ${
                      event.status === "Full"
                          ? `<button class="btn" disabled>Event Full</button>`
                          : `<a class="btn" href="event-details.html?id=${event.id}">View Details</a>`
                  }

              </div>

          </div>
      `;
  });
}

//to populate event-details.html for each event
const title = document.getElementById("eventTitle");

if (title) {

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const event = EVENTS.find(e => e.id === id);

    if (event) {

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

        document.getElementById("eventDescription").textContent =
            event.description;

        document.getElementById("eventCapacity").textContent =
            `${event.registered}/${event.capacity} spots filled`;

        document.getElementById("registerButton").textContent =
            event.status === "Full" ? "Event Full" : "Register";

        document.getElementById("registerButton").disabled =
            event.status === "Full";

    }

}