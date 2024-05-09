import User from '../models/User.js';

//Now we are going to create an authentication controller
/*const usersDB = 
{
    users: ['../models/users.json'],
    //creating the setUsers through a function with the 'this' sintax and associating with the data
    setUsers: function (data) {this.users = data}
}*/



//Creating a function to handle the login of the user
//In this function, it will start just like the register, checking if the username and the password are being inserted correctly.
//But the rest is gonna be a little different. First, we need to check if the user we inserted exists, trying to find it
//using of course a const of a name of your choice, but one that checks if the user exists
//if the user isnt found, then we create an error codeStatus 401 (Unauthorized)
//But if the user is found, we need to make the bcrypt compare the two passwords: the one that was inserted with the foundUser's one.
//If it matches, then we send a response saying that the person is logged in
const handleLogout = async (req, res) => 
{
    //Here we wont be looking for an user, but for a cookie
    const cookies = req.cookies;
    //checking if we have cookies and if we also have the cookies check if we have the jwt
    
    if(!cookies?.jwt)
    {
       return res.sendStatus(204)
    }
    //defining refresh token with teh cookie jwt
    const refreshToken = cookies.jwt;

    //Here now we use the refresh token instead of the name, because each user has to have a refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();

    //Now if we dont have a found user we can clear the cookie, then we can just erase the cookie inside the (!foundUser) condition with the method clearCookie()
    //Passing the same options
    if(!foundUser)
    {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
        return res.sendStatus(403);
    }
 
    //Here with mongodb, the only thing we need to do to delete the refreshToken is to set it to null by using ''
    foundUser.refreshToken = '';
    const result = await foundUser.save()

    console.log(result)
    //And then finally we also delete the cookie at the end of the code
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.sendStatus(204);
}
export default { handleLogout };