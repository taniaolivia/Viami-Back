const travelService = require("../../../src/api/services/travelService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("travelService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTravelById", () => {
    it("should retrieve travel details by ID", async () => {
      const mockTravelData = [{ id: 1, name: "Exciting Travel", location: "France" }];
      db.mockReturnValueOnce({
        select: () => ({
          where: () => Promise.resolve(mockTravelData)
        })
      });

      const result = await travelService.getTravelById(1);
      expect(result).toEqual(mockTravelData);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Server error";
      db.mockReturnValueOnce({
        select: () => ({
          where: () => Promise.reject(new Error(errorMessage))
        })
      });

      await expect(travelService.getTravelById(1)).rejects.toThrow(errorMessage);
    });
  });

  describe("searchTravels", () => {
    it("should return travels based on location", async () => {
      const mockTravels = [{ id: 1, name: "Beach Adventure", location: "Thailand" }];
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            orderBy: () => Promise.resolve(mockTravels)
          })
        })
      });

      const result = await travelService.searchTravels("Thailand");
      expect(result).toEqual(mockTravels);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Server error";
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            orderBy: () => Promise.reject(new Error(errorMessage))
          })
        })
      });

      await expect(travelService.searchTravels("Thailand")).rejects.toThrow(errorMessage);
    });
  });

  describe("listAllTravels", () => {
    it("should list all travels", async () => {
      const mockTravels = [{ id: 1, name: "Mountain Trek", location: "Nepal" }];
      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => Promise.resolve(mockTravels)
        })
      });

      const result = await travelService.listAllTravels();
      expect(result).toEqual(mockTravels);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Server error";
      db.mockReturnValueOnce({
        select: () => ({
          orderBy: () => Promise.reject(new Error(errorMessage))
        })
      });

      await expect(travelService.listAllTravels()).rejects.toThrow(errorMessage);
    });
  });

  describe("saveNewTravel", () => {
    it("should save a new travel", async () => {
      const name = "New Adventure";
      const description = "Exciting trip to Iceland";
      const location = "Iceland";
      db.mockReturnValueOnce({
        insert: () => Promise.resolve()
      });

      const result = await travelService.saveNewTravel(name, description, location);
      expect(result).toEqual({ message: "New travel is successfully saved." });
    });

    

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Error while saving the new travel.";
      db.mockReturnValueOnce({
        insert: () => Promise.reject(new Error(errorMessage))
      });

      await expect(travelService.saveNewTravel("Adventure", "Fun Trip", "USA")).rejects.toThrow(errorMessage);
    });
  });
});

  


