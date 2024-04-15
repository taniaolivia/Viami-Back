const activityImageController = require('../../../src/api/controllers/activityImageController');
const activityImageService = require('../../../src/api/services/activityImageService');

jest.mock('../../../src/api/services/activityImageService');

describe('getAllActivitiesImages Controller', () => {
    it('should return all activities images', async () => {
        const mockData = [{ id: 1, name: 'Activity 1', idImage: 1}, { id: 2, name: 'Activity 2', idImage: 2 }];
        activityImageService.getAllActivitiesImages.mockResolvedValue(mockData);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityImageController.getAllActivitiesImages(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: mockData });
    });

    it('should return server error when database operation fails', async () => {
        activityImageService.getAllActivitiesImages.mockRejectedValue(new Error('Database error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityImageController.getAllActivitiesImages(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});


describe('getActivityImagesById Controller', () => {
    it('should return activity images by id', async () => {
        const mockActivityId = 1;
        const mockData = [{ id: 1, name: 'Image 1', idImage: 1 }, { id: 2, name: 'Image 2', idImage: 2 }];
        activityImageService.getActivityImagesById.mockResolvedValue(mockData);

        const req = { params: { activityId: mockActivityId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityImageController.getActivityImagesById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ activityImages: mockData });
    });

    it('should return server error when database operation fails', async () => {
        activityImageService.getActivityImagesById.mockRejectedValue(new Error('Database error'));

        const req = { params: { activityId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await activityImageController.getActivityImagesById(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});


describe('addImageToActivity Controller', () => {
    it('should add image to activity data', async () => {
        const mockImage = { id: 1, url: 'image_url'};
        const mockActivityId = 1;
        const mockActivityData = { id: 1, name: 'Activity 1' };

        activityImageService.addImageToActivity.mockResolvedValueOnce({ imageId: 1, activityData: mockActivityData });

        const req = { body: { image: mockImage }, params: { activityId: mockActivityId } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await activityImageController.addImageToActivity(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: `Image is added to activity's data`,
            activity: mockActivityData,
            image: { id: 1, image: mockImage }
        });
    });

    it('should return invalid request when database operation fails', async () => {
        activityImageService.addImageToActivity.mockRejectedValueOnce(new Error('Database error'));

        const req = { body: { image: {} }, params: { activityId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await activityImageController.addImageToActivity(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid request" });
    });
});


describe('deleteActivityImage Controller', () => {
    it('should delete the image from activity data', async () => {
        const mockImageId = 1;
        const mockActivityId = 1;

        activityImageService.deleteActivityImage.mockResolvedValueOnce();

        const req = { body: { imageId: mockImageId }, params: { activityId: mockActivityId } };

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await activityImageController.deleteActivityImage(req, res);

        expect(activityImageService.deleteActivityImage).toHaveBeenCalledWith(mockImageId, mockActivityId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: `Image is deleted from activity's data` });
    });

    it('should return invalid request when database operation fails', async () => {
        const mockImageId = 1;
        const mockActivityId = 1;

        activityImageService.deleteActivityImage.mockRejectedValueOnce(new Error('Database error'));

        const req = { body: { imageId: mockImageId }, params: { activityId: mockActivityId } };

        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await activityImageController.deleteActivityImage(req, res);

        
        expect(activityImageService.deleteActivityImage).toHaveBeenCalledWith(mockImageId, mockActivityId);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid request" });
    });
});





