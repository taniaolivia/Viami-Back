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
              console.log(discussionsF)
              res.status(200).json({ discussions: discussionsF });
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

     
        db('user')
          .select('firstName', 'lastName')
          .where('id', senderId)
          .then(senderDetails => {
            if (senderDetails.length === 0) {
              res.status(404).json({ message: 'Sender not found' });
            } else {
           
              db('user')
                .select('firstName', 'lastName')
                .where('id', responderId)
                .then(responderDetails => {
                  if (responderDetails.length === 0) {
                    res.status(404).json({ message: 'Responder not found' });
                  } else {
                  
                    db('message')
                      .select('*')
                      .where('groupId', groupId)
                      .orderBy('date', 'asc')
                      .then(messages => {
                        
                        const messagesWithDetails = messages.map(message => ({
                          ...message,
                          senderFirstName: senderDetails[0].firstName,
                          senderLastName: senderDetails[0].lastName,
                          responderFirstName: responderDetails[0].firstName,
                          responderLastName: responderDetails[0].lastName,
                        }));
                        
                        res.status(200).json({ messages: messagesWithDetails });
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



// location filter 
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

//filter with not read 
exports.getAllUnreadDiscussionsForUser = async (req, res) => {
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



//filter with read 
exports.getAllReadDiscussionsForUser = async (req, res) => {
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


