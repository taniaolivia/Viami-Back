module.exports = (server) => {
    const travelController = require("../controllers/travelController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


server.route("/api/travels")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.listAllTravel);

server.route("/api/save/travel")
.post(jwtMiddleware.authenticateUser, cors(), travelController.saveTravel);

server.route("/api/travels/:travelId")
.get(jwtMiddleware.authenticateUser, cors(), travelController.getTravelById);

server.route("/api/recommend/travels")
.get(jwtMiddleware.authenticateUser, cors(),travelController.listRecommendedTravel)

server.route("/api/recommendFive/travels")
.get(jwtMiddleware.authenticateUser, cors(),travelController.getTopFiveRecommendedTravels)

}