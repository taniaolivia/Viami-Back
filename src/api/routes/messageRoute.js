module.exports = (server) => {
    const messageController = require("../controllers/messageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/sendMessage")
.post(jwtMiddleware.authenticateUser, cors(), messageController.sendMessage);

server.route("/api/getMessages/:conversationId")
.get(jwtMiddleware.authenticateUser, cors(), messageController.getMessages);

}