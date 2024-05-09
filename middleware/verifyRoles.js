//creating a middleWare called verifyRoles. its gonna accept a lot of parameters so we are going to use the '...' element to pass all the allowed roles inside the parameters
//All at once
const verifyRoles = (...allowedRoles) => 
{
    return (req, res, next) => 
    {
        //If role is not valid
        if(!req?.roles) return res.sendStatus(401);
        //Defining an array of roles
        //equals to the allowedRoles that we passed in
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.roles);
        //the result is gonna be the mapping of the roles
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true)

        if(!result) return res.sendStatus(401);

        next();
    }
}

export default verifyRoles;