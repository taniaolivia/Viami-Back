module.exports = (server) => {
    const userInterestController = require("../controllers/userInterestController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/usersInterests")
.get(jwtMiddleware.authenticateUser, cors(), userInterestController.getAllUsersInterests);

server.route("/api/users/:userId/interests")
.get(jwtMiddleware.authenticateUser, cors(), userInterestController.getUserInterestsById)
.post(jwtMiddleware.authenticateUser, cors(), userInterestController.addUserInterest)
.delete(jwtMiddleware.authenticateUser, cors(), userInterestController.deleteUserInterest);

server.route("/api/interests/:interestId/users")
.get(jwtMiddleware.authenticateUser, cors(), userInterestController.getInterestUsersById);

}