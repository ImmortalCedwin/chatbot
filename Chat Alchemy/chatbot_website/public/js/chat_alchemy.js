
function load_home_page() {
    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "none";
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

    fetch('/SendMessage', {
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
        document.getElementById("text_area").insertAdjacentHTML("beforeend", "<p class = 'subtext_ai'>" + "Ai" + "</p>" + "<div class = 'message_ai'>" + ai_response + "</div>");
        const container = document.getElementById("text_area");
        container.scrollTop = container.scrollHeight;
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

    fetch('/SendCode', {
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

    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "grid";
}

function display_chat() {
    const chat_box = document.getElementById("chat_box");
    chat_box.style.display = "grid";

    const debug_box = document.getElementById("debug_box");
    debug_box.style.display = "none";
}

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

const send_message_btn = document.getElementById("send_message");

send_message_btn.addEventListener("click", () => {
    send_message();
});


const user_input_message = document.getElementById("user_input_message");

user_input_message.addEventListener("keypress", function(event) {
    if(event.key === "Enter" && user_input_message.value != "") {
        send_message();
    }
});
