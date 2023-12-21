const { initializeApp } = require('firebase-admin/app');
const { getMessaging } = require("firebase-admin/messaging");
const admin = require("firebase-admin");
const firebaseConfig = require("../viami-402918-firebase-adminsdk-6nvif-9e01aebec8.js").firebase;
const db = require("../knex");
const io = require('../socket');

// Set a message read
exports.setMessageRead = (req, res) => {
    let messageId = req.params.messageId;
    let userId = req.query.userId;

    db("message_user_read")
      .insert({
        "messageId": messageId,
        "userRead": userId
      })
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
  let userId = req.query.userId;

  db('user_group')
    .select([
      "user_group.id as id",
      "user.id as userId",
      "user_group.groupId as groupId",
      "user.firstName as firstName",
      "user.lastName as lastName"
    ])
    .where("user.firstName", "like", `${search}%`)
    .leftJoin("user", "user.id", "=", "user_group.userId")
    .groupBy('groupId')
    .then(groups => {
      const discussionPromises = groups.map(group => {
        return db('user_group')
          .select([
            "user_group.id as id",
            "user.id as userId",
            "user_group.groupId as groupId",
            "user.firstName as firstName",
            "user.lastName as lastName"
          ])
          .where('groupId', group.groupId)
          .andWhere("userId", userId)
          .leftJoin("user", "user.id", "=", "user_group.userId")
          .groupBy('groupId')
          .then(groupIds => groupIds[0]);
      });

      Promise.all(discussionPromises)
        .then(discussions => {
          
          const filteredDiscussions = discussions.filter(discussion => discussion !== null && discussion !== undefined);

          const promises = filteredDiscussions.map(group => {
            const groupId = group.groupId;
        
            return db('message')
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
              .where('groupId', groupId)
              .leftJoin("user as sender", "sender.id", "=", "message.senderId")
              .leftJoin("user as responder", "responder.id", "=", "message.responderId")
              .orderBy('date', 'desc')
              .limit(1)
              .then(lastMessage => {
                if (lastMessage.length > 0) {
                  return db('user_group')
                    .select('userId')
                    .where('groupId', groupId)
                    .andWhereNot('userId', userId)
                    .then((users) => {
                      const senderId = lastMessage[0].senderId;
                      const responderId = lastMessage[0].responderId;
                      const usersDetails = [];
                    
                      const usersFetchPromises = users.map(async user => {
                        const userData = await db('user')
                          .select('id', 'firstName', 'lastName')
                          .where('id', user.userId)
                          .then(userData => userData[0])
                          .catch(error => null);
                        
                        return userData;
                      });
                      
                      return Promise.all(usersFetchPromises)
                        .then(usersData => {
                          usersDetails.push(...usersData);
          
                          return db('user')
                                .select('id', 'firstName', 'lastName')
                                .whereIn('id', [senderId, responderId])
                                .then(userDetails => {
                                  const senderDetails = userDetails.find(user => user.id === senderId);
                                  const responderDetails = userDetails.find(user => user.id === responderId);    
                                
                                  if (senderDetails && (responderDetails !== undefined)) {
                                    return {
                                      groupId: groupId,
                                      lastMessage: {
                                        ...lastMessage[0],
                                        senderFirstName: senderDetails.firstName,
                                        senderLastName: senderDetails.lastName,
                                        responderFirstName: responderDetails.firstName,
                                        responderLastName: responderDetails.lastName,
                                      },
                                      users: usersDetails
                                    };
                                  } 
                                  else if (senderDetails && responderDetails == undefined) {
                                    return {
                                      groupId: groupId,
                                      lastMessage: {
                                        ...lastMessage[0],
                                        senderFirstName: senderDetails.firstName,
                                        senderLastName: senderDetails.lastName,
                                        responderFirstName: null,
                                        responderLastName: null,
                                      },
                                      users: usersDetails
                                    };
                                  } 
                                  else {
                                    return null;
                                  }
                              });
                        });
                    });
              } else {
                return null;
              }
            });
          });
          
          Promise.all(promises)
            .then(discussionsF => {
              const filteredDiscussion = discussionsF.filter((discussion) => discussion != null && discussion != undefined)
              
              res.status(200).json({ discussions: filteredDiscussion });
          })
          .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
          });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    });
}

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

