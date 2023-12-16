module.exports = (server) => {
    const paymentController = require("../controllers/paymentController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/payment")
.post(jwtMiddleware.authenticateUser, cors(), paymentController.payPremium);

}