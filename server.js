//Importing the common core modules that we need for the project
//import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import express from 'express';

//importing dirname from dirname because why not right my pc doesnt fucking run the dirname methods if i dont import them
import { dirname } from 'path';
import { fileURLToPath } from 'url';

//Now importing cors to handle third party middlewares
import cors from 'cors'
import corsOptions from './config/corsOptions.js'
//importing the logEvents
//import logEvent from './middleware/logEvents.js';
import log from './middleware/logEvents.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//import subdirs from './routes/subdir.js'
import employee from './routes/api/employees.js'
import registers from './routes/register.js'
import authentication from './routes/login.js'
import refresh from './routes/refresh.js'
import logout from './routes/logout.js'
import verifyJWT from './middleware/verifyToken.js'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectDB from './config/dbConnect.js'

const app = express();
//Now we are going to define which port we are going to run the server on
const PORT = process.env.PORT || 3000;

connectDB();



//Creating custom middleware logger
//We have to use the next here, unlike the built-in middlewares.
app.use(log);

//With new google policy, we need to define the corsOptions to use any domain 

/*const corsOptions = {
    origin: "*",
    credentials: true
}*/

app.use(cors(corsOptions))

//Built-in middlewares to handle urlencoded data
//in other words, form data
//'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}))

//Built-in middleware for json
app.use(express.json())

app.use(cookieParser())

//Built-in middleware for serving static files (like css)
app.use('/', express.static(path.join(__dirname, '/public')));//will search the public folder to the request before all the routes


//Now bringing in the routes from the subdir.js so we can access the routes from the server.js
//When we use a page that doesnt exist inside the subdir, the 404 page doesnt have css, and thats because we didnt call it to the subdir fulder, only public folder
//so look at the line 53

app.use('/register', registers)
app.use('/login', authentication)
app.use('/refresh', refresh)
app.use('/logout', logout)

app.use(verifyJWT)
app.use('/employees', employee)
//Now we will start creating an api to simulate a real workspace based on the capacitation given to the trainees
//and of course we will create a folder called models to store the data of the entity we are using(employee) ACTUALLY THIS IS GONNA BE FOR AFTER THE THING
//app.use('/employees', employee);

//Now creating a folder called 'public' and dragging the css folder to inside of the public, aswell as the img folder
//Creating another folder called text and drag the data folder inside of it.

//Building the first http request using express
//"But what if i request "/index.html" instead of only "/'?" thats when express can help us, so we can put "^/$|/index.html" (^:must begin with a slash)
//($: must end with a slash) and the rest is just the operator of "or" (|) and saying that it can also begin with index.html
//And we can put the ".html" between parenthesis (.html)? so this way it isnt required on the url
app.get('^/$|/index(.html)?', (req, res) => 
{
    //res.sendFile('./views/index.html', { root: __dirname})//Here, we can send a file modifying the 'send' method to 'sendFile' and passing the path to the file aswell as the file name.
    res.sendFile(path.join(__dirname, 'views', 'index.html'));//Using path.join() is a much nicer way to use the path to the file
});

//Now the same thing but for the new-page.html
//Here, we want to use the path not using only the '/', but also the name of the file (because it isnt the main page)
app.get('/new-page(.html)?', (req, res) => 
{   
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

//Handling a redirect (if the page doesnt exist like old-page again)

app.get('/old-page(.hmtl)?', (req, res) =>
{
    res.redirect(301, '/new-page.html'); // this is gonna send a 302 code as response, but what we really want is a 301 code
})

app.get('/hello(.html)?', (req, res, next) => 
{
    console.log('attempted to reach the hello.html');
    next(); // moves on to the next handler
}, (req, res) => {
    res.send('hello world!');
})//not usual, but we can do this

//and then at the end of the route we can create a "default page"
//the "*" means that the slash followed by anything will redirect to the expecific page
//this is a way to handle the 404 error (if the path is typed wrogly or doesnt exist)
//route handlers - introduction to the next() function

app.get('/*', (req, res) => 
{
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})


mongoose.connection.once('open', () => 
{
    console.log('Connected to mongoDB')
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
})
//The way it is, it isnt ready to launch the server yet, because the server needs to listen for a req


