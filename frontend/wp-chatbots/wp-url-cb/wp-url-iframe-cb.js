const wpCbContainer = document.getElementById('wp-cb-container');
const wpUrlIframeCbLogo = document.createElement('img');
wpUrlIframeCbLogo.src = '/assets/branding/wp-w-cir-logo.webp';
wpUrlIframeCbLogo.alt = 'chatbot logo';
wpUrlIframeCbLogo.id = 'wp-url-cb-logo';
wpUrlIframeCbLogo.style.cssText = `
  height: 55px;
  width: 55px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 30px;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

wpCbContainer.appendChild(wpUrlIframeCbLogo);

const wpUrlIframeCb = document.createElement('iframe')
wpUrlIframeCb.src = '/frontend/wp-chatbots/wp-url-cb/wp-url-cb.html';
wpUrlIframeCb.title = 'iframe Chatbot';
wpUrlIframeCb.id = 'wp-url-iframe-cb';
wpUrlIframeCb.style.cssText = `
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 95vw;
  max-width: 450px;
  height: 100vh;
  max-height: 700px;
  background-color: transparent;
  display: none;
  border: none;
  z-index: 999;
  border-radius: 10px;
`;
wpCbContainer.appendChild(wpUrlIframeCb);


// Create a chat logo/button to toggle the chatbot
function displayChatbot() {  
  // Toggle chatbot visibility on logo click
  wpUrlIframeCbLogo.onclick = (e) => {
    e.stopPropagation(); 
    const chatbot = wpUrlIframeCb;
    chatbot.style.display = chatbot.style.display === 'none' ? 'block' : 'none';
  };
}

// Close chatbot when clicking outside
function setupCloseOnOutsideClick() {
  document.addEventListener('click', (e) => { 
    // Check if the clicked element is not the chatbot or the logo
    if (
      wpUrlIframeCb &&
      wpUrlIframeCbLogo &&
      wpUrlIframeCb.style.display === 'block' &&
      !wpUrlIframeCb.contains(e.target) &&
      !wpUrlIframeCbLogo.contains(e.target)
    ) {
      wpUrlIframeCb.style.display = 'none'; // Close the chatbot
    }
  });
}

// Initialize when the page loads
window.addEventListener('load', () => {
  displayChatbot();
  setupCloseOnOutsideClick();
});
