const languageController = require('../../../src/api/controllers/languageController');
const languageService = require('../../../src/api/services/languageService');

jest.mock('../../../src/api/services/languageService');

describe('Language Controller - listAllLanguages', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of languages', async () => {
        const mockLanguages = [{ id: 1, language: 'English' }, { id: 2, language: 'French' }];
        languageService.getAllLanguages.mockResolvedValueOnce(mockLanguages);

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await languageController.listAllLanguages(req, res);

        expect(languageService.getAllLanguages).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ languages: mockLanguages });
    });

    it('should return a server error if service method fails', async () => {
        languageService.getAllLanguages.mockRejectedValueOnce(new Error('Server error'));

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await languageController.listAllLanguages(req, res);

        expect(languageService.getAllLanguages).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});


describe('Language Controller - getLanguageById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the language by id', async () => {
        const mockLanguage = { id: 1, language: 'English' };
        languageService.getLanguageById.mockResolvedValueOnce(mockLanguage);

        const req = { params: { languageId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await languageController.getLanguageById(req, res);

        expect(languageService.getLanguageById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: mockLanguage });
    });

    it('should return 404 if language is not found', async () => {
        languageService.getLanguageById.mockResolvedValueOnce(null);

        const req = { params: { languageId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await languageController.getLanguageById(req, res);

        expect(languageService.getLanguageById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Language not found' });
    });

    it('should return 500 if service method fails', async () => {
        languageService.getLanguageById.mockRejectedValueOnce(new Error('Database error'));

        const req = { params: { languageId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await languageController.getLanguageById(req, res);

        expect(languageService.getLanguageById).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});