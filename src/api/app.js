const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const hostname = "0.0.0.0";
const port = 3000;
const server = express();

//SWAGGER (Documentation)
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title: 'Viami Documentation API',
            version:'1.0.0',
            description:'Documentation for Viami API',
            contact:{
                name:'OLIVIA Tania',
                email:'tania.olivia@my-digital-school.org', 
                name:'OUANASSI Nihel',
                email:'nihel.ouanassi@my-digital-school.org', 
            },
            servers:[process.env.SWAGGER_SERVER],
        },

        components:{
            securitySchemes:{
                ApiKeyAth:{
                    type:'apiKey',
                    in:'header',
                    name:'Authorization',
                }
            }
        },

        security:[{
            ApiKeyAth:[]
        }]
        
    },
    apis:["./routes/*.js"]
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)
server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

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

const themeRoute = require("./routes/themeRoute");
themeRoute(server);

const themeActivityRoute = require("./routes/themeActivityRoute");
themeActivityRoute(server);

const activityImageRoute = require("./routes/activityImageRoute");
activityImageRoute(server);

//const messengerRoute = require("./routes/messengerRoute");
//messengerRoute(server);

const activityCommentRoute = require("./routes/activityCommentRoute");
activityCommentRoute(server);

const faqRoute = require("./routes/faqRoute");
faqRoute(server);

//const demandSendMessageRoute = require("./routes/demandSendMessageRoute");
//demandSendMessageRoute(server);

const premiumPlanRoute = require("./routes/premiumPlanRoute");
premiumPlanRoute(server);

const userPremiumPlanRoute = require("./routes/userPremiumPlanRoute");
userPremiumPlanRoute(server);

const forumRoute = require("./routes/forumRoute");
forumRoute(server);
  
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
