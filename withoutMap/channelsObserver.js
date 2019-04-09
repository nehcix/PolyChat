"use strict";

class ChannelsObserver {
	constructor(channelsView) {
		this.channelsView_ = channelsView;
	}

	updateView(answerFromServer) {
		switch (answerFromServer.eventType) {
			case "updateChannelsList":
				this.channelsView_.updateChannelsList(answerFromServer);

				if (this.channelsView_.isNew) {
					currentChannel = $(".chatChannel")[0].children[1];
					this.channelsView_.isNew = false;
				}

				this.changeActiveChannel(document.getElementById(currentChannel.innerHTML));

				break;
			case "onError":
				alert(
					"An error has broken the reception or sending of a message (see console output for details).\nUne erreur a rupturé la réception ou l'envoie d'un message (voir la sortie de la console pour les détails).\n\n" +
						answerFromServer.data
				);
				console.log(answerFromServer);
				break;
		}
	}

	changeActiveChannel(thisEl) {
		messages.innerHTML = "";
		this.channelsView_.changeActiveChannelView(thisEl);

		let message = new Message("onGetChannel", currentChannel.parentElement.id, null, userName, new Date());
		sock.send(JSON.stringify(message));

		messagesView.removeBadgesFrom(thisEl.parentElement.id);
	}
}
