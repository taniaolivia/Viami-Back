module.exports = (server) => {
    const userController = require("../controllers/userController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.post("/api/register", cors(), userController.userRegister);
server.post("/api/login", cors(), userController.userLogin);
server.post("/api/logout/:userId", cors(), userController.userLogout);

server.route("/api/users")
.get(jwtMiddleware.authenticateUser, cors(), userController.listAllUsers);

server.route("/api/users/:userId")
.get(jwtMiddleware.authenticateUser, cors(), userController.getUserById)
.put(jwtMiddleware.authenticateUser, cors(), userController.updateUserById)
.patch(jwtMiddleware.authenticateUser, cors(), userController.updateUserPasswordById)
.delete(jwtMiddleware.authenticateUser, cors(), userController.deleteUserById);

server.route("/api/users/:userId/description")
.patch(jwtMiddleware.authenticateUser, cors(), userController.updateUserDescriptionById)

server.get("/verify", cors(), userController.verifiedEmailUserByToken);

server.post("/forgetPassword", cors(), userController.forgetPassword);

}