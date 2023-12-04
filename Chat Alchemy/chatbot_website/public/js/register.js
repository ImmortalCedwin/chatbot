
const login_btn = document.getElementById("login_btn");
const register_btn = document.getElementById("register_btn");

function open_login_page() {
    window.location.href = "http://localhost:3000/Login";
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()); 
}

login_btn.addEventListener("click", () => {
    open_login_page();
});

function authenticate_registration(user_name, password, password_confirm, email) {
    if (user_name.length < 4) {
        return "Name must be atleast 4 characters long";
    }   else 
    if (password.length < 6) {
        return "Password must be atlest 6 characters long";
    }   else
    if (password != password_confirm) {
        return "Passwords do not match";
    }   else
    if (!validateEmail(email)) {
        return "Enter correct email"
    }   else    {
        return true;
    }
}

register_btn.addEventListener("click", () => {
    const user_name = document.getElementById("user_name").value;
    const password = document.getElementById("password").value;
    const password_confirm = document.getElementById("password_confirm").value;
    const email = document.getElementById("email").value;
    
    const output = authenticate_registration(user_name, password, password_confirm, email);
    if (output == true) {

        fetch("/CreateUser", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({email, password}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.account == true) {
                console.log("user: " + data.user);
                document.getElementById("register_form").reset()
                alert("Account Created !");
            }   else    {
                alert(data.error_code);
                console.log("error message: " + data.error_message);
            }
        })

    }   else    {
        alert(output);
    }
    
})
