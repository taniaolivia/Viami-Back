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

  describe("getDateLocationUsers", () => {
    it("should return users based on location and date", async () => {
      const mockDateLocation = [{ id: 1, location: "Paris", date: "2022-09-01" }];
      const mockUsers = [
        { firstName: "John", lastName: "Doe" }
      ];
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            where: () => ({
              orderBy: () => Promise.resolve(mockDateLocation)
            })
          })
        })
      }).mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => ({
                orderBy: () => Promise.resolve(mockUsers)
              })
            })
          })
        })
      });

      const result = await travelService.getDateLocationUsers("Paris", "2022-09-01");
      expect(result).toEqual({ nbParticipant: mockUsers.length, users: mockUsers });
    });

    it("should throw an error if no participant is found for the given date and location", async () => {
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            where: () => ({
              orderBy: () => Promise.resolve([])
            })
          })
        })
      });

      await expect(travelService.getDateLocationUsers("Paris", "2022-09-01")).rejects.toThrow("Failed to get date location users");
    });
  });

  

   

    it("should throw an error if travel date and location not found", async () => {
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            orderBy: () => Promise.resolve([])
          })
        })
      });

      await expect(travelService.joinTravel("Paris", "2022-09-01", 2)).rejects.toThrow("Failed to join travel");
    });

    it("should throw an error on failure to update or insert user", async () => {
      const mockDateLocation = [{ id: 1, date: "2022-09-01", location: "Paris", nbParticipant: 0 }];
      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            orderBy: () => Promise.resolve(mockDateLocation)
          })
        })
      }).mockReturnValueOnce({
        select: () => ({
          where: () => ({
            andWhere: () => Promise.resolve([])
          })
        })
      }).mockReturnValueOnce({
        insert: () => Promise.reject(new Error("Failed to join travel"))
      });

      await expect(travelService.joinTravel("Paris", "2022-09-01", 2)).rejects.toThrow("Failed to join travel");
    });
  });

  


