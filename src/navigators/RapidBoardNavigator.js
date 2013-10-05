var RapidBoardNavigator = function(jiraUrl, jiraNavigator) {
	this.jiraNavigator = jiraNavigator;
    this.jiraUrl = jiraUrl;
	this.rapidBoardsDropDown = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
			if (this.rapidBoardsDropDown.value().value !== "none") {
				this.jah.requestRapidSprints(this.rapidBoardsDropDown.value().value, function(data) {
					this.receiveOpenRapidBoardSprints(data.sprints)
				}.bind(this));
			}
		}
	}
	this.rapidBoardSprintsDropDown = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
			if (this.rapidBoardSprintsDropDown.value().value !== "none") {
				this.jah.getRapidBoardSprint(this.rapidBoardsDropDown.value().value, this.rapidBoardSprintsDropDown.value().value, function(data) {
					var issues = RapidBoardHandler.getJirasFromJSON(data);
					this.receiveJiraCallback(issues);
				}.bind(this));
			}
		}
	}
}

RapidBoardNavigator.prototype.getDisplayName = function() {
	return "Rapid Board";
}

RapidBoardNavigator.prototype.requestTopLevelData = function() {
    this.jah = new JiraApiHandler(this.jiraUrl, this);
    this.jah.requestRapidViews(function(data) {
		this.receiveRapidBoardViews(data);
	}.bind(this));
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