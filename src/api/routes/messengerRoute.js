module.exports = (server) => {
    const messengerController = require("../controllers/messengerController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/users/:senderId/messages")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.listAllMessagesBySenderId);

server.route("/api/users/:senderId/:responderId/messages")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.listAllMessagesBySenderResponder);

}