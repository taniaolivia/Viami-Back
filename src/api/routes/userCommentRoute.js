module.exports = (server) => {
    const userCommentController = require("../controllers/userCommentController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /api/usersComments:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get all comments with their users"
 *       description: "Retrieve all comments with associated users."
 *       
 *       responses:
 *         '200':
 *           description: "Comments with users retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: "comment_id_here"
 *                     userId: "user_id_here"
 *                     commenterId: "commenter_id_here"
 *                     commentId: "comment_id_here"
 *                     
 *                   - id: "comment_id_here"
 *                     userId: "user_id_here"
 *                     commenterId: "commenter_id_here"
 *                     commentId: "comment_id_here"
 *                    
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
server.route("/api/usersComments")
  .get(jwtMiddleware.authenticateUser, cors(), userCommentController.getAllUsersComments);


/**
 * @openapi
 * paths:
 *   /api/users/{userId}/comments:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get all comments of a user by id"
 *       description: "Retrieve all comments associated with a specific user."
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: "ID of the user"
 *           schema:
 *             type: string
 *      
 *       responses:
 *         '200':
 *           description: "Comments of the user retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 userComments:
 *                   - id: "comment_id_here"
 *                     userId: "user_id_here"
 *                     commenterId: "commenter_id_here"
 *                     commentId: "comment_id_here"
 *                     
 *                   - id: "comment_id_here"
 *                     userId: "user_id_here"
 *                     commenterId: "commenter_id_here"
 *                     commentId: "comment_id_here"
 *                     
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
server.route("/api/users/{userId}/comments")
  .get(jwtMiddleware.authenticateUser, cors(), userCommentController.getUserCommentsById);


/**
 * @openapi
 * paths:
 *   /api/users/addComment/{userId}:
 *     post:
 *       tags:
 *         - User Comment
 *       summary: "Add comment to user's profile"
 *       description: "Add a comment to a user's profile."
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: "ID of the user to add the comment"
 *           schema:
 *             type: string
 *       requestBody:
 *         description: "Comment details"
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               commenterId: "commenter_id_here"
 *               commentText: "Comment text here"
 *       
 *       responses:
 *         '200':
 *           description: "Comment added successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Comment added successfully"
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
 *                 message: "Server error during comment addition."
 */
server.post("/api/users/addComment/{userId}", jwtMiddleware.authenticateUser, cors(), userCommentController.addCommentToUserProfile);


/**
 * @openapi
 * paths:
 *   /api/users/hasUserLeftComment/{userId}/{otherUserId}:
 *     get:
 *       tags:
 *         - User Comment
 *       summary: "Check if the user has left a comment for another user"
 *       description: "Check if the user has left a comment for another user."
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: "ID of the user"
 *           schema:
 *             type: string
 *         - in: path
 *           name: otherUserId
 *           required: true
 *           description: "ID of the other user"
 *           schema:
 *             type: string
 *       
 *       responses:
 *         '200':
 *           description: "Check result retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 hasUserLeftComment: true
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
 *                 message: "Server error during comment check."
 */
server.get("/api/users/hasUserLeftComment/{userId}/{otherUserId}", jwtMiddleware.authenticateUser, cors(), userCommentController.hasUserLeftComment);




}