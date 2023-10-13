const showdown = require('showdown');
const converter = new showdown.Converter();     // this is to convert markup to html

const { markdownToTxt } = require('markdown-to-txt');

const express = require("express");
const app = express();

const ai = require('./public/js/ai_resource.js');

const { TextServiceClient } = require("@google-ai/generativelanguage");
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME_TEXT = "models/text-bison-001";
const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "";

const client = new DiscussServiceClient({
	authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const client_text = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

var mode = "Question Answer";
var current_mode = mode;

const messages = [];

async function ai_response(input) {
  
    var context;
    var examples;
    var temprature;
    var promptString;

    if (current_mode == mode) {

        // if the mode is the same it will go here

        switch (mode) {
            case "Question Answer":
                context = ai.context_qa;
                examples = ai.examples_qa;
                temprature = 0.3;
                break;
    
            case "Doctor":
                context = ai.context_doctor;
                examples = ai.examples_doctor;
                temprature = 0.3;
                break;
    
            case "Friend":
                context = ai.context_friend;
                examples = ai.examples_friend;
                temprature = 0.9;
                break;

            case "DMC":
                promptString = ai.dmc_main(input);
                temprature = 0.15;
                break;
            
            case "DMC Syllabus":
                promptString = ai.dmc_syllabus(input);
                temprature = 0.15;
                break;
    
            default:
                console.log("Mode Error"); // the code will ideally never reach here
                break;
        }

    }   else    {

        // if the mode gets changed then it will come here
        // here we just clear the old messages array and change the parameters

        current_mode = mode;
        messages.length = 0;

        switch (mode) {
            case "Question Answer":
                context = ai.context_qa;
                examples = ai.examples_qa;
                temprature = 0.3;
                break;
    
            case "Doctor":
                context = ai.context_doctor;
                examples = ai.examples_doctor;
                temprature = 0.3;
                break;
    
            case "Friend":
                context = ai.context_friend;
                examples = ai.examples_friend;
                temprature = 0.9;
                break;

            case "DMC":
                promptString = ai.dmc_main(input);
                temprature = 0.15;
                break;

            case "DMC Syllabus":
                promptString = ai.dmc_syllabus(input);
                temprature = 0.15;
                break;
    
            default:
                console.log("Mode Error"); // the code will ideally never reach here
                break;
        }

    }

    if (mode == "Question Answer" || mode == "Doctor" || mode == "Friend") {

        messages.push({ "content": `${input}` });

        const result = await client.generateMessage({
            model: MODEL_NAME,
            temperature: temprature,
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

        const html = converter.makeHtml(content);

        return html

    }   else if (mode == "DMC" || mode == "DMC Syllabus") {

        const result = await client_text.generateText({
            model: MODEL_NAME_TEXT,
            temperature: temprature,
            candidateCount: 1,
            top_k: 40,
            top_p: 0.95,
            max_output_tokens: 1024,
            
            safety_settings: [{"category":"HARM_CATEGORY_DEROGATORY","threshold":1},{"category":"HARM_CATEGORY_TOXICITY","threshold":1},{"category":"HARM_CATEGORY_VIOLENCE","threshold":2},{"category":"HARM_CATEGORY_SEXUAL","threshold":2},{"category":"HARM_CATEGORY_MEDICAL","threshold":2},{"category":"HARM_CATEGORY_DANGEROUS","threshold":2}],
            prompt: {
                text: promptString,
            },
        })
        
        const json = JSON.stringify(result);
        const obj = JSON.parse(json);
        const content =  obj[0].candidates[0].output
        
        const html = converter.makeHtml(content);

        return html

    }

};

async function debug_code(code) {

    const code_input = ai.input_code(code);

    const result = await client_text.generateText({
        model: MODEL_NAME_TEXT,
        temperature: 0.2,
        candidateCount: 1,
        top_k: 40,
        top_p: 0.95,
        max_output_tokens: 1024,
        
        safety_settings: [{"category":"HARM_CATEGORY_DEROGATORY","threshold":1},{"category":"HARM_CATEGORY_TOXICITY","threshold":1},{"category":"HARM_CATEGORY_VIOLENCE","threshold":2},{"category":"HARM_CATEGORY_SEXUAL","threshold":2},{"category":"HARM_CATEGORY_MEDICAL","threshold":2},{"category":"HARM_CATEGORY_DANGEROUS","threshold":2}],
        prompt: {
            text: code_input,
        },
    })

    const json = JSON.stringify(result);
    const obj = JSON.parse(json);
    const content =  obj[0].candidates[0].output
    
    const text = markdownToTxt(content);

    return text

}

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
    mode = req.body.mode;

    const content = await ai_response(message);

    res.json({response:content});
});

app.post("/SendCode", async (req,res) => {
    const code = req.body.debug_code;

    const debugged_code = await debug_code(code);

    res.json({response:debugged_code});
})

app.listen(3000);