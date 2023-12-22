module.exports = (server) => {
    const commentController = require("../controllers/commentController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/comments")
.get(jwtMiddleware.authenticateUser, cors(), commentController.listAllComments);

server.route("/api/comments/:commentId")
.get(jwtMiddleware.authenticateUser, cors(), commentController.getCommentById);

}