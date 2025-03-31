let lastverticalScroll = 0;
const header = document.querySelector("header");

// Scroll threshold in pixels
const scrollThreshold = 10; 

window.addEventListener("scroll", function () {

    let verticalScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Check if the scroll difference exceeds the threshold
    if (Math.abs(verticalScroll - lastverticalScroll) > scrollThreshold) {
        if (verticalScroll > lastverticalScroll) {
            // User scrolled down past the threshold
            header.style.transform = "translateY(-100%)"; // Hide header
        } else {
            // User scrolled up past the threshold
            header.style.transform = "translateY(0)"; // Show header
        }
    }
 
    // Update last scroll position
    lastverticalScroll = verticalScroll <= 0 ? 0 : verticalScroll; // For mobile or negative scrolling
});
