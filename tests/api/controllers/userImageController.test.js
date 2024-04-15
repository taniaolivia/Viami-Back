const userImageController = require("../../../src/api/controllers/userImageController");
const userImageService = require("../../../src/api/services/userImageService");

jest.mock("../../../src/api/services/userImageService");

describe("User Image Controller - getAllUsersImages", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all images with their users", async () => {
        const mockImages = [
            { id: 1, userId: 1, imageId: 101, user: { id: 1, name: "John" }, image: { id: 101, url: "image1.jpg" } },
            { id: 2, userId: 2, imageId: 102, user: { id: 2, name: "Emma" }, image: { id: 102, url: "image2.jpg" } }
        ];

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userImageService.getAllUsersImages.mockResolvedValueOnce(mockImages);

        await userImageController.getAllUsersImages(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockImages);
    });

    it("should handle error if failed to get all users images", async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userImageService.getAllUsersImages.mockRejectedValueOnce(new Error("Failed to fetch users' images"));

        await userImageController.getAllUsersImages(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});

describe('User Image Controller - getUserImagesById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user images by id', async () => {
        const userId = 1;
        const userImages = [
            { id: 1, userId: 1, imageId: 101, image: { id: 101, url: "image1.jpg" } },
            { id: 2, userId: 1, imageId: 102, image: { id: 102, url: "image2.jpg" } }
        ];

        const req = { params: { userId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userImageService.getUserImagesById.mockResolvedValueOnce(userImages);

        await userImageController.getUserImagesById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ userImages });
    });

    it('should handle error if failed to get user images by id', async () => {
        const userId = 1;

        const req = { params: { userId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userImageService.getUserImagesById.mockRejectedValueOnce(new Error('Failed to get user images by id'));

        await userImageController.getUserImagesById(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});
