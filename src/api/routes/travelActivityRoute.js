module.exports = (server) => {
    const travelActivityController = require("../controllers/travelActivityController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/travelActivities")
.get(jwtMiddleware.authenticateUser, cors(), travelActivityController.getAllTravelsActivities);



}