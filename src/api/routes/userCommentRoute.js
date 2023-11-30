module.exports = (server) => {
    const userCommentController = require("../controllers/userCommentController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/usersComments")
.get(jwtMiddleware.authenticateUser, cors(), userCommentController.getAllUsersComments);

server.route("/api/users/:userId/comments")
.get(jwtMiddleware.authenticateUser, cors(), userCommentController.getUserCommentsById);

server.post("/api/users/addComment/:userId", jwtMiddleware.authenticateUser, cors(), userCommentController.addCommentToUserProfile);

server.get("/api/users/hasUserLeftComment/:userId/:otherUserId", jwtMiddleware.authenticateUser, cors(), userCommentController.hasUserLeftComment);

}