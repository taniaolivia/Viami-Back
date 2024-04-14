document.addEventListener('DOMContentLoaded', function() {
    var passwordInput = document.getElementById('passwordInput');
    var showPassword = document.getElementById('showPassword');
    var hidePassword = document.getElementById('hidePassword');

    showPassword.addEventListener('click', function() {
        passwordInput.type = 'text';
        showPassword.style.display = 'none';
        hidePassword.style.display = 'inline';
    });

    hidePassword.addEventListener('click', function() {
        passwordInput.type = 'password';
        showPassword.style.display = 'inline';
        hidePassword.style.display = 'none';
    });
});