import Employee from '../models/employee.js';


const getAllEmployees = async (req, res) => 
{
    const employees = await Employee.find();
    
    if(!employees) res.status(204).json('No employees found');
    
    try
    {
        res.status(200).json(employees)
    } catch(err) {
        res.status(404).json(err)
    }
}

const createEmployee = async(req, res) => 
{
    const { name, age, document } = req.body;

    if(!req?.body?.name || !req?.body?.age || !req?.body?.document)
    {
        res.status(400).json("name, age and document are required")
    }

    try
    {
        const result = await Employee.create({
            name: name,
            age: age,
            document: document
        })

        res.status(201).json(result)
        
    } catch(err) {
        res.status(500).json(err)
    }

}

const updateEmployee = async (req, res) => 
{
    if(!req?.body?.id) return res.status(400).json('Employee not found')
    //Receiving the id as a parameter from the body request with a really precise function:
    const employee = await Employee.findOne({_id: req.body.id}).exec();

    if(!employee)
    {
        return res.status(204).json("Employee not found");
    }


    //Now, if we got an employee by the id we inserted, we are going to check if the data is inserted in the body request, and if it is, we just update the data.
    if(req.body.name) employee.name = req.body.name;
    if(req.body.age) employee.age = req.body.age;
    if(req.body.document) employee.document = req.body.document;
    
    //now we filter the array and remove the existing employee record from it
    //and then add the "new" employee on the array
    try
    {

        const updatedEmployee = await employee.save()
        res.status(201).json(updatedEmployee)
    } catch(err) {
        res.status(500).json(err)
    }
}

const deleteEmployee = async (req, res) => 
{
    if(!req?.body?.id) return res.status(400).json('Employee not found')
    //Here, we are going to receive the id as a parameter from the body again, just like we did on updateEmployee,
    const employee = await Employee.findOne({_id: req.body.id}).exec();

    //Checking if the employee exists
    if(!employee)
    {
        return res.status(500).json('Employee id not found')
    }

    //now, just like before we are going to filter the array and then delete the employee that belongs to the id we inserted
    try
    {
        await employee.deleteOne();
        res.status(201).json('Employee deleted successfully');
    } catch(err) {
        res.status(500).json(err)
    }
    
}

const getEmployeeById = async (req, res) => 
{
    //Again, we use the id inserted to locate the employee and then send a response with the employee
    const employee = await Employee.findOne({_id: req.params.id}).exec();
    //Always checking if the employee exists
    if(!employee)
    {
        res.status(500).json('Employee id not found');
    }

    res.json(employee);
}

export default {getAllEmployees, createEmployee, updateEmployee, deleteEmployee, getEmployeeById}