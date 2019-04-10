"use strict";

/**
 * @description MessagesView represents the view of the messages, it can add a message to the screen and it can add and remove badges for unread notifications.
 * @author Xi Chen Shen
 * @author Hakim Payman
 * @copyright Ecole Polytechnique de Montreal & Course LOG2420
 * @version 1.0.0
 */
class MessagesView {
	/**
	 * This constructor sets the nbBadge and the nbBadgePerChannel to a new Map.
	 * nbBadge represents the total number of unread messages
	 * nbBadgePerChannel represents the nubmer of unread messages 
	 * per channel (key: channel id, value: number of unread messages)
	 */
	constructor() {
		this.nbBadge = 0;
		this.nbBadgePerChannel = new Map();
	}

	/**
	 * This method adds a new message to the screen. It appends the message to 
	 * the list of messages in the Dom. The style (css) of the message will be 
	 * different depending on the sender (administrator / current user / other user).
	 * Finally, it will scroll the scroll bar to the bottom of the messages list.
	 * @param {object} answerFromServer
	 * @param {string} username
	 */
	onMessage(answerFromServer, username) {
		if (answerFromServer.sender == "Admin") {
			let divMssageReceived = document.createElement("div");
			divMssageReceived.classList.add("adminMessage");

			let divName = document.createElement("div");
			divName.classList.add("name");
			divName.innerHTML = answerFromServer.sender + " - ";

			let divContent = document.createElement("div");
			divContent.classList.add("content");
			divContent.innerHTML = answerFromServer.data;

			let divTime = document.createElement("span");

			let spanDay = document.createElement("span");
			let date = new Date(Date.parse(answerFromServer.timestamp));
			spanDay.classList.add("toTranslate");
			spanDay.setAttribute("key", Days[date.getDay()]);

			let spanDate = document.createElement("span");
			spanDate.innerHTML =
				" " +
				date.getDate() +
				", " +
				date.getHours() +
				":" +
				(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());

			divTime.appendChild(spanDay);
			divTime.appendChild(spanDate);
			divName.appendChild(divTime);
			divMssageReceived.appendChild(divName);
			divMssageReceived.appendChild(divContent);
			messages.appendChild(divMssageReceived);
		} else if (answerFromServer.sender == username) {
			let divMessageSend = document.createElement("div");
			divMessageSend.classList.add("messageSend");

			let divContent = document.createElement("div");
			divContent.classList.add("content");
			divContent.innerHTML = answerFromServer.data;

			let divTime = document.createElement("div");
			divTime.classList.add("time");

			let spanDay = document.createElement("span");
			spanDay.classList.add("day");
			let date = new Date(Date.parse(answerFromServer.timestamp));
			spanDay.classList.add("toTranslate");
			spanDay.setAttribute("key", Days[date.getDay()]);

			let spanDate = document.createElement("span");
			spanDate.classList.add("date");
			spanDate.innerHTML =
				" " +
				date.getDate() +
				", " +
				date.getHours() +
				":" +
				(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());

			divTime.appendChild(spanDay);
			divTime.appendChild(spanDate);
			divMessageSend.appendChild(divContent);
			divMessageSend.appendChild(divTime);
			messages.appendChild(divMessageSend);
		} else {
			let divMssageReceived = document.createElement("div");
			divMssageReceived.classList.add("messageReceived");

			let divName = document.createElement("div");
			divName.classList.add("name");
			divName.innerHTML = answerFromServer.sender;

			let divContent = document.createElement("div");
			divContent.classList.add("content");
			divContent.innerHTML = answerFromServer.data;

			let divTime = document.createElement("div");
			divTime.classList.add("time");

			let spanDay = document.createElement("span");
			spanDay.classList.add("day");
			let date = new Date(Date.parse(answerFromServer.timestamp));
			spanDay.classList.add("toTranslate");
			spanDay.setAttribute("key", Days[date.getDay()]);

			let spanDate = document.createElement("span");
			spanDate.classList.add("date");
			spanDate.innerHTML =
				" " +
				date.getDate() +
				", " +
				date.getHours() +
				":" +
				(date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());

			divTime.appendChild(spanDay);
			divTime.appendChild(spanDate);
			divMssageReceived.appendChild(divName);
			divMssageReceived.appendChild(divContent);
			divMssageReceived.appendChild(divTime);
			messages.appendChild(divMssageReceived);
		}

		messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
	}

	/**
	 * First, this method will show a dot badge on the channel (found by channelId) which the current user has joined but is not currently in. Then, it will update the nbBadge. Finally, if there is already a key in nbBadgePerChannel for the corresponding channel (the channel already has an unread message), it will update its value, otherwise, it will create a new key and value.
	 * @param {string} channelId This parameter represents the id of the channel in question.
	 */
	addNewBadge(channelId) {
		document.getElementById("badge" + channelId).style.display = "inline-block";

		if (this.nbBadge == 0) {
			this.nbBadgePerChannel.set(channelId, 1);
			this.nbBadge = 1;

			navBarSecondLine.children[1].style.visibility = "visible";
		} else {
			if (isNaN(this.nbBadgePerChannel.get(channelId))) {
				this.nbBadgePerChannel.set(channelId, 1);
				this.nbBadge += 1;
			} else {
				let thisNbBadge = this.nbBadgePerChannel.get(channelId);
				this.nbBadgePerChannel.set(channelId, thisNbBadge + 1);
				this.nbBadge += 1;
			}
			$("#badge").text(this.nbBadge);
		}
	}

	/**
	 * First, this method will hide the dot badge on the channel (found by channelId) which the current user has joined but is not currently in. Then, it will update nbBadge by removing the number of unread messages in the channel in question and update nbBadgePerChannel. Finally, it will hide all badges if there's no more unread message
	 * @param {string} channelId This parameter represents the id of the channel in question.
	 */
	removeBadgesFrom(channelId) {
		document.getElementById("badge" + channelId).style.display = "none";

		if (isNaN(this.nbBadgePerChannel.get(channelId))) {
		} else {
			this.nbBadge -= this.nbBadgePerChannel.get(channelId);
			this.nbBadgePerChannel.set(channelId, 0);
			$("#badge").text(this.nbBadge);
		}
		if (this.nbBadge == 0) {
			if (navBarSecondLine.children[1]) {
				navBarSecondLine.children[1].style.visibility = "hidden";
			}
		}
	}
}
