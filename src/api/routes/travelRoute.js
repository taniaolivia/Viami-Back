module.exports = (server) => {
    const travelController = require("../controllers/travelController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


server.route("/api/travels")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.listAllTravel);

server.route("/api/search/travels")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.searchTravels);

server.post("/api/save/travel", cors(), travelController.saveTravel);

server.route("/api/travel/:travelId")
.get( cors(), travelController.getTravelById)

}