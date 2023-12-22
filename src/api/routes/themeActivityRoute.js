module.exports = (server) => {
    const themeActivityController = require("../controllers/themeActivityController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/themes/:themeId/activities")
.get(jwtMiddleware.authenticateUser, cors(), themeActivityController.listActivitiesByTheme);

server.route("/api/themesFive/:themeId/activities")
.get(jwtMiddleware.authenticateUser, cors(), themeActivityController.getFirstFiveActivitiesByTheme);

}