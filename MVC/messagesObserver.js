"use strict";

class MessagesObserver {
	constructor() {
		this.sendButton = document.getElementById("sendButton");
		this.inputToSend = document.getElementById("inputToSend");
		this.messages = document.getElementById("messages");
		this.messagesWrapper = document.getElementById("messagesWrapper");
	}

	onMessage(answerFromServer, userName) {
		if (answerFromServer.sender == userName) {
			messages.innerHTML +=
				'<div class="messageSend">\
                <div class="content">' +
				answerFromServer.data +
				'</div>\
                <div class="time">' +
				answerFromServer.timestamp +
				"</div>\
                </div>";
			inputToSend.value = "";
		} else {
			messages.innerHTML +=
				'<div class="messageReceived">\
                <div class="name">' +
				answerFromServer.sender +
				'</div>\
                <div class="content">' +
				answerFromServer.data +
				'</div>\
                <div class="time">' +
				answerFromServer.timestamp +
				"</div>\
                </div>";
		}

		messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
	}
}
