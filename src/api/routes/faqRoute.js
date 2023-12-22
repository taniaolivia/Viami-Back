module.exports = (server) => {
    const faqController = require("../controllers/faqController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');


server.route("/api/faq")
.get(jwtMiddleware.authenticateUser, cors(), faqController.listAllFaq);

server.route("/api/faq/:faqId")
.get(jwtMiddleware.authenticateUser, cors(),faqController.getFaqById)

server.route("/api/frequentedFive/faq")
.get(jwtMiddleware.authenticateUser, cors(),faqController.getTopFiveFrequentedFaq)



}