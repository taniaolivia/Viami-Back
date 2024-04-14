module.exports = (server) => {
    const documentController = require("../controllers/documentController");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /politique-de-confidentialite:
 *      get:
 *       tags:
 *         - Politique de confidentalité
 *       summary: "Documentation sur la politique de confidentialité"
 *       description: "Les informations sur la politique de confidentialité de Viami"
 */
server.route("/politique-de-confidentialite")
.get(cors(), documentController.getPrivacyPolicy);

/**
 * @openapi
 * paths:
 *   /supprimer-compte:
 *      get:
 *       tags:
 *         - Suppression du compte
 *       summary: "Suppression du compte d'utilisateur"
 *       description: "Les informations sur les étapes pour supprimer un compte"
 */
server.route("/supprimer-compte")
.get(cors(), documentController.getInformationDeleteAccount);

}