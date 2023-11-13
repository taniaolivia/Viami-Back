module.exports = (server) => {
    const activityController = require("../controllers/activityController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


server.route("/api/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.listAllActivities);

server.route("/api/save/activity")
.post(jwtMiddleware.authenticateUser, cors(), activityController.saveActivity);

server.route("/api/activities/:activityId")
.get(jwtMiddleware.authenticateUser, cors(), activityController.getActivityById)

server.route("/api/recommend/activities/:activityId")
.get(jwtMiddleware.authenticateUser, cors(), activityController.getRecommendedActivityById);

server.route("/api/recommend/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.listRecommendedActivities)

server.route("/api/recommendFive/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.getTopFiveRecommendedActivities)

server.route("/api/popular/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.listPopularActivities);

server.route("/api/popularFive/activities")
.get(jwtMiddleware.authenticateUser, cors(), activityController.getTopFivePopularActivities);

}