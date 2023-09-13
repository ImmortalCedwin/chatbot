
var vid = document.getElementById("bg_blue");
vid.playbackRate = 0.3;

function send_message() {

  var text = document.getElementById("user_input").value;

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
    body: JSON.stringify({ message: text}),
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

  var input = document.getElementById("user_input");
  input.value = "";

}

var btn = document.getElementById("user_input");

btn.addEventListener("keypress", function(event) {
  if(event.key === "Enter" && btn.value != "") {
    send_message();
  }
});
