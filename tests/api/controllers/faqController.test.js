const faqController = require('../../../src/api/controllers/faqController');
const faqService = require('../../../src/api/services/faqService');

jest.mock('../../../src/api/services/faqService');


describe('Faq Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all faq items', async () => {
        const mockFaqData = [{ id: 1, question: 'Question 1', answer: 'Answer 1' }];
        faqService.getAllFaq.mockResolvedValueOnce(mockFaqData);

        const faqItems = await faqService.getAllFaq();

        expect(faqService.getAllFaq).toHaveBeenCalled();
        expect(faqItems).toEqual(mockFaqData);
    });

    it('should throw an error if database operation fails', async () => {
        const errorMessage = 'Database error';
        faqService.getAllFaq.mockRejectedValueOnce(new Error(errorMessage));

        await expect(faqService.getAllFaq()).rejects.toThrow(errorMessage);

         
        expect(faqService.getAllFaq).toHaveBeenCalled();
    });
});

describe('Faq Controller - getTopFiveFrequentedFaq', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the top five frequented faq', async () => {
        const mockFaqData = [{ id: 1, question: 'Question 1', answer: 'Answer 1' }];
        faqService.getTopFiveFrequentedFaq.mockResolvedValueOnce(mockFaqData);

        const req = {};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await faqController.getTopFiveFrequentedFaq(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ faq: mockFaqData });
    });

    it('should return a server error if service method fails', async () => {
        faqService.getTopFiveFrequentedFaq.mockRejectedValueOnce(new Error('Database error'));

        const req = {};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        await faqController.getTopFiveFrequentedFaq(req, res);

         
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});


describe('FAQ Service - getFaqById', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return FAQ by id', async () => {
        const faqId = 1;
        const mockFaq = { id: 1, question: 'Question 1', answer: 'Answer 1' };

        faqService.getFaqById.mockResolvedValueOnce(mockFaq);

        const faq = await faqService.getFaqById(faqId);

        expect(faqService.getFaqById).toHaveBeenCalledWith(faqId);
        expect(faq).toEqual(mockFaq);
    });

    it('should throw an error if database operation fails', async () => {
        const faqId = 1;
        const errorMessage = 'Database error';

        faqService.getFaqById.mockRejectedValueOnce(new Error(errorMessage));

        await expect(faqService.getFaqById(faqId)).rejects.toThrow(errorMessage);

        expect(faqService.getFaqById).toHaveBeenCalledWith(faqId);
    });
});
