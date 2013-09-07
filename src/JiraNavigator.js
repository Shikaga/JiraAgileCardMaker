var JiraNavigator = function(jiraUrl) {
	this._noneOption = {value: "none", text: "None"};
	this._noneOptionArray = [this._noneOption];
	this.selectionMethod = {
		value: ko.observable(),
		visible: ko.observable(true),
		options: this._noneOptionArray.concat(this.getNavigationTypes()),
		change: this.handleSelectionMethodChanged
	}
	this.projectsDropDown = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
			if (this.projectsDropDown.value().value !== "none") {
				this.jah.requestFixVersions(this.projectsDropDown.value().value);
			}
		}
	}
	this.sprintsDropDown = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
			if (this.sprintsDropDown.value().value !== "none") {
				this.jah.requestFixVersion(this.projectsDropDown.value().value,this.sprintsDropDown.value().value);
			}
		}
	}
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
	this.csvJirasField = {
		value: ko.observable(),
		visible: ko.observable(false),
		change: function() {
			this.updateJiraListWithIndividualJiras();
			return
		}
	}
	this.renderElement = null;
	this.viewDropDown = null;
	this.projectDropDown = null;
	this.fixVersionsDropDown = null;
	this.jirasField = null;
	this.jah = new JiraApiHandler(jiraUrl, this);
}

JiraNavigator.prototype.handleSelectionMethodChanged = function() {
	var value = this.selectionMethod.value().value
	if (value == "rapidboard") {
		this.clearRapidViewsIfNecessary();
	} else if (value == "fixversion") {
		this.clearJiraList();
		this.clearFixViewIfNecessary();
	} else if (value == "jiras") {
		this.showIndividualJirasField();
	}
}

JiraNavigator.prototype.updateJiraListWithIndividualJiras = function() {
	var jiras = this.csvJirasField.value().split(",").map(λ("_.trim()"));
	this.receiveJiraCallback(jiras);
}

JiraNavigator.prototype.clearRapidViewsIfNecessary = function() {
	if (this.viewDropDown != null && this.viewDropDown.value != "None") {
		if (this.openRapidBoardSprintDropDown != null && this.openRapidBoardSprintDropDown.value != "None") {
			this.jah.getRapidBoardSprint(this.viewDropDown.value, this.openRapidBoardSprintDropDown.value);
		} else {
			this.jah.requestRapidSprints(this.viewDropDown.value);
		}
	} else {
		this.jah.requestRapidViews();
	}
}

JiraNavigator.prototype.clearFixViewIfNecessary = function() {
	if (this.projectDropDown != null && this.projectDropDown.value != "None") {
		if (this.fixVersionsDropDown != null && this.fixVersionsDropDown.value != "None") {
			this.jah.requestFixVersion(this.projectDropDown.value, this.fixVersionsDropDown.value);
		} else {
			this.jah.requestFixVersions(this.projectDropDown.value);
		}
	} else {
		this.jah.requestProjects();
	}
}

JiraNavigator.prototype.showIndividualJirasField = function() {
	this.csvJirasField.visible(true);
}

JiraNavigator.prototype.getNavigationTypes = function() {
	return [
		{value: "fixversion", text: "Sprint"},
		{value: "rapidboard", text: "Rapid Board"},
		{value: "jiras", text: "Comma Seperated Jiras"}
	];
}

JiraNavigator.prototype.receiveRapidBoardViews = function(views) {
	this.rapidBoardsDropDown.visible(true);
	this.setDropDown(this.rapidBoardsDropDown.options, views.views, "id", "name");
}

JiraNavigator.prototype.receiveProjectData = function(views) {
	this.projectsDropDown.visible(true);
	this.setDropDown(this.projectsDropDown.options, views, "key", "name");
}

JiraNavigator.prototype.receiveFixVersionsData = function(views) {
	this.sprintsDropDown.visible(true);
	this.setDropDown(this.sprintsDropDown.options, views, "id", "name");
}

JiraNavigator.prototype.receiveOpenRapidBoardSprints = function(ids) {
	this.rapidBoardSprintsDropDown.visible(true);
	this.setDropDown(this.rapidBoardSprintsDropDown.options, ids, "id", "name")
}

JiraNavigator.prototype.setDropDown = function(dropDown, views, value, text) {
	dropDown.splice(0,dropDown().length);
	dropDown.push(this._noneOption);
	views.forEach(function(view) {
		dropDown.push({value: view[value], text: view[text]});
	}.bind(this));
}

JiraNavigator.prototype.receiveJiraCallback = function(jiras) {
	receiveJiraCallback(jiras);
}

JiraNavigator.prototype.clearJiraList = function(jiras) {
	var stageThree = document.getElementById("stageThree");
	stageThree.style.display = "none";
}

JiraNavigator.prototype.setJira = function(jira) {
	this.navigationTypes.selectedIndex = 3;
	this.onchange(this);
	this.jirasField.value = jira;
	this.onchange(this.jirasField);
}