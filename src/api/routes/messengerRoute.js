module.exports = (server) => {
    const messengerController = require("../controllers/messengerController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/messages/discussions/{messageId}:
 *     get:
 *       summary: "Get discussions for a specific message"
 *       description: "Retrieve discussions related to a specific message."
 *       tags: [Message]
 *       
 *       parameters:
 *         - in: path
 *           name: messageId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the message to retrieve discussions for."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns discussions for the specified message."
 *           content:
 *             application/json:
 *               example:
 *                 messages:
 *                   - id: 1
 *                     senderId: 123
 *                     responderId: 456
 *                     groupId: 789
 *                     date: "2023-01-01T12:00:00Z"
 *                     content: "Discussion message content"
 *                     senderFirstName: "John"
 *                     senderLastName: "Doe"
 *                     responderFirstName: "Jane"
 *                     responderLastName: "Doe"
 *                   - id: 2
 *                     senderId: 789
 *                     responderId: 123
 *                     groupId: 456
 *                     date: "2023-01-02T12:00:00Z"
 *                     content: "Another discussion message"
 *                     senderFirstName: "Jane"
 *                     senderLastName: "Doe"
 *                     responderFirstName: "John"
 *                     responderLastName: "Doe"
 *         '404':
 *           description: "Not Found. Message or details not found."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Message not found"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error"
 */
server.route("/api/messages/discussions/:messageId")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getDiscussionsForMessage);
/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/messages/discussions/group/{groupId}:
 *     get:
 *       summary: "Get discussions for a specific group"
 *       description: "Retrieve discussions related to a specific group."
 *       tags: [Message]
 *       
 *       parameters:
 *         - in: path
 *           name: groupId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the group to retrieve discussions for."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns discussions for the specified group."
 *           content:
 *             application/json:
 *               example:
 *                 messages:
 *                   - id: 1
 *                     senderId: 123
 *                     responderId: 456
 *                     groupId: 789
 *                     date: "2023-01-01T12:00:00Z"
 *                     content: "Discussion message content"
 *                     senderFirstName: "John"
 *                     senderLastName: "Doe"
 *                     responderFirstName: "Jane"
 *                     responderLastName: "Doe"
 *                   - id: 2
 *                     senderId: 789
 *                     responderId: 123
 *                     groupId: 456
 *                     date: "2023-01-02T12:00:00Z"
 *                     content: "Another discussion message"
 *                     senderFirstName: "Jane"
 *                     senderLastName: "Doe"
 *                     responderFirstName: "John"
 *                     responderLastName: "Doe"
 *         '404':
 *           description: "Not Found. Group or details not found."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Group not found"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error"
 */
server.route("/api/messages/discussions/group/:groupId")
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getDiscussionsForGroup);


/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/messages/{senderId}/{responderId}/messages:
 *     get:
 *       summary: "Get all messages between sender and responder"
 *       description: "Retrieve all messages between a sender and a responder."
 *       tags: [Message]
 *       
 *       parameters:
 *         - in: path
 *           name: senderId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the sender."
 *         - in: path
 *           name: responderId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the responder."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns all messages between sender and responder."
 *           content:
 *             application/json:
 *               example:
 *                 messages:
 *                   - id: 1
 *                     senderId: 123
 *                     responderId: 456
 *                     groupId: 789
 *                     date: "2023-01-01T12:00:00Z"
 *                     content: "Message content between sender and responder"
 *                   - id: 2
 *                     senderId: 789
 *                     responderId: 123
 *                     groupId: 456
 *                     date: "2023-01-02T12:00:00Z"
 *                     content: "Another message between sender and responder"
 *         '404':
 *           description: "Not Found. Group or messages not found."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Group not found"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error"
 */
server.route("/api/messages/:senderId/:responderId/messages")
    .get(jwtMiddleware.authenticateUser, cors(), messengerController.getMessagesBetweenUsers);


/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/messages/{messageId}:
 *     post:
 *       summary: "Set a message as read"
 *       description: "Mark a message as read for a specific user."
 *       tags: [Message]
 *      
 *       parameters:
 *         - in: path
 *           name: messageId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the message to set as read."
 *         - in: query
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user marking the message as read."
 *       responses:
 *         '200':
 *           description: "Successful operation. Message set as read."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Message is set to read successfully!"
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
 *                 message: "Server error during message set as read."
 *     get:
 *       summary: "Get a message by ID"
 *       description: "Retrieve information about a specific message by providing its ID."
 *       tags: [Message]
 *       
 *       parameters:
 *         - in: path
 *           name: messageId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the message to retrieve."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns information about the requested message."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Message found"
 *                 data:
 *                   - id: 1
 *                     senderId: 123
 *                     responderId: 456
 *                     groupId: 789
 *                     date: "2023-01-01T12:00:00Z"
 *                     content: "Message content"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '404':
 *           description: "Not Found. Message not found."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Message not found"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during message retrieval."
 */
