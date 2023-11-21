const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const hostname = "0.0.0.0";
const port = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use(cors());

const userRoute = require("./routes/userRoute");
userRoute(app);

const interestRoute = require("./routes/interestRoute");
interestRoute(app);

const userInterestRoute = require("./routes/userInterestRoute");
userInterestRoute(app);

const languageRoute = require("./routes/languageRoute");
languageRoute(app);

const userLanguageRoute = require("./routes/userLanguageRoute");
userLanguageRoute(app);

const imageRoute = require("./routes/imageRoute");
imageRoute(app);

const userImageRoute = require("./routes/userImageRoute");
userImageRoute(app);

const travelRoute = require("./routes/travelRoute");
travelRoute(app);

const commentRoute = require("./routes/commentRoute");
commentRoute(app);

const userCommentRoute = require("./routes/userCommentRoute");
userCommentRoute(app);

const activityRoute = require("./routes/activityRoute");
activityRoute(app);

const travelActivityRoute = require("./routes/travelActivityRoute");
travelActivityRoute(app);

const travelImageRoute = require("./routes/travelImageRoute");
travelImageRoute(app);

const themeRoute = require("./routes/themeRoute");
themeRoute(app);

const themeActivityRoute = require("./routes/themeActivityRoute");
themeActivityRoute(app);

const activityImageRoute = require("./routes/activityImageRoute");
activityImageRoute(app);

const messengerRoute = require("./routes/messengerRoute");
messengerRoute(app, io);

/*io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (message) => {
        io.emit('chat message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});*/
  
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = { app, server, io };