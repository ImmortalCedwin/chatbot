
var vid = document.getElementById("bg_blue");
vid.playbackRate = 0.3;

function send_message() {
  var text = document.getElementById("user_input").value;
  document.getElementById("text_area").insertAdjacentHTML("beforeend", "<p class = 'message_human'>" + text + "</p>" + "<p class = 'subtext_human'>" + "Cedwin" + "</p>");

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
    document.getElementById("text_area").insertAdjacentHTML("beforeend", "<p class = 'message_ai'>" + ai_response + "</p>" + "<p class = 'subtext_ai'>" + "Ai" + "</p>");
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
