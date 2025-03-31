
//mobile nav menu bar via global nav.js-------------------------------

// new feature prompt javascript
function dismissPrompt(event) {
  const prompt = document.getElementById('newFeaturePrompt');
  if (prompt) {
    prompt.remove();
  }
}

// Add click event listener to the entire document
document.addEventListener('click', dismissPrompt);

// Add click event listener to the prompt itself to prevent event bubbling
document.getElementById('newFeature')?.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevents click events from bubbling up to the document
});


fetch('../../auth/auth.html')
  .then(res => res.text())
  .then(data => {

    const DomParser = new DOMParser();
    const parsedHtml = DomParser.parseFromString(data, 'text/html');

    //dynamic css
      const dynamicAuthLink = document.createElement('link');
      dynamicAuthLink.rel = 'stylesheet';
      dynamicAuthLink.href = '../../auth/auth.css';
      dynamicAuthLink.type = 'text/css';
      dynamicAuthLink.className = 'dynamic-css';
      document.head.appendChild(dynamicAuthLink);

      //dynamic js
      const dynamicAuthScript = document.createElement('script');
      dynamicAuthScript.src = '../../auth/auth.js';
      dynamicAuthScript.type = 'module';
      dynamicAuthScript.className = 'dynamic-js';
        document.head.appendChild(dynamicAuthScript);
    

    const authContent = parsedHtml.getElementById('auth-main-content');

    if (authContent) {
      document.getElementById('auth-content').innerHTML = authContent.innerHTML;
    } else {
      console.log('authContent not found');

    }
  });