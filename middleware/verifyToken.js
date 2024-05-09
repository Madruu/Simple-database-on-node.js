//Hre we obviusly need to import jwt and .env to make this middleware
import jwt from 'jsonwebtoken';

//First, on the const function we are going to create an authorization header called authHeader.
//if this is not inserted, then we send an error of codeStatus 401(unauthorized)
//then we will also create the token const and split it (this will put the token in an array and then return whatever part we want. when used as ([' ']) it will 
//return a word. when used like (['']) it will return just a letter)
//So when we use the split, we dont want it in the 0 position, but in the 1 position
//we also want to verify all this on the jwt. we are going to use the jwt.verify method to verify the token passing the token (that stored the authHeader.split()),
//the accessToken(the dotenv variable) and a callback in case the token is invalid.
//And then we are going to set the user equal to the decoded username

const verifyJWT = (req, res, next) => 
{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => 
        {
            if(err) return res.sendStatus(403);
            req.user = decoded.UserInfo.username;//username decoded
            req.roles = decoded.UserInfo.roles
            next();
        }
    )
}

export default verifyJWT 

