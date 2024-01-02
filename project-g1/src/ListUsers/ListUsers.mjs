import myRefreshToken from '../Chaves/chaves-privadas.json';

const { initializeApp } = require('firebase-admin/app');


const app = initializeApp();
const myRefreshToken = '...'; // Get refresh token from OAuth2 flow

initializeApp({
  credential: refreshToken(myRefreshToken),
  databaseURL: 'https://game-list-c3dc2-default-rtdb.firebaseio.com'
});
