module.exports = (server) => {
    const travelActivityController = require("../controllers/travelActivityController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/travelActivities")
.get(jwtMiddleware.authenticateUser, cors(), travelActivityController.getAllTravelsActivities);


server.route("/api/travels/:travelId/activities")
.get(jwtMiddleware.authenticateUser, cors(), travelActivityController.getTravelActivitiesById)
.post(jwtMiddleware.authenticateUser, cors(), travelActivityController.addActivityToTravel)
.delete(jwtMiddleware.authenticateUser, cors(), travelActivityController.deleteTravelActivity);

}