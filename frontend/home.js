let expenseList = [];

function checkIfUserLoggedIn(){
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = 'https://appcstp1206-final-peter.onrender.com/index.html';
    }
}

async function createExpense(event){
    event.preventDefault();
    const expenseName = document.getElementById('expenseName').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;

    const expenseData = {
        expenseName,
        amount,
        date,
        category
    }

    const token = localStorage.getItem('token');

    if(!token){
        alert("Token not Found");
        return;
    }

    try{
        const createdExpense = await fetch('/api/v1/user/expense', {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(expenseData)
        });

        const createdExpenseJson = await createdExpense.json();

        if(createdExpenseJson) {
            alert(createdExpenseJson.message);
            getAllExpenses();
        }
    } catch(error){
        alert("There is an error in Creating expense");
    }

}

async function getAllExpenses(){
    try{
        const allExpenses = await fetch('/api/v1/user/expense');

        const allExpensesJson = await allExpenses.json();
        expenseList = allExpensesJson.data;
        generateAllExpenses(expenseList)
    } catch(error){
        alert("There was an error ");
    }
}

function filterExpensesByMonth() {

    const selectedMonth = document.getElementById('monthSelector').value;
    const monthlyExpenses = getMonthlyExpenses(expenseList, selectedMonth);
    generateAllExpenses(monthlyExpenses);
}

function getMonthlyExpenses(expenseList, selectedMonth) {
    const currentYear = new Date().getFullYear(); //Date object getfullyear() = give the whole year

    return expenseList.filter(expense => {
        const expenseDate = new Date(expense.date); //Get the expense date
        const expenseMonth = expenseDate.getMonth() + 1; //Get month january = 0 so +1
        const expenseYear = expenseDate.getFullYear();

        return expenseMonth === parseInt(selectedMonth) && expenseYear === currentYear; //check if the same year
    });
}

async function generateAllExpenses(expenseList) {
    const expensesElements = document.getElementById('allExpense');
    expensesElements.innerHTML = "";

    const token = decodeToken(localStorage.getItem('token'));
    const userID = token.payload.id;

    for (let expense of expenseList) {
        if (userID == expense.user) {
            const expenseItem = `
                <div class="border-gray-300 bg-gray-400 p-6 space-y-4 md:space-y-6 sm:p-8 mb-5">
                    <h1>${expense.expenseName} | ${expense.amount}$ | ${expense.date} | category:${expense.category} </h1>
                    <button type="button" class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" id="${expense._id}" onclick="deleteExpense('${expense._id}')">Delete</button>
                </div>`;

            expensesElements.innerHTML += expenseItem;
        }
    }

    const totalMonthlyExpense = expenseList.reduce((total, expense) => total + parseFloat(expense.amount), 0); // array1.reduce((accumulator, currentValue) => accumulator + currentValue,initialValue,);
    const totalExpenseElement = `<p class="bg-red-500 text-white font-bold py-2 px-4 rounded"> Total Monthly Expense: $${totalMonthlyExpense}</p> `
    expensesElements.innerHTML += totalExpenseElement
}

async function deleteExpense(expenseId) {
    try {
        const token = localStorage.getItem('token');
        const expenseDelete = await fetch(`/api/v1/user/expense/${expenseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            }
        });

        if (expenseDelete) {
            const deletedExpense = await expenseDelete.json();
            console.log('Expense deleted successfully:', deletedExpense);
            getAllExpenses();

        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'https://appcstp1206-final-peter.onrender.com/index.html';
}

function decodeToken(token) {
    const arrayToken = token.split('.'); 
    const tokenHeader = JSON.parse(atob(arrayToken[0]));
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    return {
        header: tokenHeader,
        payload: tokenPayload
    };
}

// export function isTokenExpired(token) {
//     const arrayToken = token.split('.');
//     const tokenPayload = JSON.parse(atob(arrayToken[1]));
//     return Math.floor(new Date().getTime() / 1000) >= tokenPayload?.sub;
//   }
//   const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
//   isTokenExpired(token); //true

checkIfUserLoggedIn();
getAllExpenses();