module.exports = (server) => {
    const userPremiumPlanController = require("../controllers/userPremiumPlanController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

server.route("/api/users/:userId/premiumPlan")
.get(jwtMiddleware.authenticateUser, cors(), userPremiumPlanController.getUserLastPremiumPlan)
.post(jwtMiddleware.authenticateUser, cors(), userPremiumPlanController.addUserPremiumPlan);

}