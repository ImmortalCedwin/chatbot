
if (sessionStorage.getItem("login_check") == null || sessionStorage.getItem("login_check") == "false") {
    window.location.href = "/Login";
}   else    {
    var user_name = sessionStorage.getItem("user_name");
    var email = sessionStorage.getItem("email");
    var user_profile_image = sessionStorage.getItem("user_profile_image");
    var provider = sessionStorage.getItem("provider");

    fetch("/GetSettings", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({user_name})
    })
    .then(response => response.json())
    .then(data => {
        sessionStorage.setItem("typing_mode", String(data.typing_mode));
    })

    fetch("/GetTheme", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({user_name})
    })
    .then(response => response.json())
    .then(data => {
        sessionStorage.setItem("theme", String(data.theme));
        if (data.theme == "Light") {
            change_style("css/light_theme.css")
        }   else
        if (data.theme == "Default") {
            change_style("css/chat_alchemy.css");
        }
    })
}

// it loads all the pages by default so im hiding the other pages
function load_home_page() {
    const debug_box = document.getElementById("debug_box");
    const email_box = document.getElementById("email_box");
    const translate_box = document.getElementById("translate_box");
    const settings_box = document.getElementById("settings_box");

    debug_box.style.display = "none";
    email_box.style.display = "none";
    translate_box.style.display = "none"
    settings_box.style.display = "none";
}

load_home_page();

function get_mode() {
    const mode_value = document.getElementById("select_mode").value;

    return mode_value
}

function get_messages(mode_value) {

    var mode_name = get_mode()

    fetch("/GetMessagesFromDatabase", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({mode_value, user_name})
    })
    .then(response => response.json())
    .then(data => {
        const messages = data.messages;
        for(let i = 1; i <= messages.length; i++) {
            if (i % 2 == 0) {
                document.getElementById("text_area").insertAdjacentHTML("beforeend", "<p class = 'subtext_ai'>" + mode_name + "</p>" + "<div class = 'message_ai'>" + messages[i-1] + "</div>");
            }   else    {
                if (provider == "google.com") {
                    document.getElementById("text_area").insertAdjacentHTML("beforeend", "<img class = 'user_image_google' src = '"+user_profile_image+"'>" + "<p class = 'subtext_human'>" + user_name + "</p>" + "<p class = 'message_human'>" + messages[i-1] + "</p>");
                }
                else {
                    document.getElementById("text_area").insertAdjacentHTML("beforeend", "<p class = 'subtext_human'>" + user_name + "</p>" + "<p class = 'message_human'>" + messages[i-1] + "</p>");
                }
            }
        }
    })
}

window.onload = function load_messages() {
    if (user_name == "error_name") {
        window.location.href = "/Login";
    }   else    {
        get_messages(get_mode());
    }
}

const mode = document.getElementById("select_mode");

mode.addEventListener("change", () => {
    var mode_value = get_mode();

    get_messages(mode_value);
})

function send_message() {

    const mode_value = document.getElementById("select_mode").value; // this is the chat mode

    var text = document.getElementById("user_input_message").value;

    if (provider == "google.com") {
        document.getElementById("text_area").insertAdjacentHTML("beforeend", "<img class = 'user_image_google' src = '"+user_profile_image+"'>" + "<p class = 'subtext_human'>" + user_name + "</p>" + "<p class = 'message_human'>" + text + "</p>");
    }
    else {
        document.getElementById("text_area").insertAdjacentHTML("beforeend", "<p class = 'subtext_human'>" + user_name + "</p>" + "<p class = 'message_human'>" + text + "</p>");
    }

    // this is to create the "Typing..." message when the ai is processing
    const type = document.createElement('div');
    type.classList.add("message_ai")
    type.innerHTML = "Typing...";
    document.getElementById("text_area").appendChild(type);

    // scroll when the message exceeds the container height
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
        document.getElementById("text_area").removeChild(type);

        const container = document.getElementById("text_area");

        fetch("/SendMessageToDatabase", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({user_message:text, ai_response, mode:mode_value, user_name})
        })

        //handling typing mode

        switch (sessionStorage.getItem("typing_mode")) {
            case "type":
                let index = 0;
                const speed = 2;   // lower is faster
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
                document.getElementById("text_area").insertAdjacentHTML("beforeend", "<p class = 'subtext_ai'>" + mode_value + "</p>" + "<div class = 'message_ai'></div>");
                type_writer();
                break;

            case "block":
                document.getElementById("text_area").insertAdjacentHTML("beforeend", "<p class = 'subtext_ai'>" + mode_value + "</p>" + "<div class = 'message_ai'>" + ai_response + "</div>");
                container.scrollTop = container.scrollHeight;
            default:
                break;
        }

    })

    .catch(error => {
        console.error("Error sending message: ", error);
    });

    var input = document.getElementById("user_input_message");
    input.value = "";

}

