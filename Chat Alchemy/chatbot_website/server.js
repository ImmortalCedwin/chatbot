
const showdown = require('showdown');
const converter = new showdown.Converter();     // this is to convert markup to html

const { markdownToTxt } = require('markdown-to-txt');

const express = require("express");
const app = express();


// Firebase Code for database
/*
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");


const service_account = require("./public/js/firebase_cred.json");

initializeApp({
    credential: cert(service_account)
})

const db = getFirestore();
*/

const { getAuth, signInWithCredential, GoogleAuthProvider,
        signOut, onAuthStateChanged, createUserWithEmailAndPassword,
        signInWithEmailAndPassword } = require("firebase/auth");

const { initializeApp } = require("firebase/app");

const firebaseConfig = {
    apiKey: "AIzaSyBKQsL1Q9exxc-EcOdwcfusKjE90oKaOAA",
    authDomain: "chat-alchemy-fe455.firebaseapp.com",
    databaseURL: "https://chat-alchemy-fe455-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chat-alchemy-fe455",
    storageBucket: "chat-alchemy-fe455.appspot.com",
    messagingSenderId: "657561356464",
    appId: "1:657561356464:web:7e68c225ea11235c411375",
    measurementId: "G-CXJDGVNG63"
};

const firebase = initializeApp(firebaseConfig);

const auth = getAuth(firebase);

const ai = require('./public/js/ai_resource.js');

const { TextServiceClient } = require("@google-ai/generativelanguage");
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME_TEXT = "models/text-bison-001";
const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyDUoEjt1TuSBUqkH8YYL30rnQZQGvvPJbg";

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

async function generate_email(email, style, length) {
    const mail = ai.input_email(style,length,email)

    const result = await client_text.generateText({
        model: MODEL_NAME_TEXT,
        temperature: 0.7,
        candidateCount: 1,
        top_k: 40,
        top_p: 0.95,
        max_output_tokens: 1024,
        
        safety_settings: [{"category":"HARM_CATEGORY_DEROGATORY","threshold":1},{"category":"HARM_CATEGORY_TOXICITY","threshold":1},{"category":"HARM_CATEGORY_VIOLENCE","threshold":2},{"category":"HARM_CATEGORY_SEXUAL","threshold":2},{"category":"HARM_CATEGORY_MEDICAL","threshold":2},{"category":"HARM_CATEGORY_DANGEROUS","threshold":2}],
        prompt: {
            text: mail,
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

    try {

        const message = req.body.message;
        mode = req.body.mode;

        const content = await ai_response(message);

        res.json({response:content});

    } catch (error) {

        const content = "Error";
        res.json({response:content});

        console.log(error);

    }
    
});

app.post("/SendCode", async (req,res) => {
    const code = req.body.debug_code;

    const debugged_code = await debug_code(code);

    res.json({response:debugged_code});
})

app.post("/SendMail", async (req,res) => {
    const email = req.body.email;
    const style = req.body.style;
    const length = req.body.length;

    const mail = await generate_email(email, style, length);

    res.json({response:mail});
})

app.post("/AuthenticateUserGoogle", (req,res) => {

    var login_condition = false;

    const id_token = req.body.token;

    const credential = GoogleAuthProvider.credential(id_token);

    const auth = getAuth(firebase);

    signInWithCredential(auth, credential)
    .then((user) => {
        login_condition = true;
        console.log("login successful");
        //console.log(user);

        res.json({login_check:login_condition});
    })
    .catch((error) => {

        const errorCode = error.code;
        console.log(errorCode);

        const errorMessage = error.message;
        console.log(errorMessage);

        const email = error.customData.email;
        console.log(email);
        
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(credential);
    });

})

app.post("/AuthenticateUserEmail", (req,res) => {

    var login_condition = false

    const email = req.body.email;
    const password = req.body.password;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;

        login_condition = true;

        res.json({login_check:login_condition, user:user});
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        res.json({error_code:errorCode, error_message:errorMessage});
    });

})

app.post("/SignOutUser", (req,res) => {

    var condition = "sign_out";

    const auth = getAuth(firebase);
    signOut(auth).then(() => {
        console.log("sign out successful");

        res.json({response:condition});
    }).catch((error) => {
        console.log(error);

        res.json({error_message:error})
    });
})

app.post("/CreateUser", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    var account_created = false

    createUserWithEmailAndPassword(auth, email, password)
        .then((user_credential) => {
            const user = user_credential.user;
            account_created = true

            res.json({user:user, account:account_created});
        })
        .catch((error) => {
            const error_code = error.code;
            const error_message = error.message;

            res.json({error_code:error_code, error_message:error_message});
        })
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        //console.log("user is signed in");
        //console.log(user.displayName);
        //console.log(user.email);
    }   else    {
        //console.log("user is signed out");
    }
})

app.listen(3000);