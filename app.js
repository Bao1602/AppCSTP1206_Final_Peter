const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 4000;
require('dotenv').config();
const UserRoutes = require('./routes/User');
const ExpenseRoutes = require('./routes/Expense');

const path = require('path');



app.use(express.json());

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to the Database');
}).catch((error) => {
    console.error(`Error connecting to the Database: ${error} `);
})


app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/user/expense', ExpenseRoutes);

app.listen(PORT, () => {
    console.log(`Server Currently Running on port ${PORT}`);
})