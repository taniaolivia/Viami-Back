module.exports = (server) => {
    const travelController = require("../controllers/travelController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


server.route("/api/travels")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.listAllTravel);

server.post("/api/save/travel", cors(), travelController.saveTravel);

server.route("/api/travel/:travelId")
.get( cors(), travelController.getTravelById);

server.route("/api/recommended-travels").get(cors(),travelController.listRecommendedTravel)

server.route("/api/popular/travels")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.listPopularTravels);

server.route("/api/popularFive/travels")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.getTopFivePopularTravels);

}