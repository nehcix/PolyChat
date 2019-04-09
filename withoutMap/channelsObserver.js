"use strict";

class ChannelsObserver {
	constructor(channelsVue) {
		this.channelsVue_ = channelsVue;
	}

	updateVue(answerFromServer) {
		switch (answerFromServer.eventType) {
			case "updateChannelsList":
				this.channelsVue_.updateChannelsList(answerFromServer);

				if (this.channelsVue_.isNew) {
					currentChannel = $(".chatChannel")[0].children[1];
					this.channelsVue_.isNew = false;
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
		this.channelsVue_.changeActiveChannelVue(thisEl);

		let message = new Message("onGetChannel", currentChannel.parentElement.id, null, userName, new Date());
		sock.send(JSON.stringify(message));

		messagesVue.removeBadgesFrom(thisEl.parentElement.id);
	}
}
