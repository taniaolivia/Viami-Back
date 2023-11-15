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
            "sender.firstName as firstName",
            "sender.lastName as lastName",
            "sender.email as email",
            "sender.password as password",
            "sender.location as location",
            "sender.description as description",
            "sender.phoneNumber as phoneNumber",
            "sender.birthday as birthday",
            "sender.age as age",
            "sender.sex as sex",
            "sender.lastConnection as lastConnection",
            "sender.connected as connected",
            "sender.profileImage as profileImage",
            "sender.verifyEmailToken as verifyEmailToken",
            "sender.emailVerified as emailVerified",
            "sender.plan as plan"
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
            "sender.firstName as firstName",
            "sender.lastName as lastName",
            "sender.email as email",
            "sender.password as password",
            "sender.location as location",
            "sender.description as description",
            "sender.phoneNumber as phoneNumber",
            "sender.birthday as birthday",
            "sender.age as age",
            "sender.sex as sex",
            "sender.lastConnection as lastConnection",
            "sender.connected as connected",
            "sender.profileImage as profileImage",
            "sender.verifyEmailToken as verifyEmailToken",
            "sender.emailVerified as emailVerified",
            "sender.plan as plan"
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
    let messageId = req.params.id;
    
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


