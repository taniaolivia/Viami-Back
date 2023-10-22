module.exports = (server) => {
    const userImageController = require("../controllers/userImageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/usersImages")
.get(jwtMiddleware.authenticateUser, cors(), userImageController.getAllUsersImages);

server.route("/api/users/:userId/images")
.get(jwtMiddleware.authenticateUser, cors(), userImageController.getUserImagesById)
.post(jwtMiddleware.authenticateUser, cors(), userImageController.addUserImage)
.delete(jwtMiddleware.authenticateUser, cors(), userImageController.deleteUserImage);

}