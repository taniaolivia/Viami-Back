module.exports = (server) => {
    const premiumPlanController = require("../controllers/premiumPlanController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /api/premiumPlans:
 *     get:
 *       tags:
 *         - Premium Plans
 *       summary: "Get all premium plans"
 *       description: "Get details of all available premium plans."
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: "List of premium plans retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 plans:
 *                   - id: 1
 *                     name: "Premium Plan 1"
 *                     description: "Description of Premium Plan 1"
 *                     price: 9.99
 *                     
 *                   - id: 2
 *                     name: "Premium Plan 2"
 *                     description: "Description of Premium Plan 2"
 *                     price: 14.99
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
 *                 message: "Server error during retrieval of premium plans."
 */
server.route("/api/premiumPlans")
  .get(jwtMiddleware.authenticateUser, cors(), premiumPlanController.getAllPremiumPlans);


/**
 * @openapi
 * paths:
 *   /api/premiumPlans/{planId}:
 *     get:
 *       tags:
 *         - Premium Plans
 *       summary: "Get premium plan by ID"
 *       description: "Get details of a premium plan by its ID."
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: planId
 *           required: true
 *           description: "ID of the premium plan."
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "Premium plan details retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 id: 1
 *                 name: "Premium Plan 1"
 *                 description: "Description of Premium Plan 1"
 *                 price: 9.99
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
 *                 message: "Server error during retrieval of premium plan details."
 */
server.route("/api/premiumPlans/:planId")
  .get(jwtMiddleware.authenticateUser, cors(), premiumPlanController.getPremiumPlanById);


}