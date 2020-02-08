import '@babel/polyfill';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { updateSettings } from './updateSettings.js';
import { bookTour } from './stripe';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const settingsForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-settings');
const bookTourBtn = document.getElementById('book-tour');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  document.querySelector('.form--login').addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  document.querySelector('.nav__el--logout').addEventListener('click', logout);
}

if (settingsForm) {
  document
    .querySelector('.form-user-data')
    .addEventListener('submit', event => {
      event.preventDefault();

      const form = new FormData();
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('photo', document.getElementById('photo').files[0]);

      updateSettings(form, 'data');
    });
}

if (passwordForm) {
  document
    .querySelector('.form-user-settings')
    .addEventListener('submit', async event => {
      event.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Updating...';

      const currentPassword = document.getElementById('password-current').value;
      const newPassword = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;

      await updateSettings(
        { currentPassword, newPassword, passwordConfirm },
        'password'
      );

      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
      document.querySelector('.btn--save-password').textContent =
        'Save password';
    });
}

if (bookTourBtn) {
  document.getElementById('book-tour').addEventListener('click', event => {
    event.target.textContent = 'Processing...';
    const { tourId } = event.target.dataset;
    bookTour(tourId);
  });
}
