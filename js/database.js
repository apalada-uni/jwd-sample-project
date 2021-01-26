// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHOhUZgXcydm7qgvWcmR7IGfwmLAThXM0",
    authDomain: "jwd-app.firebaseapp.com",
    projectId: "jwd-app",
    storageBucket: "jwd-app.appspot.com",
    messagingSenderId: "481473274980",
    appId: "1:481473274980:web:c4999db0da438e257d6b71"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
