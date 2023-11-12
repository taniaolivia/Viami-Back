const db = require("../knex");
const { S3Client, PutObjectCommand, PutObjectAclCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require('crypto');
const fs = require('fs');
const path = require("path");

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
    let newImage = req.body.image;
    
    db.select("*")
        .from("image")
        .where("image", "=", newImage)
        .then((user) => {
            if(user.length > 0) {
                res.status(401);
                res.json({message: "Image already exists"});
            }
            else {
                const uploadFile = async () => {
                    const uniqueId = Date.now();
                    const randomString = crypto.randomBytes(4).toString('hex');
                    const imageName = `image_${uniqueId}_${randomString}.jpg`;
                    const key = `${directoryPath}/image_${uniqueId}_${randomString}.jpg`;

                    const fileContent = newImage;

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
        })
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
exports.updateImageById = async (req, res) => {
    let id = req.params.imageId;
    let newImage = req.body.image;
    
    const uniqueId = Date.now();
    const randomString = crypto.randomBytes(4).toString('hex');
    const imageName = `image_${uniqueId}_${randomString}.jpg`;
    const directoryPath = process.env.AWS_PATH_USER_IMAGES;
    const key = `${directoryPath}/image_${uniqueId}_${randomString}.jpg`;
    const fileContent = newImage;

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

   /* db.select("*")
        .from("image")
        .where("id", id)
        .then((image) => {
            const deleteFile = async () => {                  
                /*const paramsDelete = {
                    Bucket: bucketName,
                    Key: `${process.env.AWS_PATH}/${image[0].image.split("/")[7]}`
                };*/
                
            
                /*try {
                   /* const deleteCommand = new DeleteObjectCommand(paramsDelete);
                    await s3Client.send(deleteCommand);
                
                    console.log("Image deleted successfully.");*/

                    /*const params = {
                        Bucket: bucketName,
                        Key: key,
                        Body: fileContent,
                        ContentType: "image/jpeg",
                    };

                    const command = new PutObjectCommand(params);
                    const result = await s3Client.send(command);

                    const aclParams = {
                        Bucket: bucketName,
                        Key: key,
                        ACL: "public-read",
                    };
                
                    const aclCommand = new PutObjectAclCommand(aclParams);
                    await s3Client.send(aclCommand);
                    console.log("File uploaded successfully", result);

                    db("image")
                        .delete("*")
                        .where("image", image)
                        .then(data => {
                            
                            db("image")
                                .update({"image":`${process.env.CDN_URL}/assets/usersImages/${imageName}`})
                                .where({id: id})
                                .then(data => res.status(200).json({"message": "Image has been updated successfully"}))
                                .catch(error => {
                                    res.status(401);
                                    console.log(error);
                                    res.json({message: "Server error"});
                                });
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
        })*/
}