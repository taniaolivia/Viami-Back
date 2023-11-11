module.exports = (server) => {
    const activityController = require("../controllers/activityController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


server.route("/api/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.listAllActivities);

server.route("/api/save/activity")
.post(jwtMiddleware.authenticateUser, cors(), activityController.saveActivity);

server.route("/api/activity/:activityId")
.get(jwtMiddleware.authenticateUser, cors(), activityController.getActivityById)

server.route("/api/recommend/activities/:activityId")
.get(jwtMiddleware.authenticateUser, cors(), travelController.getRecommendedActivityById);

server.route("/api/recommend/activities")
.get(jwtMiddleware.authenticateUser, cors(),travelController.listRecommendedActivities)

server.route("/api/recommendFive/activities")
.get(jwtMiddleware.authenticateUser, cors(),travelController.getTopFiveRecommendedActivities)

server.route("/api/popular/activities")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.listPopularActivities);

server.route("/api/popularFive/activities")
.get(jwtMiddleware.authenticateUser, cors(),  travelController.getTopFivePopularActivities);

}