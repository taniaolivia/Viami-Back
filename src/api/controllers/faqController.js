const db = require("../knex");
const faqService = require('../services/faqService');


//list all faq 
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




// get faq by id
exports.getFaqById = (req, res) => {
    const id = req.params.faqId;

    db("faq")
        .select("*")
        .where("id", id)
        .then(data => {
            res.status(200);
            res.json({message: `faq found`, data});
        })
        .catch(error => {
            res.status(401);
            res.json({message: "faq not found"});
        });   
}