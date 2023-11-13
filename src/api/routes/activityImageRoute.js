module.exports = (server) => {
    const activityImageController = require("../controllers/activityImageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/activityImages")
.get(jwtMiddleware.authenticateUser, cors(), activityImageController.getAllActivitiesImages);

server.route("/api/activities/:activityId/images")
.get(jwtMiddleware.authenticateUser, cors(), activityImageController.getActivityImagesById)
.post(jwtMiddleware.authenticateUser, cors(), activityImageController.addImageToActivity)
.delete(jwtMiddleware.authenticateUser, cors(), activityImageController.deleteActivityImage);

}