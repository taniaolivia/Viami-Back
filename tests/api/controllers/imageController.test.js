const imageController = require('../../../src/api/controllers/imageController');
const imageService = require('../../../src/api/services/imageService');

jest.mock('../../../src/api/services/imageService');

describe('Image Controller - listAllImages', () => {
    it('should return a list of images', async () => {
        const mockImages = [{ id: 1, url: 'image1.jpg' }, { id: 2, url: 'image2.jpg' }];

        imageService.listAllImages.mockResolvedValueOnce(mockImages);

        const req = {};
        const res = { status: jest.fn(), json: jest.fn() };
        res.status.mockReturnThis(); 

        await imageController.listAllImages(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ images: mockImages }); 
        expect(imageService.listAllImages).toHaveBeenCalledTimes(1);
    });

    it('should return 401 if failed to fetch images', async () => {
        imageService.listAllImages.mockRejectedValueOnce(new Error('Server error'));

        const req = {};
        const res = { status: jest.fn(), json: jest.fn() };
        res.status.mockReturnThis(); 
        await imageController.listAllImages(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});

describe('getImageById', () => {
    it('should return the image if found', async () => {
        const mockImage = { id: 1, url: 'image.jpg' };

        imageService.getImageById.mockResolvedValueOnce(mockImage);

        const req = { params: { imageId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(), 
        };

        await imageController.getImageById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: mockImage });
    });

    it('should return 404 if image not found', async () => {
        imageService.getImageById.mockResolvedValueOnce(null);

        const req = { params: { imageId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn()
        };

        await imageController.getImageById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Image not found' });
    });
});