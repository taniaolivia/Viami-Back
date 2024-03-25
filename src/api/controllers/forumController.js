const db = require("../knex");

exports.getListCitiesForum = (req, res) => {
    db("forum_cities")
      .select("*")
      .orderBy("name", "asc")
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
        db("forum_cities")
        .select("*")
        .where({"cityId": cityId})
        .then(cities => {
            db("user")
            .select("*")
            .where({"id": data[0].userId})
            .then(user => res.status(200).json({"forum_posts_city": {
                id: data[0].id,
                post: data[0].post,
                user: {
                    id: user[0].id,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    email: user[0].email
                },
                city: cities,
                postedOn: data[0].postedOn
            }}))
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
      .catch(error => {
          res.status(401);
          console.log(error);
          res.json({message: "Server error"});
      });
}

exports.addPostByCity = (req, res) => {
    let post = req.boy.post;
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
        db("user")
            .select("*")
            .where({"id": data[0].userId})
            .then(user => res.status(200).json({"forum": {
                id: data[0].id,
                post: data[0].post,
                user: {
                    id: user[0].id,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    email: user[0].email
                },
                postedOn: data[0].postedOn
            }}))
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
}

exports.getCommentsPostById = (req, res) => {
    let postId = req.params.postId;

    db("forum_comment")
      .select("*")
      .where({"postId": postId})
      .then(data => {
        db("user")
            .select("*")
            .where({"id": data[0].userId})
            .then(user => res.status(200).json({"forum": {
                id: data[0].id,
                forumId: data[0].forumId,
                comment: data[0].comment,
                user: {
                    id: user[0].id,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    email: user[0].email
                },
                commentedOn: data[0].commentedOn
            }}))
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

    db("forum")
      .insert({
        "postId": postId,
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
        db("user")
            .select("*")
            .where({"id": data[0].userId})
            .then(user => res.status(200).json({"forum": {
                id: data[0].id,
                post: data[0].post,
                user: {
                    id: user[0].id,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    email: user[0].email
                },
                postedOn: data[0].postedOn
            }}))
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
}

exports.getAllOldestPosts = (req, res) => {
    db("forum")
      .select("*")
      .orderBy("postedOn", "asc")
      .then(data => {
        db("user")
            .select("*")
            .where({"id": data[0].userId})
            .then(user => res.status(200).json({"forum": {
                id: data[0].id,
                post: data[0].post,
                user: {
                    id: user[0].id,
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    email: user[0].email
                },
                postedOn: data[0].postedOn
            }}))
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
}