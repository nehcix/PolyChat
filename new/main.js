"use strict";

let messagesObserver = new MessagesObserver();
let channelsObserver = new ChannelsObserver();
let connectionHandler = new ConnectionHandler(messagesObserver, channelsObserver);

sendButton.addEventListener("click", connectionHandler.sendInput);
inputToSend.addEventListener("keypress", function(e) {
	if (e.key === "Enter") {
		connectionHandler.sendInput();
	}
});
