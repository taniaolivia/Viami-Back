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
exports.sendMessage = (req, res) => {
    const { message, senderId, responderId } = req.body;
  
    // Check if a group already exists between the two users
    db('user_group')
      .select('groupId')
      .whereIn('userId', [senderId, responderId])
      .groupBy('groupId')
      .havingRaw('COUNT(DISTINCT userId) >= 2') // group can have 2 user min
      .then(existingGroups => {
        if (existingGroups.length > 0) {
          const groupId = existingGroups[0].groupId;
          // Use the ID of the existing group to send the message
          sendGroupMessage(groupId, message, senderId,responderId, res);
        } else {
          // Create a new group between the two users
          db('group')
            .insert({})
            .then(groupIds => {
              const groupId = groupIds[0];
              // Add both users to the new group
              db('user_group')
                .insert([
                  { userId: senderId, groupId: groupId },
                  { userId: responderId, groupId: groupId }
                ])
                .then(() => {
                  // Use the ID of the new group to send the message
                  sendGroupMessage(groupId, message, senderId,responderId, res);
                })
                .catch(error => {
                  console.error(error);
                  res.status(500).json({ message: 'Failed to create group and send message' });
                });
            })
            .catch(error => {
              console.error(error);
              res.status(500).json({ message: 'Failed to create group and send message' });
            });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      });
  };
  
  // Function to send the message to a group
  function sendGroupMessage(groupId, message, senderId,responderId, res) {
    const groupMessage = {
      message: message,
      senderId: senderId,
      groupId: groupId,
      responderId:responderId,
      date: new Date(),
      read: "0",
    };
  
    db('message')
      .insert(groupMessage)
      .then(() => {
        io.emit(`group-${groupId}`, groupMessage);
        res.status(201).json({ message: 'Message sent successfully' });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Failed to send group message' });
      });
  }
  

//get All messages between sender and other user
exports.getMessagesBetweenUsers = (req, res) => {
    const senderId = req.params.senderId;
    const responderId = req.params.responderId;
  
    db('user_group')
      .select('groupId')
      .whereIn('userId', [senderId, responderId])
      .groupBy('groupId')
      .havingRaw('COUNT(DISTINCT userId) = 2')
      .then(groupIds => {
        if (groupIds.length > 0) {
          const groupId = groupIds[0].groupId;
  
          db('message')
            .select('*')
            .where('groupId', groupId)
            .orderBy('date', 'asc')
            .then(data => {
              if (data.length > 0) {
                res.status(200).json({ messages: data });
              } else {
                res.status(404).json({ message: 'Messages not found' });
              }
            })
            .catch(error => {
              console.error(error);
              res.status(500).json({ message: 'Internal server error' });
            });
        } else {
          res.status(404).json({ message: 'Group not found' });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      });
  };
  

  

// Add a user to an existing group
exports.addUserToGroup = (req, res) => {
    const loggedInUserId = req.params.loggedInUserId;
    const userToAddId = req.params.userToAddId;
    const receiverId = req.params.receiverId;
  
    db('user_group')
      .select('groupId')
      .whereIn('userId', [loggedInUserId, receiverId])
      .groupBy('groupId')
      .havingRaw('COUNT(DISTINCT userId) >= 2')
      .then(groupIds => {
        if (groupIds.length > 0) {
          const groupId = groupIds[0].groupId;
  
        
          db('user_group')
            .select('userId')
            .where('groupId', groupId)
            .andWhere('userId', userToAddId)
            .then(existingUser => {
              if (existingUser.length === 0) {
                db('user_group')
                  .insert({ userId: userToAddId, groupId: groupId })
                  .then(() => {
                    res.status(200).json({ success: true, message: 'User added to the group successfully' });
                  })
                  .catch(error => {
                    console.error(error);
                    res.status(500).json({ success: false, message: 'Failed to add user to the group' });
                  });
              } else {
                res.status(400).json({ success: false, message: 'User is already in the group' });
              }
            });
        } else {
          res.status(404).json({ success: false, message: 'Group not found' });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      });
  };
  

