
//js for the bubble effect
document.addEventListener("DOMContentLoaded", function () {
    const bubbleContainer = document.querySelector('.bubbles');

    // Bubble Animation
    for (let i = 0; i < 50; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        // Set random size
        const size = Math.random() * (80 - 20) + 20; // Random size between 20px and 80px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // Set random position
        const top = Math.random() * 100; // Random top position percentage
        const left = Math.random() * 100; // Random left position percentage
        bubble.style.top = `${top}%`;
        bubble.style.left = `${left}%`;

        // Set random color
        const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`;
        bubble.style.backgroundColor = color;

        // Set random animation duration
        const duration = Math.random() * (30 - 10) + 10; // Random duration between 10s and 30s
        bubble.style.animationDuration = `${duration}s`;

        bubbleContainer.appendChild(bubble);
    }
});