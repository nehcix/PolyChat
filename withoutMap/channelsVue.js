"use strict";

class ChannelsView {
	constructor() {
		this.isNew = true;
	}

	updateChannelsList(answerFromServer) {
		while (listOfChannels.firstChild) {
			listOfChannels.removeChild(listOfChannels.firstChild);
		}
		this.updateGeneral(answerFromServer.data[0]);

		for (let i = 1; i < answerFromServer.data.length; i++) {
			if (answerFromServer.data[i].joinStatus == true) {
				this.updateJoined(answerFromServer.data[i]);
			}
		}
		for (let i = 1; i < answerFromServer.data.length; i++) {
			if (answerFromServer.data[i].joinStatus == false) {
				this.updateNotJoined(answerFromServer.data[i]);
			}
		}

		controller.updateControl.call(controller);
	}

	updateGeneral(element) {
		let liChatChannel = document.createElement("li");
		liChatChannel.classList.add("chatChannel");
		liChatChannel.setAttribute("id", element.id);

		let icon = document.createElement("i");
		icon.classList.add("fas");
		icon.classList.add("fa-star");
		icon.style.color = "darkorange";

		let spanChannelName = document.createElement("span");
		spanChannelName.classList.add("channelName");
		spanChannelName.setAttribute("status", element.joinStatus);
		spanChannelName.setAttribute("id", element.name);
		spanChannelName.innerHTML = element.name;

		let defaultTag = document.createElement("span");
		defaultTag.classList.add("toTranslate");
		defaultTag.setAttribute("id", "defaultTag");
		defaultTag.setAttribute("key", "Default");
		defaultTag.innerHTML = "défaut";

		let badgeDot = document.createElement("span");
		badgeDot.setAttribute("id", "badge" + element.id);
		badgeDot.classList.add("badgeDot");
		badgeDot.style.display = "none";

		liChatChannel.appendChild(icon);
		liChatChannel.appendChild(spanChannelName);
		liChatChannel.appendChild(defaultTag);
		liChatChannel.appendChild(badgeDot);
		listOfChannels.appendChild(liChatChannel);
	}

	updateJoined(element) {
		let liChatChannel = document.createElement("li");
		liChatChannel.classList.add("chatChannel");
		liChatChannel.setAttribute("id", element.id);
		liChatChannel.setAttribute("status", element.joinStatus);

		let icon = document.createElement("i");
		icon.classList.add("fas");
		icon.classList.add("fa-minus");
		icon.classList.add("toLeave");
		icon.style.color = "darkorange";

		let spanChannelName = document.createElement("span");
		spanChannelName.classList.add("channelName");
		spanChannelName.setAttribute("status", element.joinStatus);
		spanChannelName.setAttribute("id", element.name);
		spanChannelName.innerHTML = element.name;

		let badgeDot = document.createElement("span");
		badgeDot.setAttribute("id", "badge" + element.id);
		badgeDot.classList.add("badgeDot");
		badgeDot.style.display = "none";

		liChatChannel.appendChild(icon);
		liChatChannel.appendChild(spanChannelName);
		liChatChannel.appendChild(badgeDot);
		listOfChannels.appendChild(liChatChannel);
	}

	updateNotJoined(element) {
		let liChatChannel = document.createElement("li");
		liChatChannel.classList.add("chatChannel");
		liChatChannel.setAttribute("id", element.id);
		liChatChannel.setAttribute("status", element.joinStatus);

		let icon = document.createElement("i");
		icon.classList.add("fas");
		icon.classList.add("fa-plus");
		icon.classList.add("toJoin");
		icon.style.color = "#5b898b";

		let spanChannelName = document.createElement("span");
		spanChannelName.classList.add("channelName");
		spanChannelName.setAttribute("status", element.joinStatus);
		spanChannelName.setAttribute("id", element.name);
		spanChannelName.innerHTML = element.name;

		let badgeDot = document.createElement("span");
		badgeDot.setAttribute("id", "badge" + element.id);
		badgeDot.classList.add("badgeDot");
		badgeDot.style.display = "none";

		liChatChannel.appendChild(icon);
		liChatChannel.appendChild(spanChannelName);
		liChatChannel.appendChild(badgeDot);
		listOfChannels.appendChild(liChatChannel);
	}

	changeActiveChannelView(thisEl) {
		if (currentChannel) {
			currentChannel.style.padding = null;
			currentChannel.style.border = null;
			currentChannel.style.borderRadius = null;
		}

		activeChannel.innerHTML = thisEl.innerHTML;
		currentChannel = thisEl;

		inputToSend.focus();

		thisEl.style.padding = "2px 10px";
		thisEl.style.border = "1px solid rgb(39, 89, 180)";
		thisEl.style.borderRadius = "20px";
	}
}
