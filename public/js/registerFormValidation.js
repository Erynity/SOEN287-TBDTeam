const passwordRequirements = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])\S{8,}$/;

const passwordInput = document.getElementById('password');
const registerForm = document.getElementById('register-form');
const confirmInput = document.getElementById('confirmpassword');
const firstNameInput = document.getElementById('firstname');
const lastNameInput = document.getElementById('lastname');
const emailInput = document.getElementById('email');
const roleInput = document.getElementById('role');


registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const firstName = firstNameInput ? firstNameInput.value.trim() : '';
    const lastName = lastNameInput ? lastNameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    const confirmPassword = confirmInput ? confirmInput.value : '';
    const role = roleInput ? roleInput.value.trim() : '';

    if (firstName === '') {
        alert('Please fill out the First Name field.');
        return;
    }
    if (lastName === '') {
        alert('Please fill out the Last Name field.');
        return;
    }
    if (email === '') {
        alert('Please enter a valid email.');
        return;
    }
    if (password === '') {
        alert('Please enter a password.');
        return;
    }
    if (role === '') {
        alert('Please select a role.');
        return;
    }

    const validPassword = passwordRequirements.test(password);
    if (!validPassword) {
        alert('Password must be 8+ chars with uppercase, lowercase, number, and symbol.');
        return;
    }

    if (confirmPassword === '') {
        alert('Please confirm your password.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    registerForm.submit();
});




