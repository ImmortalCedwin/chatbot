
let i = 0;
let text = "Chat Alchemy";
let speed = 120;

addEventListener("load", () => {
    type_writer();
})

function type_writer() {
    if (i < text.length) {
        document.getElementById("page_title").innerHTML += text.charAt(i);
        i++;
        setTimeout(type_writer, speed);
    }
}

const register_btn = document.getElementById("register_btn");

register_btn.addEventListener("click", () => {
    open_registration_page()
})

function open_registration_page() {
    window.location.href = "/Register";
}

const submit_btn = document.getElementById("submit_btn");

submit_btn.addEventListener("click", () => {
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/AuthenticateUserEmail", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({email, password}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.login_check == true) {
            console.log(data.user);

            window.location.href = "/ChatAlchemy"
        }   else    {
            alert(data.error_code);
            console.log(data.error_message);
        }
    })

})
