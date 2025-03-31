
// Array to store cart Contents
let bookmarkItems = JSON.parse(localStorage.getItem('bookmarks')) || [];

// fn to Toggle the visibility of #bookmark-container
function toggleBookmark(event) {
    event.stopPropagation();
    const bookmarkContainer = document.querySelector('#bookmark-container');

    // Toggle display between 'block' and 'none'
    if (bookmarkContainer.style.display === 'none' || bookmarkContainer.style.display === '') {
        bookmarkContainer.style.display = 'block';
    } else {
        bookmarkContainer.style.display = 'none';
    }
}

// Add the toggle function to your button or trigger element
const bookmarkButton = document.querySelector('#bookmark-icon-container');
bookmarkButton.addEventListener('click', toggleBookmark);

// Add a document-wide click listener to hide #bookmark-container when clicking outside it
document.addEventListener('click', (e) => {
    const bookmarkContainer = document.querySelector('#bookmark-container');

    // Check if the container is open and if the click was outside the container
    if (bookmarkContainer.style.display === 'block' && !bookmarkContainer.contains(e.target)) {
        bookmarkContainer.style.display = 'none';
    }
});



// Function to save bookmark items to localStorage
function saveBookmarks() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkItems));
}


// Function to handle appending a bookmark to the list
function appendBookmark(bookmarkItem) {
    const bookmarks = document.querySelector('#bookmark-items');
    const bookmarkDiv = document.createElement('div');
    bookmarkDiv.classList.add('bookmark-item');

    // Adding data-url attribute directly to bookmarkDiv for redirection
    bookmarkDiv.setAttribute('data-url', bookmarkItem.url);

    bookmarkDiv.innerHTML = `
        <img src="${bookmarkItem.image}" alt="Bookmarked Image">
        <h4>${bookmarkItem.title}</h4>
        <button class="delete-item"><i class="fa-solid fa-trash" alt="Trash Icon"></i></button>
    `;

    bookmarks.prepend(bookmarkDiv);

    // Add event listener to the bookmarkDiv itself
    bookmarkDiv.addEventListener('click', (e) => {
        e.preventDefault();

        if (!bookmarkItem.url) return;

        // Redirect to the stored URL in the bookmarkItem object
        if (bookmarkItem.url) {
            fetch(bookmarkItem.url)
                .then(response => {
                    if (response.status === 200) {
                        // If the response is 200, redirect to the page
                        window.location.href = bookmarkItem.url;
                    } else if (response.status === 404) {
                        // If the response is 404, show the "Coming Soon" alert
                        alert("Coming Soon");
                    } else {
                        // Handle other statuses if necessary
                        alert("Error: Page not found.");
                    }
                })
                .catch(error => {
                    // If there is any error in the fetch request
                    console.error('Error fetching the URL:', error);
                    alert("Error loading the page.");
                });
        }
    });


    // Add the delete button event listener
    const deleteButton = bookmarkDiv.querySelector('.delete-item');
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteBookmark(bookmarkDiv, bookmarkItem.id);
    });
}

// Function to delete a bookmark
function deleteBookmark(bookmarkDiv, moduleId) {

    // Remove the entire bookmarkDiv
    bookmarkDiv.remove();

    // Update the bookmark items array
    bookmarkItems = bookmarkItems.filter(item => item.id !== moduleId);

    // Reset the button text for the removed item
    const button = document.querySelector(`.rlbtn[module-id="${moduleId}"]`);
    if (button) {
        button.textContent = "Read Later";
    }

    // Update the bookmark item count and display
    bookmarkItemCount(bookmarkItems);
    updateBookmarkDisplay(bookmarkItems);

    // Save the updated bookmarks to localStorage
    saveBookmarks();
}

