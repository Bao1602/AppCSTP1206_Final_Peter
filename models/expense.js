const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    expenseName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    category:{
        type: String,
        require: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
  }, {
      timestamps: true
  });

const ExpenseModel = mongoose.model('userExpense',ExpenseSchema);

module.exports = ExpenseModel;

