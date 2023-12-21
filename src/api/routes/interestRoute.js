module.exports = (server) => {
    const interestController = require("../controllers/interestController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

    /**
     * @openapi
     * tags:
     *   name: Interest
     *   description: "Operations related to user interests."
     */

    /**
     * @openapi
     * paths:
     *   /api/interests:
     *     get:
     *       summary: "Get a list of interests"
     *       description: "Retrieve a list of all interests."
     *       tags: [Interest]
     *       security:
     *         - bearerAuth: []
     *       responses:
     *         '200':
     *           description: "Successful operation. Returns a list of interests."
     *           content:
     *             application/json:
     *               example:
     *                 interests:
     *                   - id: 1
     *                     interest: "Sports"
     *                   - id: 2
     *                     interest: "Music"
     *                   - id: 3
     *                     interest: "Travel"
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
     *                 message: "Server error during interest retrieval."
     */
    server.route("/api/interests")
        .get(jwtMiddleware.authenticateUser, cors(), interestController.listAllInterests);

    /**
     * @openapi
     * paths:
     *   /api/interests/{interestId}:
     *     get:
     *       summary: "Get an interest by ID"
     *       description: "Retrieve information about a specific interest by providing its ID."
     *       tags: [Interest]
     *       security:
     *         - bearerAuth: []
     *       parameters:
     *         - in: path
     *           name: interestId
     *           schema:
     *             type: integer
     *           required: true
     *           description: "ID of the interest to retrieve."
     *       responses:
     *         '200':
     *           description: "Successful operation. Returns information about the requested interest."
     *           content:
     *             application/json:
     *               example:
     *                 data:
     *                   - id: 1
     *                     interest: "Sports"
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
     *                 message: "Server error during interest retrieval."
     */
    server.route("/api/interests/:interestId")
        .get(jwtMiddleware.authenticateUser, cors(), interestController.getInterestById);
}
