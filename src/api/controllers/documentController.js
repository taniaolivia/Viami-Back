const currentModuleDir = __dirname;
const fs = require('fs');
const path = require('path');

// Get the privacy policy document of Viami
exports.getPrivacyPolicy = async (req, res) => {
    const documentTemplatePath = path.join(currentModuleDir, '../document/privacyPolicy.html');
    const html = fs.readFileSync(documentTemplatePath, 'utf-8');

    res.send(html);
};

// Get the informations on how to delete an account
exports.getInformationDeleteAccount = async (req, res) => {
    const documentTemplatePath = path.join(currentModuleDir, '../document/deleteAccount.html');
    const html = fs.readFileSync(documentTemplatePath, 'utf-8');

    res.send(html);
};