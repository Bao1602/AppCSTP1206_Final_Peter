
let expenseList = [];

function checkIfUserLoggedIn(){
    const token = localStorage.getItem('token');
    if(!token){
        window.location.href = 'http://localhost:4000';
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
        const expenseItem = `
    <div class="border-gray-300 bg-gray-400 p-6 space-y-4 md:space-y-6 sm:p-8 mb-5">
        <h1>${expense.expenseName} /${expense.amount}$ | ${expense.date} |category:${expense.category}</h1>
    </div>
        `

        expensesElements.innerHTML += expenseItem;
    }

}










function logout(event) {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'http://localhost:4000';
}

checkIfUserLoggedIn();
getAllExpenses();