const themeController = require('../../../src/api/controllers/themeController');
const themeService = require('../../../src/api/services/themeService');

jest.mock('../../../src/api/services/themeService');

describe('Theme Controller - listThemes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of themes ordered ascending by theme name', async () => {
        const mockThemes = [{ id: 1, theme: 'Theme 1' }, { id: 2, theme: 'Theme 2' }];
        themeService.listThemes.mockResolvedValueOnce(mockThemes);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await themeController.listThemes(req, res);

        expect(themeService.listThemes).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ themes: mockThemes });
    });

    it('should return 500 if service method fails', async () => {
        themeService.listThemes.mockRejectedValueOnce(new Error('Server error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await themeController.listThemes(req, res);

        expect(themeService.listThemes).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});

describe('Theme Controller - getFiveThemes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return five themes ordered ascending by theme name', async () => {
        const mockThemes = [{ id: 1, theme: 'Theme 1' }, { id: 2, theme: 'Theme 2' }];
        themeService.getFiveThemes.mockResolvedValueOnce(mockThemes);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await themeController.getFiveThemes(req, res);

        
        expect(themeService.getFiveThemes).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ themes: mockThemes });
    });

    it('should return 500 if service method fails', async () => {
        themeService.getFiveThemes.mockRejectedValueOnce(new Error('Server error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await themeController.getFiveThemes(req, res);

        expect(themeService.getFiveThemes).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});
