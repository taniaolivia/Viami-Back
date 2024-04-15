const db = require("../knex");
const travelService = require('../services/travelService');

// Get the travel information
exports.getTravelById = async (req, res) => {
    try {
        const id = req.params.travelId;
        const data = await travelService.getTravelById(id);
        if (!data) {
            return res.status(404).json({ message: 'Travel not found' });
        }
        return res.status(200).json({ message: 'Travel found', travel: data });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get a travel compatible with user's search
exports.searchTravels = async (req, res) => {
    try {
        let location = req.query.location;
        const data = await travelService.searchTravels(location);
        return res.status(200).json({ message: 'List of travels found', travels: data });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get the number of participants of searched travel
exports.getDateLocationUsers = async (req, res) => {
    try {
        const location = req.query.location;
        const date = req.query.date;

        const data = await dateLocationService.getDateLocationUsers(location, date);

        res.status(200).json({ userDateLocation: data });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// Add user to a trip that user has searched
exports.joinTravel = async (req, res) => {
    try {
        const { location, date, userId } = req.body;

        const message = await dateLocationService.joinTravel(location, date, userId);

        res.status(200).json({ message });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// Get all travels
exports.listAllTravels = async (req, res) => {
    try {
        const data = await travelService.listAllTravels();
        res.status(200).json({ "travels": data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new travel
exports.saveTravel = async (req, res) => {
    try {
        const { name, description, location } = req.body;
        
        if (!name || !description || !location) {
            return res.status(400).json({ message: "Please fill all the required fields ! (name, description and location)" });
        }

        const response = await travelService.saveNewTravel(name, description, location);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


