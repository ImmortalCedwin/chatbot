
const showdown = require('showdown');
const converter = new showdown.Converter();     // this is to convert markup to html

const { markdownToTxt } = require('markdown-to-txt');

const express = require("express");
const app = express();

// Firebase Code for database
const { Timestamp, FieldValue } = require("firebase-admin/firestore");

function firestore() {
    
    const { initializeApp, cert } = require("firebase-admin/app");
    const { getFirestore } = require("firebase-admin/firestore");

    const service_account = require("./public/js/firebase_cred.json");

    initializeApp({
        credential: cert(service_account)
    })

    const db = getFirestore();

    return db
}

const db = firestore();

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

const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold,} = require("@google/generative-ai");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyDnjaNLtw9PwIIKDNaqd0BpqS9KLla3LpI";


var mode = "Question Answer";
var current_mode = mode;

async function ai_response(input) {
  
    var safetySettings = ai.safety_settings;
    var generationConfig;
    var history;
    var promptString;

    if (current_mode == mode) {

        // if the mode is the same it will go here

        switch (mode) {
            case "Question Answer":
                generationConfig = ai.gen_config_qa;
                history = ai.history_qa;
                break;
    
            case "Doctor":
                generationConfig = ai.gen_config_doctor;
                history = ai.history_doctor
                break;
    
            case "Friend":
                generationConfig = ai.gen_config_friend;
                history = ai.history_friend;
                break;

            case "Therapist":
                generationConfig = ai.gen_config_therapist;
                history = ai.history_therapist
                break;

            case "Alien":
                generationConfig = ai.gen_config_alien;
                history = ai.history_alien;
                break;

            case "DMC":
                generationConfig = ai.gen_config_dmc;
                break;
            
            default:
                console.log("Mode Error"); // the code will ideally never reach here
                break;
        }

    }   else    {

        // if the mode gets changed then it will come here

        current_mode = mode;

        switch (mode) {
            case "Question Answer":
                generationConfig = ai.gen_config_qa;
                history = ai.history_qa;
                break;
    
            case "Doctor":
                generationConfig = ai.gen_config_doctor;
                history = ai.history_doctor
                break;
    
            case "Friend":
                generationConfig = ai.gen_config_friend;
                history = ai.history_friend;
                break;

            case "Therapist":
                generationConfig = ai.gen_config_therapist;
                history = ai.history_therapist
                break;

            case "Alien":
                generationConfig = ai.gen_config_alien;
                history = ai.history_alien;
                break;

            case "DMC":
                generationConfig = ai.gen_config_dmc;
                break;
    
            default:
                console.log("Mode Error"); // the code will ideally never reach here
                break;
        }

    }

    if (mode == "Question Answer" || mode == "Doctor" || mode == "Friend" || mode == "Therapist" || mode == "Alien") {

        async function runChat() {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
            const chat = model.startChat({
                generationConfig,
                safetySettings,
                history: history,
            });
        
            const result = await chat.sendMessage(input);
            const response = result.response;

            const html = converter.makeHtml(response.text());

            return html
        }
        
        return runChat();

    }   
    
    else if (mode == "DMC") {

        async function run() {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: MODEL_NAME });
            
            const parts = ai.parts;

            parts.push({text: `${input}`},)
            
            const result = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig,
                safetySettings,
            });

            parts.length = 1;
            
            const response = result.response;

            const html = converter.makeHtml(response.text());

            return html
        }
            
        return run();

    }

};


async function debug_code(code) {

    async function run() {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        const generationConfig = {
            temperature: 0.2,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        safetySettings = ai.safety_settings;
        
        const parts = [
            {text: "debug and improve the following code.\n\n"},
        ];

        parts.push({text: `${code}`},)
        
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });

        parts.length = 1;
        
        const response = result.response;

        const text = markdownToTxt(response.text());

        return text
    }
        
    return run();

}

async function generate_email(email, style, length) {

    const mail = ai.input_email(style,length,email) // this will return the complete prompt

    async function run() {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
        const generationConfig = {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };
        
        const safetySettings = ai.safety_settings;
        
        const parts = [
            {text: `Write an email\n\nit should be in ${style} style.\n\nit should be in ${length} length.\n\nthe topic of the email is ${email} \n`},
        ];
        
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });
        
        const response = result.response;

        const text = markdownToTxt(response.text());

        return text
    }
        
    return run();

}

async function translate_text(lang_1,lang_2,text) {

    async function run() {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
        const generationConfig = {
            temperature: 0.4,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };
    
        const safetySettings = ai.safety_settings;
    
        const parts = [
            {text: `\nTranslate this text from ${lang_1} to ${lang_2} :\n\n ${text}`},
        ];
    
        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });
    
        const response = result.response;
        const translated_text = markdownToTxt(response.text())

        return translated_text;
    }
    
    return run();
}

async function add_user_to_database_google(username,email,provider) {

    const user_ref = db.collection("Users").doc(username);

    const doc = await user_ref.get()

    if (!doc.exists) {
        user_ref.set({
            "Username":username,
            "Email":email,
            "Provider":provider
        })
    }   else    {
        return
    }

}

async function check_if_user_exits(username) {

    const user_ref = db.collection("Users").doc(username);

    const doc = await user_ref.get();

    if (doc.exists) {
        return true
    }   else    {
        return false
    }

}

async function add_user_to_database_email(username,email,password,provider) {

    const user_ref = db.collection("Users").doc(username);

    const doc = await user_ref.get();

    if (!doc.exists) {
        user_ref.set({
            "Username":username,
            "Password":password,
            "Email":email,
            "Provider":provider
        })
    }   else    {
        return false
    }

}

app.use(express.json());

