// functions/firebaseConfig.js
exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Allow all origins for simplicity
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        },
        body: JSON.stringify({
            apiKey: "AIzaSyCOOOzdBKLfQpToFW6bt5XW-tgbOsb7-_s",
            authDomain: "untobauth.firebaseapp.com",
            projectId: "untobauth",
            storageBucket: "untobauth.firebasestorage.app",
            messagingSenderId: "595245764662",
            appId: "1:595245764662:web:ccd0b84b22745ca240c897",
            measurementId: "G-LWNEY850D4"
        })
    };
};
