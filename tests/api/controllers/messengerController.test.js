const messageController = require("../../../src/api/controllers/messengerController");
const messageService = require("../../../src/api/services/messengerService");

jest.mock("../../../src/api/services/messengerService");

describe("Message Controller - setMessageRead", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should set message as read successfully", async () => {
        const req = {
            params: { messageId: "1" },
            query: { userId: "123" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        messageService.setMessageRead.mockResolvedValueOnce({ message: "Message is set to read successfully!" });

        await messageController.setMessageRead(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Message is set to read successfully!" });
    });

    it("should handle error if setting message as read fails", async () => {
        const req = {
            params: { messageId: "1" },
            query: { userId: "123" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        messageService.setMessageRead.mockRejectedValueOnce(new Error("Failed to set message as read."));

        await messageController.setMessageRead(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Failed to set message as read." });
    });
});

describe("Message Controller - getMessageById", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return message by id if found", async () => {
        const req = {
            params: { messageId: "1" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const mockMessage = { id: 1, content: "Test message" };
        messageService.getMessageById.mockResolvedValueOnce(mockMessage);

        await messageController.getMessageById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Message found", data: mockMessage });
    });

    it("should return 401 if message not found", async () => {
        const req = {
            params: { messageId: "1" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        messageService.getMessageById.mockRejectedValueOnce(new Error("Message not found"));

        await messageController.getMessageById(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Message not found" });
    });
});
