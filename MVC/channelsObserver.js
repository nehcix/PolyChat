"use strict";

class ChannelsObserver {
	constructor() {
		this.listOfChannels = document.getElementById("listOfChannels");
		this.activeGroup = document.getElementById("actifGroupe");
		this.activeGroupId;
	}

	updateChannelsList(answerFromServer) {
		// when we remove 1st child, 2nd child becomes 1st... and the length decrease...
		let length = this.listOfChannels.children.length;
		for (let i = 1; i < length; ++i) {
			this.listOfChannels.children[1].remove();
		}
		// first time on chat, default channel is on General
		if (this.listOfChannels.children.length == 0) {
			this.updateGeneral(answerFromServer.data[0]);
			this.activeGroup.innerHTML = answerFromServer.data[0].name;
			this.activeGroupId = answerFromServer.data[0].id;
		}
		for (let i = 1; i < answerFromServer.data.length; ++i) {
			this.updateUserGroups(answerFromServer.data[i]);
		}
	}

	updateGeneral(element) {
		let icon = '<i class="fas fa-star"></i>';
		let defaultTag = '<span id="defaultTag">défaut</span>';
		listOfChannels.innerHTML +=
			'<div class="chatGroup" id="' +
			element.id +
			'">' +
			icon +
			'<span class="groupName" onclick="connectionHandler.changeActiveGroupFromGroupDiv(this.parentElement)">' +
			element.name +
			"</span>" +
			defaultTag +
			"</div>";
	}

	updateUserGroups(element) {
		let icon;
		if (element.joinStatus == false) {
			icon = '<i class="fas fa-plus" onclick="connectionHandler.joinChannel(this)"></i>';
		} else {
			icon = '<i class="fas fa-minus" onclick="connectionHandler.leaveChannel(this)"></i>';
		}
		listOfChannels.innerHTML +=
			'<div class="chatGroup" id="' +
			element.id +
			'">' +
			icon +
			'<span class="groupName" onclick="connectionHandler.changeActiveGroupFromGroupDiv(this.parentElement)">' +
			element.name +
			"</span></div>";
	}
}