server.route("/api/messages/:messageId")
    .post(jwtMiddleware.authenticateUser, cors(), messengerController.setMessageRead)
    .get(jwtMiddleware.authenticateUser, cors(), messengerController.getMessageById);


/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/messages/search/users:
 *     get:
 *       summary: "Search users by name"
 *       description: "Search users by the inserted name in the search input."
 *       tags: [Message]
 *       
 *       parameters:
 *         - in: query
 *           name: search
 *           schema:
 *             type: string
 *           required: true
 *           description: "Name to search for users."
 *         - in: query
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user performing the search."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns discussions with searched users."
 *           content:
 *             application/json:
 *               example:
 *                 discussions:
 *                   - groupId: 1
 *                     lastMessage:
 *                       id: 1
 *                       senderId: 123
 *                       responderId: 456
 *                       groupId: 789
 *                       date: "2023-01-01T12:00:00Z"
 *                       message: "Last message content"
 *                       senderFirstName: "SenderFirstName"
 *                       senderLastName: "SenderLastName"
 *                       responderFirstName: "ResponderFirstName"
 *                       responderLastName: "ResponderLastName"
 *                       read: false
 *                     users:
 *                       - id: 789
 *                         firstName: "User1FirstName"
 *                         lastName: "User1LastName"
 *                       - id: 987
 *                         firstName: "User2FirstName"
 *                         lastName: "User2LastName"
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
 *                 message: "Server error during user search."
 */
server.route("/api/messages/search/users")
    .get(jwtMiddleware.authenticateUser, cors(), messengerController.getSearchedUsers);


/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/sendMessage:
 *     post:
 *       summary: "Send a message"
 *       description: "Send a message to a group or user."
 *       tags: [Message]
 *       
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groupId:
 *                   type: integer
 *                   description: "ID of the group. If not provided, a new group will be created."
 *                 message:
 *                   type: string
 *                   description: "Content of the message."
 *                 senderId:
 *                   type: integer
 *                   description: "ID of the message sender."
 *                 responderId:
 *                   type: integer
 *                   description: "ID of the message responder."
 *       responses:
 *         '201':
 *           description: "Successful operation. Message sent successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Message sent successfully"
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
 *                 message: "Failed to send group message."
 */
server.route("/api/sendMessage")
    .post(jwtMiddleware.authenticateUser, cors(), messengerController.sendMessage);


/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/getUserCountInGroup/{groupId}:
 *     get:
 *       summary: "Get user count in group"
 *       description: "Retrieve the count of users in a specific group."
 *       tags: [Message]
 *       
 *       parameters:
 *         - in: path
 *           name: groupId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the group to retrieve user count."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns the count of users in the group."
 *           content:
 *             application/json:
 *               example:
 *                 success: true
 *                 count: 5
 *                 groupId: 123
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 success: false
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 success: false
 *                 message: "Internal server error."
 */
server.route("/api/getUserCountInGroup/:groupId")
    .get(jwtMiddleware.authenticateUser, cors(), messengerController.getUserCountInGroup);


/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/messages/addUserToGroup/{userToAddId}/{groupId}:
 *     post:
 *       summary: "Add a user to an existing group or create a new group"
 *       description: "Add a user to an existing group or create a new group if the group has two members already."
 *       tags: [Message]
 *       
 *       parameters:
 *         - in: path
 *           name: userToAddId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user to add to the group."
 *         - in: path
 *           name: groupId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the group to which the user will be added."
 *       responses:
 *         '200':
 *           description: "Successful operation. User added to the group successfully."
 *           content:
 *             application/json:
 *               example:
 *                 success: true
 *                 message: "User added to the group successfully"
 *                 groupId: 123
 *         '400':
 *           description: "Bad Request. User already exists in the group."
 *           content:
 *             application/json:
 *               example:
 *                 success: false
 *                 message: "User already exists in this group"
 *                 groupId: 123
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 success: false
 *                 message: "Internal server error."
 */
server.route("/api/messages/addUserToGroup/:userToAddId/:groupId")
    .post(jwtMiddleware.authenticateUser, cors(), messengerController.addUserToGroup);

