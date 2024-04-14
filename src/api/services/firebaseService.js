const { getMessaging } = require("firebase-admin/lib/messaging/index.js");
exports.sendNotificationPush = (fcmToken, titleNotif, contentNotif) => {
    const receivedToken = fcmToken;
    const title = titleNotif;
    const content = contentNotif;
  
    const message = {
        notification: {
            title: title,
            body: content
        },
        token: receivedToken
    };
  
    return getMessaging()
        .send(message);
};