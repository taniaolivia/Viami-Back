module.exports = (server) => {
    const imageController = require("../controllers/imageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
    const multer = require('multer');
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });
/**
 * @openapi
 * paths:
 *   /api/images:
 *     get:
 *       summary: Get a list of images
 *       description: Retrieve a list of all images.
 *       tags:
 *         - Image
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Successful operation. Returns a list of images.
 *           content:
 *             application/json:
 *               example:
 *                 images:
 *                   - id: 1
 *                     image: "https://example.com/image1.jpg"
 *                   - id: 2
 *                     image: "https://example.com/image2.jpg"
 *                   - id: 3
 *                     image: "https://example.com/image3.jpg"
 *         '401':
 *           description: Unauthorized. User not authenticated or server error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during image retrieval."
 */
server.route("/api/images")
.get(jwtMiddleware.authenticateUser, cors(), imageController.listAllImages);
/**
 * @openapi
 * paths:
 *   /api/image:
 *     post:
 *       summary: Add new image
 *       description: Add a new image to the server by uploading a file.
 *       tags:
 *         - Image
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *       responses:
 *         '200':
 *           description: Successful operation. Returns information about the newly added image.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Image added successfully"
 *                 data:
 *                   id: 4
 *                   image: "https://example.com/image4.jpg"
 *         '401':
 *           description: Unauthorized. User not authenticated or server error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request"
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during image upload."
 *     delete:
 *       summary: Delete an image
 *       description: Delete an existing image from the server.
 *       tags:
 *         - Image
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   description: URL of the image to be deleted.
 *       responses:
 *         '200':
 *           description: Successful operation. Returns a message indicating successful image deletion.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Image deleted successfully"
 *         '401':
 *           description: Unauthorized. User not authenticated or server error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request"
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during image deletion."
 */
server.route("/api/image")
.post(jwtMiddleware.authenticateUser, upload.single('image'), cors(), imageController.addImage)
.delete(jwtMiddleware.authenticateUser, cors(), imageController.deleteImage);
/**
 * @openapi
 * paths:
 *   /api/images/{imageId}:
 *     get:
 *       summary: Get an image by ID
 *       description: Retrieve information about a specific image using its ID.
 *       tags:
 *         - Image
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: imageId
 *           in: path
 *           required: true
 *           description: ID of the image to retrieve.
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Successful operation. Returns information about the requested image.
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   id: 4
 *                   image: "https://example.com/image4.jpg"
 *         '401':
 *           description: Unauthorized. User not authenticated or server error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request"
 *         '404':
 *           description: Image not found.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Image not found"
 *
 *     patch:
 *       summary: Update an image by ID
 *       description: Update an existing image on the server by its ID.
 *       tags:
 *         - Image
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: imageId
 *           in: path
 *           required: true
 *           description: ID of the image to update.
 *           schema:
 *             type: integer
 *       requestBody:
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *       responses:
 *         '200':
 *           description: Successful operation. Returns a message indicating successful image update.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Image has been updated successfully"
 *         '401':
 *           description: Unauthorized. User not authenticated or server error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request"
 *         '500':
 *           description: Internal Server Error.
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during image update."
 */
server.route("/api/images/:imageId")
.get(jwtMiddleware.authenticateUser, cors(), imageController.getImageById)
.patch(jwtMiddleware.authenticateUser, upload.single('image'), cors(), imageController.updateImageById);

}