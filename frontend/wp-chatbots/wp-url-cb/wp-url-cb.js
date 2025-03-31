const scrapeBtn = document.getElementById('scrapeBtn');
const askBtn = document.getElementById('askBtn');
const userInput = document.getElementById('userInput');
const responseArea = document.getElementById('responseArea');
const suggestedQuestionBox = document.querySelector('.suggested-question-box');
const scrapResponseArea = document.getElementById('scrapResponseArea');


// Consolidated DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async () => {
    scrapeBtn.addEventListener('click', async () => {
        try {
            scrapResponseArea.innerHTML = '<b>Scraping website...</b>';

            const response = await fetch('/wp-url-cb/scraped-data', {
                method: 'GET' // optional, The default HTTP method for fetch() is GET
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                scrapResponseArea.innerHTML = `
                    <strong>Scraped Text:</strong>
                    <pre style="white-space: pre-wrap;">${data.scrapedText}</pre>
                `;
                console.log(`Scraped ${data.textLength} characters`);
            } else {
                scrapResponseArea.innerHTML = '<b>Failed to scrape website</b>';
            }
        } catch (error) {
            console.error('Scraping error:', error);
            scrapResponseArea.innerHTML = `<b>Error: ${error.message}</b>`;
        }
    });
    scrapeBtn.click();

    // Enable/Disable the ask button based on user input
    function updateAskButtonState() {
        askBtn.disabled = userInput.value.trim() === "";
    }
    userInput.addEventListener('input', updateAskButtonState);
    updateAskButtonState(); // Initial state
});

// Suggested questions event listener
document.querySelectorAll('.suggested-question').forEach((suggestedQuestion) => {
    suggestedQuestion.addEventListener('click', () => {
        userInput.value = suggestedQuestion.textContent;
        const inputEvent = new Event("input", { bubbles: true });
        userInput.dispatchEvent(inputEvent);
        askBtn.click();
        if (window.innerWidth <= 430) {
            userInput.blur();
        }
    });
});

// Consolidated keyboard event handling
userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        askBtn.click();
    }
});

// Function to create a conversation message element
function createMessageElement(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `message-${role}`);
    const parsedText = marked.parse(text);
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-role">${role === 'user' ? 'You' : 'AI'}:</span>
            ${parsedText}
        </div>
    `;
    return messageDiv;
}

let userScrolling = false;
// Function to check user scroll
responseArea.addEventListener('scroll', () => {
    if (responseArea.scrollTop < responseArea.scrollHeight - responseArea.clientHeight - 50) {
        userScrolling = true;
    } else {
        userScrolling = false;
    }
});

// Auto-scroll function
function autoScroll() {
    if (!userScrolling) {
        responseArea.scrollTop = responseArea.scrollHeight;
    }
}

askBtn.addEventListener('click', async () => {
    try {
        const authResponse = await fetch('/auth-status');
        const authData = await authResponse.json();

        if (authData.isAuthenticated !== true) {
            alert('Please log in to ask questions');
            return; // Exit the function immediately if not authenticated
        }

        const question = userInput.value.trim();
        if (!question) {
            console.log("No question provided");
            return;
        }

        // Blur the input field to hide the keyboard
        if (window.innerWidth <= 430) {
            userInput.blur();
        }

        // Disable and clear user input and ask button
        userInput.value = '';
        userInput.disabled = true;
        askBtn.disabled = true;

        // Remove suggested questions
        if (suggestedQuestionBox) suggestedQuestionBox.remove();

        // Add user message to response area
        const questionElement = createMessageElement('user', question);
        responseArea.appendChild(questionElement);
        responseArea.scrollTop = responseArea.scrollHeight;

        // Create AI response element for streaming
        const responseElement = createMessageElement('ai', 'Generating...');
        responseArea.appendChild(responseElement);
        responseArea.scrollTop = responseArea.scrollHeight;
        const contentDiv = responseElement.querySelector('.message-content');

        const response = await fetch('/wp-url-cb/wp-ask', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (!response.body) {
            contentDiv.innerHTML = 'Error: No response stream.';
            return;
        }

        // Stream response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            lines.forEach(line => {
                if (line.startsWith('data: ')) {
                    if (line.includes('[DONE]')) return;

                    try {
                        const jsonData = JSON.parse(line.slice(6));
                        if (jsonData.content) {
                            fullResponse += jsonData.content;
                            contentDiv.innerHTML = marked.parse(fullResponse);
                            autoScroll();
                        }
                    } catch (parseError) {
                        console.error('JSON parse error:', parseError);
                    }
                }
            });
        }

        if (fullResponse.includes('[DONE]')) {
            fullResponse = fullResponse.replace('[DONE]', '').trim();
            contentDiv.innerHTML = marked.parse(fullResponse);
        }

    } catch (error) {
        console.error('Authentication or request error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        userInput.disabled = false;
        askBtn.disabled = userInput.value.trim() === "";
        userInput.focus();
        if (window.innerWidth <= 430) {
            userInput.blur();
        }
    }
});

