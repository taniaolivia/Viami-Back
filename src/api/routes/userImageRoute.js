module.exports = (server) => {
    const userImageController = require("../controllers/userImageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
    const multer = require('multer');
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

/**
 * @openapi
 * paths:
 *   /api/usersImages:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get all images with their users"
 *       description: "Retrieve all images with associated user information."
 *       
 *       responses:
 *         '200':
 *           description: "Images with users retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: "user_image_id_here"
 *                     userId: "user_id_here"
 *                     imageId: "image_id_here"
 *                     user:
 *                       id: "user_id_here"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                      
 *                     image:
 *                       id: "image_id_here"
 *                       url: "https://example.com/image.jpg"
 *                       
 *                   - id: "user_image_id_here"
 *                     userId: "user_id_here"
 *                     imageId: "image_id_here"
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
 *                 message: "Server error during image retrieval."
 */
server.route("/api/usersImages")
  .get(jwtMiddleware.authenticateUser, cors(), userImageController.getAllUsersImages);


/**
 * @openapi
 * paths:
 *   /api/users/{userId}/images:
 *     get:
 *       tags:
 *         - User
 *       summary: "Get all images of a user by id"
 *       description: "Retrieve all images associated with a specific user."
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: "ID of the user"
 *           schema:
 *             type: string
 *       
 *       responses:
 *         '200':
 *           description: "Images of the user retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 userImages:
 *                   - id: "user_image_id_here"
 *                     userId: "user_id_here"
 *                     imageId: "image_id_here"
 *                     user:
 *                       id: "user_id_here"
 *                       firstName: "John"
 *                       lastName: "Doe"
 *                       email: "example@email.com"
 *                    
 *                     image:
 *                       id: "image_id_here"
 *                       image: "https://example.com/image.jpg"
 *                     
 *                   - id: "user_image_id_here"
 *                     userId: "user_id_here"
 *                     imageId: "image_id_here"
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
 *                 message: "Server error during image retrieval."
 * 
 *     post:
 *       tags:
 *         - User
 *       summary: "Add image to user's data"
 *       description: "Upload a new image and associate it with a specific user."
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: "ID of the user"
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                   format: binary
 *      
 *       responses:
 *         '200':
 *           description: "Image added to user's data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Image is added to user's data"
 *                 user:
 *                   id: "user_id_here"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   email: "example@email.com"
 *                  
 *                 image:
 *                   id: "image_id_here"
 *                   image: "https://example.com/image.jpg"
 *                  
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during image upload."
 * 
 *     delete:
 *       tags:
 *         - User
 *       summary: "Delete an image in user's data"
 *       description: "Delete a specific image associated with a user."
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: "ID of the user"
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageId:
 *                   type: string
 *                   description: "ID of the image to delete"
 *                   example: "image_id_here"
 *                 image:
 *                   type: string
 *                   description: "URL of the image to delete"
 *                   example: "https://example.com/image.jpg"
 *       
 *       responses:
 *         '200':
 *           description: "Image deleted from user's data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Image is deleted from user's data"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during image deletion."
 */
server.route("/api/users/{userId}/images")
  .get(jwtMiddleware.authenticateUser, cors(), userImageController.getUserImagesById)
  .post(jwtMiddleware.authenticateUser, upload.single('image'), cors(), userImageController.addUserImage)
  .delete(jwtMiddleware.authenticateUser, cors(), userImageController.deleteUserImage);


}