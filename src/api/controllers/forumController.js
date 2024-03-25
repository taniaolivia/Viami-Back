const db = require("../knex");

exports.getListCitiesForum = (req, res) => {
    db("forum_cities")
      .select("*")
      .orderBy("city", "asc")
      .then(data => res.status(200).json({"forum_cities": data}))
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}

exports.getAllPostsByCity = (req, res) => {
    let cityId = req.params.cityId;

    db("forum_posts_city")
      .select("*")
      .where({"cityId": cityId})
      .then(data => {
        const postsCitiesPromises = data.map((post) => {
            return db("forum_cities")
                .select("*")
                .where({"id": cityId})
                .then(cities => {
                    return db("user")
                        .select("*")
                        .where({"id": post.userId})
                        .then(user => ({
                            id: post.id,
                            post: post.post,
                            user: {
                                id: user[0].id,
                                firstName: user[0].firstName,
                                lastName: user[0].lastName,
                                email: user[0].email
                            },
                            city: cities,
                            postedOn: post.postedOn
                        }))
                    .catch(error => {
                        res.status(401);
                        console.log(error);
                        res.json({message: "Server error"});
                    });
                })
                .catch(error => {
                    res.status(401);
                    console.log(error);
                    res.json({message: "Server error"});
                });
         })

         Promise.all(postsCitiesPromises)
         .then(postsCities => {
            return res.status(200).json({"forum_posts_cities": postsCities});
         })
      })
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}

exports.addPostByCity = (req, res) => {
    let post = req.body.post;
    let cityId = req.params.cityId;
    let userId = req.body.userId;

    db("forum_posts_city")
      .insert({
        "cityId": cityId,
        "post": post,
        "userId": userId,
        "postedOn": new Date()
      })
      .then(data => res.status(200).json({ message: 'Post added successfully' }))
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}

exports.getAllPosts = (req, res) => {
    db("forum")
      .select("*")
      .then(data => {
         const postsPromises = data.map((post) => {
            return db("user")
                .select("*")
                .where({"id": post.userId})
                .then(user => ({
                    id: post.id,
                    post: post.post,
                    user: {
                        id: user[0].id,
                        firstName: user[0].firstName,
                        lastName: user[0].lastName,
                        email: user[0].email
                    },
                    postedOn: post.postedOn
                }))
                .catch(error => {
                    res.status(401);
                    console.log(error);
                    res.json({message: "Server error"});
                });
         })

         Promise.all(postsPromises)
         .then(posts => {
            return res.status(200).json({"forum": posts});
         })

      })
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}

exports.getCommentsPostById = (req, res) => {
    let postId = req.params.postId;

    db("forum_comment")
      .select("*")
      .where({"forumId": postId})
      .then(data => {
        const postCommentsPromises = data.map((post) => {
            return db("user")
                .select("*")
                .where({"id": post.userId})
                .then(user => ({
                    id: post.id,
                    forumId: post.forumId,
                    comment: post.comment,
                    user: {
                        id: user[0].id,
                        firstName: user[0].firstName,
                        lastName: user[0].lastName,
                        email: user[0].email
                    },
                    commentedOn: post.commentedOn
                }))
                .catch(error => {
                    res.status(401);
                    console.log(error);
                    res.json({message: "Server error"});
                });
         })

         Promise.all(postCommentsPromises)
         .then(postComments => {
            return res.status(200).json({"forum_comment": postComments});
         })
      })
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}

exports.addPost = (req, res) => {
    let post = req.body.post;
    let userId = req.body.userId;

    db("forum")
      .insert({
        "post": post,
        "userId": userId,
        "postedOn": new Date()
      })
      .then(data => res.status(200).json({ message: 'Post added successfully' }))
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}

exports.addCommentToPostById = (req, res) => {
    let postId = req.params.postId;
    let comment = req.body.comment;
    let userId = req.body.userId;

    db("forum_comment")
      .insert({
        "forumId": postId,
        "comment": comment,
        "userId": userId,
        "commentedOn": new Date()
      })
      .then(data => res.status(200).json({ message: 'Comment added successfully' }))
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}

exports.getAllNewestPosts = (req, res) => {
    db("forum")
      .select("*")
      .orderBy("postedOn", "desc")
      .then(data => {
        const postsPromises = data.map((post) => {
            return db("user")
                .select("*")
                .where({"id": post.userId})
                .then(user => ({
                    id: post.id,
                    post: post.post,
                    user: {
                        id: user[0].id,
                        firstName: user[0].firstName,
                        lastName: user[0].lastName,
                        email: user[0].email
                    },
                    postedOn: post.postedOn
                }))
                .catch(error => {
                    res.status(401);
                    console.log(error);
                    res.json({message: "Server error"});
                });
         })

         Promise.all(postsPromises)
         .then(posts => {
            return res.status(200).json({"forum": posts});
         })
      })
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}

exports.getAllOldestPosts = (req, res) => {
    db("forum")
      .select("*")
      .orderBy("postedOn", "asc")
      .then(data => {
        const postsPromises = data.map((post) => {
            return db("user")
                .select("*")
                .where({"id": post.userId})
                .then(user => ({
                    id: post.id,
                    post: post.post,
                    user: {
                        id: user[0].id,
                        firstName: user[0].firstName,
                        lastName: user[0].lastName,
                        email: user[0].email
                    },
                    postedOn: post.postedOn
                }))
                .catch(error => {
                    res.status(401);
                    console.log(error);
                    res.json({message: "Server error"});
                });
         })

         Promise.all(postsPromises)
         .then(posts => {
            return res.status(200).json({"forum": posts});
         })
      })
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}