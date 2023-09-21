/* eslint-disable */
import '@babel/polyfill';
// import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
// DOM Elements
// const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateFrom = document.querySelector('.form-user-data');
const updatePasswordFrom = document.querySelector('.form-user-password');

// if (mapBox) {
//   const locations = JSON.parse(mapBox.dataset.locations);
//   displayMap(locations);
// }

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (updateFrom) {
  updateFrom.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    updateSettings({ name, email }, 'user');
  });
}
if (updatePasswordFrom) {
  updatePasswordFrom.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').value = 'Updaing';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );
    document.querySelector('.btn--save-password').value = 'save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
