const messageService = require("../../../src/api/services/messengerService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe('messengerService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setMessageRead', () => {
    it('should set message as read', async () => {
      db.mockReturnValueOnce({
        insert: () => Promise.resolve(),
      });

      const result = await messageService.setMessageRead(1, 1);
      expect(result).toEqual({ message: "Message is set to read successfully!" });
    });

    it('should throw an error if failed to set message as read', async () => {
      db.mockReturnValueOnce({
        insert: () => Promise.reject(new Error('Failed to set message as read')),
      });

      await expect(messageService.setMessageRead(1, 1)).rejects.toThrow('Failed to set message as read.');
    });
  });

  describe('getMessageById', () => {
    it('should return message by id', async () => {
      const mockMessage = { id: 1, message: 'Message 1' };
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.resolve(mockMessage),
          }),
        }),
      });

      const result = await messageService.getMessageById(1);
      expect(result).toEqual(mockMessage);
    });

    it('should throw an error if failed to get message by id', async () => {
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            first: () => Promise.reject(new Error('Failed to get message by id')),
          }),
        }),
      });

      await expect(messageService.getMessageById(1)).rejects.toThrow('Failed to get message by id');
    });
  });

  describe('getMessagesbyUserId', () => {
    it('should return messages by user id', async () => {
      const mockMessages = [
        { id: 1, message: 'Message 1' },
        { id: 2, message: 'Message 2' },
      ];
      db.mockReturnValueOnce({
        select: () => ({
          where: () => Promise.resolve(mockMessages),
        }),
      });

      const result = await messageService.getMessagesbyUserId(1);
      expect(result).toEqual(mockMessages);
    });

    it('should throw an error if failed to get user\'s messages', async () => {
      db.mockReturnValueOnce({
        select: () => ({
          where: () => Promise.reject(new Error('Failed to get user\'s messages')),
        }),
      });

      await expect(messageService.getMessagesbyUserId(1)).rejects.toThrow('Failed to get user\'s messages');
    });
  });
});