// Get users by group id
exports.getUsersGroup = (req, res) => {
  let groupId = req.params.groupId;
  let userId = req.params.userId;

  db("user_group")
      .select([
        "user_group.id as id",
        "user.id as userId",
        "user_group.groupId as groupId",
        "user.firstName as firstName",
        "user.lastName as lastName"
      ])
      .where({"groupId": groupId})
      .join("user", "user.id", "=", "user_group.userId")
      .then(users => {
        let usersFiltered = users.filter((user) => user.userId != userId);

        res.status(200).json({ "groupUsers": usersFiltered });
      })
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}

// Send notification push
exports.sendNotificationPushMessage = (fcmToken, text,name,res) => {
  const receivedToken = fcmToken;
  const title = name;
  const content = text;
  
  const message = {
    notification: {
      title: title,
      body: content
    },
    token: receivedToken
  };
  
  getMessaging()
    .send(message)
    .then((response) => {
      res.status(200).json({message: "Successfully sent message notification"})
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}

//send notif to all users in group 
async function sendNotificationToGroup(groupId, senderId, message, res) {
  try {
    const senderFirstName = await db('user')
      .where('id', senderId)
      .select('firstName')
      .first();

    const users = await db('user_group')
      .select('userId', 'fcmToken')
      .where('groupId', groupId)
      .join("user", "user.id", "=", "user_group.userId")
      ;

    const notifications = [];

    users.forEach((user) => {
      // Exclure le sender de la notification
      if (user.userId !== senderId) {
        const { fcmToken } = user;
        console.log("fcmToken");
        console.log(fcmToken);
        console.log(senderFirstName['firstName']);
        
        notifications.push(exports.sendNotificationPushMessage(fcmToken, message, senderFirstName['firstName'],res));
      }
    });

    console.log('Notifications envoyées avec succès.');
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi des notifications :', error);
    res.status(500).json({ message: 'Failed to send notifications' });
  }
}

// Add user to group
async function addUserInGroup(trx, groupId, ...userIds) {
  if (!groupId) {
    const usersInGroup = userIds.map(userId => ({ userId, groupId }));

    console.log('Adding users to group:', usersInGroup);

    await trx('user_group')
      .insert(usersInGroup);
  }
}

// Create a new group
async function createNewGroup(trx, userIds) {
  const [newGroupId] = await trx('group').insert({});
  return newGroupId;
}

// Send message
exports.sendMessage = async (req, res) => {
  const { groupId, message, senderId, responderId } = req.body;
  

  try {
    await db.transaction(async (trx) => {
      const finalGroupId = groupId || await createNewGroup(trx, [responderId, senderId]);
      const userIds = [responderId, senderId];
      await addUserInGroup(trx, finalGroupId, ...userIds);
      await sendGroupMessage(trx, finalGroupId, message, senderId, responderId);
      await sendNotificationToGroup(finalGroupId, senderId, message, res);


      await trx.commit();
      res.status(201).json({ message: 'Message sent successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send group message' });
  }
};

// Function to send the message to a group
async function sendGroupMessage(trx, groupId, message, senderId, responderId) {
  const groupMessage = {
    message: message,
    senderId: senderId,
    groupId: groupId,
    responderId: responderId,
    date: new Date(),
    read: '0',
  };

  console.log("Group message data before insertion into database:");
  console.log(groupMessage);

  const [messageId] = await trx('message').insert(groupMessage);

  await trx('message')
    .where('id', messageId)
    .update({ read: '1' });

  await trx('message_user_read').insert({ messageId, userRead: senderId });
};


// get user count in group 
exports.getUserCountInGroup = (req, res) => {
  const groupId = req.params.groupId;

  db('user_group')
    .count('userId as userCount')
    .where({ groupId })
    .then(result => {
      const userCount = result[0].userCount;
      res.status(200).json({ success: true,count: userCount, groupId });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });
};




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
// Add a user to an existing group or create a new group
exports.addUserToGroup = (req, res) => {
  const userToAddId = req.params.userToAddId;
  const groupId = req.params.groupId;

  
  db('user_group')
    .where({
      userId: userToAddId,
      groupId: groupId
    })
    .then(existingUser => {
      if (existingUser.length > 0) {
       
        res.status(400).json({ success: false, message: 'User already exists in this group', groupId: groupId });
      } else {
        
        db('user_group')
          .select('userId')
          .where('groupId', groupId)
          .then(usersInGroup => {
            if (usersInGroup.length == 2) {
              // Create a new group and retrieve its ID
              db('group')
                .insert({})
                .returning('id')
                .then(newGroupId => {
                  
                  const combinedUserIds = [...usersInGroup.map(user => user.userId), userToAddId];
                  const newGroupInserts = combinedUserIds.map(userId => ({ userId, groupId: newGroupId[0] }));

                  db('user_group')
                    .insert(newGroupInserts)
                    .then(() => {
                      res.status(200).json({ success: true, message: 'User added to the new group successfully', groupId: newGroupId[0] });
                    })
                    .catch(error => {
                      console.error(error);
                      res.status(500).json({ success: false, message: 'Failed to add user to the new group' });
                    });
                })
                .catch(error => {
                  console.error(error);
                  res.status(500).json({ success: false, message: 'Failed to create a new group' });
                });
            } else {
            
              db('user_group')
                .insert({ userId: userToAddId, groupId: groupId })
                .then(() => {
                  res.status(200).json({ success: true, message: 'User added to the group successfully', groupId: groupId });
                })
                .catch(error => {
                  console.error(error);
                  res.status(500).json({ success: false, message: 'Failed to add user to the group' });
                });
            }
          })
          .catch(error => {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
          });
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
        const groupId = messageDetails[0].groupId;

        let messagesWithDetails = [];

        db('message')
            .select('*')
            .where('groupId', groupId)
            .orderBy('date', 'asc')
            .then(messages => {
              const promise = messages.map(message => {
                return db('user')
                .select('firstName', 'lastName')
                .where('id', message.senderId)
                .then(senderDetails => {
                  if (senderDetails.length === 0) {
                    res.status(404).json({ message: 'Sender not found' });
                  } else {
                  
                    return db('user')
                      .select('firstName', 'lastName')
                      .where('id', message.responderId)
                      .then(responderDetails => {
                        if (responderDetails.length === 0) {
                          res.status(404).json({ message: 'Responder not found' });
                        } else {
                          messagesWithDetails.push({
                            ...message,
                            senderFirstName: senderDetails[0].firstName,
                            senderLastName: senderDetails[0].lastName,
                            responderFirstName: responderDetails[0].firstName,
                            responderLastName: responderDetails[0].lastName,
                          })
                          return {
                            ...message,
                            senderFirstName: senderDetails[0].firstName,
                            senderLastName: senderDetails[0].lastName,
                            responderFirstName: responderDetails[0].firstName,
                            responderLastName: responderDetails[0].lastName,
                          };
                        }
                      })
                    }
                  }
                )})
              
              Promise.all(promise)
              .then(messages => {
                res.status(200).json({ messages: messages });
              })
                  
              
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
};

// Get discussions for a specific group 
exports.getDiscussionsForGroup = (req, res) => {
    const groupId = req.params.groupId;
    db('message')
      .select('senderId', 'responderId', 'groupId')
      .where('groupId', groupId)
      .then(messageDetails => {
        if (messageDetails.length === 0) {
          res.status(404).json({ message: 'Group not found' });
        } else {
          const senderId = messageDetails[0].senderId;
          const responderId = messageDetails[0].responderId;
          const groupId = messageDetails[0].groupId;
          
  
          let messagesWithDetails = [];
  
       
         
                    
                    db('message')
                        .select('*')
                        .where('groupId', groupId)
                        .orderBy('date', 'asc')
                        .then(messages => {
                         const promise = messages.map(message => {
                          return db('user')
                          .select('firstName', 'lastName')
                          .where('id', message.senderId)
                          .then(senderDetails => {
                            if (senderDetails.length === 0) {
                              res.status(404).json({ message: 'Sender not found' });
                            } else {
                           
                              return db('user')
                                .select('firstName', 'lastName')
                                .where('id', message.responderId)
                                .then(responderDetails => {
                                  if (responderDetails.length === 0) {
                                    res.status(404).json({ message: 'Responder not found' });
                                  } else {
                                    messagesWithDetails.push({
                                      ...message,
                                      senderFirstName: senderDetails[0].firstName,
                                      senderLastName: senderDetails[0].lastName,
                                      responderFirstName: responderDetails[0].firstName,
                                      responderLastName: responderDetails[0].lastName,
                                    })
                                    return {
                                      ...message,
                                      senderFirstName: senderDetails[0].firstName,
                                      senderLastName: senderDetails[0].lastName,
                                      responderFirstName: responderDetails[0].firstName,
                                      responderLastName: responderDetails[0].lastName,
                                    };
  
                                   
                                  }
                                })
                              }
                            }
                          )})
                        
                          Promise.all(promise)
                          .then(messages => {
                            res.status(200).json({ messages: messages });
                          })
                              
                         
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
  };

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
          res.status(500).json({ message: 'Server error' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
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
          res.status(500).json({ message: 'Server error' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    });
};



// Filter discussions by location
exports.getAllDiscussionsForUserWithLocationFilter =  (req, res) => {
  const userId = req.params.userId;
  const selectedLocation = req.query.location;

  db('user_group')
    .select('groupId')
    .where('userId', userId)
    .groupBy('groupId')
    .then(groupIds => {
      const discussionPromises = groupIds.map(group => {
        const groupId = group.groupId;
       
        return db('user_group')
          .select('userId')
          .where('groupId', groupId)
          .then(groupMembers => {
            const userIds = groupMembers.map(member => member.userId);

            return db('user')
              .select('id', 'location')
              .whereIn('id', userIds)
              .andWhere('location', selectedLocation) 
              .then(usersWithSpecificLocation => {
                if (usersWithSpecificLocation.length > 0) {
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
                            const senderId = lastMessage[0].senderId;
                            const responderId = lastMessage[0].responderId;

                            return db('user')
                              .select('id', 'firstName', 'lastName')
                              .whereIn('id', [senderId, responderId])
                              .then(userDetails => {
                                const senderDetails = userDetails.find(user => user.id === senderId);
                                const responderDetails = userDetails.find(user => user.id === responderId);
                                const usersDetails = [];
                    
                                const usersFetchPromises = users.map(async user => {
                                  const userData = await db('user')
                                    .select('id', 'firstName', 'lastName')
                                    .where('id', user.userId)
                                    .then(userData => userData[0])
                                    .catch(error => null);
                                  
                                  return userData;
                                });
                                
                                return Promise.all(usersFetchPromises)
                                  .then(usersData => {
                                    usersDetails.push(...usersData);

                                    if (senderDetails && responderDetails) {
                                      return db("message_user_read")
                                        .select("*")
                                        .where("messageId", lastMessage[0].id)
                                        .then(read => {
                                          return {
                                            groupId: groupId,
                                            lastMessage: {
                                              ...lastMessage[0],
                                              senderFirstName: senderDetails.firstName,
                                              senderLastName: senderDetails.lastName,
                                              responderFirstName: responderDetails.firstName,
                                              responderLastName: responderDetails.lastName,
                                            },
                                            users: usersDetails,
                                            usersRead: read.map(user => user.userRead)
                                          };
                                        })
                                    } else {
                                      return null;
                                    }
                                  });
                              });
                            })
                      } else {
                        return null;
                      }
                    });
                } else {
                  return null;
                }
              });
          });
      });

      Promise.all(discussionPromises)
        .then(discussions => {
          const filteredDiscussions = discussions.filter(discussion => discussion !== null);
          res.status(200).json({ discussions: filteredDiscussions });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
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

              return db("message_user_read")
                .select("*")
                .where("messageId", lastMessage[0].id)
                .then(read => {

                  return db('user_group')
                    .select('userId')
                    .where('groupId', groupId)
                    .andWhereNot('userId', userId)
                    .then(users => {
                      const senderId = lastMessage[0].senderId;
                      const responderId = lastMessage[0].responderId;
                      const usersDetails = [];

                      users.map(async (user) =>  {
                        let userDetails = await db('user')
                          .select('id', 'firstName', 'lastName')
                          .where('id', user.userId)
                          .then(userData => userData[0])
                          .catch((error) => null)
                        
                          usersDetails.push(userDetails)
                      })

                      return db('user')
                        .select('id', 'firstName', 'lastName')
                        .whereIn('id', [senderId, responderId])
                        .then(userDetails => {
                          const senderDetails = userDetails.find(user => user.id === senderId);
                          const responderDetails = userDetails.find(user => user.id === responderId);

                          if (senderDetails && (responderDetails !== undefined)) {
                            return {
                              groupId: groupId,
                              lastMessage: {
                                ...lastMessage[0],
                                senderFirstName: senderDetails.firstName,
                                senderLastName: senderDetails.lastName,
                                responderFirstName: responderDetails.firstName,
                                responderLastName: responderDetails.lastName,
                              },
                              users: usersDetails,
                              usersRead: read.map(user => user.userRead)
                            };
                          } 
                          else if (senderDetails && responderDetails == undefined) {
                            return {
                              groupId: groupId,
                              lastMessage: {
                                ...lastMessage[0],
                                senderFirstName: senderDetails.firstName,
                                senderLastName: senderDetails.lastName,
                                responderFirstName: null,
                                responderLastName: null,
                              },
                              users: usersDetails,
                              usersRead: read.map(user => user.userRead)
                            };
                          } 
                          else {
                            return null;
                          }
                        });
                    });
                })

              /**/
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
          res.status(500).json({ message: 'Server error' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    });
};


// Function to get only discussions between the user and one other person
exports.getTwoUserDiscussions = (req, res) => {
  const userId = req.params.userId;

  // Function to get user details by ID
  const getUserDetailsById = async (userId) => {
    return db('user')
      .select('id', 'firstName', 'lastName')
      .where('id', userId)
      .first();
  };

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
          .then(async users => {
            const userCount = users.length;

            if (userCount === 2 && users.some(user => user.userId === userId)) {
              const lastMessage = await db('message')
                .select('*')
                .where('groupId', groupId)
                .orderBy('date', 'desc')
                .limit(1);

              if (lastMessage.length > 0) {
                const senderId = lastMessage[0].senderId;
                const responderId = users.find(user => user.userId !== userId).userId;

                const senderDetails = await getUserDetailsById(senderId);
                const responderDetails = await getUserDetailsById(responderId);

                const usersDetails = [];
                    
                const usersFetchPromises = users.map(async user => {
                  if(user.userId !== userId) {
                    const userData = await db('user')
                      .select('id', 'firstName', 'lastName')
                      .where('id', user.userId)
                      .then(userData => userData[0])
                      .catch(error => null);
                    
                    return userData;
                  }
                });
                
                return Promise.all(usersFetchPromises)
                  .then(usersData => {
                    usersDetails.push(...usersData);

                    const filteredUsers = usersDetails.filter(user => user != null);
                    
                    return db("message_user_read")
                      .select("*")
                      .where("messageId", lastMessage[0].id)
                      .then(read => {
                          return {
                            groupId: groupId,
                            lastMessage: {
                              ...lastMessage[0],
                              senderFirstName: senderDetails.firstName,
                              senderLastName: senderDetails.lastName,
                              responderFirstName: responderDetails.firstName,
                              responderLastName: responderDetails.lastName,
                            },
                            users: filteredUsers,
                            usersRead: read.map(user => user.userRead)
                          };
                        })
                    })
              }
            }

            return null;
          });
      });

      Promise.all(twoUserDiscussionPromises)
        .then(discussions => {
          const filteredDiscussions = discussions.filter(discussion => discussion !== null);

          res.status(200).json({ discussions: filteredDiscussions });
        })
        .catch(error => {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    });
};


// Function to get only discussions where the group is composed of three users or more
exports.getGroupUsersDiscussions = (req, res) => {
  const userId = req.params.userId;

  // Function to get user details by ID
  const getUserDetailsById = async (userId) => {
    return db('user')
      .select('id', 'firstName', 'lastName')
      .where('id', userId)
      .first();
  };

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
          .then(async users => {
            const userCount = users.length;

            if (userCount >= 3) {
              const lastMessage = await db('message')
                .select('*')
                .where('groupId', groupId)
                .orderBy('date', 'desc')
                .limit(1);

              if (lastMessage.length > 0) {
                const otherUserIds = users
                  .filter(user => user.userId !== userId)
                  .map(user => user.userId);

                const otherUsersDetails = await Promise.all(
                  otherUserIds.map(userId => getUserDetailsById(userId))
                );

                return db("message_user_read")
                  .select("*")
                  .where("messageId", lastMessage[0].id)
                  .then(read => {
                    return {
                      groupId: groupId,
                      lastMessage: {
                        ...lastMessage[0],
                        senderFirstName: otherUsersDetails[0].firstName,
                        senderLastName: otherUsersDetails[0].lastName,
                        responderFirstName: otherUsersDetails[1].firstName,
                        responderLastName: otherUsersDetails[1].lastName,
                      },
                      users : otherUsersDetails,
                      usersRead: read.map(user => user.userRead)
                    };
                })
              }
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
          res.status(500).json({ message: 'Server error' });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    });
};

// get only unread dicussions of a user
exports.getAllUnreadDiscussionsForUserFilter = async (req, res) => {
  try {
    const userId = req.params.userId;

    const groupIds = await db('user_group')
      .select('groupId')
      .where('userId', userId)
      .groupBy('groupId');

    const discussionPromises = groupIds.map(async (group) => {
      const groupId = group.groupId;

      const lastMessage = await db('message')
        .select('*')
        .where('groupId', groupId)
        .orderBy('date', 'desc')
        .limit(1)
        .first();

      if (lastMessage) {
        const usersInGroup = await db('user_group')
          .select('userId')
          .where('groupId', groupId)
          .andWhereNot('userId', userId);

        const senderId = lastMessage.senderId;
        const responderId = lastMessage.responderId;

        const userDetails = await db('user')
          .select('id', 'firstName', 'lastName')
          .whereIn('id', [senderId, responderId]);

        const senderDetails = userDetails.find((user) => user.id === senderId);
        const responderDetails = userDetails.find((user) => user.id === responderId);

        const usersDetails = await Promise.all(
          usersInGroup.map(async (user) => {
            const userData = await db('user')
              .select('id', 'firstName', 'lastName')
              .where('id', user.userId)
              .first();

            return userData;
          })
        );

        const usersRead = await db('message_user_read')
          .select('userRead')
          .where('messageId', lastMessage.id);

        if (!usersRead.some((readUser) => readUser.userRead === userId)) {
          return {
            groupId: groupId,
            lastMessage: {
              ...lastMessage,
              senderFirstName: senderDetails.firstName,
              senderLastName: senderDetails.lastName,
              responderFirstName: responderDetails.firstName,
              responderLastName: responderDetails.lastName,
            },
            users: usersDetails,
            usersRead: usersRead.map((user) => user.userRead),
          };
        }
      }

      return null;
    });

    const discussions = await Promise.all(discussionPromises);
    const filteredDiscussions = discussions.filter((discussion) => discussion !== null);

    res.status(200).json({ discussions: filteredDiscussions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// get only read dicussions of a user
exports.getAllReadDiscussionsForUserFilter = async (req, res) => {
  try {
    const userId = req.params.userId;

    const groupIds = await db('user_group')
      .select('groupId')
      .where('userId', userId)
      .groupBy('groupId');

    const discussionPromises = groupIds.map(async (group) => {
      const groupId = group.groupId;

      const lastMessage = await db('message')
        .select('*')
        .where('groupId', groupId)
        .orderBy('date', 'desc')
        .limit(1)
        .first();

      if (lastMessage) {
        const usersInGroup = await db('user_group')
          .select('userId')
          .where('groupId', groupId)
          .andWhereNot('userId', userId);

        const senderId = lastMessage.senderId;
        const responderId = lastMessage.responderId;

        const userDetails = await db('user')
          .select('id', 'firstName', 'lastName')
          .whereIn('id', [senderId, responderId]);

        const senderDetails = userDetails.find((user) => user.id === senderId);
        const responderDetails = userDetails.find((user) => user.id === responderId);

        const usersDetails = await Promise.all(
          usersInGroup.map(async (user) => {
            const userData = await db('user')
              .select('id', 'firstName', 'lastName')
              .where('id', user.userId)
              .first();

            return userData;
          })
        );

        const usersRead = await db('message_user_read')
          .select('userRead')
          .where('messageId', lastMessage.id);

        if (usersRead.some((readUser) => readUser.userRead === userId)) {
          return {
            groupId: groupId,
            lastMessage: {
              ...lastMessage,
              senderFirstName: senderDetails.firstName,
              senderLastName: senderDetails.lastName,
              responderFirstName: responderDetails.firstName,
              responderLastName: responderDetails.lastName,
            },
            users: usersDetails,
            usersRead: usersRead.map((user) => user.userRead),
          };
        }
      }

      return null;
    });

    const discussions = await Promise.all(discussionPromises);
    const filteredDiscussions = discussions.filter((discussion) => discussion !== null);

    res.status(200).json({ discussions: filteredDiscussions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


