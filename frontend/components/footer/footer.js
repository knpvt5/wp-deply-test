
function loadFooterHTML() {
    fetch('/frontend/components/footer/footer.html')
    .then(response => response.text())
    .then(footerHTML => {
        const footer = document.getElementById('footer');
        if(footer){
            footer.innerHTML = footerHTML;
        }else{
            console.error('Footer element not found.');
        }
    })
    .catch(error => {
        console.error('Error loading footer HTML:', error);
    });
}

function loadFooterCSS(){
    fetch('/frontend/components/footer/footer.css')
    .then(response => response.text())
    .then(footerCSS => {
        const style = document.createElement('style');
        style.innerHTML = footerCSS;
        document.head.appendChild(style);
    })
    .catch(error => {
        console.error('Error loading footer CSS:', error);
    });
}

// calling the function 
document.addEventListener("DOMContentLoaded", () => {
    loadFooterHTML();
    loadFooterCSS();

});





