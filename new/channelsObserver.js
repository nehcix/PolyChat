"use strict";

class ChannelsObserver {
	constructor(messagesVue, channelsVue) {
		this.messagesVue_ = messagesVue;
		this.channelsVue_ = channelsVue;
	}

	updateVue(answerFromServer) {
		switch (answerFromServer.eventType) {
			case "updateChannelsList":
				this.channelsVue_.updateChannelsList(answerFromServer);
				if (this.channelsVue_.isNew) {
					this.changeActiveChannel($(".chatChannel")[0].children[1]);
					this.channelsVue_.isNew = false;
				} else {
					this.changeActiveChannel(document.getElementById(currentChannel.innerHTML));
				}

				$(".channelName").css("cursor", "pointer");
				$(".channelName").click(event => {
					if (event.target.attributes["status"].value == "false") {
						alert("You need to join this channel first !\nVous devez d'abord rejoindre ce groupe !");
					} else {
						this.changeActiveChannel(event.target);
					}
				});

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
		if (this.messagesVue_.messagesPerChannel.has(thisEl.parentElement.id)) {
			let oldMessages = this.messagesVue_.messagesPerChannel.get(thisEl.parentElement.id);

			if (oldMessages.length <= 1) {
				let message = new Message("onGetChannel", currentChannel.parentElement.id, null, userName, new Date());
				sock.send(JSON.stringify(message));
			}

			for (let i = 0; i < oldMessages.length; i++) {
				this.messagesVue_.onMessage(oldMessages[i], userName);
			}
		} else {
			let message = new Message("onGetChannel", currentChannel.parentElement.id, null, userName, new Date());
			sock.send(JSON.stringify(message));
		}
		this.messagesVue_.removeBadgesFrom(thisEl.parentElement.id);
	}
}
