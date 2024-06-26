const db = require("../knex");
const { S3Client, PutObjectCommand, PutObjectAclCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require('crypto');
const imageService = require('../services/imageService');

const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
    },
});

const bucketName = process.env.BUCKET_NAME;
const directoryPath = process.env.AWS_PATH;

// Get a list of images
exports.listAllImages = async (req, res) => {
    try {
        const data = await imageService.listAllImages();
        res.status(200).json({"images": data});
    } catch (error) {
        res.status(401).json({message: "Server error"});
    }
};

// Get an image by id
exports.getImageById = async (req, res) => {
    const imageId = req.params.imageId;

    try {
        const data = await imageService.getImageById(imageId);
        if (data) {
            res.status(200).json({ data });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Add new image
exports.addImage =  (req, res) => {
    let newImage = req.file;
    
    const uploadFile = async () => {
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
        
        try {
            const command = new PutObjectCommand(params);
            const result = await s3Client.send(command);

            const aclParams = {
            Bucket: bucketName,
            Key: key,
            ACL: "public-read",
            };
        
            const aclCommand = new PutObjectAclCommand(aclParams);
            await s3Client.send(aclCommand);

            db("image")
            .insert({
                image: `${process.env.CDN_URL}/assets/${imageName}`
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
        } catch (error) {
            console.error("Error uploading file to S3:", error);
        }
        };
        
        uploadFile();
            
}

exports.deleteImage = async (req, res) => {
    let image = req.body.image;
    
    db.select("*")
        .from("image")
        .where("image", "=", image)
        .then((user) => {
                const deleteFile = async () => {                  
                    const params = {
                      Bucket: bucketName,
                      Key: `${process.env.AWS_PATH}/${image.split("/")[6]}`
                    };
                  
                    try {
                        const deleteCommand = new DeleteObjectCommand(params);
                        await s3Client.send(deleteCommand);
                    
                        db("image")
                            .delete("*")
                            .where("image", image)
                            .then(data => {
                                res.status(200).json({
                                    message: `Image deleted successfully`                   
                                })
                            })
                            .catch(error => {
                                res.status(401);
                                console.log(error);
                                res.json({message: "Invalid request"});
                            });
                    } catch (error) {
                        console.error("Error deleting image:", error);
                    }
                  };
                  
                  deleteFile();
        })
}


// Update an image by id
exports.updateImageById =  async (req, res) => {
    let id = req.params.imageId;
    const newImage = req.file;    
    const uniqueId = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    const imageName = `image_${uniqueId}_${randomString}.jpg`;
    const directoryPath = process.env.AWS_PATH_USER_IMAGES;
    const key = `${directoryPath}/image_${uniqueId}_${randomString}.jpg`;
    const fileContent = Buffer.from(newImage.buffer);

    try {
         const params = {
             Bucket: bucketName,
             Key: key,
             Body: fileContent,
             ContentType: "image/jpeg",
         };

         const command = new PutObjectCommand(params);
         await s3Client.send(command);

         const aclParams = {
             Bucket: bucketName,
             Key: key,
             ACL: "public-read",
         };
     
         const aclCommand = new PutObjectAclCommand(aclParams);
         await s3Client.send(aclCommand);

         db.select("*")
            .from("image")
            .where("id", id)
            .then((image) => {
                const deleteFile = async () => {                  
                    const paramsDelete = {
                        Bucket: bucketName,
                        Key: `${process.env.AWS_PATH_USER_IMAGES}/${image[0].image.split("/")[7]}`
                    };

                    try {
                        const deleteCommand = new DeleteObjectCommand(paramsDelete);
                        await s3Client.send(deleteCommand);
                        
                        db("image")
                            .update({"image":`${process.env.CDN_URL}/assets/usersImages/${imageName}`})
                            .where({id: id})
                            .then(data => res.status(200).json({"message": "Image has been updated successfully"}))
                            .catch(error => {
                                res.status(401);
                                console.log(error);
                                res.json({message: "Server error"});
                            });
                            
                    } catch (error) {
                        console.error("Error deleting image:", error);
                    }
                };
                    
                deleteFile();
             })
             .catch(error => {
                 res.status(401);
                 console.log(error);
                 res.json({message: "Invalid request"});
             });
     } catch (error) {
         console.error("Error deleting image:", error);
     }
}

