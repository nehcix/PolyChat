"use strict";

class ConnectionHandler {
	constructor(messagesObserver, channelsObserver) {
		this.messagesObserver_ = messagesObserver;
		this.channelsObserver_ = channelsObserver;

		this.lastAnswerFromServer;
		sock.onmessage = event => {
			this.lastAnswerFromServer = JSON.parse(event.data);

			this.messagesObserver_.updateVue(this.lastAnswerFromServer);
			this.channelsObserver_.updateVue(this.lastAnswerFromServer);

			$(".toTranslate").each(function() {
				$(this).text(languages[currentLanguage][$(this).attr("key")]);
			});
		};
	}

	sendInput() {
		let message = new Message(
			"onMessage",
			currentChannel.parentElement.id,
			inputToSend.value,
			userName,
			new Date()
		);
		sock.send(JSON.stringify(message));
	}

	sendThumbsUp() {
		let message = new Message("onMessage", currentChannel.parentElement.id, "👍🏻", userName, new Date());
		sock.send(JSON.stringify(message));
	}

	// Since we can leave a channel which is not active... we need theses loops
	joinChannel(event) {
		let message = new Message("onJoinChannel", event.parentElement.id, null, userName, new Date());
		sock.send(JSON.stringify(message));
		alert(
			"You (" +
				userName +
				") have joined " +
				event.parentElement.children[1].innerHTML +
				".\nVous (" +
				userName +
				") avez rejoint " +
				event.parentElement.children[1].innerHTML +
				"."
		);
		currentChannel = event.parentElement.children[1];

		message = new Message("onGetChannel", currentChannel.parentElement.id, null, userName, new Date());
		sock.send(JSON.stringify(message));
	}

	leaveChannel(event) {
		let message = new Message("onLeaveChannel", event.parentElement.id, null, userName, new Date());
		sock.send(JSON.stringify(message));
		alert(
			"You (" +
				userName +
				") have leaved " +
				event.parentElement.children[1].innerHTML +
				".\nVous (" +
				userName +
				") avez quitté " +
				event.parentElement.children[1].innerHTML +
				"."
		);
		currentChannel = $(".chatChannel")[0].children[1];
		this.channelsObserver_.messagesVue_.messagesPerChannel.delete(event.parentElement.id);
	}

	createChannel() {
		let newChannelName = prompt("Name of the new channel (Nom du nouveau groupe) :");
		let message = new Message("onCreateChannel", null, newChannelName, userName, new Date());
		sock.send(JSON.stringify(message));
	}
}
