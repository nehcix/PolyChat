"use strict";

class MessagesVue {
	constructor() {
		this.nbBadge = 0;
		this.nbBadgePerChannel = new Map();
	}

	onMessage(answerFromServer, userName) {
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
		} else if (answerFromServer.sender == userName) {
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

		inputToSend.value = "";
		messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
	}

	addNewBadge(channelId) {
		document.getElementById("badge" + channelId).style.display = "inline-block";

		if (this.nbBadge == 0) {
			this.nbBadgePerChannel.set(channelId, 1);
			this.nbBadge = 1;

			let badge = document.createElement("div");
			badge.setAttribute("id", "badge");
			badge.innerHTML = this.nbBadge;
			navBarSecondLine.appendChild(badge);
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
				navBarSecondLine.children[1].remove();
			}
		}
	}
}
