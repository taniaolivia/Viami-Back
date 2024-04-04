const db = require("../knex");

exports.setMessageRead = async (messageId, userId) => {
    try {
        await db("message_user_read").insert({
            messageId: messageId,
            userRead: userId
        });
        return { message: "Message is set to read successfully!" };
    } catch (error) {
        throw new Error("Failed to set message as read.");
    }
};

exports.getMessageById = async (messageId) => {
    try {
        const message = await db("message")
            .select("*")
            .where("id", messageId)
            .first();

        if (!message) {
            throw new Error("Message not found");
        }

        return message;
    } catch (error) {
        throw new Error("Failed to get message by id");
    }
};


