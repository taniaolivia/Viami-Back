module.exports = (server) => {
    const premiumPlanController = require("../controllers/premiumPlanController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/premiumPlans")
.get(jwtMiddleware.authenticateUser, cors(), premiumPlanController.getAllPremiumPlans);

server.route("/api/premiumPlans/:planId")
.get(jwtMiddleware.authenticateUser, cors(), premiumPlanController.getPremiumPlanById);

}