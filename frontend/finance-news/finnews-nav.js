document.addEventListener('DOMContentLoaded', function () {
    const menuBars = document.getElementById('menu-bars');
    const navMenu = document.querySelector('.nav-menu');
    const financeNewsLink = document.querySelector('.nav-menu a[href*="finance-news"]');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    function toggleMobileMenu(event) {
        event.stopPropagation();
        navMenu.classList.toggle('active');
        menuBars.classList.toggle('active');
    }

    function closeMobileMenu() {
        navMenu.classList.remove('active');
        menuBars.classList.remove('active');
    }

    function handleOutsideClick(event) {
        if (!navMenu.contains(event.target) && !menuBars.contains(event.target)) {
            closeMobileMenu();
        }
    }

    function addMobileClickListeners() {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.dropdown > a').forEach(dropdown => {
                dropdown.addEventListener('click', function (e) {
                    e.preventDefault();
                    this.nextElementSibling.classList.toggle('active');
                });
            });
        }
    }

    if (menuBars && navMenu) {
        menuBars.addEventListener('click', toggleMobileMenu);
        document.addEventListener('click', handleOutsideClick);

        document.querySelector('.nav-menu').addEventListener('click', function (event) {
            const target = event.target;
            if (target.matches('.nav-menu a') && window.innerWidth <= 768) {
                if (target === financeNewsLink) {
                    event.preventDefault();
                    dropdownMenu.classList.toggle('active');
                } else {
                    closeMobileMenu();
                }
            }
        });

        financeNewsLink.addEventListener('touchstart', function (event) {
            if (window.innerWidth <= 768) {
                event.preventDefault();
                dropdownMenu.classList.toggle('active');
            }
        });
    }

    addMobileClickListeners();
    window.addEventListener('resize', addMobileClickListeners);
});



// nav scroll js----------------------------------------------------
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
