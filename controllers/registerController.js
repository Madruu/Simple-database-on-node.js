//Creating use State with javascript with the requirement of the users and setting them aswell.

//NOW THAT WE ARE GOING TO USE THE MONGODB DATABASE, WE DONT NEED THE FSPROMISES OR THE PATH

import User from '../models/User.js'
import bcrypt from 'bcrypt';
//And now we are going to have to install a package called bcrypt, because we want to use a authentication system here


//Now, we are going to define our handler for the new user information on the register route
//with bcrypt, use async/await functions
//Inside the function to handle a new user, we need to send the request to the body requesting the user and the password (pwd), and send an error of code 404 if one of these
//two wasnt inserted or were incorrect;
//we will also check if the new user is duplicated (if it already exists) and then we are going to use an fsPromises writeFile to create the new user on the json file
const handleNewUser = async (req, res) => 
{
    const { user, pwd } = req.body;
    //Check if the user of password are being inserted correctly
    if(!user || !pwd)
    {
        res.status(404).json("User name and password are required");
    }
    //Check if the user is duplicated
    //using a const called duplicate
    const duplicate = await User.findOne({ username: user }).exec();

    //Send a message if the user is duplicated
    if(duplicate)
    {
        return res.sendStatus(409);
    } 


    try
    {
        //Using the bcrypt to hash the password
        const cryptedPwd = await bcrypt.hash(pwd, 10) // Hashin the password created by the user with a 10 salt value
        
        //create and store new user
        const result = await User.create({
            "username": user, 
            "password": cryptedPwd
        });
        //Setting the new data passing all the data that we have AND the new user
        console.log(result)
        res.status(201).json({'Message': `user ${user} created`})
    } catch(err) {
        res.status(500).json(err);
    }

}

export default { handleNewUser };