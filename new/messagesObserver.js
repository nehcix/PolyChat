"use strict";

class MessagesObserver {
	constructor(messagesVue) {
		this.messagesVue_ = messagesVue;
	}

	updateVue(answerFromServer) {
		switch (answerFromServer.eventType) {
			case "onMessage":
				if (!this.messagesVue_.messagesPerChannel.has(answerFromServer.channelId)) {
					this.messagesVue_.messagesPerChannel.set(answerFromServer.channelId, []);
				}
				let messagesTampon = this.messagesVue_.messagesPerChannel.get(answerFromServer.channelId);
				messagesTampon.push(answerFromServer);
				this.messagesVue_.messagesPerChannel.set(answerFromServer.channelId, messagesTampon);

				if (answerFromServer.channelId == currentChannel.parentElement.id) {
					this.messagesVue_.onMessage(answerFromServer, userName);
				} else {
					this.messagesVue_.addNewBadge(answerFromServer.channelId);
				}
				if (answerFromServer.sender != userName) {
					audio.play();
				}
				break;
			case "onGetChannel":
				if (this.messagesVue_.messagesPerChannel.has(answerFromServer.channelId)) {
					let messagesTampon = this.messagesVue_.messagesPerChannel.get(answerFromServer.channelId);
					//!
					messagesTampon.concat(answerFromServer.data.messages);
					this.messagesVue_.messagesPerChannel.set(answerFromServer.channelId, messagesTampon);
				} else {
					this.messagesVue_.messagesPerChannel.set(
						answerFromServer.channelId,
						answerFromServer.data.messages
					);
				}

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
