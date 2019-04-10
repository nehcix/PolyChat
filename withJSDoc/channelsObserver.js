"use strict";

/**
 * @description ChannelsObserver is the sub-model of the global model(connectionHandler), it contains the channelsView. Once this gets notified by the the globale model, it will update the view of channels.
 * @author Xi Chen Shen
 * @author Hakim Payman
 * @copyright Ecole Polytechnique de Montreal & Course LOG2420
 * @version 1.0.0
 */
class ChannelsObserver {
	/**
	 * The constructor takes a view object to initiate the ChannelsObserver.
	 * @param {object} channelsView View object for the channels.
	 */
	constructor(channelsView) {
		this.channelsView_ = channelsView;
	}

	/**
	 * This method contains a switch case. Depending on the type of answer from the server, this method will update the view differently (see details in code).
	 * @param {object} answerFromServer The answerFromServer holds the answer from the server which got parsed in connectionHandler.
	 */
	updateView(answerFromServer) {
		switch (answerFromServer.eventType) {
			/**
			 * In this case, when the type is updateChannelsList, it will update every channel.
			 * Then, if it is the first time (the view is new) we update the channelsView, 
			 * it will set the currentChannel to General. Finally, it will activate the 
			 * current channel. (This is also very useful when we leave the group and 
			 * we want the general channel to be active afterwards, and if the current 
			 * group hasn't changed, it will still update the active channel, 
			 * but the user won't notice.)
			 */
			case "updateChannelsList":
				this.channelsView_.updateChannelsList(answerFromServer);

				if (this.channelsView_.isNew) {
					currentChannel = $(".chatChannel")[0].children[1];
					this.channelsView_.isNew = false;
				}

				this.changeActiveChannel(document.getElementById(currentChannel.innerHTML));

				break;

			/**
			 * In this case, when the type is onError, it will alert the user about the error.
			 */
			case "onError":
				alert(
					"An error has broken the reception or sending of a message (see console output for details).\nUne erreur a rupturé la réception ou l'envoie d'un message (voir la sortie de la console pour les détails).\n\n" +
						answerFromServer.data
				);
				console.log(answerFromServer);
				break;
		}
	}

	/**
	 * This method will be used to activate another channel (or update the current channel).
	 * It will first empty all the messages on screen, and tell the channelView 
	 * to change the active channel view (changeActiveChannelView).
	 * Then it will send a message of type onGetChannel by using the current channel id, 
	 * the user input in the text area, the username and the current time.
	 * Finally it will remove the badges of unread messages depending on which channel is activated.
	 * @param {objet} thisEl This holds the span (.channelName) of the channel we want to activate.
	 */
	changeActiveChannel(thisEl) {
		messages.innerHTML = "";
		this.channelsView_.changeActiveChannelView(thisEl);

		let message = new Message("onGetChannel", currentChannel.parentElement.id, null, username, new Date());
		sock.send(JSON.stringify(message));

		messagesView.removeBadgesFrom(thisEl.parentElement.id);
	}
}
