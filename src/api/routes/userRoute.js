module.exports = (server) => {
    const userController = require("../controllers/userController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.post("/user/register", cors(), userController.userRegister);
server.post("/user/login", cors(), userController.userLogin);
server.post("/user/logout/:userId", cors(), userController.userLogout);

server.route("/users")
.get(jwtMiddleware.authenticateUser, cors(), userController.listAllUsers);

server.route("/users/:userId")
.get(jwtMiddleware.authenticateUser, cors(), userController.getUserById)
.patch(jwtMiddleware.authenticateUser, cors(), userController.updateUserPasswordById)
.delete(jwtMiddleware.authenticateUser, cors(), userController.deleteUserById);

}