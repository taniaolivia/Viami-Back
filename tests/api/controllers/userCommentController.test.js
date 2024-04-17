const userCommentController = require("../../../src/api/controllers/userCommentController");
const userCommentService = require("../../../src/api/services/userCommentService");

jest.mock("../../../src/api/services/userCommentService");


describe("Comment Controller - getAllUsersComments", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all comments with their users", async () => {
        const mockComments = [{ id: 1, text: "Comment 1", user: { id: 1, username: "user1" } }, { id: 2, text: "Comment 2", user: { id: 2, username: "user2" } }];
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userCommentService.getAllUsersComments.mockResolvedValueOnce(mockComments);

        await userCommentController.getAllUsersComments({}, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: mockComments });
    });

    it("should return 401 if failed to get all users comments", async () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userCommentService.getAllUsersComments.mockRejectedValueOnce(new Error("Failed to get all users comments"));

        await userCommentController.getAllUsersComments({}, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});


describe("Comment Controller - getUserCommentsById", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all comments of a user by id", async () => {
        const userId = 1;
        const mockUserComments = [{ id: 1, text: "Comment 1", user: { id: 1, username: "user1" } }, { id: 2, text: "Comment 2", user: { id: 1, username: "user1" } }];
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userCommentService.getUserCommentsById.mockResolvedValueOnce(mockUserComments);

        await userCommentController.getUserCommentsById({ params: { userId } }, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ userComments: mockUserComments });
    });

    it("should return 401 if failed to get user comments by id", async () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userCommentService.getUserCommentsById.mockRejectedValueOnce(new Error("Failed to get user comments by id"));

        await userCommentController.getUserCommentsById({}, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});


describe("Comment Controller - addCommentToUserProfile", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should add comment to user profile successfully", async () => {
        const req = { body: { commenterId: 2, commentText: "Test comment" }, params: { userId: 1} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockResponse = { message: 'Comment added successfully' };

        userCommentService.addCommentToUserProfile.mockResolvedValueOnce(mockResponse);

        await userCommentController.addCommentToUserProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it("should return 500 if failed to add comment to user profile", async () => {
        const req = { body: { commenterId: 2, commentText: "Test comment" }, params: { userId: 1} };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const errorMessage = 'Internal server error';

        userCommentService.addCommentToUserProfile.mockRejectedValueOnce(new Error(errorMessage));

        await userCommentController.addCommentToUserProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});


describe("Comment Controller - hasUserLeftComment", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return true if user has left comment for other user", async () => {
        const req = { params: { userId: 1, otherUserId: 2 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockResponse = { hasUserLeftComment: true };

        userCommentService.hasUserLeftComment.mockResolvedValueOnce(mockResponse);

        await userCommentController.hasUserLeftComment(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it("should return false if user has not left comment for other user", async () => {
        const req = { params: { userId: 1, otherUserId: 2 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const mockResponse = { hasUserLeftComment: false };

        userCommentService.hasUserLeftComment.mockResolvedValueOnce(mockResponse);

        await userCommentController.hasUserLeftComment(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it("should return 500 if failed to check if user has left comment", async () => {
        const req = { params: { userId: 1, otherUserId: 2 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const errorMessage = "Internal server error";

        userCommentService.hasUserLeftComment.mockRejectedValueOnce(new Error(errorMessage));

        await userCommentController.hasUserLeftComment(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
});