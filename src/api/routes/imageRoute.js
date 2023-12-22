module.exports = (server) => {
    const imageController = require("../controllers/imageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
    const multer = require('multer');
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

server.route("/api/images")
.get(jwtMiddleware.authenticateUser, cors(), imageController.listAllImages);

server.route("/api/image")
.post(jwtMiddleware.authenticateUser, upload.single('image'), cors(), imageController.addImage)
.delete(jwtMiddleware.authenticateUser, cors(), imageController.deleteImage);

server.route("/api/images/:imageId")
.get(jwtMiddleware.authenticateUser, cors(), imageController.getImageById)
.patch(jwtMiddleware.authenticateUser, upload.single('image'), cors(), imageController.updateImageById);

}