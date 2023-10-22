module.exports = (server) => {
    const languageController = require("../controllers/languageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/languages")
.get(jwtMiddleware.authenticateUser, cors(), languageController.listAllLanguages);

server.route("/api/languages/:languageId")
.get(jwtMiddleware.authenticateUser, cors(), languageController.getLanguageById);

}