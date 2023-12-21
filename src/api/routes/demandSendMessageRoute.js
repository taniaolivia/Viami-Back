module.exports = (server) => {
    const demandSendMessageController = require("../controllers/demandSendMessageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
/**
 * @openapi
 * paths:
 *   /api/send/requestMessage:
 *      post:
 *       tags:
 *         - Demmand
 *       summary: "Send a request to talk to a user"
 *       description: "Send a request to be able to talk to a user."
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               requesterId: 1
 *               receiverId: 2
 *               fcmToken: "user-fcm-token"
 *               title: "Request Message"
 *               content: "Can we talk?"
 *       responses:
 *         '200':
 *           description: "Request message sent successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Request message sent successfully."
 *         '400':
 *           description: "Bad Request. Failed to send request message."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Failed send request message to a user"
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
 *                 message: "Server error during request message sending."
 */
server.route("/api/send/requestMessage")
.post(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.requestSendMessage);
/**
 * @openapi
 * paths:
 *   /api/send/answerRequest:
 *      patch:
 *       tags:
 *         - Demmand
 *       summary: "Respond to a request of a user"
 *       description: "Respond to a request of a user. Accept or reject a request."
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               requestId: 1
 *               answer: 1
 *               fcmToken: "user-fcm-token"
 *               title: "Request Answer"
 *               content: "Your request has been accepted."
 *       responses:
 *         '200':
 *           description: "Request message answered successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Request message answered successfully."
 *         '400':
 *           description: "Bad Request. Failed to answer the request message."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Failed answering the request message of a user"
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
 *                 message: "Server error during request message answering."
 */

server.route("/api/send/answerRequest")
.patch(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.answerRequestMessageTwoUsers);
/**
 * @openapi
 * paths:
 *   /api/requestsMessages/{receiverId}:
 *     get:
 *       tags:
 *         - Demmand
 *       summary: "Display all requests that a user has"
 *       description: "Display all requests that a user has. Retrieves pending requests for a user."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: receiverId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "User ID for which to retrieve pending requests."
 *       responses:
 *         '200':
 *           description: "Pending requests retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 requestsMessages:
 *                   - id: 1
 *                     requesterId: 2
 *                     receiverId: 1
 *                     requesterFirstName: "John"
 *                     requesterLastName: "Doe"
 *                     receiverFirstName: "Jane"
 *                     receiverLastName: "Doe"
 *                     requesterFcmToken: "fcm-token-1"
 *                     receiverFcmToken: "fcm-token-2"
 *                     accept: null
 *                     chat: null
 *                   - id: 2
 *                     requesterId: 3
 *                     receiverId: 1
 *                     requesterFirstName: "Alice"
 *                     requesterLastName: "Johnson"
 *                     receiverFirstName: "Jane"
 *                     receiverLastName: "Doe"
 *                     requesterFcmToken: "fcm-token-3"
 *                     receiverFcmToken: "fcm-token-2"
 *                     accept: null
 *                     chat: null
 *         '400':
 *           description: "Bad Request. Failed to retrieve pending requests."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Failed retrieving pending requests for the user"
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
 *                 message: "Server error during pending requests retrieval."
 */
server.route("/api/requestsMessages/:receiverId")
.get(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.getAllRequestsMessagesByUser);
/**
 * @openapi
 * paths:
 *   /api/requestsMessages/{userId}/accepted:
 *     get:
 *       tags:
 *         - Demmand
 *       summary: "Display all the accepted requests of a user"
 *       description: "Display all the accepted requests of a user. Retrieves accepted requests for a user."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "User ID for which to retrieve accepted requests."
 *       responses:
 *         '200':
 *           description: "Accepted requests retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 requestsMessages:
 *                   - id: 1
 *                     requesterId: 2
 *                     receiverId: 1
 *                     requesterFirstName: "John"
 *                     requesterLastName: "Doe"
 *                     receiverFirstName: "Jane"
 *                     receiverLastName: "Doe"
 *                     requesterFcmToken: "fcm-token-1"
 *                     receiverFcmToken: "fcm-token-2"
 *                     accept: 1
 *                     chat: null
 *                   - id: 2
 *                     requesterId: 3
 *                     receiverId: 1
 *                     requesterFirstName: "Alice"
 *                     requesterLastName: "Johnson"
 *                     receiverFirstName: "Jane"
 *                     receiverLastName: "Doe"
 *                     requesterFcmToken: "fcm-token-3"
 *                     receiverFcmToken: "fcm-token-2"
 *                     accept: 1
 *                     chat: null
 *         '400':
 *           description: "Bad Request. Failed to retrieve accepted requests."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Failed retrieving accepted requests for the user"
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
 *                 message: "Server error during accepted requests retrieval."
 */
server.route("/api/requestsMessages/:userId/accepted")
.get(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.getAllAcceptedRequestsByUser);
/**
 * @openapi
 * paths:
 *   /api/requestsMessages/{requestId}/chat:
 *     patch:
 *       tags:
 *         - Demmand
 *       summary: "Update the chat value of a request"
 *       description: "Update the chat value of a request. Marks a request as having an active chat."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: requestId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the request to update the chat value."
 *       responses:
 *         '200':
 *           description: "Chat value updated successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Successfully updating the chat variable"
 *         '400':
 *           description: "Bad Request. Failed to update chat value."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Failed updating the chat variable"
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
 *                 message: "Server error during chat variable update."
 */
server.route("/api/requestsMessages/:requestId/chat")
.patch(jwtMiddleware.authenticateUser, cors(), demandSendMessageController.setChat);
}