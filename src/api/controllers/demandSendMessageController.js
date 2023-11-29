const {initializeApp, applicationDefault } = require('firebase-admin/app');
const { getMessaging } = require("firebase-admin/messaging");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require('path');
const firebaseConfig = require("../viami-402918-firebase-adminsdk-6nvif-9e01aebec8.js").firebase;

const serviceAccount = JSON.parse(JSON.stringify(firebaseConfig));

initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
});

exports.demandSendMessage = (req, res) => {
   const receivedToken = req.body.fcmToken;
  
  const message = {
    notification: {
      title: "Notif",
      body: 'This is a Test Notification'
    },
    token: receivedToken,
  };
  
  getMessaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: receivedToken,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
}