module.exports = (server) => {
    const imageController = require("../controllers/imageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/images")
.get(jwtMiddleware.authenticateUser, cors(), imageController.listAllImages);

server.route("/api/images/:imageId")
.get(jwtMiddleware.authenticateUser, cors(), imageController.getImageById);

}