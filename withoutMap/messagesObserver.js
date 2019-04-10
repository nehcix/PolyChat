"use strict";

/**
 * @description MessagesObserver is the sub-model of the globale model(connectionHandler), it contains the messagesView. Once this get poked by the the globale model, it will update the view of messages.
 * @author Xi Chen Shen
 * @author Hakim Payman
 * @copyright Ecole Polytechnique de Montreal & Course LOG2420
 * @version 1.0.0
 */
class MessagesObserver {
	/**
	 * The constructor takes an objet view to initiate the MessagesObserver.
	 * @param {object} messagesView Objet view for messagers.
	 */
	constructor(messagesView) {
		this.messagesView_ = messagesView;
	}

	/**
	 * This method contains a switch case. Depending on the type of answer from the server, this method will update the view differently (see details in code).
	 * @param {object} answerFromServer The answerFromServer holds the answer from the server which got parsed in connectionHandler.
	 */
	updateView(answerFromServer) {
		switch (answerFromServer.eventType) {
			/**
			 * In this case, when the type is onMessage, if the messages if from the current channel, it will be directly add to screen by calling the onMessage method of the messagesView, otherwise, it will add a notification badge.
			 * Then, if the message isn't sent by the current user, and the message isn't from the administrator, a notification sound will be played.
			 * Finally, if the message is sent by the current user, the it will empty the textarea.
			 */
			case "onMessage":
				if (answerFromServer.channelId == currentChannel.parentElement.id) {
					this.messagesView_.onMessage(answerFromServer, username);
				} else if (answerFromServer.sender != "Admin") {
					this.messagesView_.addNewBadge(answerFromServer.channelId);
				}

				if (answerFromServer.sender != username && answerFromServer.sender != "Admin") {
					if (audioIsON) {
						this.playAudio();
					}
				}
				if (answerFromServer.sender == username) {
					inputToSend.value = "";
				}

				break;

			/**
			 * In this case, when the type is onGetChannel, all the messages from answerFromServer.data will be added to screen one by one by calling the onMessage method of the messagesView.
			 */
			case "onGetChannel":
				for (let i = 0; i < answerFromServer.data.messages.length; ++i) {
					this.messagesView_.onMessage(answerFromServer.data.messages[i], username);
				}
				break;
		}
	}

	/**
	 * This method will play the notification sound
	 */
	playAudio() {
		var playPromise = audio.play();
		playPromise
			.then(() => {
				// audio.play();
			})
			.catch(error => {
				console.log(
					"I don't know why but we need to click once anywhere at the page, otherwise audio.play() doesn't work..."
				);
				console.log(error);
			});
	}
}
