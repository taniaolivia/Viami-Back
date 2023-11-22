const db = require("../knex");
const io = require('../app');

// Get a list of all messages sent by a user
exports.listAllMessagesByUser = (req, res) => {
  let userId = req.params.groupId;

  db("user_group")
    .select("*")
    .where({"userId": userId})
    .then(groups => {
      groups.map((group) => {
        db("message")
          .select([
              "message.id as id",
              "sender.id as senderId",
              "responder.id as responderId",
              "message.groupId as groupId",
              "message.date as date",
              "message.message as message",
              "sender.firstName as senderFirstName",
              "sender.lastName as senderLastName",
              "responder.firstName as responderFirstName",
              "responder.lastName as responderLastName",
              "message.read as read"
          ])
          .where({"groupId": group.groupId})
          .join("user as sender", "sender.id", "=", "message.senderId")
          .join("user as responder", "responder.id", "=", "message.responderId")
          .orderBy("id", "asc")
          .then(data => res.status(200).json({"messages": data}))
          .catch(error => {
              res.status(401);
              console.log(error);
              res.json({message: "Server error"});
          });
      })
    })
    .catch(error => {
        res.status(401);
        console.log(error);
        res.json({message: "Server error"});
    });
}

// Get the last message between the two users or groups
exports.getLastMessageByGroups = (req, res) => {
    let userId = req.params.groupId;

    db("user_group")
      .select("*")
      .where({"userId": userId})
      .then(groups => {
        groups.map((group) => {
          db("message")
            .select([
                "message.id as id",
                "sender.id as senderId",
                "responder.id as responderId",
                "message.groupId as groupId",
                "message.date as date",
                "message.message as message",
                "sender.firstName as senderFirstName",
                "sender.lastName as senderLastName",
                "responder.firstName as responderFirstName",
                "responder.lastName as responderLastName",
                "message.read as read"
            ])
            .where({"groupId": group.groupId})
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
        })
      })
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

// Search user by the inserted name in the search input
exports.getSearchedUsers = (req, res) => {
  let search = req.query.search;
  let senderId = req.params.senderId;

  db('message')
    .select([
      "message.id as id",
      "sender.id as senderId",
      "responder.id as responderId",
      "message.date as date",
      "message.message as message",
      "sender.firstName as senderFirstName",
      "sender.lastName as senderLastName",
      "responder.firstName as responderFirstName",
      "responder.lastName as responderLastName",
      "message.read as read"
    ])
    .where("responder.firstName", 'like', `${search}%`)
    .andWhere({"senderId": senderId})
    .join("user as sender", "sender.id", "=", "message.senderId")
    .join("user as responder", "responder.id", "=", "message.responderId")
    .orderBy("id", "asc")
    .then(data => res.status(200).json({"messages": data}))
    .catch(error => {
      console.error(error);
      res.status(401).json({ message: 'User not found' });
    });
};

// Get message by id 
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

// Send message 
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
  
// Get All messages between sender and other user
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

// Get discussions for a specific message 
exports.getDiscussionsForMessage = (req, res) => {
  const messageId = req.params.messageId;

  db('message')
    .select('senderId', 'responderId', 'groupId')
    .where('id', messageId)
    .then(messageDetails => {
      if (messageDetails.length === 0) {
        res.status(404).json({ message: 'Message not found' });
      } else {
        const senderId = messageDetails[0].senderId;
        const responderId = messageDetails[0].responderId;
        const groupId = messageDetails[0].groupId;

        
        db('message')
        .select('*')
        .where('groupId', groupId)
        .orderBy('date', 'asc')
        .then(messages => {
          res.status(200).json({ messages: messages });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        });
    }
  })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
}

// Function to get all chats with read messages for a user
exports.getAllReadDiscussionsForUser = (req, res) => {
  const userId = req.params.userId;

  db('user_group')
    .select('groupId')
    .where('userId', userId)
    .groupBy('groupId')
    .then(groupIds => {
      const discussionPromises = groupIds.map(group => {
        const groupId = group.groupId;
      
        return db('message')
          .select('*')
          .where('groupId', groupId)
          .andWhere('read', '1') 
          .orderBy('date', 'desc')
          .then(readMessages => {
         
            return db('user_group')
              .select('userId')
              .where('groupId', groupId)
              .andWhereNot('userId', userId) 
              .then(users => {
                return {
                  groupId: groupId,
                  messagesLus: readMessages,
                  utilisateurs: users.map(user => user.userId),
                };
              });
          });
      });

      Promise.all(discussionPromises)
        .then(discussions => {
          res.status(200).json({ discussions: discussions });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Erreur interne du serveur' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    });
};

// Function to get all chats with unread messages for a user
exports.getAllUnreadDiscussionsForUser = (req, res) => {
  const userId = req.params.userId;
  
  db('user_group')
    .select('groupId')
    .where('userId', userId)
    .groupBy('groupId')
    .then(groupIds => {
      const discussionPromises = groupIds.map(group => {
        const groupId = group.groupId;
      
        return db('message')
          .select('*')
          .where('groupId', groupId)
          .andWhere('read', '0') 
          .orderBy('date', 'desc')
          .then(unreadMessages => {
            
            return db('user_group')
              .select('userId')
              .where('groupId', groupId)
              .andWhereNot('userId', userId) 
              .then(users => {
                return {
                  groupId: groupId,
                  messagesNonLus: unreadMessages,
                  utilisateurs: users.map(user => user.userId),
                };
              });
          });
      });

      Promise.all(discussionPromises)
        .then(discussions => {
          res.status(200).json({ discussions: discussions });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Erreur interne du serveur' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    });
};

// Function to get all chats for a user with filter by location
exports.getAllDiscussionsForUserWithLocationFilter = (req, res) => {
  const userId = req.params.userId;
  const selectedLocation = req.params.selectedLocation;

  db('user_group')
    .select('groupId')
    .where('userId', userId)
    .groupBy('groupId')
    .then(groupIds => {
      const discussionPromises = groupIds.map(group => {
        const groupId = group.groupId;

        return db('message')
          .select('*')
          .where('groupId', groupId)
          .orderBy('date', 'desc')
          .limit(1)
          .then(lastMessage => {
            if (lastMessage.length > 0) {
             
              return db('user_group as senderGroup')
                .select('senderGroup.userId as senderId', 'receiverGroup.userId as receiverId', 'receiverUser.location')
                .join('user_group as receiverGroup', 'receiverGroup.groupId', '=', 'senderGroup.groupId')
                .andWhere('senderGroup.groupId', groupId)
                .andWhere('receiverGroup.userId', '!=', userId)
                .join('user as receiverUser', 'receiverGroup.userId', '=', 'receiverUser.id')
                .then(users => {
                  const receiverLocation = users[0].location;

                 
                  if (receiverLocation === selectedLocation) {
                    return {
                     
                      lastMessage: lastMessage[0],
                      
                    };
                  } else {
                    return null;
                  }
                });
            } else {
              return null;
            }
          });
      });

      Promise.all(discussionPromises)
        .then(discussions => {
          const filteredDiscussions = discussions.filter(discussion => discussion !== null);
          res.status(200).json({ discussions: filteredDiscussions });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Erreur interne du serveur' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    });
};

// Function to get all chats for a user
exports.getAllDiscussionsForUser = (req, res) => {
  const userId = req.params.userId;

  db('user_group')
    .select('groupId')
    .where('userId', userId)
    .groupBy('groupId')
    .then(groupIds => {
      const discussionPromises = groupIds.map(group => {
        const groupId = group.groupId;

        return db('message')
          .select('*')
          .where('groupId', groupId)
          .orderBy('date', 'desc')
          .limit(1)
          .then(lastMessage => {
            if (lastMessage.length > 0) {
              return db('user_group')
                .select('userId')
                .where('groupId', groupId)
                .andWhereNot('userId', userId)
                .then(users => {
                  return {
                    groupId: groupId,
                    lastMessage: lastMessage[0],
                    users: users.map(user => user.userId),
                  };
                });
            } else {
              return null;
            }
          });
      });

      Promise.all(discussionPromises)
        .then(discussions => {
          const filteredDiscussions = discussions.filter(discussion => discussion !== null);
          res.status(200).json({ discussions: filteredDiscussions });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Erreur interne du serveur' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    });
};

 // Function to get only discussions between the user and one other person 
 exports.getTwoUserDiscussions = (req, res) => {
  const userId = req.params.userId;

  db('user_group')
    .select('groupId')
    .where('userId', userId)
    .groupBy('groupId')
    .then(groupIds => {
      const twoUserDiscussionPromises = groupIds.map(group => {
        const groupId = group.groupId;

        return db('user_group')
          .select('userId')
          .where('groupId', groupId)
          .then(users => {
            const userCount = users.length;

            if (userCount === 2 && users.some(user => user.userId === userId)) {
              return db('message')
                .select('*')
                .where('groupId', groupId)
                .orderBy('date', 'desc')
                .limit(1)
                .then(lastMessage => {
                  return {
                    groupId: groupId,
                    lastMessage: lastMessage[0],
                    otherUserId: users.find(user => user.userId !== userId).userId,
                  };
                });
            } else {
              return null;
            }
          });
      });

      Promise.all(twoUserDiscussionPromises)
        .then(discussions => {
          const filteredDiscussions = discussions.filter(discussion => discussion !== null);

          res.status(200).json({ discussions: filteredDiscussions });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Erreur interne du serveur' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    });
};


// Function to get only discussions where the group is composed of three users or more
exports.getGroupUsersDiscussions = (req, res) => {
  const userId = req.params.userId;

  db('user_group')
    .select('groupId')
    .where('userId', userId)
    .groupBy('groupId')
    .then(groupIds => {
      const threeOrMoreUserDiscussionPromises = groupIds.map(group => {
        const groupId = group.groupId;

        return db('user_group')
          .select('userId')
          .where('groupId', groupId)
          .then(users => {
            const userCount = users.length;

            if (userCount >= 3) {
              return db('message')
                .select('*')
                .where('groupId', groupId)
                .orderBy('date', 'desc')
                .limit(1)
                .then(lastMessage => {
                  return {
                    groupId: groupId,
                    lastMessage: lastMessage[0],
                    otherUserIds: users
                      .filter(user => user.userId !== userId)
                      .map(user => user.userId),
                  };
                });
            } else {
              return null;
            }
          });
      });

      Promise.all(threeOrMoreUserDiscussionPromises)
        .then(discussions => {
          const filteredDiscussions = discussions.filter(discussion => discussion !== null);

          res.status(200).json({ discussions: filteredDiscussions });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Erreur interne du serveur' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    });
};

