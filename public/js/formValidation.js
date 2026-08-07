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

// ---- LOGIN (HTML checks required + email; JS checks the account) ----
const testAccounts = [
  {
    email: "student@campus.ca",
    password: "Student123!",
    page: "student-dashboard.html",
    role: "student",
  },
  {
    email: "admin@campus.ca",
    password: "Admin123!",
    page: "admin-dashboard.html",
    role: "admin",
  },
];
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const pass = document.getElementById("password").value;
    const box = document.getElementById("login-error");

    if (!emailPattern.test(email))
      return showMessage(box, "Invalid email or password.", false);

    const match = testAccounts.find(
      (a) => a.email === email && a.password === pass,
    );
    if (match) {
      localStorage.setItem("userRole", match.role);
      window.location.href = match.page;
    } else showMessage(box, "Invalid email or password.", false);
  });
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
  // Stops html file from reloading
  registerForm.addEventListener("submit", (e) => {
    // Get IDs
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;
    const role = document.getElementById("role").value;
    const box = document.getElementById("register-msg");

    // Checks names input if it matches names pattern
    if (!namePattern.test(firstName) && !namePattern.test(lastName))
      return showMessage(
        box,
        "First and last name must be 2+ characters, containing only letters, spaces, or dashes (-).",
        false,
      );
    // Checks email input if it matches email pattern
    if (!emailPattern.test(email))
      return showMessage(
        box,
        "Email must be a valid @gmail.com, @outlook.com, or @campus.ca address.",
        false,
      );

    // Checks password input if it matches password pattern
    if (!passwordPattern.test(pass))
      return showMessage(
        box,
        "Password must be 8+ characters with a capital letter, number, and special character.",
        false,
      );

    // Verifies confirm password matches with password
    if (pass !== confirm) {
      e.preventDefault();
      return showMessage(box, "Please make sure your passwords match.", false);
    }
    if (role === "")
      return showMessage(
        box,
        "Please select a role before registering.",
        false,
      );

    // Successful Account Creation Message
    showMessage(box, "Account created successfully!", true);

    // Resets form to a blank page after submission
    registerForm.reset();
  });
}

// ---- PROFILE (HTML checks name/email; JS handles the password logic) ----
const profileForm = document.getElementById("profile-form");
if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPass = document.getElementById("new-password").value;
    const confirm = document.getElementById("confirm-password").value;
    const box = document.getElementById("profile-msg");

    // password is optional - only check the match if they typed a new one
    if (newPass !== "") {
      if (!passwordPattern.test(newPass))
        return showMessage(
          box,
          "Password must be 8+ characters with a capital letter, number, and special character.",
          false,
        );
      if (newPass !== confirm)
        return showMessage(box, "New passwords do not match.", false);
    }
    showMessage(box, "Profile updated successfully!", true);
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
    e.preventDefault();
    const start = document.getElementById("start-time").value;
    const end = document.getElementById("end-time").value;
    const box = document.getElementById("event-msg");

    if (end <= start)
      return showMessage(box, "End time must be after start time.", false);
    showMessage(box, "Event saved successfully!", true);
  });
}
const createForm = document.getElementById("create-event-form");
if (createForm) validateEventForm(createForm);
const editEventForm = document.getElementById("edit-event-form");
if (editEventForm) validateEventForm(editEventForm);
