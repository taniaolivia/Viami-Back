const db = require("../knex");
const faqService = require('../services/faqService');

// List all faq 
exports.listAllFaq = async (req, res) => {
    try {
        const data = await faqService.getAllFaq();
        res.status(200).json({ "faq": data });
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
};

// Get the top five frequented faq
exports.getTopFiveFrequentedFaq = async (req, res) => {
    try {
        const faq = await faqService.getTopFiveFrequentedFaq();
        res.status(200).json({ faq });
    } catch (error) {
        
        res.status(401).json({message: "Server error"});
    }
}

// Get faq by id
exports.getFaqById = async (req, res) => {
    const faqId = req.params.faqId;

    try {
        const faq = await faqService.getFaqById(faqId);
        if (faq) {
            res.status(200).json({ message: "FAQ found", data: faq });
        } else {
            res.status(404).json({ message: "FAQ not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};