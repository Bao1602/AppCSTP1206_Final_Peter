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

async function generateAllExpenses(expenseList){
    const expensesElements = document.getElementById('allExpense');

    expensesElements.innerHTML = "";

    for(let expense of expenseList) {
        const expenseItem = 
       `<div class="border-gray-300 bg-white p-6 space-y-4 md:space-y-6 sm:p-8 mb-5">
            <div>${expense.expenseName} / ${expense.amount}$ | ${expense.date} | category:${expense.category}</div>
            <button type="button" class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" id="${expense._id}" onclick="deleteExpense('${expense._id}')">Delete</button>
        </div>`

        expensesElements.innerHTML += expenseItem;
    }

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

        } else {
            console.error('Failed to delete expense');
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

checkIfUserLoggedIn();
getAllExpenses();