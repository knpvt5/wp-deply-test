

// global navigation js------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const menuBars = document.getElementById('menu-bars');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle the menu visibility when clicking the menu bar
    menuBars.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the click event from bubbling up to the document
        navMenu.classList.toggle('active'); // Toggle the menu visibility
        menuBars.classList.toggle('bar-active'); // Toggle the class on the menu bar
    });

    // Hide the menu when clicking outside the menu bar and menu
    document.addEventListener('click', function (event) {
        if (!navMenu.contains(event.target) && !menuBars.contains(event.target)) {
            navMenu.classList.remove('active'); // Hide the menu
            menuBars.classList.remove('bar-active'); // Remove the active class from the menu bar
        }
    });
});


let lastverticalScroll = 0;
const navbar = document.querySelector("nav");

// Scroll threshold in pixels
const scrollThreshold = 10; 

window.addEventListener("scroll", function () {

    let verticalScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Check if the scroll difference exceeds the threshold
    if (Math.abs(verticalScroll - lastverticalScroll) > scrollThreshold) {
        if (verticalScroll > lastverticalScroll) {
            // User scrolled down past the threshold
            navbar.style.transform = "translateY(-100%)"; // Hide navbar
        } else {
            // User scrolled up past the threshold
            navbar.style.transform = "translateY(0)"; // Show navbar
        }
    }
 
    // Update last scroll position
    lastverticalScroll = verticalScroll <= 0 ? 0 : verticalScroll; // For mobile or negative scrolling
});
