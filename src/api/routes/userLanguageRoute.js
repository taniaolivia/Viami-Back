module.exports = (server) => {
    const userLanguageController = require("../controllers/userLanguageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /api/usersLanguages:
 *     get:
 *       tags:
 *         - User Language
 *       summary: "Get all users with their languages"
 *       description: "Retrieve all users along with their associated languages."
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "Users with languages retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 - userId: "user1"
 *                   languageId: "language1"
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
 *                 message: "Server error during users and languages retrieval."
 */
server.route("/api/usersLanguages").get(jwtMiddleware.authenticateUser, cors(), userLanguageController.getAllUsersLanguages);


/**
 * @openapi
 * paths:
 *   /api/users/{userId}/languages:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get all languages of a user by ID"
 *       description: "Retrieve all languages associated with the user identified by the given ID."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to retrieve languages"
 *           required: true
 *           schema:
 *             type: string
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "User languages retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 userLanguages:
 *                   - id: "user_language_id_here"
 *                     userId: "user_id_here"
 *                     languageId: "language_id_here"
 *                     user:
 *                       id: "user_id_here"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                     
 *                     language:
 *                       id: "language_id_here"
 *                       name: "English"
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
 *                 message: "Server error during user languages retrieval."
 */
server.route("/api/users/:userId/languages").get(jwtMiddleware.authenticateUser, cors(), userLanguageController.getUserLanguagesById);


/**
 * @openapi
 * paths:
 *   /api/users/{userId}/languages:
 *     post:
 *       tags:
 *         - User
 *       summary: "Add language to user's data"
 *       description: "Add a new language to the user's data."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to add language"
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 languageId:
 *                   type: string
 *                   description: "ID of the language to add"
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "Language added to user's data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Language is added to user's data"
 *                 user:
 *                   id: "user_id_here"
 *                   email: "example@email.com"
 *                
 *                 language:
 *                   id: "language_id_here"
 *                   name: "English"
 *                 
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
 *                 message: "Server error during adding language to user's data."
 */
server.route("/api/users/:userId/languages").post(jwtMiddleware.authenticateUser, cors(), userLanguageController.addUserLanguage);

/**
 * @openapi
 * paths:
 *   /api/users/{userId}/languages:
 *     delete:
 *       tags:
 *         - User
 *       summary: "Delete a language in user's data"
 *       description: "Delete a language from the user's data."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to delete language"
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 languageId:
 *                   type: string
 *                   description: "ID of the language to delete"
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "Language deleted from user's data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Language is deleted from user's data"
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
 *                 message: "Server error during deleting language from user's data."
 */
server.route("/api/users/:userId/languages").delete(jwtMiddleware.authenticateUser, cors(), userLanguageController.deleteUserLanguage);


/**
 * @openapi
 * paths:
 *   /api/languages/{languageId}/users:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get all users with the same language by ID"
 *       description: "Retrieve all users who have the same language associated with the given ID."
 *       parameters:
 *         - in: path
 *           name: languageId
 *           description: "ID of the language to retrieve users"
 *           required: true
 *           schema:
 *             type: string
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "Users with the same language retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 userLanguages:
 *                   - id: "user_language_id_here"
 *                     userId: "user_id_here"
 *                     languageId: "language_id_here"
 *                     user:
 *                       id: "user_id_here"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                      
 *                     language:
 *                       id: "language_id_here"
 *                       name: "English"
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
 *                 message: "Server error during users retrieval with the same language."
 */
server.route("/api/languages/:languageId/users").get(jwtMiddleware.authenticateUser, cors(), userLanguageController.getLanguageUsersById);


}