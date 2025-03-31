const loginButton = document.querySelector('.login-button');
const accountIcon = document.querySelector('.account-icon');
const accountIconImg = document.querySelector('.account-icon .account-icon-image');
const profileCard = document.querySelector('.profile-card');
const profileImg = document.querySelector('.profile-img');
const profileName = document.querySelector('.profile-name');
const profileEmail = document.querySelector('.profile-email');
const logoutButton = document.querySelector('.logout-button');

// Login button handler
loginButton.addEventListener('click', () => {
  loginButton.innerHTML = '<span class="spinner"></span>Login...';
  loginButton.disabled = true;
  window.location.href = '/login';
});

// Logout button handler
logoutButton.addEventListener('click', () => {
  const logout = confirm('Are you sure you want to logout?');
  if (logout) {
    logoutButton.innerHTML = '<span class="spinner"></span>Logout...';
    logoutButton.disabled = true;
    window.location.href = '/logout';
  }
});


//outside click close
function outsideClick(e) {
  if (
    profileCard.classList.contains('active') &&
    !e.target.closest('.account-icon') &&
    !e.target.closest('.profile-card')
  ) {
    profileCard.classList.remove('active');
  }
}


document.addEventListener('click', outsideClick);

// Toggle profile card when account icon is clicked
// (Moved outside the auth check to avoid potential timing issues)
accountIcon.addEventListener('click', () => {
  if (accountIcon.classList.contains('active')) {
    profileCard.classList.toggle('active');
  }
});

function authStatusCheck() {
  fetch('/auth-status')
    .then(res => res.json())
    .then(data => {
      // console.log(data);
      if (data.isAuthenticated === true) {
        accountIcon.classList.add('active');
        loginButton.classList.add('hide');
        
        // Fetch user data and update UI
        fetch('/user-data')
          .then(res => res.json())
          .then(data => {
            profileName.textContent = data.name;
            accountIconImg.src = `${data.picture}`;
            profileImg.src =  `https://ui-avatars.com/api/?name=${data.name}`;
            profileEmail.textContent = data.email;
          })
          .catch(err => {
            console.error("Error fetching user data:", err);
          });
      } else {
        accountIcon.classList.remove('active');
        loginButton.classList.remove('hide');
      }
    })
    .catch((err) => {
      console.error("Error checking auth status:", err);
    })
    .finally(() => {
      console.log("Auth status check completed");
    });
}

// Initial authentication call
authStatusCheck();