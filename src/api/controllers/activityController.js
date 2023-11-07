const db = require("../knex");

exports.listAllActivities = (req, res) => {
    db(" activity")
    .select("*")
    .orderBy("name", "asc")
    .then(data => res.status(200).json({data}))
    .catch(error => {
        res.status(401);
        console.log(error);
        res.json({message: "Server error"});
    });   
}

exports.getActivityById = (req, res) => {
    const id = req.params.activityId;

    db("activity")
        .select("*")
        .then(datas => {
            datas.map((data) => {
                 if(id === data.id) {
                    res.status(200);
                    res.json({message: `Activity found`, activity: data});
                }
            })
        })
        .catch(error => {
            res.status(500);
            res.json({message: "Server error"});
        });   
}

