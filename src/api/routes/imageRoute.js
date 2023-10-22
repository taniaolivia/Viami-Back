module.exports = (server) => {
    const imageController = require("../controllers/imageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/images")
.get(jwtMiddleware.authenticateUser, cors(), imageController.listAllImages);

server.route("/api/image")
.post(jwtMiddleware.authenticateUser, cors(), imageController.addImage);

server.route("/api/images/:imageId")
.get(jwtMiddleware.authenticateUser, cors(), imageController.getImageById)
.patch(jwtMiddleware.authenticateUser, cors(), imageController.updateImageById);

}