/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/readDiscussions/{userId}:
 *     get:
 *       summary: "Get all chats with read messages for a user"
 *       description: "Retrieve all discussions with read messages for a specific user."
 *       tags: [Message]
 *      
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user to retrieve discussions for."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns discussions with read messages."
 *           content:
 *             application/json:
 *               example:
 *                 discussions:
 *                   - groupId: 1
 *                     messagesLus:
 *                       - id: 1
 *                         groupId: 1
 *                         message: "Read message 1"
 *                         date: "2023-12-20T12:00:00Z"
 *                         read: true
 *                       - id: 2
 *                         groupId: 1
 *                         message: "Read message 2"
 *                         date: "2023-12-20T12:15:00Z"
 *                         read: true
 *                     utilisateurs:
 *                       - 2
 *                       - 3
 *                   - groupId: 2
 *                     messagesLus: []
 *                     utilisateurs:
 *                       - 3
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during discussion retrieval."
 */
server.route("/api/readDiscussions/:userId")
    .get(jwtMiddleware.authenticateUser, cors(), messengerController.getAllReadDiscussionsForUser);

/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/unreadDiscussions/{userId}:
 *     get:
 *       summary: "Get all chats with unread messages for a user"
 *       description: "Retrieve all discussions with unread messages for a specific user."
 *       tags: [Message]
 *      
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user to retrieve discussions for."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns discussions with unread messages."
 *           content:
 *             application/json:
 *               example:
 *                 discussions:
 *                   - groupId: 1
 *                     messagesNonLus:
 *                       - id: 3
 *                         groupId: 1
 *                         message: "Unread message 3"
 *                         date: "2023-12-20T12:30:00Z"
 *                         read: false
 *                       - id: 4
 *                         groupId: 1
 *                         message: "Unread message 4"
 *                         date: "2023-12-20T12:45:00Z"
 *                         read: false
 *                     utilisateurs:
 *                       - 2
 *                       - 3
 *                   - groupId: 2
 *                     messagesNonLus: []
 *                     utilisateurs:
 *                       - 3
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during discussion retrieval."
 */
server.route("/api/unreadDiscussions/:userId")
    .get(jwtMiddleware.authenticateUser, cors(), messengerController.getAllUnreadDiscussionsForUser);

/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/discussions/{userId}/location:
 *     get:
 *       summary: "Get discussions for a user with location filter"
 *       description: "Retrieve discussions for a specific user filtered by location."
 *       tags: [Message]
 *       
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user to retrieve discussions for."
 *         - in: query
 *           name: location
 *           schema:
 *             type: string
 *           required: true
 *           description: "Location to filter discussions by."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns discussions filtered by location."
 *           content:
 *             application/json:
 *               example:
 *                 discussions:
 *                   - groupId: 1
 *                     lastMessage:
 *                       id: 3
 *                       groupId: 1
 *                       message: "Last message in group 1"
 *                       date: "2023-12-20T12:30:00Z"
 *                       read: false
 *                       senderFirstName: "John"
 *                       senderLastName: "Doe"
 *                       responderFirstName: "Jane"
 *                       responderLastName: "Doe"
 *                     users:
 *                       - id: 2
 *                         firstName: "Jane"
 *                         lastName: "Doe"
 *                       - id: 3
 *                         firstName: "Alice"
 *                         lastName: "Smith"
 *                     usersRead:
 *                       - 2
 *                       - 3
 *                   - groupId: 2
 *                     lastMessage: null
 *                     users: []
 *                     usersRead: []
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during discussion retrieval."
 */
server.route("/api/discussions/:userId/location")
    .get(jwtMiddleware.authenticateUser, cors(), messengerController.getAllDiscussionsForUserWithLocationFilter);


/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/discussions/{userId}:
 *     get:
 *       summary: "Get all discussions for a user"
 *       description: "Retrieve all discussions for a specific user."
 *       tags: [Message]
 *      
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user to retrieve discussions for."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns all discussions for the user."
 *           content:
 *             application/json:
 *               example:
 *                 discussions:
 *                   - groupId: 1
 *                     lastMessage:
 *                       id: 3
 *                       groupId: 1
 *                       message: "Last message in group 1"
 *                       date: "2023-12-20T12:30:00Z"
 *                       read: false
 *                       senderFirstName: "John"
 *                       senderLastName: "Doe"
 *                       responderFirstName: "Jane"
 *                       responderLastName: "Doe"
 *                     users:
 *                       - id: 2
 *                         firstName: "Jane"
 *                         lastName: "Doe"
 *                       - id: 3
 *                         firstName: "Alice"
 *                         lastName: "Smith"
 *                     usersRead:
 *                       - 2
 *                       - 3
 *                   - groupId: 2
 *                     lastMessage: null
 *                     users: []
 *                     usersRead: []
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during discussion retrieval."
 */
server.route("/api/discussions/:userId")
    .get(jwtMiddleware.authenticateUser, cors(), messengerController.getAllDiscussionsForUser);


