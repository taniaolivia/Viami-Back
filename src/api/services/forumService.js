const db = require('../knex');

exports.getListCitiesForum = async () => {
    try {
        const cities = await db("forum_cities").select("*").orderBy("city", "asc");
        const citiesWithImages = await Promise.all(cities.map(async (city) => {
            const image = await db("image").select("*").where({ "id": city.image }).first();
            return {
                id: city.id,
                city: city.city,
                image: {
                    id: image.id,
                    image: image.image
                }
            };
        }));
        return citiesWithImages;
    } catch (error) {
        throw new Error("Failed to get list of cities for forum");
    }
};

exports.getAllPostsByCity = async (cityId) => {
    try {
        const posts = await db("forum_posts_city").select("*").where({ "cityId": cityId });
        const postsWithDetails = await Promise.all(posts.map(async (post) => {
            const city = await db("forum_cities").select("*").where({ "id": cityId }).first();
            const user = await db("user").select("*").where({ "id": post.userId }).first();
            const userImage = await db("user_image").select("*").where({ "userId": post.userId }).first();
            const userImageUrl = await db("image").select("*").where({ "id": userImage.imageId }).first();
            const cityImage = await db("image").select("*").where({ "id": city.image }).first();
            return {
                id: post.id,
                post: post.post,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profileImage: userImageUrl.image
                },
                city: {
                    id: city.id,
                    city: city.city,
                    image: cityImage.image
                },
                postedOn: post.postedOn
            };
        }));
        return postsWithDetails;
    } catch (error) {
        throw new Error("Failed to get posts by city");
    }
};

exports.addPostByCity = async (cityId, userId, post) => {
    try {
        await db("forum_posts_city").insert({
            cityId: cityId,
            post: post,
            userId: userId,
            postedOn: new Date()
        });
    } catch (error) {
        throw new Error("Failed to add post to city");
    }
};

exports.getAllPosts = async () => {
    try {
        const posts = await db("forum").select("*");
        const postsWithDetails = await Promise.all(posts.map(async (post) => {
            const user = await db("user").select("*").where({ "id": post.userId }).first();
            const userImage = await db("user_image").select("*").where({ "userId": post.userId }).first();
            const userImageUrl = await db("image").select("*").where({ "id": userImage.imageId }).first();
            return {
                id: post.id,
                post: post.post,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profileImage: userImageUrl.image
                },
                postedOn: post.postedOn
            };
        }));
        return postsWithDetails;
    } catch (error) {
        throw new Error("Failed to get all posts");
    }
};

exports.addPost = async (userId, post) => {
    try {
        const options = {
            timeZone: 'Europe/Paris',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            fractionalSecondDigits: 3,
            hour12: false
        };
        const now = new Date().toLocaleString('fr-FR', options);
        const formattedDateTime = `${now.substring(6, 10)}-${now.substring(3, 5)}-${now.substring(0, 2)} ${now.substring(11)}`;
        await db("forum").insert({
            post: post,
            userId: userId,
            postedOn: formattedDateTime
        });
    } catch (error) {
        throw new Error("Failed to add post");
    }
};

exports.getCommentsPostById = async (postId) => {
    try {
        const comments = await db("forum_comment").select("*").where({ "forumId": postId });
        const commentsWithDetails = await Promise.all(comments.map(async (comment) => {
            const user = await db("user").select("*").where({ "id": comment.userId }).first();
            const userImage = await db("user_image").select("*").where({ "userId": comment.userId }).first();
            const userImageUrl = await db("image").select("*").where({ "id": userImage.imageId }).first();
            return {
                id: comment.id,
                forumId: comment.forumId,
                comment: comment.comment,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profileImage: userImageUrl.image
                },
                commentedOn: comment.commentedOn
            };
        }));
        return commentsWithDetails;
    } catch (error) {
        throw new Error("Failed to get comments for post");
    }
};

exports.addCommentToPostById = async (postId, userId, comment) => {
    try {
        await db("forum_comment").insert({
            forumId: postId,
            comment: comment,
            userId: userId,
            commentedOn: new Date()
        });
    } catch (error) {
        throw new Error("Failed to add comment to post");
    }
};

exports.getAllNewestPosts = async () => {
    try {
        const posts = await db("forum").select("*").orderBy("postedOn", "desc");
        const postsWithDetails = await Promise.all(posts.map(async (post) => {
            const user = await db("user").select("*").where({ "id": post.userId }).first();
            const userImage = await db("user_image").select("*").where({ "userId": post.userId }).first();
            const userImageUrl = await db("image").select("*").where({ "id": userImage.imageId }).first();
            return {
                id: post.id,
                post: post.post,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profileImage: userImageUrl.image
                },
                postedOn: post.postedOn
            };
        }));
        return postsWithDetails;
    } catch (error) {
        throw new Error("Failed to get newest posts");
    }
};

exports.getAllOldestPosts = async () => {
    try {
        const posts = await db("forum").select("*").orderBy("postedOn", "asc");
        const postsWithDetails = await Promise.all(posts.map(async (post) => {
            const user = await db("user").select("*").where({ "id": post.userId }).first();
            const userImage = await db("user_image").select("*").where({ "userId": post.userId }).first();
            const userImageUrl = await db("image").select("*").where({ "id": userImage.imageId }).first();
            return {
                id: post.id,
                post: post.post,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profileImage: userImageUrl.image
                },
                postedOn: post.postedOn
            };
        }));
        return postsWithDetails;
    } catch (error) {
        throw new Error("Failed to get oldest posts");
    }
};
