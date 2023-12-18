const db = require("../knex");


//list all faq 
exports.listAllFaq = (req, res) => {
    db("faq")
    .select("*")
    .orderBy("question", "asc")
    .then(data => res.status(200).json({"faq": data}))
    .catch(error => {
        res.status(401);
        res.json({message: "Server error"});
    });   
}
// Get the top five frequented faq
exports.getTopFiveFrequentedFaq = (req, res) => {
    db("faq")
        .select("*")
        .where("isFrequented", 1)
        .orderBy("question", "asc")
        .limit(5)
        .offset(0)
        .then(data => res.status(200).json({"faq": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });   
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