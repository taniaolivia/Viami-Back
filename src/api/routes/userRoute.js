module.exports = (server) => {
    const userController = require("../controllers/userController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
/**
 * @openapi
 * paths:
 *   /api/register:
 *     post:
 *       tags:
 *         - User
 *       summary: Register a new user
 *       description: Register a new user with the provided information.
 *       requestBody:
 *         description: User information for registration.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                   format: password
 *                 location:
 *                   type: string
 *                 description:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                   format: date
 *                 sex:
 *                   type: string
 *                   enum: [ "male", "female" ]
 *                 lastConnection:
 *                   type: string
 *                   format: date-time
 *                 fcmToken:
 *                   type: string
 *       responses:
 *         '200':
 *           description: User registered successfully.
 *           content:
 *             application/json:
 *               example:
 *                 message: |
 *                   User created: example@email.com
 *                 user:
 *                   firstName: John
 *                   lastName: Doe
 *                   email: example@email.com
 *                  
 *         '401':
 *           description: Invalid request or missing password.
 *           content:
 *             application/json:
 *               example:
 *                 message: Invalid request or missing password.
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               example:
 *                 message: An error occurred during registration.
 */
server.post("/api/register", cors(), userController.userRegister);

/**
 * @openapi
 * paths:
 *   /api/login:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: "Login to an existing account"
 *       description: "Log in to an existing user account with email and password."
 *       requestBody:
 *         description: "User credentials for login."
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                   format: password
 *       responses:
 *         '200':
 *           description: "User logged in successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Connected user: example@email.com"
 *                 token: ""
 *                 user:
 *                   id: "1"
 *                   email: "example@email.com"
 *         '401':
 *           description: "Invalid credentials or missing password."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid credentials or missing password."
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "An error occurred during login."
 */
server.post("/api/login", cors(), userController.userLogin);

/**
 * @openapi
 * paths:
 *   /api/logout/{userId}:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: "User Logout"
 *       description: "Logout an authenticated user."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to logout"
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: "User logged out successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Disconnected user: 1"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Error disconnecting user."
 */
server.post("/api/logout/:userId", cors(), userController.userLogout);


/**
 * @openapi
 * paths:
 *   /api/users:
 *     get:
 *       tags:
 *         - User
 *       summary: "Show list of users"
 *       description: "Retrieve a list of all users."
 * 
 *       responses:
 *         '200':
 *           description: "List of users retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: "1"
 *                     firstName: "John"
 *                     lastName: "Doe"
 *                     email: "john.doe@example.com"
 *                    
 *                   - id: "2"
 *                     firstName: "Jane"
 *                     lastName: "Doe"
 *                     email: "jane.doe@example.com"
 *                  
 *         '401':
 *           description: "Unauthorized. User not authenticated."
 *         '500':
 *           description: "Internal Server Error."
 */
server.route("/api/users").get(jwtMiddleware.authenticateUser, cors(), userController.listAllUsers);

/**
 * @openapi
 * paths:
 *   /api/users/userStatus/{userId}:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get the status of a user"
 *       description: "Get the online/offline status of a specific user by their ID."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to retrieve status"
 *           required: true
 *           schema:
 *             type: string
 * 
 *       responses:
 *         '200':
 *           description: "User status retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 userStatus:
 *                   status: "online"
 *                   lastConnection: null
 *         '401':
 *           description: "Unauthorized. User not authenticated."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Unauthorized"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error"
 */
server.route("/api/users/userStatus/:userId").get(jwtMiddleware.authenticateUser, cors(), userController.getUserStatus);

/**
 * @openapi
 * paths:
 *  /api/users/{userId}:
 *   get:
 *     tags:
 *       - User
 *     summary: "Get user by ID"
 *     description: "Retrieve information about a specific user by their ID."
 *     parameters:
 *      - in: path
 *        name: userId
 *        description: "ID of the user to retrieve"
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: "Successful operation. Returns the requested user."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                
 *       401:
 *         description: "Unauthorized. User not authenticated."
 *       404:
 *         description: "User not found."
 *       500:
 *         description: "Internal Server Error."
 *   put:
 *     tags:
 *       - User
 *     summary: "Update user by ID"
 *     description: "Update information about a specific user by their ID."
 *     parameters:
 *      - in: path
 *        name: userId
 *        description: "ID of the user to update"
 *        schema:
 *          type: string
 *      - in: body
 *        name: user
 *        description: "User object to update"
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *           
 *     responses:
 *       200:
 *         description: "Successful operation. Returns the updated user."
 *       401:
 *         description: "Unauthorized. User not authenticated."
 *       404:
 *         description: "User not found."
 *       500:
 *         description: "Internal Server Error."
 *   patch:
 *     tags:
 *       - User
 *     summary: "Update user password by ID"
 *     description: "Update the password of a specific user by their ID."
 *     parameters:
 *      - in: path
 *        name: userId
 *        description: "ID of the user to update the password"
 *        schema:
 *          type: string
 *      - in: body
 *        name: password
 *        description: "New password for the user"
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            password:
 *              type: string
 *     responses:
 *       200:
 *         description: "Successful operation. Returns a success message."
 *       401:
 *         description: "Unauthorized. User not authenticated."
 *       404:
 *         description: "User not found."
 *       500:
 *         description: "Internal Server Error."
 *   delete:
 *     tags:
 *       - User
 *     summary: "Delete user by ID"
 *     description: "Delete a specific user by their ID."
 *     parameters:
 *      - in: path
 *        name: userId
 *        description: "ID of the user to delete"
 *        schema:
 *          type: string
 *     responses:
 *       204:
 *         description: "Successful operation. User deleted."
 *       401:
 *         description: "Unauthorized. User not authenticated."
 *       404:
 *         description: "User not found."
 *       500:
 *         description: "Internal Server Error."
 */
server.route("/api/users/:userId")
.get(jwtMiddleware.authenticateUser, cors(), userController.getUserById)
.put(jwtMiddleware.authenticateUser, cors(), userController.updateUserById)
.patch(jwtMiddleware.authenticateUser, cors(), userController.updateUserPasswordById)
.delete(jwtMiddleware.authenticateUser, cors(), userController.deleteUserById);

/**
 * @openapi
 * paths:
 *  /api/users/userFcmToken/:fcmToken:
 *   get:
 *     tags:
 *       - User
 *     summary: "Get user by fcm token"
 *     description: "Retrieve information about a specific user by fcm token."
 *     parameters:
*      - in: path
 *        name: fcmToken
 *        description: "Fcm token of the user to retrieve"
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: "Successful operation. Returns the requested user."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                
 *       401:
 *         description: "Unauthorized. User not authenticated."
 *       404:
 *         description: "User not found."
 *       500:
 *         description: "Internal Server Error."
 */
server.route("/api/users/userFcmToken/:fcmToken")
.get(jwtMiddleware.authenticateUser, cors(), userController.getUserByFcmToken);


/**
 * @openapi
 * paths:
 *   /api/users/{userId}/description:
 *     patch:
 *       tags:
 *         - User
 *       summary: "Update user's description by ID"
 *       description: "Update the description of a specific user by their ID."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to update the description"
 *           required: true
 *           schema:
 *             type: string
 *       requestBody:
 *         description: "New description for the user."
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 * 
 *       responses:
 *         '200':
 *           description: "User's description updated successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "User's description is updated successfully"
 *         '401':
 *           description: "Unauthorized. User not authenticated."
 *           content:
 *             application/json:
 *               example:
 *                 message: "User not found"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 */
server.route("/api/users/:userId/description").patch(jwtMiddleware.authenticateUser, cors(), userController.updateUserDescriptionById);


/**
 * @openapi
 * paths:
 *   /api/checkToken/{token}:
 *     get:
 *       tags:
 *         - Authentication
 *       summary: "Check Token Validity"
 *       description: "Check the validity of an authentication token."
 *       parameters:
 *         - in: path
 *           name: token
 *           description: "Authentication token to check"
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: "Token is valid."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Token not expired"
 *         '500':
 *           description: "Token is expired."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Token expired"
 */
server.get("/api/checkToken/:token", cors(), userController.checkToken);


/**
 * @openapi
 * paths:
 *   /verify:
 *     get:
 *       tags:
 *         - Authentication
 *       summary: "Verify user's email by token"
 *       description: "Verify the user's email using the provided token."
 *       parameters:
 *         - in: query
 *           name: token
 *           description: "Verification token received via email."
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: "User's email verified successfully."
 *           content:
 *             text/html:
 *               example: "Email verified successfully. You can close this page."
 *         '401':
 *           description: "Unauthorized. Token expired or user not found."
 *           content:
 *             text/html:
 *               example: "Token expired. Please request a new verification email."
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             text/html:
 *               example: "Server error during email verification."
 */
server.get("/verify", cors(), userController.verifiedEmailUserByToken);

/**
 * @openapi
 * paths:
 *   /forgetPassword:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: "Send an email for password reset"
 *       description: "Send an email with a password reset link to the provided email address."
 *       requestBody:
 *         description: "User email for password reset."
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *       responses:
 *         '200':
 *           description: "Email sent successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Email sent"
 *         '401':
 *           description: "Unauthorized. Error sending email."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Error sending email"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error during email sending."
 */
server.post("/forgetPassword", cors(), userController.forgetPassword);
/**
 * @openapi
 * paths:
 *   /setNewPassword:
 *     post:
 *       tags:
 *         - Authentication
 *       summary: "Update user's password by email"
 *       description: "Update the password of a user using the provided email address and new password."
 *       requestBody:
 *         description: "User email and new password for updating the password."
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         '200':
 *           description: "Password updated successfully."
 *           content:
 *             text/html:
 *               example: "Password updated successfully. You can close this page."
 *         '401':
 *           description: "Unauthorized. Error updating password or user not found."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Error updating password or user not found."
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             text/html:
 *               example: "Server error during password update."
 */
server.post("/setNewPassword", cors(), userController.updateUserPasswordByEmail);

/**
 * @openapi
 * paths:
 *   /newPasswordForm:
 *     get:
 *       tags:
 *         - Authentication
 *       summary: "Display the form to change password in HTML"
 *       description: "Display the HTML form for users to change their password using a provided email and token."
 *       parameters:
 *         - in: query
 *           name: email
 *           description: "User email for password change."
 *           required: true
 *           schema:
 *             type: string
 *         - in: query
 *           name: token
 *           description: "Verification token received via email."
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: "Password change form displayed successfully."
 *           content:
 *             text/html:
 *               example: "HTML form for password change displayed successfully."
 *         '401':
 *           description: "Unauthorized. Token expired or user not found."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Token expired or user not found."
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             text/html:
 *               example: "Server error during password change form display."
 */
server.get("/newPasswordForm", cors(), userController.newPasswordForm);


/**
 * @openapi
 * paths:
 *   /api/users/{userId}/fcmToken:
 *     patch:
 *       tags:
 *         - User
 *       summary: "Update the FCM token of a user"
 *       description: "Update the Firebase Cloud Messaging (FCM) token of a specific user by their ID."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to update the FCM token"
 *           required: true
 *           schema:
 *             type: string
 *         - in: query
 *           name: fcmToken
 *           description: "New FCM token for the user."
 *           required: true
 *           schema:
 *             type: string
 * 
 *       responses:
 *         '200':
 *           description: "FCM token updated successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Successfully updating the FCM token of a user"
 *         '401':
 *           description: "Unauthorized. User not authenticated."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Unauthorized"
 *         '400':
 *           description: "Bad Request. Failed updating FCM token."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Failed updating the FCM token of a user"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error during FCM token update."
 */
server.route("/api/users/:userId/fcmToken").patch(jwtMiddleware.authenticateUser, cors(), userController.setFcmTokenUser);


/**
 * @openapi
 * paths:
 *   /api/users/search/{search}:
 *     get:
 *       tags:
 *         - User
 *       summary: "Search for users by first name"
 *       description: "Search for users whose first name matches the provided search term."
 *       parameters:
 *         - in: path
 *           name: search
 *           description: "Search term for first name."
 *           required: true
 *           schema:
 *             type: string
 * 
 *       responses:
 *         '200':
 *           description: "Users found successfully."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: "user1"
 *                     firstName: "John"
 *                     lastName: "Doe"
 *                     email: "john.doe@example.com"
 *                  
 *                   - id: "user2"
 *                     firstName: "Jane"
 *                     lastName: "Smith"
 *                     email: "jane.smith@example.com"
 *                  
 *         '401':
 *           description: "Unauthorized. User not authenticated."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Unauthorized"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error during user search."
 */
server.route("/api/users/search/:search").get(jwtMiddleware.authenticateUser, cors(), userController.searchUsersByFirstName);


/**
 * @openapi
 * paths:
 *   /api/users/{userId}/plan:
 *     patch:
 *       tags:
 *         - User
 *       summary: "Update user's plan"
 *       description: "Update the plan of a specific user by their ID."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to update the plan"
 *           required: true
 *           schema:
 *             type: string
 *         - in: query
 *           name: plan
 *           description: "New plan for the user."
 *           required: true
 *           schema:
 *             type: string
 * 
 *       responses:
 *         '201':
 *           description: "User's plan updated successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "User's plan is updated successfully"
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
 *                 message: "Server error during plan update."
 */
server.route("/api/users/:userId/plan").patch(jwtMiddleware.authenticateUser, cors(), userController.updateUserPlan);


/**
 * @openapi
 * paths:
 *   /api/users/{userId}/conversations:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get users with whom a specific user has had a conversation"
 *       description: "Retrieve users with whom a specific user has had a conversation."
 *       parameters:
 *         - in: path
 *           name: userId
 *           description: "ID of the user to retrieve conversations"
 *           required: true
 *           schema:
 *             type: string
 * 
 *       responses:
 *         '200':
 *           description: "Users with conversations retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: "user1"
 *                     firstName: "John"
 *                     lastName: "Doe"
 *                     email: "john.doe@example.com"
 *                   
 *                   - id: "user2"
 *                     firstName: "Jane"
 *                     lastName: "Smith"
 *                     email: "jane.smith@example.com"
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
 *                 message: "Server error during user conversations retrieval."
 */
server.route("/api/users/:userId/conversations").get(jwtMiddleware.authenticateUser, cors(), userController.getUsersWithConversation);



}