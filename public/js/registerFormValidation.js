const passwordRequirements = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])\S{8,}$/;

const passwordInput = document.getElementId('password');

let validationStatus = passwordRequirements.test(passwordInput.value);