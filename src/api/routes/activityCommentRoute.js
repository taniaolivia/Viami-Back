module.exports = (server) => {
    const activityCommentController = require("../controllers/activityCommentController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
/**
 * @openapi
 * paths:
 *   /api/activities/hasUserLeftComment/{activityId}/{otherUserId}:
 *     get:
 *       tags:
 *         - Activity Comments
 *       summary: "Check if user has left comment for another user"
 *       description: "Check if a user has left a comment for another user regarding a specific activity."
 *      
 *       parameters:
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: "ID of the activity for which the comment is being checked."
 *           schema:
 *             type: integer
 *         - in: path
 *           name: otherUserId
 *           required: true
 *           description: "ID of the other user for whom the comment is being checked."
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "User's comment status retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 hasUserLeftComment: true
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error during comment status retrieval."
 */
server.get("/api/activities/hasUserLeftComment/:activityId/:otherUserId", jwtMiddleware.authenticateUser, cors(), activityCommentController.hasUserLeftComment);
/**
 * @openapi
 * paths:
 *   /api/activities/addComment/{activityId}:
 *     post:
 *       tags:
 *         - Activity Comments
 *       summary: "Add comment to activity"
 *       description: "Add a comment to a specific activity."
 *       
 *       parameters:
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: "ID of the activity to which the comment is being added."
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               commenterId: 123
 *               commentText: "Great activity!"
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
 *                 message: "Internal server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error during comment addition."
 */
server.post("/api/activities/addComment/:activityId", jwtMiddleware.authenticateUser, cors(), activityCommentController.addCommentToActivity);

}