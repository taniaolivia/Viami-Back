module.exports = (server) => {
    const userInterestController = require("../controllers/userInterestController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /api/usersInterests:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get all interests with their users"
 *       description: "Retrieve all users with their associated interests."
 *     
 *       responses:
 *         '200':
 *           description: "Users with their associated interests retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: "user_interest_id_here"
 *                     userId: "user_id_here"
 *                     interestId: "interest_id_here"
 *                     user:
 *                       id: "user_id_here"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                   
 *                     interest:
 *                       id: "interest_id_here"
 *                       name: "Technology"
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
 *                 message: "Server error during users and interests retrieval."
 */
server.route("/api/usersInterests").get(jwtMiddleware.authenticateUser, cors(), userInterestController.getAllUsersInterests);


/**
 * @openapi
 * paths:
 *   /api/users/{userId}/interests:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get all interests of a user by id"
 *       description: "Retrieve all interests associated with a specific user."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user."
 *           required: true
 *           schema:
 *             type: string
 *      
 *       responses:
 *         '200':
 *           description: "Interests associated with the user retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 userInterests:
 *                   - id: "user_interest_id_here"
 *                     userId: "user_id_here"
 *                     interestId: "interest_id_here"
 *                     user:
 *                       id: "user_id_here"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                       
 *                     interest:
 *                       id: "interest_id_here"
 *                       name: "Technology"
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
 *                 message: "Server error during user interests retrieval."
 * 
 *     post:
 *       tags:
 *         - User
 *       summary: "Add interest to user's data"
 *       description: "Add a new interest to the specified user's data."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user."
 *           required: true
 *           schema:
 *             type: string
 *         - in: body
 *           name: body
 *           description: "Interest ID to be added to user's data."
 *           required: true
 *           schema:
 *             type: object
 *             properties:
 *               interestId:
 *                 type: string
 *                 description: "ID of the interest to be added."
 *     
 *       responses:
 *         '200':
 *           description: "Interest added to user's data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Interest is added to user's data"
 *                 user: 
 *                 interest: 
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during user interests addition."
 * 
 *     delete:
 *       tags:
 *         - User
 *       summary: "Delete an interest in user's data"
 *       description: "Delete a specific interest from the specified user's data."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user."
 *           required: true
 *           schema:
 *             type: string
 *         - in: body
 *           name: body
 *           description: "Interest ID to be deleted from user's data."
 *           required: true
 *           schema:
 *             type: object
 *             properties:
 *               interestId:
 *                 type: string
 *                 description: "ID of the interest to be deleted."
 *     
 *       responses:
 *         '200':
 *           description: "Interest deleted from user's data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Interest is deleted from user's data"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during user interests deletion."
 */
server.route("/api/users/:userId/interests")
  .get(jwtMiddleware.authenticateUser, cors(), userInterestController.getUserInterestsById)
  .post(jwtMiddleware.authenticateUser, cors(), userInterestController.addUserInterest)
  .delete(jwtMiddleware.authenticateUser, cors(), userInterestController.deleteUserInterest);

/**
 * @openapi
 * paths:
 *   /api/interests/{interestId}/users:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get all users with the same interest by id"
 *       description: "Retrieve all users who share a specific interest by interest ID."
 *       parameters:
 *         - in: path
 *           name: interestId
 *           description: "ID of the interest."
 *           required: true
 *           schema:
 *             type: string
 *     
 * 
 *       responses:
 *         '200':
 *           description: "Users with the same interest retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 userInterests:
 *                   - id: "user_interest_id_here"
 *                     userId: "user_id_here"
 *                     interestId: "interest_id_here"
 *                     user:
 *                       id: "user_id_here"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                     
 *                     interest:
 *                       id: "interest_id_here"
 *                       name: "Technology"
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
 *                 message: "Server error during interest users retrieval."
 */
server.route("/api/interests/:interestId/users")
  .get(jwtMiddleware.authenticateUser, cors(), userInterestController.getInterestUsersById);


}