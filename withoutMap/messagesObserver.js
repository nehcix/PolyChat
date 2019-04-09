"use strict";

class MessagesObserver {
	constructor(messagesVue) {
		this.messagesVue_ = messagesVue;
	}

	updateVue(answerFromServer) {
		switch (answerFromServer.eventType) {
			case "onMessage":
				if (answerFromServer.channelId == currentChannel.parentElement.id) {
					this.messagesVue_.onMessage(answerFromServer, userName);
				} else if (answerFromServer.sender != "Admin") {
					this.messagesVue_.addNewBadge(answerFromServer.channelId);
				}

				if (answerFromServer.sender != userName && answerFromServer.sender != "Admin") {
					if (audioIsON) {
						this.playAudio();
					}
				}
				if (answerFromServer.sender == userName) {
					inputToSend.value = "";
				}

				break;
			case "onGetChannel":
				for (let i = 0; i < answerFromServer.data.messages.length; ++i) {
					this.messagesVue_.onMessage(answerFromServer.data.messages[i], userName);
				}
				break;
		}
	}

	onMessage(answerFromServer, userName) {
		this.messagesVue_.onMessage(answerFromServer, userName);
	}

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