function delete_message() {

    fetch("/DeleteMessages", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({mode:mode.value, user_name})
    })
    .then(response => response.json())
    .then(data => {
        alert(data.response);
        const text_area = document.getElementById("text_area").innerHTML = "";
    })
}

const delete_messages_btn = document.getElementById("delete_messages_btn");
delete_messages_btn.addEventListener("click", () => {
    delete_message();
})

function set_typing_to_type() {

    var new_mode = "type";

    if (sessionStorage.getItem("typing_mode") == "type") {
        return
    }   else    {
        fetch("/UpdateTypingMode", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({user_name,new_mode})
        })
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem("typing_mode", String(data.typing_mode));
        })
        const type = document.getElementById("typing_btn");
        const block = document.getElementById("block_btn");

        if (sessionStorage.getItem("theme") == "Light") {
            type.style.backgroundColor = "black";
            type.style.color = "white";
            block.style.backgroundColor = "white";
            block.style.color = "black";    
        }   else    {
            type.style.backgroundColor = "white";
            type.style.color = "black";
            block.style.backgroundColor = "black";
            block.style.color = "white";
        }
        
    }
}

function set_typing_to_block() {
    
    var new_mode = "block"

    if (sessionStorage.getItem("typing_mode") == "block") {
        return
    }   else    {
        fetch("/UpdateTypingMode", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({user_name,new_mode})
        })
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem("typing_mode", String(data.typing_mode));
        })
        const block = document.getElementById("block_btn");
        const type = document.getElementById("typing_btn");

        if(sessionStorage.getItem("theme") == "Light") {
            block.style.backgroundColor = "black";
            block.style.color = "white";
            type.style.backgroundColor = "white";
            type.style.color = "black";
        }   else    {
            block.style.backgroundColor = "white";
            block.style.color = "black";
            type.style.backgroundColor = "black";
            type.style.color = "white";
        }

        
    }
}

function update_theme(new_theme) {

    fetch("/UpdateTheme", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({user_name,new_theme})
    })
    .then(response => response.json())
    .then(data => {
        sessionStorage.setItem("theme", String(data.theme));
        display_settings();
    })
}

function translate() {

    const lang_1 = document.getElementById("language_select_1").value;
    const lang_2 = document.getElementById("language_select_2").value;

    const text = document.getElementById("translate_from_text").value;

    document.getElementById("translate_to_text").innerHTML = "Processing..."

    if (text == "") {
        return
    }

    fetch("/Translate", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({lang_1,lang_2,text}),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("translate_to_text").innerHTML = data.translated_text;
    })
}

function translate_clear() {
    document.getElementById("translate_from_text").value = "";
    document.getElementById("translate_to_text").innerHTML = "";
}

function translate_copy() {
    const text = document.getElementById("translate_to_text").value;

    if (text == "") {
        return
    }

    document.addEventListener("copy", (event) => {
      event.clipboardData.setData('text/plain', text);
      event.preventDefault(); 
      alert("Text Copied !");
    });
    document.execCommand("copy");
}