/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/discussions/twoUsers/{userId}:
 *     get:
 *       summary: "Get two-user discussions for a user"
 *       description: "Retrieve discussions between the user and one other person."
 *       tags: [Message]
 *      
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user to retrieve two-user discussions for."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns two-user discussions for the user."
 *           content:
 *             application/json:
 *               example:
 *                 discussions:
 *                   - groupId: 1
 *                     lastMessage:
 *                       id: 3
 *                       groupId: 1
 *                       message: "Last message in group 1"
 *                       date: "2023-12-20T12:30:00Z"
 *                       read: false
 *                       senderFirstName: "John"
 *                       senderLastName: "Doe"
 *                       responderFirstName: "Jane"
 *                       responderLastName: "Doe"
 *                     users:
 *                       - id: 2
 *                         firstName: "Jane"
 *                         lastName: "Doe"
 *                     usersRead:
 *                       - 2
 *                   - groupId: 2
 *                     lastMessage: null
 *                     users: []
 *                     usersRead: []
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during two-user discussion retrieval."
 */
server.route("/api/discussions/twoUsers/:userId")
    .get(jwtMiddleware.authenticateUser, cors(), messengerController.getTwoUserDiscussions);

/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/discussions/groupUsers/{userId}:
 *     get:
 *       summary: "Get group discussions for a user with three or more users"
 *       description: "Retrieve discussions where the group is composed of three users or more."
 *       tags: [Message]
 *     
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user to retrieve group discussions for."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns group discussions for the user with three or more users."
 *           content:
 *             application/json:
 *               example:
 *                 discussions:
 *                   - groupId: 1
 *                     lastMessage:
 *                       id: 3
 *                       groupId: 1
 *                       message: "Last message in group 1"
 *                       date: "2023-12-20T12:30:00Z"
 *                       read: false
 *                       senderFirstName: "John"
 *                       senderLastName: "Doe"
 *                       responderFirstName: "Jane"
 *                       responderLastName: "Doe"
 *                     users:
 *                       - id: 2
 *                         firstName: "Jane"
 *                         lastName: "Doe"
 *                       - id: 3
 *                         firstName: "Bob"
 *                         lastName: "Smith"
 *                     usersRead:
 *                       - 2
 *                       - 3
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during group discussion retrieval."
 */
server.route('/api/discussions/groupUsers/:userId')
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getGroupUsersDiscussions);
/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/discussions/{userId}/unread:
 *     get:
 *       summary: "Get unread discussions for a user"
 *       description: "Retrieve unread discussions for a specific user."
 *       tags: [Message]
 *      
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user to retrieve unread discussions for."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns unread discussions for the user."
 *           content:
 *             application/json:
 *               example:
 *                 discussions:
 *                   - groupId: 1
 *                     lastMessage:
 *                       id: 3
 *                       groupId: 1
 *                       message: "Unread message in group 1"
 *                       date: "2023-12-20T12:30:00Z"
 *                       read: false
 *                       senderFirstName: "John"
 *                       senderLastName: "Doe"
 *                       responderFirstName: "Jane"
 *                       responderLastName: "Doe"
 *                     users:
 *                       - id: 2
 *                         firstName: "Jane"
 *                         lastName: "Doe"
 *                       - id: 3
 *                         firstName: "Bob"
 *                         lastName: "Smith"
 *                     usersRead:
 *                       - 2
 *                       - 3
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during unread discussions retrieval."
 */
server.route('/api/discussions/:userId/unread')
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getAllUnreadDiscussionsForUserFilter);
/**
 * @openapi
 * tags:
 *   name: Message
 *   description: "Operations related to messages and discussions."
 * 
 * paths:
 *   /api/discussions/{userId}/unread:
 *     get:
 *       summary: "Get unread discussions for a user"
 *       description: "Retrieve unread discussions for a specific user."
 *       tags: [Message]
 *      
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the user to retrieve unread discussions for."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns unread discussions for the user."
 *           content:
 *             application/json:
 *               example:
 *                 discussions:
 *                   - groupId: 1
 *                     lastMessage:
 *                       id: 3
 *                       groupId: 1
 *                       message: "Unread message in group 1"
 *                       date: "2023-12-20T12:30:00Z"
 *                       read: false
 *                       senderFirstName: "John"
 *                       senderLastName: "Doe"
 *                       responderFirstName: "Jane"
 *                       responderLastName: "Doe"
 *                     users:
 *                       - id: 2
 *                         firstName: "Jane"
 *                         lastName: "Doe"
 *                       - id: 3
 *                         firstName: "Bob"
 *                         lastName: "Smith"
 *                     usersRead:
 *                       - 2
 *                       - 3
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during unread discussions retrieval."
 */
server.route('/api/discussions/:userId/read')
.get(jwtMiddleware.authenticateUser, cors(), messengerController.getAllReadDiscussionsForUserFilter);
}