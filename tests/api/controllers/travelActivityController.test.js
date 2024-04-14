const travelActivityController = require('../../../src/api/controllers/travelActivityController');
const travelActivityService = require('../../../src/api/services/travelActivityService');

jest.mock('../../../src/api/services/travelActivityService');

describe('Travel Activity Controller - getAllTravelsActivities', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all travels activities', async () => {
        const mockData = [{ id: 1, name: 'Travel Activity 1' }, { id: 2, name: 'Travel Activity 2' }];
        travelActivityService.getAllTravelsActivities.mockResolvedValueOnce(mockData);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelActivityController.getAllTravelsActivities(req, res);

        expect(travelActivityService.getAllTravelsActivities).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: mockData });
    });

    it('should return 500 if service method fails', async () => {
        travelActivityService.getAllTravelsActivities.mockRejectedValueOnce(new Error('Server error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelActivityController.getAllTravelsActivities(req, res);

        expect(travelActivityService.getAllTravelsActivities).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});

describe('Travel Activity Controller - getTravelActivitiesById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return travel activities by travel id', async () => {
        const mockData = [{ id: 1, name: 'Travel Activity 1' }, { id: 2, name: 'Travel Activity 2' }];
        travelActivityService.getTravelActivitiesById.mockResolvedValueOnce(mockData);

        const req = { params: { travelId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelActivityController.getTravelActivitiesById(req, res);

        expect(travelActivityService.getTravelActivitiesById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ travelActivities: mockData });
    });

    it('should return 500 if service method fails', async () => {
        travelActivityService.getTravelActivitiesById.mockRejectedValueOnce(new Error('Server error'));

        const req = { params: { travelId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelActivityController.getTravelActivitiesById(req, res);

        expect(travelActivityService.getTravelActivitiesById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});

describe('Travel Activity Controller - addActivityToTravel', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add activity to travel', async () => {
        const req = { params: { travelId: 1 }, body: { id: 1, name: 'New Activity' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelActivityController.addActivityToTravel(req, res);

        expect(travelActivityService.addActivityToTravel).toHaveBeenCalledWith(req.body, 1);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 if request is invalid', async () => {
        travelActivityService.addActivityToTravel.mockRejectedValueOnce(new Error('Invalid request'));

        const req = { params: { travelId: 1 }, body: { id: 1, name: 'New Activity' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelActivityController.addActivityToTravel(req, res);

        expect(travelActivityService.addActivityToTravel).toHaveBeenCalledWith(req.body, 1);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request' });
    });
});

describe('Travel Activity Controller - deleteTravelActivity', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete travel activity', async () => {
        const req = { params: { travelId: 1 }, body: { activityId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelActivityController.deleteTravelActivity(req, res);

        expect(travelActivityService.deleteTravelActivity).toHaveBeenCalledWith(1, 1);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 if request is invalid', async () => {
        travelActivityService.deleteTravelActivity.mockRejectedValueOnce(new Error('Invalid request'));

        const req = { params: { travelId: 1 }, body: { activityId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await travelActivityController.deleteTravelActivity(req, res);

        expect(travelActivityService.deleteTravelActivity).toHaveBeenCalledWith(1, 1);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request' });
    });
});
