module.exports = (server) => {
    const themeTravelController = require("../controllers/themeTravelController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/themes")
.get(jwtMiddleware.authenticateUser, cors(), themeTravelController.listThemes);

server.route("/api/themesFive")
.get(jwtMiddleware.authenticateUser, cors(), themeTravelController.getFiveThemes);

server.route("/api/themes/:themeId/travels")
.get(jwtMiddleware.authenticateUser, cors(), themeTravelController.listTravelsByTheme);

}