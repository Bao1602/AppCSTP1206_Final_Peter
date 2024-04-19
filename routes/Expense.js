const express = require('express');
const Router = express.Router();
const ExpenseController = require('../controllers/Expense');


//create API
Router.post('/', ExpenseController.CreateExpense);


//get all API
Router.get('/',ExpenseController.GetAllExpenses);

//delete API
Router.delete('/:expenseId',ExpenseController.DeleteExpense);



module.exports = Router;