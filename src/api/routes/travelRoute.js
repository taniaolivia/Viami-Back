module.exports = (server) => {
    const travelController = require("../controllers/travelController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/travel/:travelId")
.get(jwtMiddleware.authenticateUser, cors(), travelController.getTravelById)

}