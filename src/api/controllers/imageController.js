const db = require("../knex");

// Get a list of images
exports.listAllImages = (req, res) => {
    db("image")
        .select("*")
        .then(data => res.status(200).json({"images": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get an image by id
exports.getImageById = (req, res) => {
    let id = req.params.imageId;

    db("image")
        .select("*")
        .where({id: id})
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}
