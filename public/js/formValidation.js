// ============================================================
//  Form Validation - JS only handles what HTML can't:
//  comparing fields (passwords match, end after start).
//  Simple checks (required, email, number) are done in the HTML.
// ============================================================

function showMessage(box, text, ok) {
  box.textContent = text;
  box.style.color = ok ? "var(--status-open)" : "var(--status-cancelled)";
  box.hidden = false;
}

// ---- REGISTER (HTML checks the fields; JS checks passwords match) ----
// Regular Expression for password
const passwordPattern =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])\S{8,}$/;

// Regular Expression for email
const emailPattern = /^(\S+@)(gmail|outlook|campus)\.(com|ca)$/i;

// Regular Expression for first and last name
const namePattern = /^[a-zA-Z \-]{2,}$/;

// Links to registration form
const registerForm = document.getElementById("register-form");

// Verifies we're in registerForm
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;
    const box = document.getElementById("register-msg");

    // if ANY check fails, stop the submit and show the message
    if (!namePattern.test(firstName) && !namePattern.test(lastName)) {
      e.preventDefault();
      return showMessage(
        box,
        "First and last name must be 2+ characters, letters/spaces/dashes only.",
        false,
      );
    }
    if (!emailPattern.test(email)) {
      e.preventDefault();
      return showMessage(
        box,
        "Email must be a valid @gmail.com, @outlook.com, or @campus.ca address.",
        false,
      );
    }
    if (!passwordPattern.test(pass)) {
      e.preventDefault();
      return showMessage(
        box,
        "Password must be 8+ characters with a capital letter, number, and special character.",
        false,
      );
    }
    if (pass !== confirm) {
      e.preventDefault();
      return showMessage(box, "Please make sure your passwords match.", false);
    }
    if (role === "") {
      e.preventDefault();
      return showMessage(
        box,
        "Please select a role before registering.",
        false,
      );
    }
  });
}

// ---- CONTACT (HTML checks everything; JS just confirms) ----
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    const box = document.getElementById("contact-msg");

    if (!namePattern.test(fullName))
      return showMessage(box, "Please enter a valid full name.", false);

    if (!emailPattern.test(email))
      return showMessage(
        box,
        "Please enter a valid @gmail.com, @outlook.com, or @campus.ca address.",
        false,
      );

    showMessage(box, "Message sent successfully!", true);
    contactForm.reset();
  });
}

// ---- CREATE & EDIT EVENT (HTML checks fields; JS checks end > start) ----
function validateEventForm(form) {
  form.addEventListener("submit", (e) => {
    const start = document.getElementById("start-time").value;
    const end = document.getElementById("end-time").value;
    const box = document.getElementById("event-msg");

    if (end <= start) {
      e.preventDefault();
      return showMessage(box, "End time must be after start time.", false);
    }
    showMessage(box, "Event saved successfully!", true);
  });
}
const createForm = document.getElementById("create-event-form");
if (createForm) validateEventForm(createForm);
const editEventForm = document.getElementById("edit-event-form");
if (editEventForm) validateEventForm(editEventForm);
