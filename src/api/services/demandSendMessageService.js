const db = require("../knex");
const { sendNotificationPush } = require('./firebaseService');

exports.sendNotificationPush = sendNotificationPush;

exports.addRequestMessage = async (requesterId, receiverId, fcmToken, title, content) => {
    try {
        await db("request_message_user").insert({ "requesterId": requesterId, "receiverId": receiverId });
        await exports.sendNotificationPush(fcmToken, title, content);
        return { success: true };
    } catch (error) {
        console.log(error);
        throw new Error("Failed send request message to a user");
    }
};
