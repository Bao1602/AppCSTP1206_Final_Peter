

async function registerUser(event){
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const newUser = {
        name,
        email,
        password
    }

    try{
        const createdUser = await fetch('/api/v1/users/register', {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser)
        });

        const createdUserJson = await createdUser.json();

        if(createdUser) {
            alert(createdUserJson.message);
        }
    } catch(error){
        alert("There is an error in creating user")
    }
}

async function loginUser(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const userSigninData = {
        email,
        password
    }

    try{
        const loggedInUser = await fetch('/api/v1/users/login', {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userSigninData)
        });

        const loggedInUserJson = await loggedInUser.json();

        if(loggedInUserJson) {
            localStorage.setItem('token', loggedInUserJson.data.token);
            alert(loggedInUserJson.message);
            window.location.href = 'http://localhost:4000/home.html';
        }
    } catch(error){
        alert("There is an error in Loggin")
    }
}


