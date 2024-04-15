const admin = require("firebase-admin");
const firebaseConfig = require("../viami-402918-firebase-adminsdk-6nvif-b8893ec7f9.js").firebase;
const db = require("../knex.js");

const serviceAccount = firebaseConfig;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
});

// Send notification push
exports.sendNotificationPush = (fcmToken, titleNotif, contentNotif, res) => {
  const receivedToken = fcmToken;
  const title = titleNotif;
  const content = contentNotif;
  
  const message = {
    notification: {
      title: title,
      body: content
    },
    token: receivedToken
  };
  
  admin.messaging()
    .send(message)
    .then((response) => {
      res.status(200).json({message: "Successfully sent request message to a user"})
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}

// Send a request to be able to talk to a user
exports.requestSendMessage = (req, res) => {
  let requesterId = req.body.requesterId;
  let receiverId = req.body.receiverId;
  let fcmToken = req.body.fcmToken;
  let title = req.body.title;
  let content = req.body.content;

  db("request_message_user")
    .insert({
      "requesterId": requesterId,
      "receiverId": receiverId
    })
    .then((response) => {
      exports.sendNotificationPush(fcmToken, title, content, res);
    })
    .catch((error) => {
      console.log(error);

      res.status(400).json({
        message: "Failed send request message to a user"
      });
    });
}

// Respond to a request of a user
exports.answerRequestMessageTwoUsers = (req, res) => {
  let requestId = req.body.requestId;
  let answer = req.body.answer;
  let fcmToken = req.body.fcmToken;
  let title = req.body.title;
  let content = req.body.content;

  db("request_message_user")
    .update("accept", answer)
    .where("id", requestId)
    .then((response) => {

      if(answer === 1) {
        db("request_message_user")
          .select("*")
          .where("id", requestId)
          .then((request) => {

            db("group")
              .insert({})
              .then((groupId) => {
              
                db("user_group")
                  .insert({
                    "userId": request[0].requesterId,
                    "groupId": groupId
                  })
                  .then(() => {
    
                    db("user_group")
                      .insert({
                        "userId": request[0].receiverId,
                        "groupId": groupId
                      })
                      .then((response) => {
                        exports.sendNotificationPush(fcmToken, title, content, res);
                      })
                      .catch((error) => {
                        console.log(error)
    
                        res.status(400).json({
                          message: "Failed answering the request message of a user"
                        });
                      })
                  })
                  .catch((error) => {
                      console.log(error)
                  })
            })
            .catch((error) => {
              console.log(error)
            })
        })
      }
      else {
        exports.sendNotificationPush(fcmToken, title, content, res);    
      }
    })
    .catch((error) => {
      console.log(error);

      res.status(400).json({
        message: "Failed answering the request message of a user"
      });
    });
}

// Display all requests that a user has
exports.getAllRequestsMessagesByUser = (req, res) => {
  let receiverId = req.params.receiverId;
  
  db("request_message_user")
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
    .where("receiverId", receiverId)
    .leftJoin("user as requester", "requester.id", "=", "request_message_user.requesterId")
    .leftJoin("user as receiver", "receiver.id", "=", "request_message_user.receiverId")
    .then((requests) => {
      res.status(200).json({
        "requestsMessages": requests
      })
    })
    .catch((error) => {
      console.log(error);

      res.status(400).json({
        message: "Failed answering the request message of a user"
      });
    });
}

// Display all the accepted requests of a user
exports.getAllAcceptedRequestsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
      const requests = await requestService.getAllAcceptedRequestsByUser(userId);
      res.status(200).json({ "requestsMessages": requests });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};

// Update the chat value of a request
exports.setChat = async (req, res) => {
  const requestId = req.params.requestId;

  try {
      const message = await requestService.setChat(requestId);
      res.status(200).json({ message });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};