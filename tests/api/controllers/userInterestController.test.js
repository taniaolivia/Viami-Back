const userInterestController = require("../../../src/api/controllers/userInterestController");
const userInterestService = require("../../../src/api/services/userInterestService");

jest.mock("../../../src/api/services/userInterestService");

describe("User Interest Controller - getAllUsersInterests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all user interests", async () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockInterests = [{ id: 1, name: "Interest 1" }, { id: 2, name: "Interest 2" }];

        userInterestService.getAllUsersInterests.mockResolvedValueOnce(mockInterests);

        await userInterestController.getAllUsersInterests({}, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: mockInterests });
    });

    it("should return 500 if failed to get user interests", async () => {
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const errorMessage = "Server error";

        userInterestService.getAllUsersInterests.mockRejectedValueOnce(new Error(errorMessage));

        await userInterestController.getAllUsersInterests({}, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});


describe("Interest's users Controller - getInterestUsersById", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return interest users by interest ID", async () => {
        const req = { params: { interestId: "1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockInterestUsers = [{ id: 1, userId: "1", interestId: "1", interest: "Interest 1" }, { id: 2, userId: "2", interestId: "1", interest: "Interest 1" }];

        userInterestService.getInterestUsersById.mockResolvedValueOnce(mockInterestUsers);

        await userInterestController.getInterestUsersById(req, res);

        expect(userInterestService.getInterestUsersById).toHaveBeenCalledWith(req.params.interestId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ userInterests: mockInterestUsers });
    });

    it("should return 500 if failed to get user interests by interest ID", async () => {
        const req = { params: { interestId: "1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const errorMessage = "Failed to get interest's users by interest ID";

        userInterestService.getInterestUsersById.mockRejectedValueOnce(new Error(errorMessage));

        await userInterestController.getInterestUsersById(req, res);

        expect(userInterestService.getInterestUsersById).toHaveBeenCalledWith(req.params.interestId);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});

describe("User's interests Controller - getUserInterestsById", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return user's interests by user ID", async () => {
        const req = { params: { userId: "1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockUserInterests = [{ id: 1, userId: "1", interestId: "1", interest: "Interest 1" }, { id: 2, userId: "1", interestId: "2", interest: "Interest 2" }];

        userInterestService.getUserInterestsById.mockResolvedValueOnce(mockUserInterests);

        await userInterestController.getUserInterestsById(req, res);

        expect(userInterestService.getUserInterestsById).toHaveBeenCalledWith(req.params.userId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ userInterests: mockUserInterests });
    });

    it("should return 500 if failed to get user's interests by user ID", async () => {
        const req = { params: { userId: "1" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const errorMessage = "Failed to get user's interests by user ID";

        userInterestService.getUserInterestsById.mockRejectedValueOnce(new Error(errorMessage));

        await userInterestController.getUserInterestsById(req, res);

        expect(userInterestService.getUserInterestsById).toHaveBeenCalledWith(req.params.userId);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});


describe("User Interest Controller - addUserInterest", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should add user interest and return success response", async () => {
        const req = { 
            body: { interestId: 1 }, 
            params: { userId: 1 }    
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        userInterestService.addUserInterest.mockResolvedValueOnce({ message: "Interest is added to user's data" });

        await userInterestController.addUserInterest(req, res);

        expect(userInterestService.addUserInterest).toHaveBeenCalledWith(req.params.userId, req.body.interestId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Interest is added to user's data" });
    });

    it("should return 401 if user interest addition fails", async () => {
        const req = { 
            body: { interestId: 1 }, 
            params: { userId: 1 }    
        };
        const res = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn() 
        };

        userInterestService.addUserInterest.mockRejectedValueOnce(new Error("Invalid request"));

        await userInterestController.addUserInterest(req, res);

         
        expect(userInterestService.addUserInterest).toHaveBeenCalledWith(req.params.userId, req.body.interestId);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid request" });
    });
});


describe("User Interest Controller - deleteUserInterest", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete user interest successfully", async () => {
        const req = {
            params: { userId: 1 },
            body: { interestId: 1 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userInterestService.deleteUserInterest.mockResolvedValueOnce({ message: "Interest is deleted from user's data" });

        await userInterestController.deleteUserInterest(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Interest is deleted from user's data" });
    });

    it("should handle error if failed to delete user interest", async () => {
        const req = {
            params: { userId: 1 },
            body: { interestId: 1 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userInterestService.deleteUserInterest.mockRejectedValueOnce(new Error("Failed to delete user interest"));

        await userInterestController.deleteUserInterest(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid request" });
    });
});
