"use strict";

class MessagesObserver {
	constructor(messagesVue) {
		this.messagesVue_ = messagesVue;
	}

	updateVue(answerFromServer) {
		switch (answerFromServer.eventType) {
			case "onMessage":
				if (answerFromServer.channelId == currentGroupId) {
					this.messagesVue_.onMessage(answerFromServer, userName);
				} else {
					this.messagesVue_.badgePlusOne();
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
