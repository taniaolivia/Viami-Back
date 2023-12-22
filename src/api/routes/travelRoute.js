module.exports = (server) => {
    const travelController = require("../controllers/travelController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


/**
 * @openapi
 * paths:
 *   /api/travels:
 *     get:
 *       tags:
 *         - Travel
 *       summary: "List all travels"
 *       description: "Get a list of all travels."
 *       
 *       responses:
 *         '200':
 *           description: "List of travels retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 travels:
 *                   - id: 1
 *                     name: "Travel 1"
 *                     description: "Description of Travel 1"
 *                     location: "Location 1"
 *                     nbParticipant: 5
 *                   - id: 2
 *                     name: "Travel 2"
 *                     description: "Description of Travel 2"
 *                     location: "Location 2"
 *                     nbParticipant: 10
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
 *                 message: "Server error during travel retrieval."
 */
server.route("/api/travels").get(jwtMiddleware.authenticateUser, cors(),  travelController.listAllTravels);


/**
 * @openapi
 * paths:
 *   /api/save/travel:
 *     post:
 *       tags:
 *         - Travel
 *       summary: "Save a new travel"
 *       description: "Save details of a new travel."
 *       
 *       requestBody:
 *         description: "Travel details"
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               name: "New Travel"
 *               description: "Description of New Travel"
 *               location: "New Location"
 *       responses:
 *         '201':
 *           description: "New travel saved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "New travel is successfully saved."
 *         '400':
 *           description: "Bad Request. Required fields are missing."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Please fill all the required fields! (name, description and location)"
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
 *                 message: "Error while saving the new travel."
 */
server.route("/api/save/travel").post(jwtMiddleware.authenticateUser, cors(), travelController.saveTravel);


/**
 * @openapi
 * paths:
 *   /api/search/travels:
 *     get:
 *       tags:
 *         - Travel
 *       summary: "Search travels"
 *       description: "Search travels based on location."
 *     
 *       parameters:
 *         - in: query
 *           name: location
 *           required: true
 *           description: "Location to search for travels."
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: "List of travels found successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "List of travels found"
 *                 travels:
 *                   - id: 1
 *                     name: "Travel 1"
 *                     description: "Description of Travel 1"
 *                     location: "Location 1"
 *                     nbParticipant: 5
 *                   - id: 2
 *                     name: "Travel 2"
 *                     description: "Description of Travel 2"
 *                     location: "Location 1"
 *                     nbParticipant: 10
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
 *                 message: "Server error during travel search."
 */
server.route("/api/search/travels").get(jwtMiddleware.authenticateUser, cors(),  travelController.searchTravels);


/**
 * @openapi
 * paths:
 *   /api/travels/{travelId}:
 *     get:
 *       tags:
 *         - Travel
 *       summary: "Get travel by ID"
 *       description: "Get details of a specific travel by ID."
 *      
 *       parameters:
 *         - in: path
 *           name: travelId
 *           required: true
 *           description: "ID of the travel"
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: "Travel details retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Travel found"
 *                 travel:
 *                   id: 1
 *                   name: "Travel 1"
 *                   description: "Description of Travel 1"
 *                   location: "Location 1"
 *                   nbParticipant: 5
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
 *                 message: "Server error during travel retrieval."
 */
server.route("/api/travels/:travelId").get(jwtMiddleware.authenticateUser, cors(), travelController.getTravelById);


/**
 * @openapi
 * paths:
 *   /api/travelUsers:
 *     get:
 *       tags:
 *         - Travel
 *       summary: "Get users for a travel"
 *       description: "Get details of users for a specific travel based on location and date."
 *       
 *       responses:
 *         '200':
 *           description: "List of users for the travel retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 userDateLocation:
 *                   nbParticipant: 5
 *                   users:
 *                     - id: 1
 *                       firstName: "User"
 *                       lastName: "1"
 *                   
 *                     - id: 2
 *                       firstName: "User"
 *                       lastName: "2"
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
 *                 message: "Server error during user retrieval for the travel."
 */
server.route("/api/travelUsers").get(jwtMiddleware.authenticateUser, cors(), travelController.getDateLocationUsers);


/**
 * @openapi
 * paths:
 *   /api/travelUsers/add:
 *     patch:
 *       tags:
 *         - Travel
 *       summary: "Join a travel"
 *       description: "Join a specific travel based on location and date."
 *      
 *       requestBody:
 *         description: "Travel details"
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               location: "Location 1"
 *               date: "2023-12-31"
 *               userId: "user_id_here"
 *       responses:
 *         '200':
 *           description: "Successfully joined the travel."
 *           content:
 *             application/json:
 *               example:
 *                 message: "You've been added successfully to the trip!"
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
 *                 message: "Server error during joining the travel."
 */
server.route("/api/travelUsers/add").patch(jwtMiddleware.authenticateUser, cors(), travelController.joinTravel);


}