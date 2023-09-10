
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
// Enter API key here
const API_KEY = "";

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const context = "You are a chatbot who answers questions.";
const examples = [
  {
    "input": {
      "content": "who is the best chess player ?"
    },
    "output": {
      "content": "The best chess player is Magnus Carlsen."
    }
  },
  {
    "input": {
      "content": "what is the earth's volume ?"
    },
    "output": {
      "content": "The Earth's volume is approximately 1.08321×1012 cubic kilometers (2.609×1011 cubic miles)."
    }
  },
  {
    "input": {
      "content": "which is the rarest material on earth ?"
    },
    "output": {
      "content": "The rarest material on Earth is osmium. It is a very dense, hard, brittle, bluish-white metal that is found in very small amounts in the Earth's crust. Osmium is used in some alloys, such as platinum-iridium alloys, and it is also used in fountain pen nibs."
    }
  },
  {
    "input": {
      "content": "which is the fastest car on earth ?"
    },
    "output": {
      "content": "The fastest car on Earth is the Bugatti Chiron Super Sport 300+, which has a top speed of 304.77 mph (490.48 kph)."
    }
  },
  {
    "input": {
      "content": "give me the top five countries by gdp"
    },
    "output": {
      "content": "The top five countries by GDP are the United States, China, Japan, Germany, and the United Kingdom."
    }
  },
  {
    "input": {
      "content": "who is the current president of the united states"
    },
    "output": {
      "content": "The current president of the United States is Joe Biden."
    }
  },
  {
    "input": {
      "content": "give me 10 facts about carbon"
    },
    "output": {
      "content": "Here are 10 facts about carbon:\n\n1. Carbon is the fourth most abundant element in the universe.\n2. Carbon is the only element that can form four covalent bonds with itself.\n3. Carbon is the basis of all organic compounds.\n4. Carbon is found in all living things.\n5. Carbon is used to make steel, plastics, and other materials.\n6. Carbon is a major component of fossil fuels, such as coal, oil, and natural gas.\n7. Carbon dioxide is a greenhouse gas that contributes to climate change.\n8. Carbon monoxide is a poisonous gas that can cause death.\n9. Carbon-14 is a radioactive isotope of carbon that is used to date fossils and other objects.\n10. Carbon is a key element in the carbon cycle, which is the process by which carbon moves through the environment."
    }
  }
];
const messages = [];

async function ai_response(input) {
  var text_input = input

  messages.push({ "content": `${text_input}` });

  const result = await client.generateMessage({
    model: MODEL_NAME,
    temperature: 0.3,
    candidateCount: 1,
    top_k: 40,
    top_p: 0.95,
    prompt: {
      context: context,
      examples: examples,
      messages: messages,
    },
  });

  const json = JSON.stringify(result);
  const obj = JSON.parse(json);
  const content =  obj[0].candidates[0].content;

  return content;

  };

const express = require("express");
const app = express();

app.use(express.json());

app.use(express.static('C:/Programming/Projects/Chat Alchemy/chatbot_website/public'))

app.set("view engine", "ejs");

app.get('/Login', (req,res) => {
  res.render("C:/Programming/Projects/Chat Alchemy/chatbot_website/login.ejs");
})

app.get('/Register', (req,res) => {
  res.render("c:/Programming/Projects/Chat Alchemy/chatbot_website/register.ejs");
})

app.get('/ChatAlchemy', (req,res) => {
  res.render("C:/Programming/Projects/Chat Alchemy/chatbot_website/chat_alchemy.ejs");
})

app.post('/SendMessage', async (req,res) => {
  const message = req.body.message;

  const response = await ai_response(message);

  res.json({response});
});

app.listen(3000);