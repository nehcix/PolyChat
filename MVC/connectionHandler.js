"use strict";

class ConnectionHandler {
	constructor(messagesObserver, channelsObserver) {
		this.messagesObserver_ = messagesObserver;
		this.channelsObserver_ = channelsObserver;

		this.userName = "sxc";
		this.sock = new WebSocket("ws://log2420-nginx.info.polymtl.ca/chatservice?username=" + this.userName);

		this.lastAnswerFromServer;
		var thisConnectionHandler = this;
		this.sock.onmessage = function(event) {
			this.lastAnswerFromServer = JSON.parse(event.data);

			console.log(this.lastAnswerFromServer);

			switch (this.lastAnswerFromServer.eventType) {
				case "onMessage":
					thisConnectionHandler.messagesObserver_.onMessage(this.lastAnswerFromServer, thisConnectionHandler.userName);
					break;
				case "onCreateChannel":
					break;
				// case "onJoinChannel":
				// 	break;
				// case "onLeaveChannel":
				// 	break;
				case "updateChannelsList":
					thisConnectionHandler.channelsObserver_.updateChannelsList(this.lastAnswerFromServer);
					break;
				case "onError":
					console.log(`onError: ${this.lastAnswerFromServer.data}`);
					break;
				case "onGetChannel":
					console.log(this.lastAnswerFromServer);
					for (let i = 0; i < this.lastAnswerFromServer.data.messages.length; ++i) {
						thisConnectionHandler.messagesObserver_.onMessage(
							this.lastAnswerFromServer.data.messages[i],
							thisConnectionHandler.userName
						);
					}
					// thisConnectionHandler.channelsObserver_.messagesWrapper.scrollTop = thisConnectionHandler.channelsObserver_.messagesWrapper.scrollHeight;
					break;
			}
		};
	}

	sendInput() {
		let message = new Message(
			"onMessage",
			connectionHandler.channelsObserver_.activeGroupId,
			connectionHandler.messagesObserver_.inputToSend.value,
			connectionHandler.userName,
			new Date()
		);
		connectionHandler.sock.send(JSON.stringify(message));
	}

	// Since we can leave a groupe which is not active... we need theses loops
	joinChannel(thisEl) {
		for (let i = 0; i < this.channelsObserver_.listOfChannels.children.length; ++i) {
			if (
				this.channelsObserver_.listOfChannels.children[i].children[1].innerText ==
				thisEl.parentElement.children[1].innerText
			) {
				let message = new Message(
					"onJoinChannel",
					this.channelsObserver_.listOfChannels.children[i].id,
					null,
					this.userName,
					new Date()
				);
				this.sock.send(JSON.stringify(message));
				// this.channelsObserver_.activeGroup is on this new channel
				changeActiveGroupFromGroupDiv(this.channelsObserver_.listOfChannels.children[i]);
				break;
			}
		}
	}

	leaveChannel(thisEl) {
		for (let i = 0; i < this.channelsObserver_.listOfChannels.children.length; ++i) {
			if (
				this.channelsObserver_.listOfChannels.children[i].children[1].innerText ==
				thisEl.parentElement.children[1].innerText
			) {
				let message = new Message(
					"onLeaveChannel",
					this.channelsObserver_.listOfChannels.children[i].id,
					null,
					this.userName,
					new Date()
				);
				this.sock.send(JSON.stringify(message));
				// this.channelsObserver_.activeGroupId back to default channel which is General
				changeActiveGroupFromGroupDiv(this.channelsObserver_.listOfChannels.children[i]);
				break;
			}
		}
	}

	changeActiveGroupFromGroupDiv(thisEl) {
		this.channelsObserver_.activeGroup.innerHTML = thisEl.innerHTML;
		this.channelsObserver_.activeGroupId = thisEl.id;
		let message = new Message(
			"onGetChannel",
			this.channelsObserver_.activeGroupId,
			null,
			this.userName,
			new Date()
		);
		this.sock.send(JSON.stringify(message));
		messages.innerHTML = "";
		console.log(thisEl.id);
	}
}
