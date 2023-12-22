module.exports = (server) => {
    const themeController = require("../controllers/themeController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/themes")
.get(jwtMiddleware.authenticateUser, cors(), themeController.listThemes);

server.route("/api/themesFive")
.get(jwtMiddleware.authenticateUser, cors(), themeController.getFiveThemes);

}