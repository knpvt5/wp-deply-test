// Toggle dark mode and save preference in localStorage
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    const darkModeButton = document.getElementById('dark-mode-button');

    // Update button icon based on current state
    darkModeButton.innerHTML = document.body.classList.contains('dark-mode') 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';

    // Save the current button icon in localStorage
    localStorage.setItem('darkModeButton', darkModeButton.innerHTML);

    // Check if dark mode is currently enabled
    const isDarkMode = document.body.classList.contains('dark-mode');

    // Save the state in localStorage
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
};

// Load dark mode preference on page load
window.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode');
    const darkModeButtonState = localStorage.getItem('darkModeButton');
    const darkModeButton = document.getElementById('dark-mode-button');

    // Load dark mode preference
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    // Set button icon based on saved state
    if (darkModeButtonState) {
        darkModeButton.innerHTML = darkModeButtonState;
    } else {
        darkModeButton.innerHTML = (darkMode === 'enabled') 
            ? '<i class="fa-solid fa-sun"></i>' 
            : '<i class="fa-solid fa-moon"></i>';
    }
});
