module.exports = (server) => {
    const userImageController = require("../controllers/userImageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
    const cors = require('cors');
    const multer = require('multer');
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

server.route("/api/usersImages")
.get(jwtMiddleware.authenticateUser, cors(), userImageController.getAllUsersImages);

server.route("/api/users/:userId/images")
.get(jwtMiddleware.authenticateUser, cors(), userImageController.getUserImagesById)
.post(jwtMiddleware.authenticateUser, upload.single('image'), cors(), userImageController.addUserImage)
.delete(jwtMiddleware.authenticateUser, cors(), userImageController.deleteUserImage);

}