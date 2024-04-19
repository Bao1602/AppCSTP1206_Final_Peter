const ExpenseModel = require('../models/expense');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const GetAllExpenses = async (req,res) => {

    try{
        const expenses = await ExpenseModel.find();
        return res.status(200).json({
            message: 'Successfully found the expenses',
            data: expenses
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error finding expense',
            error
        })
    }
}

const CreateExpense = async (req,res) => {
    const allHeaders = req.headers;

    if(!allHeaders.authorization){
        return res.status(401).json({
            message: "Please provide the token"
        })
    }
    const token = allHeaders.authorization;



    const decodedToken = jwt.decode(token, {complete: true});

    const userId = decodedToken.payload.id;

    const userExists = await UserModel.findById(userId)

    if(!userExists){
        return res.status(401).json({
            message: 'You are not authorized to create an expense'
        })
    }

    const expenseBody = req.body;
    const newExpense = new ExpenseModel({
        user: userId,
        expenseName: expenseBody.expenseName,
        amount: expenseBody.amount,
        date: expenseBody.date,
        category: expenseBody.category
    })

    const savedExpense = newExpense.save();

    return res.status(201).json({
        message: "Expense Created Successfully",
        data: savedExpense
    })
}

// const DeleteExpense = async (req, res) => {
//     const allHeaders = req.headers;

//     if (!allHeaders.authorization) {
//         return res.status(401).json({
//             message: "Please provide the token"
//         });
//     }

//     const token = allHeaders.authorization;

//     const decodedToken = jwt.decode(token, { complete: true });

//     const userId = decodedToken.payload.id;

//     const userExists = await UserModel.findById(userId);

//     if (!userExists) {
//         return res.status(401).json({
//             message: 'You are not authorized to delete an expense'
//         });
//     }

//     const expenseId = req.params.expenseId; 
//     try {
//         const deletedExpense = await ExpenseModel.findOneAndDelete({ _id: expenseId, user: userId });

//         if (!deletedExpense) {
//             return res.status(404).json({
//                 message: 'Expense not found or you are not authorized to delete it'
//             });
//         }

//         return res.status(200).json({
//             message: "Expense Deleted Successfully",
//             data: deletedExpense
//         });
//     } catch (error) {
//         console.error("Error deleting expense:", error);
//         return res.status(500).json({
//             message: 'Error deleting the expense'
//         });
//     }
// };





module.exports = {
    GetAllExpenses,
    CreateExpense,
}