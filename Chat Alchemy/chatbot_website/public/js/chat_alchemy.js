
//import { getAuth, signOut } from "firebase/auth";

function load_home_page() {
    const debug_box = document.getElementById("debug_box");
    const email_box = document.getElementById("email_box");

    debug_box.style.display = "none";
    email_box.style.display = "none";
}

load_home_page();

function send_message() {

    const mode_value = document.getElementById("select_mode").value;

    var text = document.getElementById("user_input_message").value;

    document.getElementById("text_area").insertAdjacentHTML("beforeend", "<p class = 'subtext_human'>" + "Cedwin" + "</p>" + "<p class = 'message_human'>" + text + "</p>");

    const type = document.createElement('div');
    type.classList.add("message_ai")
    type.innerHTML = "Typing...";
    document.getElementById("text_area").appendChild(type);

    const container = document.getElementById("text_area");
    container.scrollTop = container.scrollHeight;

    fetch("/SendMessage", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text, mode:mode_value}),
    })
    .then(response => response.json())
    .then(data => {
        const ai_response = data.response;
        //console.log(ai_response);
        document.getElementById("text_area").removeChild(type);

        const container = document.getElementById("text_area");

        let index = 0;
        const speed = 20;
        var code_check = 0;
        var html = "";

        function type_writer() {
            if (index < ai_response.length) {

                if (code_check == 2) {
                    code_check = 0;
                }

                if (ai_response[index] == "<") {
                    code_check = 1;
                }   else if (ai_response[index] == ">") {
                    code_check = 2;
                }

                if (code_check == 1) {
                    html += ai_response[index]
                }   else if (code_check == 2) {
                    html += ai_response[index]
                    document.querySelector(".message_ai:last-of-type").insertAdjacentHTML("beforeend", html);
                    html = "";
                }

                if (code_check == 0) {
                    document.querySelector(".message_ai:last-of-type").insertAdjacentHTML("beforeend", ai_response[index]);
                }
                
                container.scrollTop = container.scrollHeight;
                
                index++;
                setTimeout(type_writer, speed);
            }
        }
        document.getElementById("text_area").insertAdjacentHTML("beforeend", "<p class = 'subtext_ai'>" + "Ai" + "</p>" + "<div class = 'message_ai'></div>");
        type_writer();
        
    })

    .catch(error => {
    console.error("Error sending message: ", error);
    });

    var input = document.getElementById("user_input_message");
    input.value = "";

}

function debug() {

    const code = document.getElementById("debug_code_text").value;

    if (code == "") {
        return
    }

    fetch("/SendCode", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({debug_code:code}),
    })
    .then(response => response.json())
    .then(data => {
        const result = document.getElementById("debug_solution_text");
        console.log(data.response);
        result.innerHTML = data.response;
    })
    
}

function clear() {
    const code = document.getElementById("debug_code_text").value = "";
    const debugged_code = document.getElementById("debug_solution_text").innerHTML = "";
}

function copy() {
    const code = document.getElementById("debug_solution_text").value;

    if (code == "") {
        return
    }

    document.addEventListener("copy", (event) => {
      event.clipboardData.setData('text/plain', code);
      event.preventDefault(); 
      alert("Text Copied !");
    });
    document.execCommand("copy");
}

function display_debug() {
    const chat_box = document.getElementById("chat_box");
    chat_box.style.display = "none";

    const email_box = document.getElementById("email_box");
    email_box.style.display = "none";

    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "grid";
}

function display_chat() {
    const chat_box = document.getElementById("chat_box");
    chat_box.style.display = "grid";

    const email_box = document.getElementById("email_box");
    email_box.style.display = "none";

    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "none";
}

function display_email_generator() {
    const chat_box = document.getElementById("chat_box");
    chat_box.style.display = "none";

    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "none";

    const email_box = document.getElementById("email_box");
    email_box.style.display = "grid";

}

function sign_out() {
    var message = "testing";
    fetch("/SignOutUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({test: message}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.response == "sign_out") {
            window.location.href = "http://localhost:3000/Login";
        }   else    {
            alert(data.error_message);
        }
    } )
}

const home_btn = document.getElementById("home_btn");
home_btn.addEventListener("click", () => {
    display_chat();
})

const send_message_btn = document.getElementById("send_message");
send_message_btn.addEventListener("click", () => {
    send_message();
});

const debug_btn = document.getElementById("debug_btn");
debug_btn.addEventListener("click", () => {
    display_debug();
});

const submit_btn = document.getElementById("submit_btn");
submit_btn.addEventListener("click", () => {
    debug();
})

const clear_btn = document.getElementById("clear_btn");
clear_btn.addEventListener("click", () => {
    clear();
})