// Function to handle the "Read Later" button click
const readLater = document.querySelectorAll('.rlbtn');
readLater.forEach(button => button.addEventListener('click', () => {
    const currentContent = button.closest('.content');

    button.textContent = "Bookmarked";
    const moduleId = currentContent.getAttribute('module-id');

    const contentTitle = currentContent.querySelector('h2 strong').innerText;
    const contentImage = currentContent.querySelector('img').src;

    const contentUrl = currentContent.querySelector('.lmbtn')
    const onclickLink = contentUrl.getAttribute('onclick');

    // Use a regex to extract the URL part from the onclick attribute
    const moduleUrl = onclickLink?.match(/'([^']+)'/)?.[1] || '';


    const bookmarkItem = {
        image: contentImage,
        id: moduleId,
        title: contentTitle,
        url: moduleUrl
    };

    // Check if the item already exists in bookmarkItems
    const itemExists = bookmarkItems.some(item => item.id === moduleId);
    if (itemExists) {
        alert(`${bookmarkItem.title} "Item already in cart"`);
    } else {
        // Push this object to the bookmarkItems array
        bookmarkItems.push(bookmarkItem);

        // Update the bookmark count and display
        bookmarkItemCount(bookmarkItems);
        updateBookmarkDisplay(bookmarkItems);

        // Append the new bookmark to the list
        appendBookmark(bookmarkItem);

        // Save bookmarks to localStorage
        saveBookmarks();
    }
}));

// Function to display the bookmark items count
function bookmarkItemCount(bookmarkItems) {
    const bookmarkCount = document.querySelector('#total-bookmark');
    const count = bookmarkItems.length;

    if (count === 0) {
        bookmarkCount.innerText = "0";
    } else if (count < 10) {
        bookmarkCount.innerText = `0${count}`;
    } else {
        bookmarkCount.innerText = count;
    }
}

// Function to update bookmark display (show/hide delete all button)
function updateBookmarkDisplay(bookmarkItems) {
    const deleteAllButton = document.querySelector('.deleteall');
    const bookmarkHeading = document.querySelector('.bookmark-heading');
    if (bookmarkItems.length > 0) {
        deleteAllButton.style.display = "block";
        bookmarkHeading.innerHTML = "Bookmarks: -";
    } else {
        deleteAllButton.style.display = "none";
        bookmarkHeading.innerHTML = "Empty Bookmarks";
    }
}
updateBookmarkDisplay(bookmarkItems);

// Added "Delete all Bookmarks" button functionality
const deleteAllButton = document.querySelector('.deleteall');
deleteAllButton.addEventListener('click', () => {
    // Ask for confirmation before deleting all bookmarks
    const confirmDelete = confirm("Are you sure you want to delete all bookmarks?");

    if (confirmDelete) {

        // Clear the bookmarkItems array
        bookmarkItems = [];

        // Remove all bookmark divs from the DOM
        const bookmark = document.querySelector('#bookmark-items');
        bookmark.innerHTML = ''; // This will remove all child elements (bookmark divs)

        // Reset all "Bookmarked" buttons back to "Read Later"
        document.querySelectorAll('.rlbtn').forEach(button => button.textContent = "Read Later");

        // Update bookmark display and count
        updateBookmarkDisplay(bookmarkItems);
        bookmarkItemCount(bookmarkItems);

        // Clear localStorage
        saveBookmarks();
    }
});



// Load bookmarks from localStorage on page load
function loadBookmarks() {
    bookmarkItems.forEach(item => appendBookmark(item));
    bookmarkItemCount(bookmarkItems);
    updateBookmarkDisplay(bookmarkItems);

    // Restore "Read Later" button states
    const readLaterButtons = document.querySelectorAll('.rlbtn');
    readLaterButtons.forEach(rlButton => {
        const moduleId = rlButton.getAttribute('module-id');
        const itemExists = bookmarkItems.some(item => item.id === moduleId);
        if (itemExists) {
            rlButton.textContent = "Bookmarked";
        }
    });
}
loadBookmarks();
