"use strict";

/**
 * @description ConnectionHandler is the globale model, it contains two sub-models(messagesObserver and channelsObserver). Once it get updated by the controller, it will tell its two sub-models to update the view.
 * @author Xi Chen Shen
 * @author Hakim Payman
 * @copyright Ecole Polytechnique de Montreal & Course LOG2420
 * @version 1.0.0
 */
class ConnectionHandler {
	/**
	 * The constructor takes two models to setup its two sub-models.
	 * It will also declare a variable lastAnswerFromServer to hold the last answer from the server.
	 * @param {object} messagesObserver Objet model for messages which will update messagesView.
	 * @param {object} channelsObserver Objet model for channels which will update messagesView.
	 */
	constructor(messagesObserver, channelsObserver) {
		this.messagesObserver_ = messagesObserver;
		this.channelsObserver_ = channelsObserver;

		this.lastAnswerFromServer;
	}

	/**
	 * This function will ask user the username, then use the username to open the WebSocket.
	 * The username will also be updated in Dom.
	 * Finally, it will define what the WebSocket should do on message.
	 */
	newConnection() {
		username = prompt("Username (Nom d'utilisateur) : ");
		sock = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=" + username);

		$("#currentUser").text(username);

		sock.onmessage = event => {
			this.lastAnswerFromServer = JSON.parse(event.data);

			// tells sub-models to update views
			this.messagesObserver_.updateView(this.lastAnswerFromServer);
			this.channelsObserver_.updateView(this.lastAnswerFromServer);

			// We use a promise to be able to wait until the Dom get updated before selecting .toTranslate and make the translation
			Promise.resolve().then(() => {
				$(".toTranslate").each(function() {
					$(this).text(languages[currentLanguage][$(this).attr("key")]);
				});
			});
		};
	}

	/**
	 * This method will be used to send a message of type onMessage by using the current channel id, the user input in the textarea, the username and the current time.
	 */
	sendInput() {
		let message = new Message(
			"onMessage",
			currentChannel.parentElement.id,
			inputToSend.value,
			username,
			new Date()
		);
		sock.send(JSON.stringify(message));
	}

	/**
	 * This method will be used to send a message of type onMessage by using the current channel id, a Thumbs Up Emoji, the username and the current time.
	 */
	sendThumbsUp() {
		let message = new Message("onMessage", currentChannel.parentElement.id, "👍🏻", username, new Date());
		sock.send(JSON.stringify(message));
	}

	/**
	 * This method will be used to send a message of type onJoinChannel by using the current channel id, the username and the current time. It will also alert user that he has joined the channel once the message is sent.
	 * @param {object} event user click event
	 */
	joinChannel(event) {
		let element = event.target;
		let message = new Message("onJoinChannel", element.parentElement.id, null, username, new Date());
		sock.send(JSON.stringify(message));
		alert(
			"You (" +
				username +
				") have joined " +
				element.parentElement.children[1].innerHTML +
				".\nVous (" +
				username +
				") avez rejoint " +
				element.parentElement.children[1].innerHTML +
				"."
		);
	}

	/**
	 * This method will verify if the channel of the click target can be selected, if the user haven't join the channel, it will alert the user, ortherwise it will call changeActiveChannel by passing the channel that we want to select.
	 * @param {object} event user click event
	 */
	verificationBeforeChange(event) {
		if (event.target.attributes["status"].value == "false") {
			alert("You need to join this channel first !\nVous devez d'abord rejoindre ce groupe !");
		} else {
			this.channelsObserver_.changeActiveChannel(event.target);
		}
	}

	/**
	 * This method will be used to send a message of type onLeaveChannel by using the current channel id, the username and the current time. It will also alert user that he has leaved the channel once the message is sent.
	 * @param {object} event user click event
	 */
	leaveChannel(event) {
		let element = event.target;
		let message = new Message("onLeaveChannel", element.parentElement.id, null, username, new Date());
		sock.send(JSON.stringify(message));
		alert(
			"You (" +
				username +
				") have leaved " +
				element.parentElement.children[1].innerHTML +
				".\nVous (" +
				username +
				") avez quitté " +
				element.parentElement.children[1].innerHTML +
				"."
		);
		currentChannel = $(".chatChannel")[0].children[1];
	}

	/**
	 * This method will ask the user for the new channel's name,
	 * and it will send a message of type onCreateChannel by using the new channel's name, the username and the current time.
	 */
	createChannel() {
		let newChannelName = prompt("Name of the new channel (Nom du nouveau groupe) :");
		let message = new Message("onCreateChannel", null, newChannelName, username, new Date());
		sock.send(JSON.stringify(message));
	}
}
