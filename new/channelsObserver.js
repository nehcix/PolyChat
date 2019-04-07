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
					this.changeActiveGroup();
					this.channelsVue_.isNew = false;
				} else {
					this.changeActiveGroup(document.getElementById(currentGroup.innerHTML));
				}
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

	// default parameter is the first chat group (general)
	changeActiveGroup(thisEl = $(".chatGroup")[0].children[1]) {
		if (currentGroup) {
			currentGroup.style.padding = null;
			currentGroup.style.border = null;
			currentGroup.style.borderRadius = null;
		}

		activeGroup.innerHTML = thisEl.innerHTML;
		currentGroupId = thisEl.parentElement.id;
		currentGroup = thisEl;
		let message = new Message("onGetChannel", currentGroupId, null, userName, new Date());
		sock.send(JSON.stringify(message));
		messages.innerHTML = "";
		inputToSend.focus();

		thisEl.style.padding = "2px 5px";
		thisEl.style.border = "1px solid rgb(13, 98, 255)";
		thisEl.style.borderRadius = "20px";
	}
}
