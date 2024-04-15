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

exports.getAllAcceptedRequestsByUser = async (userId) => {
    try {
        const requests = await db("request_message_user")
            .select([
                "request_message_user.id as id",
                "request_message_user.requesterId as requesterId",
                "request_message_user.receiverId as receiverId",
                "requester.firstName as requesterFirstName",
                "requester.lastName as requesterLastName",
                "receiver.firstName as receiverFirstName",
                "receiver.lastName as receiverLastName",
                "requester.fcmToken as requesterFcmToken",
                "receiver.fcmToken as receiverFcmToken",
                "request_message_user.accept as accept",
                "request_message_user.chat as chat"
            ])
            .where(function () {
                this.where("receiverId", userId)
                    .orWhere("requesterId", userId);
            })
            .andWhere("accept", 1)
            .andWhere("chat", 0)
            .leftJoin("user as requester", "requester.id", "=", "request_message_user.requesterId")
            .leftJoin("user as receiver", "receiver.id", "=", "request_message_user.receiverId");

        return requests;
    } catch (error) {
        throw new Error("Failed to fetch accepted requests of the user");
    }
};

exports.setChat = async (requestId) => {
    try {
        await db("request_message_user")
            .update({ "chat": "1" })
            .where("id", requestId);

        return "Successfully updated the chat variable";
    } catch (error) {
        throw new Error("Failed to update the chat variable");
    }
};

