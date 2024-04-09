const themeActivityController = require('../../../src/api/controllers/themeActivityController');
const themeActivityService = require('../../../src/api/services/themeActivityService');

jest.mock('../../../src/api/services/themeActivityService');

describe('Theme Activity Controller - listActivitiesByTheme', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of activities by theme id', async () => {
        const mockActivities = [{ id: 1, name: 'Activity 1' }, { id: 2, name: 'Activity 2' }];
        themeActivityService.listActivitiesByTheme.mockResolvedValueOnce(mockActivities);

        const req = { params: { themeId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await themeActivityController.listActivitiesByTheme(req, res);

        expect(themeActivityService.listActivitiesByTheme).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ 'activities': mockActivities });
    });

    it('should return 404 if no activities are found for the theme', async () => {
        themeActivityService.listActivitiesByTheme.mockResolvedValueOnce([]);

        const req = { params: { themeId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await themeActivityController.listActivitiesByTheme(req, res);

        expect(themeActivityService.listActivitiesByTheme).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No activities found for this theme' });
    });

    it('should return 500 if service method fails', async () => {
        themeActivityService.listActivitiesByTheme.mockRejectedValueOnce(new Error('Database error'));

        const req = { params: { themeId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await themeActivityController.listActivitiesByTheme(req, res);

        expect(themeActivityService.listActivitiesByTheme).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});


describe('Theme Activity Controller - getFirstFiveActivitiesByTheme', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of first five activities by theme id', async () => {
        const mockActivities = [
            { id: 1, name: 'Activity 1' },
            { id: 2, name: 'Activity 2' },
            { id: 3, name: 'Activity 3' },
            { id: 4, name: 'Activity 4' },
            { id: 5, name: 'Activity 5' }
        ];
        themeActivityService.getFirstFiveActivitiesByTheme.mockResolvedValueOnce(mockActivities);

        const req = { params: { themeId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await themeActivityController.getFirstFiveActivitiesByTheme(req, res);

        expect(themeActivityService.getFirstFiveActivitiesByTheme).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ 'activities': mockActivities });
    });

    it('should return 500 if service method fails', async () => {
        themeActivityService.getFirstFiveActivitiesByTheme.mockRejectedValueOnce(new Error('Server error'));

        const req = { params: { themeId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await themeActivityController.getFirstFiveActivitiesByTheme(req, res);

        expect(themeActivityService.getFirstFiveActivitiesByTheme).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});
