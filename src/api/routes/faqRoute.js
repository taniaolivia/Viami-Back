module.exports = (server) => {
    const faqController = require("../controllers/faqController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * tags:
 *   name: FAQ
 *   description: Operations related to Frequently Asked Questions (FAQ)
 * 
 * paths:
 *   /api/faq:
 *     get:
 *       summary: List all FAQ
 *       description: Retrieve a list of all Frequently Asked Questions.
 *       tags:
 *         - FAQ
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Successful operation. Returns a list of FAQ.
 *           content:
 *             application/json:
 *               example:
 *                 faq:
 *                   - id: 1
 *                     question: "What is FAQ?"
 *                     answer: "FAQ stands for Frequently Asked Questions..."
 *                   - id: 2
 *                     question: "How can I contact support?"
 *                     answer: "You can contact support by..."
 *         '401':
 *           description: Unauthorized. User not authenticated or server error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 */
server.route("/api/faq")
.get(jwtMiddleware.authenticateUser, cors(), faqController.listAllFaq);
/**
 * @openapi
 * tags:
 *   name: FAQ
 *   description: Operations related to Frequently Asked Questions (FAQ)
 * 
 * paths:
 *   /api/faq/{faqId}:
 *     get:
 *       summary: Get FAQ by ID
 *       description: Retrieve information about a specific FAQ using its ID.
 *       tags:
 *         - FAQ
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: faqId
 *           in: path
 *           required: true
 *           description: ID of the FAQ to retrieve.
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Successful operation. Returns information about the requested FAQ.
 *           content:
 *             application/json:
 *               example:
 *                 message: "FAQ found"
 *                 data:
 *                   id: 1
 *                   question: "What is FAQ?"
 *                   answer: "FAQ stands for Frequently Asked Questions..."
 *         '401':
 *           description: Unauthorized. User not authenticated or server error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "FAQ not found"
 */
server.route("/api/faq/:faqId")
.get(jwtMiddleware.authenticateUser, cors(),faqController.getFaqById)
/**
 * @openapi
 * tags:
 *   name: FAQ
 *   description: Operations related to Frequently Asked Questions (FAQ)
 * 
 * paths:
 *   /api/frequentedFive/faq:
 *     get:
 *       summary: Get top five frequented FAQ
 *       description: Retrieve a list of the top five frequently accessed FAQ.
 *       tags:
 *         - FAQ
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Successful operation. Returns a list of the top five frequented FAQ.
 *           content:
 *             application/json:
 *               example:
 *                 faq:
 *                   - id: 1
 *                     question: "What is FAQ?"
 *                     answer: "FAQ stands for Frequently Asked Questions..."
 *                   - id: 2
 *                     question: "How can I contact support?"
 *                     answer: "You can contact support by..."
 *         '401':
 *           description: Unauthorized. User not authenticated or server error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 */
server.route("/api/frequentedFive/faq")
.get(jwtMiddleware.authenticateUser, cors(),faqController.getTopFiveFrequentedFaq)



}