function debug() {

    const code = document.getElementById("debug_code_text").value;

    document.getElementById("debug_solution_text").innerHTML = "Processing..."

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
    document.getElementById("debug_code_text").value = "";
    document.getElementById("debug_solution_text").innerHTML = "";
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

// display pages by hiding the other pages

function display_chat() {
    
    const email_box = document.getElementById("email_box");
    email_box.style.display = "none";

    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "none";

    const translate_box = document.getElementById("translate_box");
    translate_box.style.display = "none";

    const settings_box = document.getElementById("settings_box");
    settings_box.style.display = "none";

    const chat_box = document.getElementById("chat_box");
    chat_box.style.display = "grid";

}

function display_debug() {

    const chat_box = document.getElementById("chat_box");
    chat_box.style.display = "none";

    const email_box = document.getElementById("email_box");
    email_box.style.display = "none";

    const translate_box = document.getElementById("translate_box");
    translate_box.style.display = "none";

    const settings_box = document.getElementById("settings_box");
    settings_box.style.display = "none";

    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "grid";

}

function display_email_generator() {

    const chat_box = document.getElementById("chat_box");
    chat_box.style.display = "none";

    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "none";

    const translate_box = document.getElementById("translate_box");
    translate_box.style.display = "none";

    const settings_box = document.getElementById("settings_box");
    settings_box.style.display = "none";

    const email_box = document.getElementById("email_box");
    email_box.style.display = "grid";

}

function display_translation() {

    const chat_box = document.getElementById("chat_box");
    chat_box.style.display = "none";

    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "none";

    const email_box = document.getElementById("email_box");
    email_box.style.display = "none";

    const settings_box = document.getElementById("settings_box");
    settings_box.style.display = "none";

    const translate_box = document.getElementById("translate_box");
    translate_box.style.display = "grid";
    
}

function display_settings() {

    const chat_box = document.getElementById("chat_box");
    chat_box.style.display = "none";

    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "none";

    const email_box = document.getElementById("email_box");
    email_box.style.display = "none";

    const translate_box = document.getElementById("translate_box");
    translate_box.style.display = "none";

    const settings_box = document.getElementById("settings_box");
    settings_box.style.display = "grid";

    fetch("/GetSettings", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({user_name})
    })
    .then(response => response.json())
    .then(data => {
        sessionStorage.setItem("typing_mode", String(data.typing_mode))

        const block = document.getElementById("block_btn");
        const type = document.getElementById("typing_btn");

        if (sessionStorage.getItem("typing_mode") == "type" && sessionStorage.getItem("theme") == "Default") {
            
            type.style.backgroundColor = "white";
            type.style.color = "black";

            block.style.backgroundColor = "black";
            block.style.color = "white";

        }   else
        if (sessionStorage.getItem("typing_mode") == "block" && sessionStorage.getItem("theme") == "Default") {

            block.style.backgroundColor = "white";
            block.style.color = "black";

            type.style.backgroundColor = "black";
            type.style.color = "white";

        }   else
        if (sessionStorage.getItem("typing_mode") == "type" && sessionStorage.getItem("theme") == "Light") {
            
            type.style.backgroundColor = "black";
            type.style.color = "white";

            block.style.backgroundColor = "white";
            block.style.color = "black";

        }   else
        if (sessionStorage.getItem("typing_mode") == "block" && sessionStorage.getItem("theme") == "Light") {

            block.style.backgroundColor = "black";
            block.style.color = "white";
            
            type.style.backgroundColor = "white";
            type.style.color = "black";

        }

    })

    const theme_select = document.getElementById("select_theme");
    theme_select.value = sessionStorage.getItem("theme");
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
            window.location.href = "/Login";
        }   else    {
            alert(data.error_message);
        }
    } )
}

// buttons mapped to functions when clicked

const send_message_btn = document.getElementById("send_message");
const user_input_message = document.getElementById("user_input_message");

send_message_btn.addEventListener("click", () => {
    if (user_input_message.value != "") {
        send_message();
    }
});

user_input_message.addEventListener("keypress", function(event) {
    if(event.key === "Enter" && user_input_message.value != "") {
        send_message();
    }
});

const debug_btn = document.getElementById("debug_btn");
debug_btn.addEventListener("click", () => {
    display_debug();
});

