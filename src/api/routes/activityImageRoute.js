module.exports = (server) => {
    const activityImageController = require("../controllers/activityImageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * tags:
 *   name: Activity Images
 *   description: API endpoints for managing activity images.
 */

/**
 * @openapi
 * paths:
 *   /api/activityImages:
 *     get:
 *       tags:
 *         - Activity Images
 *       summary: "Get all images with their associated activities"
 *       description: "Get all images along with details of the activities they are associated with."
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "Activity images retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: 1
 *                     idImage: 123
 *                     idActivity: 456
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
 *                 message: "Internal server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error during image retrieval."
 */
server.route("/api/activityImages")
    .get(jwtMiddleware.authenticateUser, cors(), activityImageController.getAllActivitiesImages);

/**
 * @openapi
 * tags:
 *   name: Activity Images
 *   description: API endpoints for managing activity images.
 */

/**
 * @openapi
 * paths:
 *   /api/activities/{activityId}/images:
 *     get:
 *       tags:
 *         - Activity Images
 *       summary: "Get all images of an activity by ID"
 *       description: "Get all images associated with a specific activity identified by its ID."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: "ID of the activity for which images are being retrieved."
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "Activity images retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 activityImages:
 *                   - id: 1
 *                     idImage: 123
 *                     idActivity: 456
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
 *                 message: "Internal server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Internal server error during image retrieval."
 *     post:
 *       tags:
 *         - Activity Images
 *       summary: "Add image to activity"
 *       description: "Add an image to the data of a specific activity."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: "ID of the activity to which the image is being added."
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               image:
 *                 image: "Base64 Encoded Image"
 *       responses:
 *         '200':
 *           description: "Image added to activity data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Image added to activity's data successfully"
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
 *                 message: "Internal server error during image addition."
 *     delete:
 *       tags:
 *         - Activity Images
 *       summary: "Delete image from activity"
 *       description: "Delete an image from the data of a specific activity."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: activityId
 *           required: true
 *           description: "ID of the activity from which the image is being deleted."
 *           schema:
 *             type: integer
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               imageId: 123
 *       responses:
 *         '200':
 *           description: "Image deleted from activity data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Image deleted from activity's data successfully"
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
 *                 message: "Internal server error during image deletion."
 */
server.route("/api/activities/{activityId}/images")
    .get(jwtMiddleware.authenticateUser, cors(), activityImageController.getActivityImagesById)
    .post(jwtMiddleware.authenticateUser, cors(), activityImageController.addImageToActivity)
    .delete(jwtMiddleware.authenticateUser, cors(), activityImageController.deleteActivityImage);

}