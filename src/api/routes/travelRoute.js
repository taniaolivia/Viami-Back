module.exports = (server) => {
    const travelController = require("../controllers/travelController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


server.route("/api/travels")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.listAllTravels);

server.route("/api/save/travel")
.post(jwtMiddleware.authenticateUser, cors(), travelController.saveTravel);

server.route("/api/search/travels")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.searchTravels);

server.route("/api/travels/:travelId")
.get(jwtMiddleware.authenticateUser, cors(), travelController.getTravelById);

}