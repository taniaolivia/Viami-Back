const travelImagesService = require("../../../src/api/services/travelImageService");
const db = require("../../../src/api/knex");

jest.mock("../../../src/api/knex");

describe("travelImagesService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTravelsImages", () => {
    it("should return all travel images", async () => {
      const travelsImages = [
        { id: 1, idImage: 101, idTravel: 201, imageName: "image1.jpg" },
        { id: 2, idImage: 102, idTravel: 202, imageName: "image2.jpg" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.resolve(travelsImages)
          })
        })
      });

      const result = await travelImagesService.getAllTravelsImages();
      expect(result).toEqual(travelsImages);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Failed to get all travels images";

      db.mockReturnValueOnce({
        select: () => ({
          join: () => ({
            join: () => Promise.reject(new Error(errorMessage))
          })
        })
      });

      try {
        await travelImagesService.getAllTravelsImages();
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe("getTravelImagesById", () => {
    it("should return travel images by ID", async () => {
      const travelImages = [
        { id: 1, idImage: 101, idTravel: 201, imageName: "image1.jpg" }
      ];

      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.resolve(travelImages)
            })
          })
        })
      });

      const result = await travelImagesService.getTravelImagesById(201);
      expect(result).toEqual(travelImages);
    });

    it("should throw an error if the database request fails", async () => {
      const errorMessage = "Failed to get travel images by id";

      db.mockReturnValueOnce({
        select: () => ({
          where: () => ({
            join: () => ({
              join: () => Promise.reject(new Error(errorMessage))
            })
          })
        })
      });

      try {
        await travelImagesService.getTravelImagesById(201);
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe("addImageToTravel", () => {
    it("should add an image to a travel", async () => {
      const image = "new_image.jpg";
      const travelId = 202;
      const idImage = 103;

      db.mockReturnValueOnce({
        insert: () => Promise.resolve([idImage])
      }).mockReturnValueOnce({
        insert: () => Promise.resolve()
      });

      const result = await travelImagesService.addImageToTravel(image, travelId);
      expect(result).toEqual({ idImage: idImage, image: image });
    });

    it("should throw an error if the request fails", async () => {
      const errorMessage = "Failed to add image to travel's data";
      const image = "new_image.jpg";
      const travelId = 202;

      db.mockReturnValueOnce({
        insert: () => Promise.reject(new Error(errorMessage))
      });

      try {
        await travelImagesService.addImageToTravel(image, travelId);
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  
    it("should throw an error if the deletion request fails", async () => {
      const errorMessage = "Failed to delete image from travel's data";
      const imageId = 105;
      const travelId = 204;

      db.mockReturnValueOnce({
        where: () => ({
          delete: () => Promise.reject(new Error(errorMessage))
        })
      });

      try {
        await travelImagesService.deleteTravelImage(imageId, travelId);
        fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

