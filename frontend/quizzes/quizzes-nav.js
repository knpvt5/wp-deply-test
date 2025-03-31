
document.addEventListener('DOMContentLoaded', function () {
    const menuBars = document.getElementById('menu-bars');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a'); // Select all navigation links

    // Only add event listeners if the elements exist
    if (menuBars && navMenu) {
        // Toggle the menu visibility when clicking the menu bar
        menuBars.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent the click event from bubbling up to the document
            navMenu.classList.toggle('active'); // Toggle the menu visibility
            menuBars.classList.toggle('active'); // Toggle the class on the menu bar
        });

        // Hide the menu when clicking outside the menu bar and menu
        document.addEventListener('click', function (event) {
            if (!navMenu.contains(event.target) && !menuBars.contains(event.target)) {
                navMenu.classList.remove('active'); // Hide the menu
                menuBars.classList.remove('active'); // Remove the active class from the menu bar
            }
        });

        // Close the menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active'); // Hide the menu
                menuBars.classList.remove('active'); // Remove the active class from the menu bar
            });
        });
    }
});
