module.exports = (server) => {
    const languageController = require("../controllers/languageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
/**
 * @openapi
 * tags:
 *   name: Language
 *   description: "Operations related to languages."
 * 
 * paths:
 *   /api/languages:
 *     get:
 *       summary: "Get a list of languages"
 *       description: "Retrieve a list of all languages."
 *       tags:
 *         - Language
 *       
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns a list of languages."
 *           content:
 *             application/json:
 *               example:
 *                 languages:
 *                   - id: 1
 *                     language: "English"
 *                   - id: 2
 *                     language: "French"
 *                   - id: 3
 *                     language: "Spanish"
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
 *                 message: "Server error during language retrieval."
 *
 *   /api/languages/{languageId}:
 *     get:
 *       summary: "Get a language by ID"
 *       description: "Retrieve information about a specific language by providing its ID."
 *       tags:
 *         - Language
 *      
 *       parameters:
 *         - in: path
 *           name: languageId
 *           schema:
 *             type: integer
 *           required: true
 *           description: "ID of the language to retrieve."
 *       responses:
 *         '200':
 *           description: "Successful operation. Returns information about the requested language."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: 1
 *                     language: "English"
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
 *                 message: "Server error during language retrieval."
 */


server.route("/api/languages")
.get(jwtMiddleware.authenticateUser, cors(), languageController.listAllLanguages);

server.route("/api/languages/:languageId")
.get(jwtMiddleware.authenticateUser, cors(), languageController.getLanguageById);

}