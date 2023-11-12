const db = require("../knex");
const AWS = require('aws-sdk');
const crypto = require('crypto');

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

// Add new image
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
                AWS.config.update({
                    accessKeyId: PROCESS_ENV_ACCESS_KEY,
                    secretAccessKey: PROCESS_ENV_SECRET_KEY,
                    region: PROCESS_ENV_REGION
                });

                const s3 = new AWS.S3();
                const bucketName = PROCESS_ENV_BUCKET_NAME;
                const uniqueId = Date.now();
                const randomString = crypto.randomBytes(4).toString('hex');
                
                const key = `image_${uniqueId}_${randomString}.jpg`;
            
                const params = {
                    Bucket: bucketName,
                    Key: key,
                    Body: fileContent,
                    ContentType: 'image/jpeg' 
                };

                s3.upload(params, (err, data) => {
                    if (err) {
                        console.error("Error uploading image to S3:", err);
                    } else {
                        db("image")
                            .insert({
                                image: data.location
                            })
                            .then(data => {
                                res.status(200).json({
                                    message: `Image added successfully`,
                                    data: {
                                        id: data[0],
                                        image: data.location
                                    }                    
                                })
                            })
                            .catch(error => {
                                res.status(401);
                                console.log(error);
                                res.json({message: "Invalid request"});
                            });
                    }
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