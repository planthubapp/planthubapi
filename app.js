const express = require('express');
const app = express();      //call express function and it returns app function
//it creates a new app for our application
const cors = require('cors');               //to expose our backend application, so that front end on any other system can use it
require('dotenv').config();                 //to read .env file
app.use(express.static('public'));          //app.use(middleware) middlware is a function and static here is for static content i.e html,css..
app.use(express.json());                    //for reading json format data key:value
app.use(express.urlencoded());              //for reading key=value&key=value
const {ROOT} = require('./utils/config').ROUTES;
app.use(cors());                            //using cors
    //ALL ROUTES

    //ROUTES AVAILABLE BEFORE ANY LOGIN     (basically these routes dont require token in headers/authorization)
    app.use(ROOT,require('./api/routes/user_login_register'));     //user - login,register,forgot pass, acc recover
    app.use(ROOT,require('./api/routes/view_plants'));
    //Authentication for USER

    //all admins, users can access this section after authentication

    //Authentication for ADMIN

    //all ADMIN section 
    app.use(ROOT,require('./api/routes/plants_crud'));      //plants crud
    app.use(ROOT,require('./api/routes/direct_change.js')) //to direct change in plants

app.use(require('./utils/middlewares/404'));                //ifuser has typed something wrong


const server = app.listen(process.env.PORT || 1234,err=>{       //.listen up the our application on that port in local host this port number should be unique , should not get conflict with other apps
    if(err){
        console.log("app crash",err);
    }
    else{
        console.log("server started...",server.address().port);     //server.address().port tells on which port our application is running
    }
});
