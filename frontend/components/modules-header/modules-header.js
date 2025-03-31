// Define the loadHTML function
function loadModuleHeaderHTML(url, selector, callback) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.querySelector(selector).innerHTML = data;
            if (callback) callback(); // Call the callback function if it exists
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// Combine the functions into a single DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
    // Load the header HTML and initialize the menu after it's loaded
    loadModuleHeaderHTML('/frontend/components/modules-header/modules-header.html', '#modules-header', () => {
        const menuBars = document.getElementById('menu-bars');
        const navMenu = document.querySelector('.nav-menu');

        // Check if the elements are available before attaching event listeners
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
        }
    });
});


