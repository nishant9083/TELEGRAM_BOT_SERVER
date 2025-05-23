var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();
const runChat = require("./bot_response");

app.use(bodyParser.json()) // for parsing application/json
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
) // for parsing application/x-www-form-urlencoded

//This is the route the API will call
app.get("/", function(req, res) {
    res.send("Welcom to Express Server!");
});
app.post("/new-message", async function(req, res) {
	const { message } = req.body

	//Each message contains "text" and a "chat" object, which has an "id" which is the chat id

	if (!message || message.text === "") {
		// In case a message is not present, or if our message does not have the word marco in it, do nothing and return an empty response
		return res.end()
	}
    let msg = "What can I do for you?"
    if(message.text.toLowerCase() === "/start") {
        msg = "Hi there! How can I help you!"            
    }
    else if(message.text.toLowerCase() === "/owner") {
        msg = "This bot is owned by @nishant_verma"
    }
    else{
        msg = await runChat(message.text);
    }
	axios
		.post(
			`https://api.telegram.org/bot${process.env.BOT_API}/sendMessage`,
			{
				chat_id: message.chat.id,
				text: msg,
			}
		)
		.then((response) => {
			// We get here if the message was successfully posted
			console.log(response)
			res.end("ok")
		})
		.catch((err) => {
			// ...and here if it was not
			console.log("Error :", err)
			res.end("Error :" + err)
		})
})

// Finally, start our server
app.listen(3000, function() {
	console.log("Telegram app listening on port 3000!")
})

module.exports = app;