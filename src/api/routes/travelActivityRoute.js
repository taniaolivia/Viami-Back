module.exports = (server) => {
    const travelActivityController = require("../controllers/travelActivityController");
    const jwtMiddleware = require("../middlewares/jwtMiddleware");
    const cors = require('cors');

/**
 * @openapi
 * paths:
 *   /api/travelActivities:
 *     get:
 *       tags:
 *         - Travel
 *       summary: "Get all activities with their travel"
 *       description: "Get all activities along with their associated travel details."
 *      
 *       responses:
 *         '200':
 *           description: "List of all activities with their associated travel details retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 data:
 *                   - id: 1
 *                     idActivity: 101
 *                     idTravel: 123
 *                     name: "Travel 1"
 *                     travelDescription: "Description of Travel 1"
 *                     location: "Location 1"
 *                     nbParticipant: 5
 *                     activityName: "Activity 1"
 *                     imageName: "Image1.jpg"
 *                     activityLocation: "Activity Location 1"
 *                     isRecommended: true
 *                     activityNbParticipant: 10
 *                     activityUrl: "http://example.com/activity1"
 *                     activityTelephone: "123-456-7890"
 *                     activityAddress: "123 Activity St"
 *                     activityLatitude: 12.345
 *                     activityLongitude: -45.678
 *                     activitySchedule: "Monday to Friday, 9 AM to 5 PM"
 *                     activityLanguage: "English"
 *                     accessibility: "Accessible"
 *                   - id: 2
 *                     idActivity: 102
 *                     idTravel: 124
 *                     name: "Travel 2"
 *                     travelDescription: "Description of Travel 2"
 *                     location: "Location 2"
 *                     nbParticipant: 8
 *                     activityName: "Activity 2"
 *                     imageName: "Image2.jpg"
 *                     activityLocation: "Activity Location 2"
 *                     isRecommended: false
 *                     activityNbParticipant: 15
 *                     activityUrl: "http://example.com/activity2"
 *                     activityTelephone: "987-654-3210"
 *                     activityAddress: "456 Activity St"
 *                     activityLatitude: 23.456
 *                     activityLongitude: -54.321
 *                     activitySchedule: "Weekends, 10 AM to 6 PM"
 *                     activityLanguage: "Spanish"
 *                     accessibility: "Not accessible"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during retrieval of all activities with their associated travel details."
 */
server.route("/api/travelActivities")
  .get(jwtMiddleware.authenticateUser, cors(), travelActivityController.getAllTravelsActivities);



/**
 * @openapi
 * paths:
 *   /api/travels/{travelId}/activities:
 *     get:
 *       tags:
 *         - Travel
 *       summary: "Get all activities of a travel by ID"
 *       description: "Get all activities associated with a specific travel by providing the travel ID."
 *       
 *       parameters:
 *         - in: path
 *           name: travelId
 *           required: true
 *           description: "ID of the travel to get activities for."
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: "List of all activities for the specified travel retrieved successfully."
 *           content:
 *             application/json:
 *               example:
 *                 travelActivities:
 *                   - id: 1
 *                     idActivity: 101
 *                     idTravel: 123
 *                     name: "Travel 1"
 *                     travelDescription: "Description of Travel 1"
 *                     location: "Location 1"
 *                     nbParticipant: 5
 *                     activityName: "Activity 1"
 *                     imageName: "Image1.jpg"
 *                     activityLocation: "Activity Location 1"
 *                     isRecommended: true
 *                     activityNbParticipant: 10
 *                     activityUrl: "http://example.com/activity1"
 *                     activityTelephone: "123-456-7890"
 *                     activityAddress: "123 Activity St"
 *                     activityLatitude: 12.345
 *                     activityLongitude: -45.678
 *                     activitySchedule: "Monday to Friday, 9 AM to 5 PM"
 *                     activityLanguage: "English"
 *                     accessibility: "Accessible"
 *                   - id: 2
 *                     idActivity: 102
 *                     idTravel: 124
 *                     name: "Travel 2"
 *                     travelDescription: "Description of Travel 2"
 *                     location: "Location 2"
 *                     nbParticipant: 8
 *                     activityName: "Activity 2"
 *                     imageName: "Image2.jpg"
 *                     activityLocation: "Activity Location 2"
 *                     isRecommended: false
 *                     activityNbParticipant: 15
 *                     activityUrl: "http://example.com/activity2"
 *                     activityTelephone: "987-654-3210"
 *                     activityAddress: "456 Activity St"
 *                     activityLatitude: 23.456
 *                     activityLongitude: -54.321
 *                     activitySchedule: "Weekends, 10 AM to 6 PM"
 *                     activityLanguage: "Spanish"
 *                     accessibility: "Not accessible"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Server error during activity retrieval for the specified travel."
 *     post:
 *       tags:
 *         - Travel
 *       summary: "Add activity to travel's data"
 *       description: "Add a new activity to the specified travel by providing the travel ID."
 *       
 *       parameters:
 *         - in: path
 *           name: travelId
 *           required: true
 *           description: "ID of the travel to add activity to."
 *           schema:
 *             type: integer
 *       requestBody:
 *         description: "Activity details to be added to the travel."
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               name: "New Activity"
 *               imageName: "NewImage.jpg"
 *               location: "New Activity Location"
 *               isRecommended: true
 *               nbParticipant: 5
 *               url: "http://example.com/newactivity"
 *               telephone: "987-654-3210"
 *               address: "789 New Activity St"
 *               latitude: 34.567
 *               longitude: -67.890
 *               schedule: "Weekdays, 8 AM to 4 PM"
 *               language: "French"
 *               accessibility: "Accessible"
 *       responses:
 *         '200':
 *           description: "Activity added to travel's data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity added to travel's data"
 *                 travel:
 *                   - id: 1
 *                     name: "Travel 1"
 *                     description: "Description of Travel 1"
 *                     location: "Location 1"
 *                     nbParticipant: 5
 *                 activity:
 *                   name: "New Activity"
 *                   imageName: "NewImage.jpg"
 *                   location: "New Activity Location"
 *                   isRecommended: true
 *                   nbParticipant: 5
 *                   url: "http://example.com/newactivity"
 *                   telephone: "987-654-3210"
 *                   address: "789 New Activity St"
 *                   latitude: 34.567
 *                   longitude: -67.890
 *                   schedule: "Weekdays, 8 AM to 4 PM"
 *                   language: "French"
 *                   accessibility: "Accessible"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request or server error during activity addition to travel."
 *     delete:
 *       tags:
 *         - Travel
 *       summary: "Delete an activity in travel's data"
 *       description: "Delete an activity from the specified travel by providing the travel ID."
 *       
 *       parameters:
 *         - in: path
 *           name: travelId
 *           required: true
 *           description: "ID of the travel to delete activity from."
 *           schema:
 *             type: integer
 *       requestBody:
 *         description: "Activity ID to be deleted from the travel."
 *         required: true
 *         content:
 *           application/json:
 *             example:
 *               activityId: 101
 *       responses:
 *         '200':
 *           description: "Activity deleted from travel's data successfully."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Activity deleted from travel's data"
 *         '401':
 *           description: "Unauthorized. User not authenticated or server error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request"
 *         '500':
 *           description: "Internal Server Error."
 *           content:
 *             application/json:
 *               example:
 *                 message: "Invalid request or server error during activity deletion from travel."
 */
server.route("/api/travels/:travelId/activities")
  .get(jwtMiddleware.authenticateUser, cors(), travelActivityController.getTravelActivitiesById)
  .post(jwtMiddleware.authenticateUser, cors(), travelActivityController.addActivityToTravel)
  .delete(jwtMiddleware.authenticateUser, cors(), travelActivityController.deleteTravelActivity);

}