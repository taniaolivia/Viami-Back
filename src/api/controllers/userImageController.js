const db = require("../knex");
const { S3Client, PutObjectCommand, PutObjectAclCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require('crypto');

const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
});

const bucketName = process.env.BUCKET_NAME;
const directoryPath = process.env.AWS_PATH_USER_IMAGES;

// Get all images with their users
exports.getAllUsersImages = (req, res) => {
    db("user_image")
        .select("*")
        .join("user", "user.id", "=", "user_image.userId")
        .join("image", "image.id", "=", "user_image.imageId")
        .then(data => res.status(200).json({data}))
        .catch(error => {
            res.status(401);
            
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
            
            res.json({message: "Server error"});
        });
}

// Add image to user's data
exports.addUserImage = async (req, res) => {
    let userId = req.params.userId;
    const newImage = req.file;
    const uniqueId = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    const imageName = `image_${uniqueId}_${randomString}.jpg`;
    const key = `${directoryPath}/image_${uniqueId}_${randomString}.jpg`;
    const fileContent = Buffer.from(newImage.buffer);

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        ContentType: "image/jpeg",
    };

    const aclParams = {
        Bucket: bucketName,
        Key: key,
        ACL: "public-read",
    };
    
    try {
        const command = new PutObjectCommand(params);
        const result = await s3Client.send(command);
    
        const aclCommand = new PutObjectAclCommand(aclParams);
        await s3Client.send(aclCommand);

       db("image")
            .insert({
                image: `${process.env.CDN_URL}/assets/usersImages/${imageName}`
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
                                        image: `${process.env.CDN_URL}/assets/usersImages/${imageName}`
                                    }
                                }) 
                            })
                    })
                    .catch(error => {
                        res.status(401);
                        
                        res.json({message: "Invalid request"});
                    })
            })
            .catch(error => {
                res.status(401);
               
                res.json({message: "Invalid request"});
            });
    } catch (error) {
        
    }
}

// Delete an image in user's data
exports.deleteUserImage = async (req, res) => {
    let imageId = req.body.imageId;
    let image = req.body.image;
    let user = req.params.userId;

    const params = {
        Bucket: bucketName,
        Key: `${process.env.AWS_PATH_USER_IMAGES}/${image.split("/")[7]}`
    };

    try {
        const deleteCommand = new DeleteObjectCommand(params);
        await s3Client.send(deleteCommand);
    
        db("user_image")
            .delete("*")
            .where({
                imageId: imageId,
                userId: user
            })
            .then(data => {
                db("image")
                    .delete("*")
                    .where({
                        id: imageId
                    })
                    .then(data => {
                        res.status(200).json({
                            message: `Image is deleted from user's data`,
                        });
                    })
                    .catch(error => {
                        res.status(401);
                      
                        res.json({message: "Invalid request"});
                    })
            })
            .catch(error => {
                res.status(401);
               
                res.json({message: "Invalid request"});
            })
    } catch (error) {
        
    }
}