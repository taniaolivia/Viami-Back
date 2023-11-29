module.exports = (server) => {
    const demandSendMessageController = require("../controllers/demandSendMessageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


server.route("/api/demandSendMessage")
.post(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.demandSendMessage);

}