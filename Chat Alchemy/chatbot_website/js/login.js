
let i = 0;
let text = "Chat Alchemy"
let speed = 120;

function type_writer() {
    if (i < text.length) {
        document.getElementById("page_title").innerHTML += text.charAt(i)
        i++;
        setTimeout(type_writer, speed);
    }
}

function open_registration_page() {
    location.href = "C:/Programming/Projects/Chat Alchemy/chatbot_website/register.html";
}