
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


const smartTradingContainer = document.querySelector('#smart-trading-container');

// Create the skeleton structure and repeat it 5 times
const skeletonTemplate = `
        <div class="skeleton">
            <div class="skeleton-text short"></div>
            <div class="skeleton-image"></div>
            <div class="skeleton-text"></div>
        </div>
`;

smartTradingContainer.innerHTML = skeletonTemplate.repeat(5); // Adding skeletons

fetch('/wealth-sense/smart-trading')
    .then(res => res.json())
    .then(data => {

        // Sort the data in ascending order based on field.id
        data.sort((a, b) => a.id - b.id);

        // Remove all skeleton elements once the data is fetched
        const skeletons = document.querySelectorAll('.skeleton');
        skeletons.forEach(skeleton => skeleton.remove());

        // Populate the container with the actual data
        data.forEach(field => {
            const smartTradingDiv = document.createElement('div');
            smartTradingDiv.classList.add('smart-trading');
            smartTradingDiv.innerHTML = `
                <h3>${field.id}. ${field.title}</h3>
                <p class="category">${field.category}</p>
                <p class="content">${field.content}</p>
                <p class="tags">${field.tags}</p>
                <p class="created-at">${field.created_at}</p>
            `;
            smartTradingContainer.appendChild(smartTradingDiv);
        });
    })
    .catch(err => {
        console.error('Error fetching data:', err);

        // Remove skeletons if there's an error
        const skeletons = document.querySelectorAll('.skeleton');
        skeletons.forEach(skeleton => skeleton.remove());

        // Optionally, display an error message or fallback content
        smartTradingContainer.innerHTML = '<p>Failed to load data. Please try again later.</p>';
    });
