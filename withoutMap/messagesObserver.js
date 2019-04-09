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
					var playPromise = audio.play();

					playPromise
						.then(() => {
							// audio.play();
						})
						.catch(error => {
							console.log(
								"I don't know why but sometimes audio.play() doesn't work, please try again latter..."
							);
							console.log(error);
						});
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
}
