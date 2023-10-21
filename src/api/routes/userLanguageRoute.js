module.exports = (server) => {
    const userLanguageController = require("../controllers/userLanguageController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/usersLanguages")
.get(jwtMiddleware.authenticateUser, cors(), userLanguageController.getAllUsersLanguages);

server.route("/api/users/:userId/languages")
.get(jwtMiddleware.authenticateUser, cors(), userLanguageController.getUserLanguagesById)
.post(jwtMiddleware.authenticateUser, cors(), userLanguageController.addUserLanguage)
.delete(jwtMiddleware.authenticateUser, cors(), userLanguageController.deleteUserLanguage);

server.route("/api/languages/:languageId/users")
.get(jwtMiddleware.authenticateUser, cors(), userLanguageController.getLanguageUsersById);

}