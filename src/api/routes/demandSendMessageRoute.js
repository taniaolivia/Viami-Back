module.exports = (server) => {
    const demandSendMessageController = require("../controllers/demandSendMessageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/send/requestMessage")
.post(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.requestSendMessage);

server.route("/api/send/answerRequest")
.patch(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.answerRequestMessageTwoUsers);

server.route("/api/requestsMessages/:receiverId")
.get(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.getAllRequestsMessagesByUser);

server.route("/api/requestsMessages/:userId/accepted")
.get(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.getAllAcceptedRequestsByUser);

server.route("/api/requestsMessages/:requestId/chat")
.patch(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.setChat);
}