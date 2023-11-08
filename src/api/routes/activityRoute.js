module.exports = (server) => {
    const activityController = require("../controllers/activityController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


server.route("/api/activities")
.get(jwtMiddleware.authenticateUser, cors(),  activityController.listAllActivities);

server.post("/api/save/activity", cors(),activityController.saveActivity );

server.route("/api/activity/:activityId")
.get( cors(), activityController.getActivityById)



}