app.use(express.static('C:/Programming/Projects/Chat Alchemy/chatbot_website/public'))

app.set("view engine", "ejs");

app.get('/Login', (req,res) => {
    res.render("login.ejs");
})

app.get('/Register', (req,res) => {
    res.render("register.ejs");
})

app.get('/ChatAlchemy', (req,res) => {
    res.render("chat_alchemy.ejs");
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

app.post("/SendMessageToDatabase", async (req,res) => {

    const user_name = req.body.user_name;
    const mode = req.body.mode;
    const user_message = req.body.user_message;
    const ai_message = req.body.ai_response;

    const doc_ref = db.collection("Users").doc(user_name).collection(mode);

    doc_ref.add({
        "user": user_message,
        "ai": ai_message,
        "timestamp": FieldValue.serverTimestamp()
    })

})

app.post("/GetMessagesFromDatabase", async (req,res) => {

    const mode = req.body.mode_value;
    const user_name = req.body.user_name;

    const doc_ref = db.collection("Users").doc(user_name).collection(mode);

    const data = await doc_ref.orderBy("timestamp").get();

    const messages = new Array();

    data.docs.forEach((docs) => {
        const user = docs.data().user;
        const ai = docs.data().ai;

        messages.push(user);
        messages.push(ai);
        
    })

    res.json({messages});

})

app.post("/DeleteMessages", (req,res) => {

    const mode = req.body.mode;
	const user_name = req.body.user_name;

	const path = `Users/${user_name}/${mode}`;


    async function deleteCollection(db, collectionPath, batchSize) {
    	const collectionRef = db.collection(collectionPath);
        const query = collectionRef.orderBy('__name__').limit(batchSize);
      
        return new Promise((resolve, reject) => {
        	deleteQueryBatch(db, query, resolve).catch(reject);
        });
    }
      
	async function deleteQueryBatch(db, query, resolve) {
		const snapshot = await query.get();
	
		const batchSize = snapshot.size;
		if (batchSize === 0) {
			// When there are no documents left, we are done
			resolve();
			return;
		}
	
		// Delete documents in a batch
		const batch = db.batch();
		snapshot.docs.forEach((doc) => {
			batch.delete(doc.ref);
		});
		await batch.commit();
	
		// Recurse on the next process tick, to avoid
		// exploding the stack.
		process.nextTick(() => {
			deleteQueryBatch(db, query, resolve);
		});
	}

	deleteCollection(db,path, 2)
	.then(() => {
		var delete_success = "The messages were successfully deleted"

		res.json({response:delete_success});
	})
	.catch((error) => {
		var error_message = error.message;

		res.json({response:error_message});
	})
})

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

app.post("/Translate", async (req,res) => {

    const lang_1 = req.body.lang_1;
    const lang_2 = req.body.lang_2;
    const text = req.body.text;

    const translated_text = await translate_text(lang_1,lang_2,text);
    
    res.json({translated_text});
    
})

app.post("/AuthenticateUserGoogle", (req,res) => {

    var login_condition = false;

    const id_token = req.body.token;

    const credential = GoogleAuthProvider.credential(id_token);

    const auth = getAuth(firebase);

    signInWithCredential(auth, credential)
    .then((userCredential) => {
        const user = userCredential.user;

        login_condition = true;
        
        add_user_to_database_google(user.displayName, user.email, user.providerData[0].providerId);

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

app.post("/CreateUser", async (req, res) => {

    const user_name = req.body.user_name;
    const email = req.body.email;
    const password = req.body.password;

    var account_created = false;

    var is_error = false;

    const exists = await check_if_user_exits(user_name);

    if (exists == false) {
        createUserWithEmailAndPassword(auth, email, password)
        .then((user_credential) => {
            const user = user_credential.user;
            account_created = true

            add_user_to_database_email(user_name, email, password, "password")

            res.json({user:user, account:account_created});
        })
        .catch((error) => {
            is_error = true;

            const error_code = error.code;
            const error_message = error.message;

            res.json({error_code:error_code, error_message:error_message, is_error});
        })
    }   else    {
        res.json({account:account_created, is_error})
    }
})

var login_condition = false;
var user_name;
var user_email;
var user_provider;

onAuthStateChanged(auth, (user) => {
    
    if (user) {

        login_condition = true;

        user_name = user.displayName;
        user_email = user.email;
        user_provider = user.providerData[0].providerId;
        
        console.log("--------------------------------------------");
        console.log("user is signed in");
        console.log(user.displayName);
        console.log(user.email);
        console.log(user.providerData[0].providerId);
        console.log("--------------------------------------------");
        
    }   else    {

        login_condition = false;

        console.log("user is signed out");
    }

})

app.post("/CheckLogin", (req,res) => {
    res.json({login_condition,name:user_name,email:user_email,provider:user_provider})
})


// to do : check if you can use doc instead of new_doc
app.post("/UpdateTypingMode", async (req,res) => {
    
    const user_name = req.body.user_name;
    const new_mode = req.body.new_mode

    const setting_ref = db.collection("Users").doc(user_name).collection("Settings").doc("Settings");

    const doc = await setting_ref.update({"Typing Mode":new_mode});

    const new_doc = await setting_ref.get();

    res.json({typing_mode:new_doc.data()["Typing Mode"]});
    
})

app.post("/GetSettings", async (req,res) => {

    const user_name = req.body.user_name;

    const setting_ref = db.collection("Users").doc(user_name).collection("Settings").doc("Settings");

    const doc = await setting_ref.get();

    if(!doc.exists) {
        setting_ref.set({
            "Typing Mode":"type"
        })
    }   else    {
        res.json({typing_mode:doc.data()["Typing Mode"]});
    }

})

app.listen(process.env.PORT || 3000);