"use strict";

class ConnectionHandler {
	constructor(messagesObserver, channelsObserver_) {
		this.messagesObserver_ = messagesObserver;
		this.channelsObserver_ = channelsObserver_;

		this.lastAnswerFromServer;
	}

	newConnection() {
		userName = prompt("Username (Nom d'utilisateur) : ");
		sock = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=" + userName);
		$("#currentUser").text(userName);

		sock.onmessage = event => {
			this.lastAnswerFromServer = JSON.parse(event.data);

			this.messagesObserver_.updateVue(this.lastAnswerFromServer);
			this.channelsObserver_.updateVue(this.lastAnswerFromServer);

			// need to wait until Dom get updated before selecting .toTranslate
			Promise.resolve().then(() => {
				$(".toTranslate").each(function() {
					$(this).text(languages[currentLanguage][$(this).attr("key")]);
				});
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

	joinChannel(event) {
		let element = event.target;
		let message = new Message("onJoinChannel", element.parentElement.id, null, userName, new Date());
		sock.send(JSON.stringify(message));
		alert(
			"You (" +
				userName +
				") have joined " +
				element.parentElement.children[1].innerHTML +
				".\nVous (" +
				userName +
				") avez rejoint " +
				element.parentElement.children[1].innerHTML +
				"."
		);
	}

	verificationBeforeChange(event) {
		if (event.target.attributes["status"].value == "false") {
			alert("You need to join this channel first !\nVous devez d'abord rejoindre ce groupe !");
		} else {
			this.channelsObserver_.changeActiveChannel(event.target);
		}
	}

	leaveChannel(event) {
		let element = event.target;
		let message = new Message("onLeaveChannel", element.parentElement.id, null, userName, new Date());
		sock.send(JSON.stringify(message));
		alert(
			"You (" +
				userName +
				") have leaved " +
				element.parentElement.children[1].innerHTML +
				".\nVous (" +
				userName +
				") avez quitté " +
				element.parentElement.children[1].innerHTML +
				"."
		);
		currentChannel = $(".chatChannel")[0].children[1];
	}

	createChannel() {
		let newChannelName = prompt("Name of the new channel (Nom du nouveau groupe) :");
		let message = new Message("onCreateChannel", null, newChannelName, userName, new Date());
		sock.send(JSON.stringify(message));
	}
}
