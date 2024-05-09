import jwt from 'jsonwebtoken';
import User from '../models/User.js';




//Creating a function to handle the login of the user
//In this function, it will start just like the register, checking if the username and the password are being inserted correctly.
//But the rest is gonna be a little different. First, we need to check if the user we inserted exists, trying to find it
//using of course a const of a name of your choice, but one that checks if the user exists
//if the user isnt found, then we create an error codeStatus 401 (Unauthorized)
//But if the user is found, we need to make the bcrypt compare the two passwords: the one that was inserted with the foundUser's one.
//If it matches, then we send a response saying that the person is logged in
const handleRefreshToken = async (req, res) => 
{
    //Here we wont be looking for an user, but for a cookie
    const cookies = req.cookies;
    //checking if we have cookies and if we also have the cookies check if we have the jwt
    console.log(cookies)
    
    if(!cookies?.jwt)
    {
       return res.sendStatus(401)
    }
    
    console.log(cookies.jwt);
    //defining refresh token with teh cookie jwt
    const refreshToken = cookies.jwt;
    //Here now we use the refresh token instead of the name, because each user has to have a refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();

    /*if(!foundUser)
    {
        return res.sendStatus(403);
    }*/
 

    //evaluating the refresh token through the jwt.verify mehtod
    //And if we do not have a token evaluated, we fall into the (err, decoded) callback inside the jwt.verify method
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403)
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'30s'}
            );
            res.json({ accessToken })
        }
    )
}

export default { handleRefreshToken };