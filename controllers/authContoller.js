
import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import bcrypt from 'bcrypt';

//Creating a function to handle the login of the user
//In this function, it will start just like the register, checking if the username and the password are being inserted correctly.
//But the rest is gonna be a little different. First, we need to check if the user we inserted exists, trying to find it
//using of course a const of a name of your choice, but one that checks if the user exists
//if the user isnt found, then we create an error codeStatus 401 (Unauthorized)
//But if the user is found, we need to make the bcrypt compare the two passwords: the one that was inserted with the foundUser's one.
//If it matches, then we send a response saying that the person is logged in
const handleLogin = async (req, res) => 
{
    const { user, pwd } = req.body;
    if(!user || !pwd)
    {
        res.status(404).json("User and password are required")
    }

     // log the users data
    //console.log(user);
    //console.log(pwd)
    const foundUser = await User.findOne({ username: user}).exec();

    if(!foundUser)
    {
        return res.sendStatus(401);
    }

    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match)
    {
        //Now here we also want to grab the role that we inserted on the newest date of studying (from ./config/roles_list)
        const roles = Object.values(foundUser.roles);
        //create jwt token
        //First, we create a const for the token. We are going to use the jwt.sign method to create the token 
        //Usually we pass the payload being the user instead of a password or something like that because otherwise it would be a security breach
        //And we are also going to pass the env variable called ACCESS_TOKEN_SECRET
        //and also we will pass when the token expires using 'expiresIn:'
        //AND THEN WE ARE GOING TO UPDATE THE ACCESSTOKEN CREATOR TO PUT IN ALSO THE ROLE THAT WE INSERTED 
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'1d'}
        );
        
        //On the refreshToken, there is no need to send in the role
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        )


        //writing the json file with the new user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result)
        //sending the refresh token as a cookie to the user with the httpOnly and maxAge of 24 hours
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
        
        //res.cookie('accessToken', accessToken, {httpOnly: true, maxAge: 30 * 1000})
        //And now we send the token to the user, just putting the access token inside the response with the json file
        res.json({ accessToken });
    } else {
        res.status(401).json("Unauthorized")
    }
}

export default { handleLogin };