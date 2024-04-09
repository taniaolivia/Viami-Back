const travelImageController = require("../../../src/api/controllers/travelImageController");
const travelImageService = require("../../../src/api/services/travelImageService");

jest.mock("../../../src/api/services/travelImageService");

describe("Travel Controller - getAllTravelsImages", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all travels images", async () => {
        const mockImages = [{ id: 1, imageName: "Image 1" }, { id: 2, imageName: "Image 2" }];
        const mockData = { data: mockImages };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelImageService.getAllTravelsImages.mockResolvedValueOnce(mockImages);

        await travelImageController.getAllTravelsImages({}, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should return 401 if failed to get all travels images", async () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelImageService.getAllTravelsImages.mockRejectedValueOnce(new Error("Failed to get all travels images"));

        await travelImageController.getAllTravelsImages({}, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});


describe("Travel Controller - getTravelImagesById", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all images of a travel by id", async () => {
        const req = { params: { travelId: 1 } };

        const mockImages = [{ id: 1, imageName: "Image 1" }, { id: 2, imageName: "Image 2" }];
        const mockData = { travelImages: mockImages };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelImageService.getTravelImagesById.mockResolvedValueOnce(mockImages);

        await travelImageController.getTravelImagesById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should return 401 if failed to get travel images by id", async () => {
        const req = { params: { travelId: 1 } };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelImageService.getTravelImagesById.mockRejectedValueOnce(new Error("Failed to get travel images by id"));

        await travelImageController.getTravelImagesById(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});