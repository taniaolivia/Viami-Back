module.exports = (server) => {
    const activityCommentController = require("../controllers/activityCommentController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');
server.get("/api/activities/hasUserLeftComment/:activityId/:otherUserId", jwtMiddleware.authenticateUser, cors(),activityCommentController.hasUserLeftComment);
server.post("/api/activities/addComment/:activityId", jwtMiddleware.authenticateUser, cors(),activityCommentController.addCommentToActivity);
}