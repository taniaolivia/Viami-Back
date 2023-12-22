module.exports = (server) => {
    const interestController = require("../controllers/interestController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/interests")
.get(jwtMiddleware.authenticateUser, cors(), interestController.listAllInterests);

server.route("/api/interests/:interestId")
.get(jwtMiddleware.authenticateUser, cors(), interestController.getInterestById);

}