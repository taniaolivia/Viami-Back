module.exports = (server) => {
    const themeActivityController = require("../controllers/themeActivityController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /api/themes/{themeId}/activities:
 *     get:
 *       tags:
 *         - Themes
 *       summary: "Get all activities by theme id"
 *       description: "Get all activities associated with a theme by theme id."
 *       
 *       parameters:
 *         - in: path
 *           name: themeId
 *           required: true
 *           description: "ID of the theme."
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "List of activities retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 activities:
 *                   - id: 1
 *                     activityId: 1
 *                     themeId: 1
 *                     activityName: "Activity 1"
 *                     activityImage: "Image 1"
 *                    
 *                   - id: 2
 *                     activityId: 2
 *                     themeId: 1
 *                     activityName: "Activity 2"
 *                     activityImage: "Image 2"
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
 *                 message: "Server error during retrieval of activities."
 */
server.route("/api/themes/:themeId/activities")
  .get(jwtMiddleware.authenticateUser, cors(), themeActivityController.listActivitiesByTheme);


/**
 * @openapi
 * paths:
 *   /api/themesFive/{themeId}/activities:
 *     get:
 *       tags:
 *         - Themes
 *       summary: "Get first five activities by theme id"
 *       description: "Get the first five activities associated with a theme by theme id."
 *       
 *       parameters:
 *         - in: path
 *           name: themeId
 *           required: true
 *           description: "ID of the theme."
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "List of first five activities retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 activities:
 *                   - id: 1
 *                     activityId: 1
 *                     themeId: 1
 *                     activityName: "Activity 1"
 *                     activityImage: "Image 1"
 *                    
 *                   - id: 2
 *                     activityId: 2
 *                     themeId: 1
 *                     activityName: "Activity 2"
 *                     activityImage: "Image 2"
 *                     
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
 *                 message: "Server error during retrieval of first five activities."
 */
server.route("/api/themesFive/:themeId/activities")
  .get(jwtMiddleware.authenticateUser, cors(), themeActivityController.getFirstFiveActivitiesByTheme);


}