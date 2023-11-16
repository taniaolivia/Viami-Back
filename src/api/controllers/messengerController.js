const db = require("../knex");

// Get a list of all messages sent by a user
exports.listAllMessagesBySenderId = (req, res) => {
    let senderId = req.params.senderId;
    
    db("message")
        .select([
            "message.id as id",
            "sender.id as senderId",
            "responder.id as responderId",
            "message.date as date",
            "message.message as message",
            "sender.firstName as senderFirstName",
            "sender.lastName as senderLastName",
            "responder.firstName as responderFirstName",
            "responder.lastName as responderLastName"
        ])
        .where("senderId", senderId)
        .join("user as sender", "sender.id", "=", "message.senderId")
        .join("user as responder", "responder.id", "=", "message.responderId")
        .orderBy("date", "asc")
        .then(data => res.status(200).json({"messages": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get the last message between the two users
exports.getLastMessageBySenderResponder = (req, res) => {
    let senderId = req.params.senderId;
    let responderId = req.params.responderId;

    db("message")
        .select([
            "message.id as id",
            "sender.id as senderId",
            "responder.id as responderId",
            "message.date as date",
            "message.message as message",
            "sender.firstName as senderFirstName",
            "sender.lastName as senderLastName",
            "responder.firstName as responderFirstName",
            "responder.lastName as responderLastName"
        ])
        .where({"senderId": senderId, "responderId": responderId})
        .orWhere({"senderId": responderId, "responderId": senderId})
        .join("user as sender", "sender.id", "=", "message.senderId")
        .join("user as responder", "responder.id", "=", "message.responderId")
        .orderBy("id", "desc")
        .limit(1)
        .then(data => res.status(200).json({"messages": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Set a message read
exports.setMessageRead = (req, res) => {
    let messageId = req.params.messageId;
    
    db("message")
        .update("read", "1")
        .where("id", messageId)
        .then(data => res.status(200).json({"message": "Message is set to read successfully !"}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}


