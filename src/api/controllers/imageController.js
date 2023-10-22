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

// Register new user
exports.addImage = (req, res) => {
    let newImage = req.body;
    
    db.select("*")
        .from("image")
        .where("image", "=", newImage.image)
        .then((user) => {
            if(user.length > 0) {
                res.status(401);
                res.json({message: "Image already exists"});
            }
            else {
                    db("image")
                    .insert({
                        image: newImage.image
                    })
                    .then(data => {
                        res.status(200).json({
                            message: `Image added successfully`,
                            data: {
                                id: data[0],
                                image: newImage.image
                            }                    
                        })
                    })
                    .catch(error => {
                        res.status(401);
                        console.log(error);
                        res.json({message: "Invalid request"});
                    });
            }
        })
}

// Update an image by id
exports.updateImageById = (req, res) => {
    let id = req.params.imageId;
    let newImage = req.body.image;

    db("image")
        .update({"image": newImage})
        .where({id: id})
        .then(data => res.status(200).json({"message": "Image has been updated successfully"}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}