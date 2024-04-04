const db = require("../knex");
const interestService = require('../services/interestService');

// Get a list of interests
exports.listAllInterests = async (req, res) => {
    try {
        const data = await interestService.getAllInterests();
        res.status(200).json({"interests": data});
    } catch (error) {
        res.status(401).json({ message: "Server error" });
    }
}


// Get an interest by id
exports.getInterestById = async (req, res) => {
    try {
        const interestId = req.params.interestId;
        const data = await interestService.getInterestById(interestId);
        
        if (!data) {
            return res.status(404).json({ message: "Interest not found" });
        }
        
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};