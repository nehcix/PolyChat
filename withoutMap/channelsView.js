"use strict";

/**
 * @description ChannelsView represents the view of the channels, it updates the channel List and it changes the Active Channel View.
 * @author Xi Chen Shen
 * @author Hakim Payman
 * @copyright Ecole Polytechnique de Montreal & Course LOG2420
 * @version 1.0.0
 */
class ChannelsView {
	/**
	 * This constructor sets the isNew to true, it means that this channelView is new and have never update the channels list
	 */
	constructor() {
		this.isNew = true;
	}

	/**
	 *	First, it will remove all channels from the list. Then, it will add channels in which the current user has joined. Then, it will add channels in which the current user hasn't yet joined. Finally, it will call updateControl un the controller to update the control of the controller (because the Dom is modified).
	 * @param {object} answerFromServer The answerFromServer holds the answer from the server which got parsed in connectionHandler.
	 */
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

	/**
	 * This method will append a new channel (general channel) to the channel list depending on the data in parameter "element".
	 * @param {object} element This variable represents a single channel from the answerFromServer.data.
	 */
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

	/**
	 * This method will append a new channel (joined channels) to the channel list depending on the data in parameter "element".
	 * @param {object} element This variable represents a single channel from the answerFromServer.data.
	 */
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

	/**
	 * This method will append a new channel (not joined channels) to the channel list depending on the data in parameter "element".
	 * @param {object} element This variable represents a single channel from the answerFromServer.data.
	 */
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

	/**
	 * This method will channel the style of the (next) current channel (adds a border in blue) representing by thisEl.
	 * @param {object} thisEl
	 */
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
