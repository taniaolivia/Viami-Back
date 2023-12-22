module.exports = (server) => {
    const userPremiumPlanController = require("../controllers/userPremiumPlanController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /api/users/{userId}/premiumPlan:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get the latest premium plan of a user"
 *       description: "Retrieve the latest premium plan information of a specific user by their ID."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to retrieve the latest premium plan"
 *           required: true
 *           schema:
 *             type: string
 * 
 *       responses:
 *         '200':
 *           description: "Latest premium plan retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 - id: 1
 *                   userId: "user1"
 *                   planId: "premium_plan_1"
 *                   token: "abc123"
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
 *                 message: "Server error during premium plan retrieval."
 */
server.route("/api/users/:userId/premiumPlan").get(jwtMiddleware.authenticateUser, cors(), userPremiumPlanController.getUserLastPremiumPlan);

/**
 * @openapi
 * paths:
 *   /api/users/{userId}/premiumPlan:
 *     post:
 *       tags:
 *         - User
 *       summary: "Add a new premium plan to user's data"
 *       description: "Add a new premium plan to a specific user's data by their ID."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to add a new premium plan"
 *           required: true
 *           schema:
 *             type: string
 *         - in: body
 *           name: body
 *           description: "Premium plan information to add."
 *           required: true
 *           schema:
 *             type: object
 *             properties:
 *               planId:
 *                 type: string
 *                 description: "ID of the premium plan to add."
 *                 example: "premium_plan_1"
 * 
 *       responses:
 *         '201':
 *           description: "New premium plan added successfully."
 *           content:
 *             application/json:
 *               example:
 *                 - id: 1
 *                   userId: "user1"
 *                   planId: "premium_plan_1"
 *                   token: "abc123"
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
 *                 message: "Server error during premium plan addition."
 */
server.route("/api/users/:userId/premiumPlan").post(jwtMiddleware.authenticateUser, cors(), userPremiumPlanController.addUserPremiumPlan);



}