"use strict";

var months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let messagesObserver = new MessagesObserver();
let channelsObserver = new ChannelsObserver();
let connectionHandler = new ConnectionHandler(messagesObserver, channelsObserver);

sendButton.addEventListener("click", connectionHandler.sendInput);
inputToSend.addEventListener("keypress", function(e) {
	if (e.key === "Enter") {
		connectionHandler.sendInput();
	}
});
