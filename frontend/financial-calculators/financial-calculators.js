// Mobile nav-menu JS
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu li a');

    mobileMenu.addEventListener('click', function () {
        navMenu.classList.toggle('active'); // Toggle the menu visibility
        mobileMenu.classList.toggle('active'); // Toggle class on mobileMenu
    });

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('active'); // Hide the menu
            mobileMenu.classList.remove('active'); // Remove active class from mobileMenu
        });
    });
});
