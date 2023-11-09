module.exports = (server) => {
    const travelImageController = require("../controllers/travelImageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/travelImages")
.get(jwtMiddleware.authenticateUser, cors(), travelImageController.getAllTravelsImages);


server.route("/api/travels/:travelId/images")
.get(jwtMiddleware.authenticateUser, cors(), travelImageController.getTravelImagesById)
.post(jwtMiddleware.authenticateUser, cors(), travelImageController.addImageToTravel)
.delete(jwtMiddleware.authenticateUser, cors(), travelImageController.deleteTravelImage);

}