const copy_btn = document.getElementById("copy_btn");
copy_btn.addEventListener("click", () => {
    copy();
})

const email_generator_btn = document.getElementById("email_generator_btn");
email_generator_btn.addEventListener("click", () => {
    display_email_generator();
})

const sign_out_btn = document.getElementById("sign_out_btn");
sign_out_btn.addEventListener("click", () => {
    sign_out();
})

// Email Code

function send_email() {
    var email_text = document.getElementById("email_prompt").value;

    fetch('/SendMail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email_text, style:style, length:length}),
    })
    .then(response => response.json())
    .then(data => {
        const result = document.getElementById("email_result");
        console.log(data.response);
        result.innerHTML = data.response;
    })
}

var style = "";
var length = "";

const style_professional = document.getElementById("style_professional");
style_professional.addEventListener("click", () => {
    style = "professional";

    const all_btn = document.getElementsByClassName("email_options_btn");

    for(let i = 0; i <= 3; i++) {
        all_btn[i].style.backgroundColor = "black";
        all_btn[i].style.color = "white";
    }

    style_professional.style.backgroundColor = "rgb(162, 236, 236)";
    style_professional.style.color = "black";

})

const style_casual = document.getElementById("style_casual");
style_casual.addEventListener("click", () => {
    style = "casual";

    const all_btn = document.getElementsByClassName("email_options_btn");

    for(let i = 0; i <= 3; i++) {
        all_btn[i].style.backgroundColor = "black";
        all_btn[i].style.color = "white";
    }

    style_casual.style.backgroundColor = "rgb(162, 236, 236)";
    style_casual.style.color = "black";

})

const style_informational = document.getElementById("style_informational");
style_informational.addEventListener("click", () => {
    style = "informational";

    const all_btn = document.getElementsByClassName("email_options_btn");

    for(let i = 0; i <= 3; i++) {
        all_btn[i].style.backgroundColor = "black";
        all_btn[i].style.color = "white";
    }

    style_informational.style.backgroundColor = "rgb(162, 236, 236)";
    style_informational.style.color = "black";

})

const style_funny = document.getElementById("style_funny");
style_funny.addEventListener("click", () => {
    style = "funny";

    const all_btn = document.getElementsByClassName("email_options_btn");

    for(let i = 0; i <= 3; i++) {
        all_btn[i].style.backgroundColor = "black";
        all_btn[i].style.color = "white";
    }

    style_funny.style.backgroundColor = "rgb(162, 236, 236)";
    style_funny.style.color = "black";

})

const length_short = document.getElementById("length_short");
length_short.addEventListener("click", () => {
    length = "short";

    const all_btn = document.getElementsByClassName("email_options_btn");

    for(let i = 4; i <= 6; i++) {
        all_btn[i].style.backgroundColor = "black";
        all_btn[i].style.color = "white";
    }

    length_short.style.backgroundColor = "rgb(162, 236, 236)";
    length_short.style.color = "black";
})

const length_medium = document.getElementById("length_medium");
length_medium.addEventListener("click", () => {
    length = "medium";

    const all_btn = document.getElementsByClassName("email_options_btn");

    for(let i = 4; i <= 6; i++) {
        all_btn[i].style.backgroundColor = "black";
        all_btn[i].style.color = "white";
    }

    length_medium.style.backgroundColor = "rgb(162, 236, 236)";
    length_medium.style.color = "black";
})

const length_long = document.getElementById("length_long");
length_long.addEventListener("click", () => {
    length = "long";

    const all_btn = document.getElementsByClassName("email_options_btn");

    for(let i = 4; i <= 6; i++) {
        all_btn[i].style.backgroundColor = "black";
        all_btn[i].style.color = "white";
    }

    length_long.style.backgroundColor = "rgb(162, 236, 236)";
    length_long.style.color = "black";
})

const email_prompt = document.getElementById("email_prompt");
email_prompt.addEventListener("keypress", function(event) {
    if(event.key === "Enter" && email_prompt.value != "") {
        if (style != "" && length != "") {
            send_email();
        }   else    {
            alert("Option not selected")
        }
    }
})

// Misc Code

var vid = document.getElementById("bg_blue");
vid.playbackRate = 0.3;

var select_mode = document.getElementById("select_mode");
var previous_mode = select_mode.value;

select_mode.addEventListener("click", () => {
    if (previous_mode != select_mode.value) {
        display_chat();
        document.getElementById("text_area").innerHTML = "";
        previous_mode = select_mode.value;
    }   else    {
        display_chat();
    }
})

const user_input_message = document.getElementById("user_input_message");

user_input_message.addEventListener("keypress", function(event) {
    if(event.key === "Enter" && user_input_message.value != "") {
        send_message();
    }
});
