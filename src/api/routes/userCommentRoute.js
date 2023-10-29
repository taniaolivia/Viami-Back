module.exports = (server) => {
    const userCommentController = require("../controllers/userCommentController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/usersComments")
.get(jwtMiddleware.authenticateUser, cors(), userCommentController.getAllUsersComments);

server.route("/api/users/:userId/comments")
.get(jwtMiddleware.authenticateUser, cors(), userCommentController.getUserCommentsById);

}