module.exports = (server) => {
    const commentController = require("../controllers/commentController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
/**
 * @openapi
 * paths:
 *   /api/comments:
 *      get:
 *       tags:
 *         - Comments
 *       summary: "List all comments"
 *       description: "Get a list of all comments."
 *       
 *       responses:
 *         '200':
 *           description: "Comments retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 comments:
 *                   - id: 1
 *                     comment: "Comment Text 1"
 *                   - id: 2
 *                     comment: "Comment Text 2"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comments retrieval."
 */
server.route("/api/comments")
.get(jwtMiddleware.authenticateUser, cors(), commentController.listAllComments);
/**
 * @openapi
 * paths:
 *   /api/comments/{commentId}:
 *      get:
 *       tags:
 *         - Comments
 *       summary: "Get comment by ID"
 *       description: "Get details of a comment by its ID."
 *     
 *       parameters:
 *         - in: path
 *           name: commentId
 *           required: true
 *           description: ID of the comment to retrieve.
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "Comment details retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: 1
 *                     comment: "Comment Text"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during comment retrieval."
 */
server.route("/api/comments/:commentId")
.get(jwtMiddleware.authenticateUser, cors(), commentController.getCommentById);

}