module.exports = (server) => {
    const activityController = require("../controllers/activityController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /api/activities:
 *      get:
 *       tags:
 *         - Activity
 *       summary: "Get all activities"
 *       description: "Get a list of all activities."
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "Activities retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 activities:
 *                   - id: 1
 *                     name: "Activity Name"
 *                     description: "Activity Description"
 *                     location: "Activity Location"
 *                     nbParticipant: 10
 *                     isRecommended: true
 *                     imageName: "Image Name"
 *                     url: "Image URL"
 *                     telephone: "Image Telephone"
 *                     address: "Image Address"
 *                     latitude: 123.456
 *                     longitude: 789.012
 *                     schedule: "Image Schedule"
 *                     language: "Image Language"
 *                     accessibility: true
 *                     image: "Base64 Encoded Image"
 *                     note: "Image Note"
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
 *                 message: "Server error during activity retrieval."
 */
server.route("/api/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.listAllActivities);
/**
 * @openapi
 * paths:
 *   /api/save/activity:
 *      post:
 *       tags:
 *         - Activity
 *       summary: "Save a new activity"
 *       description: "Save a new activity."
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               name: "New Activity"
 *               description: "New Activity Description"
 *               location: "New Activity Location"
 *               nbParticipant: 5
 *               isRecommended: false
 *               imageName: "New Image Name"
 *               url: "New Image URL"
 *               telephone: "New Image Telephone"
 *               address: "New Image Address"
 *               latitude: 12.345
 *               longitude: 67.890
 *               schedule: "New Image Schedule"
 *               language: "New Image Language"
 *               accessibility: true
 *               note: "New Image Note"
 *       responses:
 *         '201':
 *           description: "Activity saved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity is successfully saved."
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
 *                 message: "Invalid request"
 */
server.route("/api/save/activity")
.post(jwtMiddleware.authenticateUser, cors(), activityController.saveActivity);
/**
 * @openapi
 * paths:
 *   /api/activities/{activityId}:
 *      get:
 *       tags:
 *         - Activity
 *       summary: "Get activity by ID"
 *       description: "Get details of an activity by its ID."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: ID of the activity to retrieve.
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "Activity details retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity found"
 *                 data:
 *                   - id: 1
 *                     name: "Activity Name"
 *                     description: "Activity Description"
 *                     location: "Activity Location"
 *                     nbParticipant: 10
 *                     isRecommended: true
 *                     imageName: "Image Name"
 *                     url: "Image URL"
 *                     telephone: "Image Telephone"
 *                     address: "Image Address"
 *                     latitude: 123.456
 *                     longitude: 789.012
 *                     schedule: "Image Schedule"
 *                     language: "Image Language"
 *                     accessibility: true
 *                     image: "Base64 Encoded Image"
 *                     note: "Image Note"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity not found"
 *         '404':
 *           description: "Activity not found."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity not found"
 */
server.route("/api/activities/:activityId")
.get(jwtMiddleware.authenticateUser, cors(), activityController.getActivityById)
/**
 * @openapi
 * paths:
 *   /api/recommend/activities/{activityId}:
 *      get:
 *       tags:
 *         - Activity
 *       summary: "Get recommended activity by ID"
 *       description: "Get details of a recommended activity by its ID."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: ID of the recommended activity to retrieve.
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "Recommended activity details retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity found"
 *                 acitivity:
 *                   id: 1
 *                   name: "Activity Name"
 *                   description: "Activity Description"
 *                   location: "Activity Location"
 *                   nbParticipant: 10
 *                   isRecommended: true
 *                   imageName: "Image Name"
 *                   url: "Image URL"
 *                   telephone: "Image Telephone"
 *                   address: "Image Address"
 *                   latitude: 123.456
 *                   longitude: 789.012
 *                   schedule: "Image Schedule"
 *                   language: "Image Language"
 *                   accessibility: true
 *                   image: "Base64 Encoded Image"
 *                   note: "Image Note"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity not found"
 *         '404':
 *           description: "Recommended activity not found."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity not found"
 */
server.route("/api/recommend/activities/:activityId")
.get(jwtMiddleware.authenticateUser, cors(), activityController.getRecommendedActivityById);
/**
 * @openapi
 * paths:
 *   /api/recommend/activities:
 *      get:
 *       tags:
 *         - Activity
 *       summary: "List all recommended activities"
 *       description: "Get a list of all recommended activities."
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "Recommended activities retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 activities:
 *                   - id: 1
 *                     name: "Activity Name"
 *                     description: "Activity Description"
 *                     location: "Activity Location"
 *                     nbParticipant: 10
 *                     isRecommended: true
 *                     imageName: "Image Name"
 *                     url: "Image URL"
 *                     telephone: "Image Telephone"
 *                     address: "Image Address"
 *                     latitude: 123.456
 *                     longitude: 789.012
 *                     schedule: "Image Schedule"
 *                     language: "Image Language"
 *                     accessibility: true
 *                     image: "Base64 Encoded Image"
 *                     note: "Image Note"
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
 *                 message: "Server error during recommended activity retrieval."
 */
server.route("/api/recommend/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.listRecommendedActivities)
/**
 * @openapi
 * paths:
 *   /api/recommendFive/activities:
 *      get:
 *       tags:
 *         - Activity
 *       summary: "Get top five recommended activities"
 *       description: "Get a list of the top five recommended activities."
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "Top five recommended activities retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 activities:
 *                   - id: 1
 *                     name: "Activity Name"
 *                     description: "Activity Description"
 *                     location: "Activity Location"
 *                     nbParticipant: 10
 *                     isRecommended: true
 *                     imageName: "Image Name"
 *                     url: "Image URL"
 *                     telephone: "Image Telephone"
 *                     address: "Image Address"
 *                     latitude: 123.456
 *                     longitude: 789.012
 *                     schedule: "Image Schedule"
 *                     language: "Image Language"
 *                     accessibility: true
 *                     image: "Base64 Encoded Image"
 *                     note: "Image Note"
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
 *                 message: "Server error during recommended activity retrieval."
 */
server.route("/api/recommendFive/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.getTopFiveRecommendedActivities)
/**
 * @openapi
 * paths:
 *   /api/popular/activities:
 *     get:
 *       tags:
 *         - Activity
 *       summary: "List all popular activities"
 *       description: "Get a list of all popular activities."
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "Popular activities retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 activities:
 *                   - id: 1
 *                     name: "Activity Name"
 *                     description: "Activity Description"
 *                     location: "Activity Location"
 *                     nbParticipant: 10
 *                     isRecommended: true
 *                     imageName: "Image Name"
 *                     url: "Image URL"
 *                     telephone: "Image Telephone"
 *                     address: "Image Address"
 *                     latitude: 123.456
 *                     longitude: 789.012
 *                     schedule: "Image Schedule"
 *                     language: "Image Language"
 *                     accessibility: true
 *                     image: "Base64 Encoded Image"
 *                     note: "Image Note"
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
 *                 message: "Server error during popular activity retrieval."
 */
server.route("/api/popular/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.listPopularActivities);
/**
 * @openapi
 * paths:
 *   /api/popularFive/activities:
 *      get:
 *       tags:
 *         - Activity
 *       summary: "Get top five popular activities"
 *       description: "Get a list of the top five popular activities."
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "Top five popular activities retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 activities:
 *                   - id: 1
 *                     name: "Activity Name"
 *                     description: "Activity Description"
 *                     location: "Activity Location"
 *                     nbParticipant: 10
 *                     isRecommended: true
 *                     imageName: "Image Name"
 *                     url: "Image URL"
 *                     telephone: "Image Telephone"
 *                     address: "Image Address"
 *                     latitude: 123.456
 *                     longitude: 789.012
 *                     schedule: "Image Schedule"
 *                     language: "Image Language"
 *                     accessibility: true
 *                     image: "Base64 Encoded Image"
 *                     note: "Image Note"
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
 *                 message: "Server error during popular activity retrieval."
 */
server.route("/api/popularFive/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.getTopFivePopularActivities);
/**
 * @openapi
 * paths:
 *   /api/near/activities:
 *      get:
 *       tags:
 *         - Activity
 *       summary: "Get all activities by user position"
 *       description: "Get a list of all activities near the user's position."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: lat
 *           required: true
 *           description: "User's latitude."
 *           schema:
 *             type: number
 *         - in: query
 *           name: lon
 *           required: true
 *           description: "User's longitude."
 *           schema:
 *             type: number
 *       responses:
 *         '200':
 *           description: "Nearby activities retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Nearby activities found"
 *                 activities:
 *                   - id: 1
 *                     name: "Activity Name"
 *                     description: "Activity Description"
 *                     location: "Activity Location"
 *                     nbParticipant: 10
 *                     isRecommended: true
 *                     imageName: "Image Name"
 *                     url: "Image URL"
 *                     telephone: "Image Telephone"
 *                     address: "Image Address"
 *                     latitude: 123.456
 *                     longitude: 789.012
 *                     schedule: "Image Schedule"
 *                     language: "Image Language"
 *                     accessibility: true
 *                     image: "Base64 Encoded Image"
 *                     note: "Image Note"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '404':
 *           description: "No nearby activities found."
 *           content:
 *             application/json:
 *               example:
 *                 message: "No nearby activities found"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during nearby activity retrieval."
 */
server.route("/api/near/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.getAllActivitiesByUserPosition);
/**
 * @openapi
 * paths:
 *   /api/newNote/{activityId}:
 *     get:
 *       tags:
 *         - Activity
 *       summary: "Update note for activity"
 *       description: "Update the note for a specific activity."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: "ID of the activity for which to update the note."
 *           schema:
 *             type: integer
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 note:
 *                   type: string
 *                   description: "New note for the activity."
 *       responses:
 *         '200':
 *           description: "Activity note updated successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity note is updated successfully"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity not found"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during activity note update."
 */
server.route("/api/newNote/:activityId")
.get(jwtMiddleware.authenticateUser, cors(), activityController.updateNoteActivity);

}