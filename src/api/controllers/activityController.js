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

exports.saveActivity = (req,res) => {
    const {name, imageName,  location,  } = req.body;

    
    if (!name || !imageName || !location ) {
        return res.status(400).json({ message: "All fields are required." });
    }

    db("activity")
        .insert({
            name:name,
            imageName:imageName,
            location:location
            
        })
        .then(() => res.status(201).json({ message: "Activity record successfully saved." }))
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: "Error while saving the Activity record." });
        });


}





