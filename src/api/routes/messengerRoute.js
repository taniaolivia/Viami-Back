module.exports = (server) => {
    const messengerController = require("../controllers/messengerController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/messages/:senderId/messages")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.listAllMessagesBySenderId);

server.route("/api/messages/discussions/:messageId")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getDiscussionsForMessage);

server.route("/api/messages/:senderId/:responderId/messages")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getMessagesBetweenUsers);

server.route("/api/messages/:senderId/:responderId/message")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getLastMessageBySenderResponder);

server.route("/api/messages/:messageId")
.patch(jwtMiddleware.authenticateUser, cors(), messengerController.setMessageRead)
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getMessageById);

server.route("/api/messages/search/users")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getSearchedUsers);

server.route("/api/sendMessage")
.post(jwtMiddleware.authenticateUser, cors(), messengerController.sendMessage);

server.route("/api/messages/addUserToGroup/:loggedInUserId/:userToAddId/:receiverId")
.post(jwtMiddleware.authenticateUser, cors(), messengerController.addUserToGroup);

server.route("/api/readDiscussions/:userId")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getAllReadDiscussionsForUser);

server.route("/api/unreadDiscussions/:userId")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getAllUnreadDiscussionsForUser);

server.route("/api/discussions/:userId/location/:selectedLocation")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getAllDiscussionsForUserWithLocationFilter);

server.route('/api/discussions/:userId')
.get('/api/discussions/:userId', jwtMiddleware.authenticateUser, cors(), messengerController.getAllDiscussionsForUser);








}