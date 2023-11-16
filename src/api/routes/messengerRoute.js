module.exports = (server) => {
    const messengerController = require("../controllers/messengerController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/users/:senderId/messages")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.listAllMessagesBySenderId);

server.route("/api/users/:senderId/:responderId/messages")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getMessagesBetweenUsers);

server.route("/api/users/:senderId/:responderId/message")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getLastMessageBySenderResponder);

server.route("/api/messages/:messageId")
.patch(jwtMiddleware.authenticateUser, cors(), messengerController.setMessageRead)
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getMessageById);

server.route("/api/sendMessage")
.post(jwtMiddleware.authenticateUser, cors(), messengerController.sendMessage);

}