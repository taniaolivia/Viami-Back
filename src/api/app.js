const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const hostname = "0.0.0.0";
const port = 3000;

const server = express();

server.use(logger('dev'));

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use(cookieParser());

server.use(cors());

const userRoute = require("./routes/userRoute");
userRoute(server);

const interestRoute = require("./routes/interestRoute");
interestRoute(server);

const userInterestRoute = require("./routes/userInterestRoute");
userInterestRoute(server);

const languageRoute = require("./routes/languageRoute");
languageRoute(server);

const userLanguageRoute = require("./routes/userLanguageRoute");
userLanguageRoute(server);

const imageRoute = require("./routes/imageRoute");
imageRoute(server);

const userImageRoute = require("./routes/userImageRoute");
userImageRoute(server);

const travelRoute = require("./routes/travelRoute");
travelRoute(server);

const commentRoute = require("./routes/commentRoute");
commentRoute(server);

const userCommentRoute = require("./routes/userCommentRoute");
userCommentRoute(server);

const activityRoute = require("./routes/activityRoute");
activityRoute(server);

const travelActivityRoute = require("./routes/travelActivityRoute");
travelActivityRoute(server);

const travelImageRoute = require("./routes/travelImageRoute");
travelImageRoute(server);
const themeTravelRoute = require("./routes/themeTravelRoute");
themeTravelRoute(server);

const activityImageRoute = require("./routes/activityImageRoute");
activityImageRoute(server);

server.listen(port, hostname);