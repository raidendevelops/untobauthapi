const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins for simplicity
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/firebase-config', (req, res) => {
    res.json({
        apiKey: "AIzaSyCOOOzdBKLfQpToFW6bt5XW-tgbOsb7-_s",
        authDomain: "untobauth.firebaseapp.com",
        projectId: "untobauth",
        storageBucket: "untobauth.firebasestorage.app",
        messagingSenderId: "595245764662",
        appId: "1:595245764662:web:ccd0b84b22745ca240c897",
        measurementId: "G-LWNEY850D4"
    });
});

module.exports = app;
