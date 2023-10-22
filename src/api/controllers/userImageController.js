const db = require("../knex");

// Get all images with their users
exports.getAllUsersImages = (req, res) => {
    db("user_image")
        .select("*")
        .join("user", "user.id", "=", "user_image.userId")
        .join("image", "image.id", "=", "user_image.imageId")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Get all images of a user by id
exports.getUserImagesById = (req, res) => {
    let id = req.params.userId;

    db("user_image")
        .select("*")
        .where({userId: id})
        .join("user", "user.id", "=", "user_image.userId")
        .join("image", "image.id", "=", "user_image.imageId")
        .then(data => res.status(200).json({"userImages": data}))
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Server error"});
        });
}

// Add image to user's data
exports.addUserImage = (req, res) => {
    let newImage = req.body.image;
    let userId = req.params.userId;

    db("image")
        .insert({
            image: newImage
        })
        .then(data => {
            db("user_image")
                .insert({
                    imageId: data[0],
                    userId: userId
                })
                .then(userImage => {
                    db("user")
                        .select("*")
                        .where({id: userId})
                        .then(userData => {
                            res.status(200).json({
                                message: `Image is added to user's data`,
                                user: userData,
                                image: {
                                    id: data[0],
                                    image: newImage
                                }
                            }) 
                        })
                })
                .catch(error => {
                    res.status(401);
                    console.log(error);
                    res.json({message: "Invalid request"});
                })
        })
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Invalid request"});
        });
}

// Delete an image in user's data
exports.deleteUserImage = (req, res) => {
    let image = req.body.imageId;
    let user = req.params.userId;

    db("user_image")
        .delete("*")
        .where({
            imageId: image,
            userId: user
        })
        .then(data => {
            db("image")
                .delete("*")
                .where({
                    id: image
                })
                .then(data => {
                    res.status(200).json({
                        message: `Image is deleted from user's data`,
                    });
                })
                .catch(error => {
                    res.status(401);
                    console.log(error);
                    res.json({message: "Invalid request"});
                })
        })
        .catch(error => {
            res.status(401);
            console.log(error);
            res.json({message: "Invalid request"});
        })
}