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

server.listen(port, hostname);