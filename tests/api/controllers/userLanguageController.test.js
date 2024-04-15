const userLanguageController = require("../../../src/api/controllers/userLanguageController");
const userLanguageService = require("../../../src/api/services/userLanguageService");

jest.mock("../../../src/api/services/userLanguageService");

describe("User Language Controller - getAllUsersLanguages", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all languages with their users", async () => {
        const mockLanguages = [
            { id: 1, name: "English", user: { id: 1, name: "John" } },
            { id: 2, name: "French", user: { id: 2, name: "Emma" } }
        ];

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.getAllUsersLanguages.mockResolvedValueOnce(mockLanguages);

        await userLanguageController.getAllUsersLanguages(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: mockLanguages });
    });

    it("should handle error if failed to get all users languages", async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.getAllUsersLanguages.mockRejectedValueOnce(new Error("Failed to fetch users' languages"));

        await userLanguageController.getAllUsersLanguages(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
});



describe('User Language Controller - getUserLanguagesById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user languages by id', async () => {
        const userId = 1;
        const userLanguages = [{ id: 1, name: 'English' }, { id: 2, name: 'French' }];

        const req = { params: { userId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.getUserLanguagesById.mockResolvedValueOnce(userLanguages);

        await userLanguageController.getUserLanguagesById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ userLanguages });
    });

    it('should handle error if failed to get user languages by id', async () => {
        const userId = 1;

        const req = { params: { userId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.getUserLanguagesById.mockRejectedValueOnce(new Error('Failed to get user languages'));

        await userLanguageController.getUserLanguagesById(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});

describe('User Language Controller - getLanguageUsersById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return users with the same language by id', async () => {
        const languageId = 1;
        const languageUsers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];

        const req = { params: { languageId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.getLanguageUsersById.mockResolvedValueOnce(languageUsers);

        await userLanguageController.getLanguageUsersById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ userLanguages: languageUsers });
    });

    it('should handle error if failed to get users with the same language by id', async () => {
        const languageId = 1;

        const req = { params: { languageId } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.getLanguageUsersById.mockRejectedValueOnce(new Error('Failed to get users with the same language'));

        await userLanguageController.getLanguageUsersById(req, res);

        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});


describe('User Language Controller - addUserLanguage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add language to user data', async () => {
        const userId = 1;
        const languageId = 1;
        const req = {
            params: { userId },
            body: { languageId }
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const userData = { id: userId, name: 'User' };
        const languageData = { id: languageId, name: 'Language' };
        userLanguageService.addUserLanguage.mockResolvedValueOnce({ message: 'Language is added to user\'s data', user: userData, language: languageData });

        await userLanguageController.addUserLanguage(req, res);

        expect(userLanguageService.addUserLanguage).toHaveBeenCalledWith(userId, languageId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Language is added to user\'s data', user: userData, language: languageData });
    });

    it('should return 401 if failed to add language to user data', async () => {
        const userId = 1;
        const languageId = 1;
        const req = {
            params: { userId },
            body: { languageId }
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.addUserLanguage.mockRejectedValueOnce(new Error('Invalid request'));

        await userLanguageController.addUserLanguage(req, res);

        expect(userLanguageService.addUserLanguage).toHaveBeenCalledWith(userId, languageId);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request' });
    });
});

describe('User Language Controller - deleteUserLanguage', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete language from user data', async () => {
        const userId = 1;
        const languageId = 1;
        const req = {
            params: { userId },
            body: { languageId }
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.deleteUserLanguage.mockResolvedValueOnce({ message: 'Language is deleted from user\'s data' });

        await userLanguageController.deleteUserLanguage(req, res);

        expect(userLanguageService.deleteUserLanguage).toHaveBeenCalledWith(userId, languageId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Language is deleted from user\'s data' });
    });

    it('should return 401 if failed to delete language from user data', async () => {
        const userId = 1;
        const languageId = 1;
        const req = {
            params: { userId },
            body: { languageId }
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.deleteUserLanguage.mockRejectedValueOnce(new Error('Invalid request'));

        await userLanguageController.deleteUserLanguage(req, res);

        
        expect(userLanguageService.deleteUserLanguage).toHaveBeenCalledWith(userId, languageId);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request' });
    });
});

describe('User Language Controller - deleteAllLanguagesByUserId', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete all languages from a user's data", async () => {
        const userId = 1;
        const req = {
            params: { userId }
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.deleteAllLanguagesByUserId.mockResolvedValueOnce({ message: "All languages are deleted from user's data" });

        await userLanguageController.deleteAllLanguagesByUserId(req, res);

        expect(userLanguageService.deleteAllLanguagesByUserId).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "All languages are deleted from user's data" });
    });

    it("should return 401 if failed to delete languages from user's data", async () => {
        const userId = 1;
        const req = {
            params: { userId }
        };
        
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        userLanguageService.deleteAllLanguagesByUserId.mockRejectedValueOnce(new Error('Invalid request'));

        await userLanguageController.deleteAllLanguagesByUserId(req, res);

        
        expect(userLanguageService.deleteAllLanguagesByUserId).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request' });
    });
});