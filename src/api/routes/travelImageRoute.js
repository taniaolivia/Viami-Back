module.exports = (server) => {
    const travelImageController = require("../controllers/travelImageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /api/travelImages:
 *     get:
 *       tags:
 *         - Travel
 *       summary: "Get all images with their travel"
 *       description: "Get all images associated with their respective travels."
 *       
 *       responses:
 *         '200':
 *           description: "List of all travel images retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: 1
 *                     idImage: 1
 *                     idTravel: 123
 *                     name: "Travel 1"
 *                     travelDescription: "Description of Travel 1"
 *                     location: "Location 1"
 *                     nbParticipant: 5
 *                     imageName: "Image1.jpg"
 *                   - id: 2
 *                     idImage: 2
 *                     idTravel: 124
 *                     name: "Travel 2"
 *                     travelDescription: "Description of Travel 2"
 *                     location: "Location 2"
 *                     nbParticipant: 8
 *                     imageName: "Image2.jpg"
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
 *                 message: "Server error during image retrieval for all travels."
 */
server.route("/api/travelImages")
  .get(jwtMiddleware.authenticateUser, cors(), travelImageController.getAllTravelsImages);



/**
 * @openapi
 * paths:
 *   /api/travels/{travelId}/images:
 *     get:
 *       tags:
 *         - Travel
 *       summary: "Get all images of a travel by ID"
 *       description: "Get all images associated with a specific travel by ID."
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
 *           description: "List of images for the travel retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 travelImages:
 *                   - id: 1
 *                     idImage: 1
 *                     idTravel: 123
 *                     name: "Travel 1"
 *                     travelDescription: "Description of Travel 1"
 *                     location: "Location 1"
 *                     nbParticipant: 5
 *                     imageName: "Image1.jpg"
 *                   - id: 2
 *                     idImage: 2
 *                     idTravel: 123
 *                     name: "Travel 1"
 *                     travelDescription: "Description of Travel 1"
 *                     location: "Location 1"
 *                     nbParticipant: 5
 *                     imageName: "Image2.jpg"
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
 *                 message: "Server error during image retrieval for the travel."
 *     post:
 *       tags:
 *         - Travel
 *       summary: "Add image to travel's data"
 *       description: "Add an image to a specific travel's data."
 *       
 *       parameters:
 *         - in: path
 *           name: travelId
 *           required: true
 *           description: "ID of the travel"
 *           schema:
 *             type: string
 *       requestBody:
 *         description: "Image details"
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               image: "Base64EncodedImageString"
 *       responses:
 *         '200':
 *           description: "Image added to travel's data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Image is added to travel's data"
 *                 travel:
 *                   id: 123
 *                   name: "Travel 1"
 *                   description: "Description of Travel 1"
 *                   location: "Location 1"
 *                   nbParticipant: 5
 *                 image:
 *                   id: 1
 *                   image: "Base64EncodedImageString"
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
 *                 message: "Server error during adding image to travel's data."
 *     delete:
 *       tags:
 *         - Travel
 *       summary: "Delete an image in travel's data"
 *       description: "Delete an image from a specific travel's data."
 *       
 *       parameters:
 *         - in: path
 *           name: travelId
 *           required: true
 *           description: "ID of the travel"
 *           schema:
 *             type: string
 *       requestBody:
 *         description: "Image details"
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               imageId: 1
 *       responses:
 *         '200':
 *           description: "Image deleted from travel's data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Image is deleted from travel's data"
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
 *                 message: "Server error during deleting image from travel's data."
 */
server.route("/api/travels/:travelId/images")
  .get(jwtMiddleware.authenticateUser, cors(), travelImageController.getTravelImagesById)
  .post(jwtMiddleware.authenticateUser, cors(), travelImageController.addImageToTravel)
  .delete(jwtMiddleware.authenticateUser, cors(), travelImageController.deleteTravelImage);


}