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

describe("Travel Image Controller - addImageToTravel", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should add image to travel's data", async () => {
        const req = {
            params: { travelId: 1 },
            body: { image: "image_url.jpg" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const imageData = { idImage: 1, image: "image_url.jpg" };
        travelImageService.addImageToTravel.mockResolvedValueOnce(imageData);

        await travelImageController.addImageToTravel(req, res);

        expect(travelImageService.addImageToTravel).toHaveBeenCalledWith("image_url.jpg", 1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Image is added to travel's data",
            image: imageData
        });
    });

    it("should return 401 if failed to add image to travel's data", async () => {
        const req = {
            params: { travelId: 1 },
            body: { image: "image_url.jpg" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelImageService.addImageToTravel.mockRejectedValueOnce(new Error("Failed to add image"));

        await travelImageController.addImageToTravel(req, res);

        expect(travelImageService.addImageToTravel).toHaveBeenCalledWith("image_url.jpg", 1);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid request" });
    });
});

describe("Travel Image Controller - deleteTravelImage", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete image from travel's data", async () => {
        const req = {
            params: { travelId: 1 },
            body: { imageId: 1 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelImageService.deleteTravelImage.mockResolvedValueOnce();

        await travelImageController.deleteTravelImage(req, res);

        expect(travelImageService.deleteTravelImage).toHaveBeenCalledWith(1, 1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Image is deleted from travel's data"
        });
    });

    it("should return 401 if failed to delete image from travel's data", async () => {
        const req = {
            params: { travelId: 1 },
            body: { imageId: 1 }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        travelImageService.deleteTravelImage.mockRejectedValueOnce(new Error("Failed to delete image"));

        await travelImageController.deleteTravelImage(req, res);

        expect(travelImageService.deleteTravelImage).toHaveBeenCalledWith(1, 1);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid request" });
    });
});