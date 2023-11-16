const db = require("../knex");
const io = require('../socket'); 

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

//get message by id 
exports.getMessageById = (req, res) => {
    const id = req.params.messageId;

    db("message")
        .select("*")
        .where("id", id)
        .then(data => {
            res.status(200);
            res.json({message: `Message found`, data});
        })
        .catch(error => {
            res.status(401);
            res.json({message: "Message not found"});
        });   
}


// send message 
exports.sendMessage = (req,res) => {
    const { message, senderId, responderId } = req.body;

    const messageSend = {
      message: message,
        senderId: senderId,
        responderId: responderId,
        date: new Date(),
        read: "0",
      };

      db('message')
    .insert(messageSend)
    .then(() => {
      io.emit(`message-${senderId}`, messageSend);
      res.status(201).json({ message: 'Message sent successfully' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Failed to send message' });
    });




}