const debug_btn_mobile = document.getElementById("debug_btn_mobile")
debug_btn_mobile.addEventListener("click", () => {
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

const translate_submit_btn = document.getElementById("translate_submit_btn");
translate_submit_btn.addEventListener("click", () => {
    translate();
})

const translate_clear_btn = document.getElementById("translate_clear_btn");
translate_clear_btn.addEventListener("click", () => {
    translate_clear();
})

const translate_copy_btn = document.getElementById("translate_copy_btn");
translate_copy_btn.addEventListener("click", () => {
    translate_copy();
})

const email_generator_btn = document.getElementById("email_generator_btn");
email_generator_btn.addEventListener("click", () => {
    display_email_generator();
})

const email_generator_btn_mobile = document.getElementById("email_generator_btn_mobile");
email_generator_btn_mobile.addEventListener("click", () => {
    display_email_generator();
})

const translate_btn = document.getElementById("translate_btn");
translate_btn.addEventListener("click", () => {
    display_translation()
})

const translate_btn_mobile = document.getElementById("translate_btn_mobile");
translate_btn_mobile.addEventListener("click", () => {
    display_translation()
})

const sign_out_btn = document.getElementById("sign_out_btn");
sign_out_btn.addEventListener("click", () => {
    sign_out();
})

const sign_out_btn_mobile = document.getElementById("sign_out_btn_mobile");
sign_out_btn_mobile.addEventListener("click", () => {
    sign_out();
})

const settings_btn = document.getElementById("settings_btn");
settings_btn.addEventListener("click", () => {
    display_settings();
})

const settings_btn_mobile = document.getElementById("settings_btn_mobile");
settings_btn_mobile.addEventListener("click", () => {
    display_settings();
})

const typing_btn = document.getElementById("typing_btn");
typing_btn.addEventListener("click", () => {
    set_typing_to_type();
})

const block_btn = document.getElementById("block_btn");
block_btn.addEventListener("click", () => {
    set_typing_to_block();
})

const email_submit_btn = document.getElementById("email_submit_btn");
email_submit_btn.addEventListener("click", () => {
    if(email_prompt.value != "") {
        if (style != "" && length != "") {
            send_email();
        }   else    {
            alert("Option not selected")
        }
    }
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

function change_style(theme) {
    document.getElementById("style_sheet").setAttribute("href", theme);
}

const style_sheet = document.getElementById("select_theme")
style_sheet.addEventListener("change", () => {
    if (style_sheet.value == "Light") {
        change_style("css/light_theme.css");
        update_theme("Light");
    }   else
    if (style_sheet.value == "Default") {
        change_style("css/chat_alchemy.css");
        update_theme("Default");
    }
})

// Email Code

function send_email() {
    var email_text = document.getElementById("email_prompt").value;

    const result = document.getElementById("email_result");
    result.innerHTML = "Processing..."

    fetch('/SendMail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email_text, style:style, length:length}),
    })
    .then(response => response.json())
    .then(data => {
        
        result.innerHTML = data.response;
    })
}

var style = "";
var length = "";

const style_professional = document.getElementById("style_professional");
style_professional.addEventListener("click", () => {
    style = "professional";

    const all_btn = document.getElementsByClassName("email_options_btn");

    if (sessionStorage.getItem("theme") == "Light") {
        for(let i = 0; i <= 3; i++) {
            all_btn[i].style.backgroundColor = "white";
            all_btn[i].style.color = "black";
        }
    
        style_professional.style.backgroundColor = "black";
        style_professional.style.color = "white";
    }   else    {
        for(let i = 0; i <= 3; i++) {
            all_btn[i].style.backgroundColor = "black";
            all_btn[i].style.color = "white";
        }
    
        style_professional.style.backgroundColor = "white";
        style_professional.style.color = "black";
    }

    

})

const style_casual = document.getElementById("style_casual");
style_casual.addEventListener("click", () => {
    style = "casual";

    const all_btn = document.getElementsByClassName("email_options_btn");

    if (sessionStorage.getItem("theme") == "Light") {
        for(let i = 0; i <= 3; i++) {
            all_btn[i].style.backgroundColor = "white";
            all_btn[i].style.color = "black";
        }
    
        style_casual.style.backgroundColor = "black";
        style_casual.style.color = "white";    
    }   else    {
        for(let i = 0; i <= 3; i++) {
            all_btn[i].style.backgroundColor = "black";
            all_btn[i].style.color = "white";
        }
    
        style_casual.style.backgroundColor = "white";
        style_casual.style.color = "black";    
    }

})

const style_informational = document.getElementById("style_informational");
style_informational.addEventListener("click", () => {
    style = "informational";

    const all_btn = document.getElementsByClassName("email_options_btn");

    if (sessionStorage.getItem("theme") == "Light") {
        for(let i = 0; i <= 3; i++) {
            all_btn[i].style.backgroundColor = "white";
            all_btn[i].style.color = "black";
        }
    
        style_informational.style.backgroundColor = "black";
        style_informational.style.color = "white";    
    }   else    {
        for(let i = 0; i <= 3; i++) {
            all_btn[i].style.backgroundColor = "black";
            all_btn[i].style.color = "white";
        }
    
        style_informational.style.backgroundColor = "white";
        style_informational.style.color = "black";
    }
    
})

const style_funny = document.getElementById("style_funny");
style_funny.addEventListener("click", () => {
    style = "funny";

    const all_btn = document.getElementsByClassName("email_options_btn");

    if (sessionStorage.getItem("theme") == "Light") {
        for(let i = 0; i <= 3; i++) {
            all_btn[i].style.backgroundColor = "white";
            all_btn[i].style.color = "black";
        }
    
        style_funny.style.backgroundColor = "black";
        style_funny.style.color = "white";    
    }   else    {
        for(let i = 0; i <= 3; i++) {
            all_btn[i].style.backgroundColor = "black";
            all_btn[i].style.color = "white";
        }
    
        style_funny.style.backgroundColor = "white";
        style_funny.style.color = "black";
    }

})

const length_short = document.getElementById("length_short");
length_short.addEventListener("click", () => {
    length = "short";

    const all_btn = document.getElementsByClassName("email_options_btn");

    if (sessionStorage.getItem("theme") == "Light") {
        for(let i = 4; i <= 6; i++) {
            all_btn[i].style.backgroundColor = "white";
            all_btn[i].style.color = "black";
        }
    
        length_short.style.backgroundColor = "black";
        length_short.style.color = "white";    
    }   else    {
        for(let i = 4; i <= 6; i++) {
            all_btn[i].style.backgroundColor = "black";
            all_btn[i].style.color = "white";
        }
    
        length_short.style.backgroundColor = "white";
        length_short.style.color = "black";
    }
    
})

const length_medium = document.getElementById("length_medium");
length_medium.addEventListener("click", () => {
    length = "medium";

    const all_btn = document.getElementsByClassName("email_options_btn");

    if (sessionStorage.getItem("theme") == "Light") {
        for(let i = 4; i <= 6; i++) {
            all_btn[i].style.backgroundColor = "white";
            all_btn[i].style.color = "black";
        }
    
        length_medium.style.backgroundColor = "black";
        length_medium.style.color = "white";    
    }   else    {
        for(let i = 4; i <= 6; i++) {
            all_btn[i].style.backgroundColor = "black";
            all_btn[i].style.color = "white";
        }
    
        length_medium.style.backgroundColor = "white";
        length_medium.style.color = "black";
    }
    
})

const length_long = document.getElementById("length_long");
length_long.addEventListener("click", () => {
    length = "long";

    const all_btn = document.getElementsByClassName("email_options_btn");

    if (sessionStorage.getItem("theme") == "Light") {
        for(let i = 4; i <= 6; i++) {
            all_btn[i].style.backgroundColor = "white";
            all_btn[i].style.color = "black";
        }
    
        length_long.style.backgroundColor = "black";
        length_long.style.color = "white";    
    }   else    {
        for(let i = 4; i <= 6; i++) {
            all_btn[i].style.backgroundColor = "black";
            all_btn[i].style.color = "white";
        }
    
        length_long.style.backgroundColor = "white";
        length_long.style.color = "black";    
    }

})

// Misc Code

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

var select_mode_mobile = document.getElementById("select_mode_mobile");

select_mode_mobile.addEventListener("click", () => {
    display_chat();
})

let hamburger = document.querySelector('.hamburger');
let navLinks = document.getElementById('nav-links');
let links = document.querySelectorAll('.links');

//Display links onclick on hamburger
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('hide');
    hamburger.classList.toggle('lines-rotate');
});

//Hide navlink Container onClick any single link
for(let i = 0; i < links.length; i++){
    links[i].addEventListener('click', () => {
        navLinks.classList.toggle('hide');
    });
} 