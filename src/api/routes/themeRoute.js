module.exports = (server) => {
    const themeController = require("../controllers/themeController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /api/themes:
 *     get:
 *       tags:
 *         - Themes
 *       summary: "Get all themes ordered by theme name"
 *       description: "Get all themes ordered ascending by theme name."
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "List of all themes retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 themes:
 *                   - id: 1
 *                     theme: "Theme 1"
 *                   - id: 2
 *                     theme: "Theme 2"
 *                   - id: 3
 *                     theme: "Theme 3"
 *                   - id: 4
 *                     theme: "Theme 4"
 *                   - id: 5
 *                     theme: "Theme 5"
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
 *                 message: "Server error during retrieval of themes."
 */
server.route("/api/themes")
  .get(jwtMiddleware.authenticateUser, cors(), themeController.listThemes);


/**
 * @openapi
 * paths:
 *   /api/themesFive:
 *     get:
 *       tags:
 *         - Themes
 *       summary: "Get five themes ordered by theme name"
 *       description: "Get five themes ordered ascending by theme name."
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "List of five themes retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 themes:
 *                   - id: 1
 *                     theme: "Theme 1"
 *                   - id: 2
 *                     theme: "Theme 2"
 *                   - id: 3
 *                     theme: "Theme 3"
 *                   - id: 4
 *                     theme: "Theme 4"
 *                   - id: 5
 *                     theme: "Theme 5"
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
 *                 message: "Server error during retrieval of five themes."
 */
server.route("/api/themesFive")
  .get(jwtMiddleware.authenticateUser, cors(), themeController.getFiveThemes);


}