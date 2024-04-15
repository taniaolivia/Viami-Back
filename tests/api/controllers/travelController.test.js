const travelController = require('../../../src/api/controllers/travelController');
const travelService = require('../../../src/api/services/travelService');

jest.mock('../../../src/api/services/travelService');

describe('Travel Controller - getTravelById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return travel by id', async () => {
        const mockData = [{ id: 1, name: 'Travel 1' }];
        travelService.getTravelById.mockResolvedValueOnce(mockData);

        const req = { params: { travelId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelController.getTravelById(req, res);

        expect(travelService.getTravelById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Travel found', travel: mockData });
    });

    it('should return 500 if service method fails', async () => {
        travelService.getTravelById.mockRejectedValueOnce(new Error('Server error'));

        const req = { params: { travelId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelController.getTravelById(req, res);

        expect(travelService.getTravelById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});


describe('Travel Controller - searchTravels', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return travels by location', async () => {
        const mockData = [{ id: 1, name: 'Travel 1' }, { id: 2, name: 'Travel 2' }];
        travelService.searchTravels.mockResolvedValueOnce(mockData);

        const req = { query: { location: 'New York' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelController.searchTravels(req, res);

        expect(travelService.searchTravels).toHaveBeenCalledWith('New York');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'List of travels found', travels: mockData });
    });

    it('should return 500 if service method fails', async () => {
        travelService.searchTravels.mockRejectedValueOnce(new Error('Server error'));

        const req = { query: { location: 'Paris' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelController.searchTravels(req, res);

        expect(travelService.searchTravels).toHaveBeenCalledWith('Paris');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});

describe("Travel Controller - listAllTravels", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all travels from the service", async () => {
        const mockTravels = [{ id: 1, name: "Travel 1" }, { id: 2, name: "Travel 2" }];
        travelService.listAllTravels.mockResolvedValueOnce(mockTravels);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelController.listAllTravels(req, res);

        expect(travelService.listAllTravels).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ travels: mockTravels });
    });

    it("should return 500 if fetching travels fails", async () => {
        travelService.listAllTravels.mockRejectedValueOnce(new Error("Service error"));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelController.listAllTravels(req, res);

        expect(travelService.listAllTravels).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Service error" });
    });
});

describe("Travel Controller - saveTravel", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should save a new travel and return 201", async () => {
        const req = { body: { name: "Test Travel", description: "Test description", location: "Test location" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelService.saveNewTravel.mockResolvedValueOnce({ message: "New travel is successfully saved." });

        await travelController.saveTravel(req, res);

        expect(travelService.saveNewTravel).toHaveBeenCalledWith("Test Travel", "Test description", "Test location");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "New travel is successfully saved." });
    });

    it("should return 500 if saving the travel fails", async () => {
        const req = { body: { name: "Test Travel", description: "Test description", location: "Test location" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelService.saveNewTravel.mockRejectedValueOnce(new Error("Error while saving the new travel."));

        await travelController.saveTravel(req, res);

        expect(travelService.saveNewTravel).toHaveBeenCalledWith("Test Travel", "Test description", "Test location");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Error while saving the new travel." });
    });

    it("should return 400 if any required field is missing", async () => {
        const req = { body: { name: "", description: "Test description", location: "Test location" } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        await travelController.saveTravel(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Please fill all the required fields ! (name, description and location)" });
    });
});

/*describe("Travel Controller - getDateLocationUsers", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return number of participants and users for searched travel", async () => {
        const req = {
            query: { location: "Location", date: "2024-04-16" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const userData = [{ userId: 1, firstName: "John" }, { userId: 2, firstName: "Emma" }];
        const expectedResponse = { nbParticipant: userData.length, users: userData };

        travelService.getDateLocationUsers.mockResolvedValueOnce(expectedResponse);

        await travelController.getDateLocationUsers(req, res);

        expect(travelService.getDateLocationUsers).toHaveBeenCalledWith("Location", "2024-04-16");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ userDateLocation: expectedResponse });
    });

    it("should handle error if failed to get date location users", async () => {
        const req = {
            query: { location: "Location", date: "2024-04-16" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelService.getDateLocationUsers.mockRejectedValueOnce(new Error("Failed to get date location users"));

        await travelController.getDateLocationUsers(req, res);

        expect(travelService.getDateLocationUsers).toHaveBeenCalledWith("Location", "2024-04-16");
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to get date location users" });
    });
});

describe("Travel Controller - joinTravel", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should join the user to the travel if not already joined", async () => {
        const req = {
            body: { location: "Location", date: "2024-04-16", userId: 1 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelService.joinTravel.mockResolvedValueOnce("You've been added successfully to the trip!");

        await travelController.joinTravel(req, res);

        expect(travelService.joinTravel).toHaveBeenCalledWith("Location", "2024-04-16", 1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "You've been added successfully to the trip!" });
    });

    it("should handle error if failed to join the travel", async () => {
        const req = {
            body: { location: "Location", date: "2024-04-16", userId: 1 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        travelService.joinTravel.mockRejectedValueOnce(new Error("Failed to join travel"));
    
        await travelController.joinTravel(req, res);
    
        expect(travelService.joinTravel).toHaveBeenCalledWith("Location", "2024-04-16", 1);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to join travel" });
    });
    
});*/



