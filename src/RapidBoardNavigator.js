var RapidBoardNavigator = function(jiraUrl, jiraNavigator) {
	this.jiraNavigator = jiraNavigator;
	this.jah = new JiraApiHandler(jiraUrl, this);
	this.rapidBoardsDropDown = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
			if (this.rapidBoardsDropDown.value().value !== "none") {
				this.jah.requestRapidSprints(this.rapidBoardsDropDown.value().value);
			}
		}
	}
	this.rapidBoardSprintsDropDown = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
			if (this.rapidBoardSprintsDropDown.value().value !== "none") {
				this.jah.getRapidBoardSprint(this.rapidBoardsDropDown.value().value, this.rapidBoardSprintsDropDown.value().value);
			}
		}
	}
}

RapidBoardNavigator.prototype.requestTopLevelData = function() {
	this.jah.requestRapidViews();
}

RapidBoardNavigator.prototype.init = function() {
	ko.applyBindingsToNode(document.getElementById("rapidBoardsDropDown"), null, this);
	ko.applyBindingsToNode(document.getElementById("rapidBoardSprintsDropDown"), null, this);
}

RapidBoardNavigator.prototype.receiveRapidBoardViews = function(views) {
	this.rapidBoardsDropDown.visible(true);
	JiraNavigator.setDropDown(this.rapidBoardsDropDown.options, views.views, "id", "name");
}

RapidBoardNavigator.prototype.receiveOpenRapidBoardSprints = function(ids) {
	this.rapidBoardSprintsDropDown.visible(true);
	JiraNavigator.setDropDown(this.rapidBoardSprintsDropDown.options, ids, "id", "name")
}

RapidBoardNavigator.prototype.hideAll = function() {
	this.rapidBoardsDropDown.visible(false);
	this.rapidBoardSprintsDropDown.visible(false);
}

RapidBoardNavigator.prototype.receiveJiraCallback = function(jiras) {
	this.jiraNavigator.receiveJiraCallback(jiras);
}