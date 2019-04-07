"use strict";

class ChannelsVue {
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
	}

	updateGeneral(element) {
		let liChatGroup = document.createElement("li");
		liChatGroup.classList.add("chatGroup");
		liChatGroup.setAttribute("id", element.id);

		let icon = document.createElement("i");
		icon.classList.add("fas");
		icon.classList.add("fa-star");

		let spanGroupName = document.createElement("span");
		spanGroupName.classList.add("groupName");
		spanGroupName.setAttribute("onclick", "connectionHandler.changeActiveGroupWithVerification(this)");
		spanGroupName.setAttribute("status", element.joinStatus);
		spanGroupName.setAttribute("id", element.name);
		spanGroupName.innerHTML = element.name;

		let defaultTag = document.createElement("span");
		defaultTag.classList.add("toTranslate");
		defaultTag.setAttribute("id", "defaultTag");
		defaultTag.setAttribute("key", "Default");

		liChatGroup.appendChild(icon);
		liChatGroup.appendChild(spanGroupName);
		liChatGroup.appendChild(defaultTag);
		listOfChannels.appendChild(liChatGroup);
	}

	updateJoined(element) {
		let liChatGroup = document.createElement("li");
		liChatGroup.classList.add("chatGroup");
		liChatGroup.setAttribute("id", element.id);
		liChatGroup.setAttribute("status", element.joinStatus);

		let icon = document.createElement("i");
		icon.classList.add("fas");

		icon.classList.add("fa-minus");
		icon.setAttribute("onclick", "connectionHandler.leaveChannel(this)");

		let spanGroupName = document.createElement("span");
		spanGroupName.classList.add("groupName");
		spanGroupName.setAttribute("onclick", "connectionHandler.changeActiveGroupWithVerification(this)");
		spanGroupName.setAttribute("status", element.joinStatus);
		spanGroupName.setAttribute("id", element.name);
		spanGroupName.innerHTML = element.name;

		liChatGroup.appendChild(icon);
		liChatGroup.appendChild(spanGroupName);
		listOfChannels.appendChild(liChatGroup);
	}

	updateNotJoined(element) {
		let liChatGroup = document.createElement("li");
		liChatGroup.classList.add("chatGroup");
		liChatGroup.setAttribute("id", element.id);
		liChatGroup.setAttribute("status", element.joinStatus);

		let icon = document.createElement("i");
		icon.classList.add("fas");
		icon.classList.add("fa-plus");
		icon.setAttribute("onclick", "connectionHandler.joinChannel(this)");

		let spanGroupName = document.createElement("span");
		spanGroupName.classList.add("groupName");
		spanGroupName.setAttribute("onclick", "connectionHandler.changeActiveGroupWithVerification(this)");
		spanGroupName.setAttribute("status", element.joinStatus);
		spanGroupName.setAttribute("id", element.name);
		spanGroupName.innerHTML = element.name;

		liChatGroup.appendChild(icon);
		liChatGroup.appendChild(spanGroupName);
		listOfChannels.appendChild(liChatGroup);
	}

	// sortChannels(idName) {
	// 	var listOfChannels = $("#" + idName);

	// 	listOfChannels
	// 		.children()
	// 		.detach()
	// 		.sort(function(a, b) {
	// 			return $(a)
	// 				.text()
	// 				.localeCompare($(b).text());
	// 		})
	// 		.appendTo(listOfChannels);
	// }
}
