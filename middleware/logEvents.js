import { format } from 'date-fns';
import { v4 as uuid } from 'uuid'
import fs from 'fs'; // fs = fileSystem
import fsPromises from 'fs/promises';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
//All imports we need
//Function format accepts a date and a format string

//defining our logEvents funciton that we can export. Has to be an async function and its gonna receive a message
const logEvent = async(message, logName) =>
{
    const date = `${format(new Date(), "yyyy/MM/dd\tHH:mm:ss")}`;
    const logmessage = `${date}\t${uuid()}\t${message}\n`
    console.log(logmessage);
    try //AN appendFile() function will create a file even if we dont have one (have to pass the directory name, the folder(in this case its LOGS) and the file name)
    {
        if(!fs.existsSync(path.join(__dirname, '..', 'logs')))// In order to create the log folder outside the middleware folder (because now we are in the middleware), we will put the dots on the path.join to make sure it comes out of the directory
        {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logmessage); //Had to put '..' here too so we can get out of the middleware folder
    } catch (err) {
        console.log(err)
    }
}

//Creating a separate middleware based on the log creater on the server.js
const logger = (req, res, next) =>
{
    logEvent(`${req.method}\t${req.headers.origin}\t${req.path}`, 'reqLog.txt') //log events accepts two vlaues: the message that we want to send and the file we want to create
    console.log(`${req.method}, ${req.path}`)
    next();
}

export default logger; //Exporting the function so we can use it in other files || AND NOW ON DATE 25/04 WE ARE GOING TO IMPORT IN SEVER.JS