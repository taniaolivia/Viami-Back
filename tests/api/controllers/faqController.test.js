const faqController = require('../../../src/api/controllers/faqController');
const faqService = require('../../../src/api/services/faqService');

jest.mock('../../../src/api/services/faqService');


describe('Faq Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Faq Controller - listAllFaq', () => {
        it('should return all faq items', async () => {
            const mockFaqData = [{ id: 1, question: 'Question 1', answer: 'Answer 1' }];
            
            faqService.getAllFaq.mockResolvedValueOnce(mockFaqData);

            const req = {};
            const res = { status: jest.fn(), json: jest.fn() };
            res.status.mockReturnThis();     

            await faqController.listAllFaq(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ faq: mockFaqData }); 
            expect(faqService.getAllFaq).toHaveBeenCalledTimes(1);
        });

        it('should return a server error if service method fails', async () => {
            faqService.getAllFaq.mockRejectedValueOnce(new Error('Database error'));
    
            const req = {};
            const res = { status: jest.fn(), json: jest.fn() };
            res.status.mockReturnThis(); 
    
            await faqController.listAllFaq(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    })

    describe('Faq Controller - getTopFiveFrequentedFaq', () => {
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

    describe('FAQ Controller - getFaqById', () => {
        const req = { params: { faqId: 1 } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        it('should return FAQ by id', async () => {
            const faqId = 1;
            const mockFaq = { id: 1, question: 'Question 1', answer: 'Answer 1' };
    
            faqService.getFaqById.mockResolvedValueOnce(mockFaq);
    
            await faqController.getFaqById(req, res);
    
            expect(faqService.getFaqById).toHaveBeenCalledWith(faqId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "FAQ found", data: mockFaq });
        });
    
        it('should return a 404 status code if FAQ is not found', async () => {
            const faqId = 1;
            const mockFaq = null;
    
            faqService.getFaqById.mockResolvedValueOnce(mockFaq);
    
            await faqController.getFaqById(req, res);
    
            expect(faqService.getFaqById).toHaveBeenCalledWith(faqId);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "FAQ not found" });
        });
    
        it('should return a 500 status code if database operation fails', async () => {
            const faqId = 1;
            const errorMessage = 'Database error';
    
            faqService.getFaqById.mockRejectedValueOnce(new Error(errorMessage));
    
            await faqController.getFaqById(req, res);
    
            expect(faqService.getFaqById).toHaveBeenCalledWith(faqId);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });
    
    
});