"use strict";

class ConnectionHandler {
	constructor(messagesObserver, channelsObserver) {
		this.messagesObserver_ = messagesObserver;
		this.channelsObserver_ = channelsObserver;

		this.lastAnswerFromServer;
		sock.onmessage = event => {
			this.lastAnswerFromServer = JSON.parse(event.data);
			console.log(this.lastAnswerFromServer);

			this.messagesObserver_.updateVue(this.lastAnswerFromServer);
			this.channelsObserver_.updateVue(this.lastAnswerFromServer);

			$(".toTranslate").each(function() {
				$(this).text(languages[currentLanguage][$(this).attr("key")]);
			});
		};
	}

	sendInput() {
		let message = new Message("onMessage", currentGroupId, inputToSend.value, userName, new Date());
		sock.send(JSON.stringify(message));
	}

	sendThumbsUp() {
		let message = new Message("onMessage", currentGroupId, "👍🏻", userName, new Date());
		sock.send(JSON.stringify(message));
	}

	// Since we can leave a groupe which is not active... we need theses loops
	joinChannel(thisEl) {
		let message = new Message("onJoinChannel", thisEl.parentElement.id, null, userName, new Date());
		sock.send(JSON.stringify(message));
		// this.channelsObserver_.activeGroup is on this new channel
		this.changeActiveGroup(thisEl.parentElement.children[1]);
		alert(
			"You (" +
				userName +
				") have joined " +
				thisEl.parentElement.children[1].innerHTML +
				".\nVous (" +
				userName +
				") avez rejoint " +
				thisEl.parentElement.children[1].innerHTML +
				"."
		);
	}

	leaveChannel(thisEl) {
		let message = new Message("onLeaveChannel", thisEl.parentElement.id, null, userName, new Date());
		sock.send(JSON.stringify(message));
		// this.channelsObserver_.currentGroupId back to default channel which is General
		this.changeActiveGroup();
		alert(
			"You (" +
				userName +
				") have leaved " +
				thisEl.parentElement.children[1].innerHTML +
				".\nVous (" +
				userName +
				") avez quitté " +
				thisEl.parentElement.children[1].innerHTML +
				"."
		);
	}

	changeActiveGroup(thisEl) {
		this.channelsObserver_.changeActiveGroup(thisEl);
	}

	changeActiveGroupWithVerification(thisEl) {
		if (thisEl.attributes[2].value == "false") {
			alert("You need to join this channel first !\nVous devez d'abord rejoindre ce groupe !");
		} else {
			this.channelsObserver_.changeActiveGroup(thisEl);
		}
	}

	createChannel() {
		let newChannelName = prompt("Name of the new channel (Nom du nouveau groupe) :");
		let message = new Message("onCreateChannel", null, newChannelName, userName, new Date());
		sock.send(JSON.stringify(message));
	}
}
