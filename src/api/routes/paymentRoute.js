module.exports = (server) => {
    const paymentController = require("../controllers/paymentController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/payment")
.post( cors(), paymentController.payPremium);

server.route("/api/confirm/payment")
.post( cors(), paymentController.confirmPayment);

}