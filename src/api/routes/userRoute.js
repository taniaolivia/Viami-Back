module.exports = (server) => {
    const userController = require("../controllers/userController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.post("/api/register", cors(), userController.userRegister);
server.post("/api/login", cors(), userController.userLogin);
server.post("/api/logout/:userId", cors(), userController.userLogout);

server.route("/api/users")
.get(jwtMiddleware.authenticateUser, cors(), userController.listAllUsers);

server.route("/api/users/userStatus/:userId")
.get(jwtMiddleware.authenticateUser, cors(), userController.getUserStatus);

server.route("/api/users/:userId")
.get(jwtMiddleware.authenticateUser, cors(), userController.getUserById)
.put(jwtMiddleware.authenticateUser, cors(), userController.updateUserById)
.patch(jwtMiddleware.authenticateUser, cors(), userController.updateUserPasswordById)
.delete(jwtMiddleware.authenticateUser, cors(), userController.deleteUserById);

server.route("/api/users/:userId/description")
.patch(jwtMiddleware.authenticateUser, cors(), userController.updateUserDescriptionById)

server.get("/api/checkToken/:token", cors(), userController.checkToken);

server.get("/verify", cors(), userController.verifiedEmailUserByToken);

server.post("/forgetPassword", cors(), userController.forgetPassword);
server.post("/setNewPassword", cors(), userController.updateUserPasswordByEmail);
server.get("/newPasswordForm", cors(), userController.newPasswordForm);

server.route("/api/users/:userId/fcmToken")
.patch(jwtMiddleware.authenticateUser, cors(), userController.setFcmTokenUser);

server.route("/api/users/search/:search")
.get(jwtMiddleware.authenticateUser, cors(), userController.searchUsersByFirstName);

server.route("/api/users/:userId/plan")
.patch(jwtMiddleware.authenticateUser, cors(), userController.updateUserPlan)

}