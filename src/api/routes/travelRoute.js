module.exports = (server) => {
    const travelController = require("../controllers/travelController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


server.route("/api/travels")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.listAllTravel);

server.post("/api/save/travel", cors(), travelController.saveTravel);

server.route("/api/travels/:travelId")
.get(jwtMiddleware.authenticateUser, cors(), travelController.getTravelById)

}