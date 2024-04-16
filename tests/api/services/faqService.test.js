const faqService = require("../../../src/api/services/faqService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe('FAQ Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFaq', () => {
    it('should return all FAQs ordered by question', async () => {
      const mockFaqs = [
        { id: 1, question: 'Question 1', answer: 'Answer 1', isFrequented: false },
        { id: 2, question: 'Question 2', answer: 'Answer 2', isFrequented: true },
        { id: 3, question: 'Question 3', answer: 'Answer 3', isFrequented: false },
      ];
      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => Promise.resolve(mockFaqs),
        }),
      });

      const faqs = await faqService.getAllFaq();
      expect(faqs).toEqual(mockFaqs);
    });
  });

  describe('getTopFiveFrequentedFaq', () => {
    it('should return top 5 frequented FAQs ordered by question', async () => {
      const mockFaqs = [
        { id: 1, question: 'Question 1', answer: 'Answer 1', isFrequented: true },
        { id: 2, question: 'Question 2', answer: 'Answer 2', isFrequented: true },
        { id: 3, question: 'Question 3', answer: 'Answer 3', isFrequented: true },
        { id: 4, question: 'Question 4', answer: 'Answer 4', isFrequented: true },
        { id: 5, question: 'Question 5', answer: 'Answer 5', isFrequented: true },
        { id: 6, question: 'Question 6', answer: 'Answer 6', isFrequented: false },
      ];
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () => ({
                offset: () => Promise.resolve(mockFaqs.slice(0, 5)),
              }),
            }),
          }),
        }),
      });

      const faqs = await faqService.getTopFiveFrequentedFaq();
      expect(faqs).toEqual(mockFaqs.slice(0, 5));
    });

    it('should return an empty array if no frequented FAQs found', async () => {
      const mockFaqs = [
        { id: 1, question: 'Question 1', answer: 'Answer 1', isFrequented: false },
        { id: 2, question: 'Question 2', answer: 'Answer 2', isFrequented: false },
        { id: 3, question: 'Question 3', answer: 'Answer 3', isFrequented: false },
      ];
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            orderBy: () => ({
              limit: () => ({
                offset: () => Promise.resolve([]),
              }),
            }),
          }),
        }),
      });

      const faqs = await faqService.getTopFiveFrequentedFaq();
      expect(faqs).toEqual([]);
    });

    it("should throw an error if the request is invalid", async () => {
        db.mockReturnValueOnce({
          insert: () => ({
            returning: () => Promise.reject(new Error("Database error")),
          }),
        });

        await expect(faqService.getTopFiveFrequentedFaq()).rejects.toThrow("Database error");
    });
  });

  describe('getFaqById', () => {
    it('should return a FAQ by ID', async () => {
      const mockFaq = { id: 1, question: 'Question 1', answer: 'Answer 1', isFrequented: false };
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.resolve(mockFaq),
          }),
        }),
      });

      const faq = await faqService.getFaqById(1);
      expect(faq).toEqual(mockFaq);
    });

    it('should return null if FAQ not found', async () => {
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.resolve(null),
          }),
        }),
      });

      const faq = await faqService.getFaqById(1);
      expect(faq).toEqual(null);
    });

    it("should throw an error if the request is invalid", async () => {
      db.mockReturnValueOnce({
        insert: () => ({
          returning: () => Promise.reject(new Error("Failed to fetch FAQ")),
        }),
      });

      await expect(faqService.getFaqById(1)).rejects.toThrow("Failed to fetch FAQ");
    });
  });
});
