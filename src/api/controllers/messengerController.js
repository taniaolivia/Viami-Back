const db = require("../knex");

// Get a list of all messages sent by a user
exports.listAllMessagesBySenderId = (req, res) => {
    let senderId = req.params.senderId;
    
    db("message")
        .select("*")
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

// Get a list of all messages sent between two users
exports.listAllMessagesBySenderResponder = (req, res) => {
    let senderId = req.params.senderId;
    let responderId = req.params.responderId;

    db("message")
        .select("*")
        .where("senderId", senderId)
        .where("responderId", responderId)
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

