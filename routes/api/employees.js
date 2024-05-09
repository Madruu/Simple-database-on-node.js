//Initiating this router just like the others, importing express, router, path AND defining a const with empty data named data
import express from 'express';
import path from 'path';
import employeesController from '../../controllers/employeesController.js';
import ROLES_LIST from '../../config/roles_list.js';
import verifyRoles from '../../middleware/verifyRoles.js';

const router = express.Router();

//Now we can put the roles that are the ones specific to each permision, so on the post route we can put only the admin to be able to control that route
router.route('/')
    .get(employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createEmployee)/*verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), */
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee)

router.route('/:id')
    .get(employeesController.getEmployeeById);

export default router;