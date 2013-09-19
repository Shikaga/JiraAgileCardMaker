var FixVersionNavigator = function(jiraUrl, jiraNavigator) {
	this.jiraNavigator = jiraNavigator;
    this.jiraUrl = jiraUrl;
	this.projectsDropDown = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
			if (this.projectsDropDown.value().value !== "none") {
				this.jah.requestFixVersions(this.projectsDropDown.value().value, function(data) {
					this.receiveFixVersionsData(data);
				}.bind(this));
			}
		}
	}
	this.sprintsDropDown = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
			if (this.sprintsDropDown.value().value !== "none") {
				this.jah.requestFixVersion(this.projectsDropDown.value().value,this.sprintsDropDown.value().value, function(data) {
					this.receiveJiraCallback(data.issues.map(λ("_.key")));
				}.bind(this));
			}
		}
	}
}

FixVersionNavigator.prototype.getDisplayName = function() {
	return "Sprint";
}

FixVersionNavigator.prototype.init = function() {
	ko.applyBindingsToNode(document.getElementById("projectsDropDown"), null, this);
	ko.applyBindingsToNode(document.getElementById("sprintsDropDown"), null, this);
}

FixVersionNavigator.prototype.hideAll = function() {
	this.projectsDropDown.visible(false);
	this.sprintsDropDown.visible(false);
}

FixVersionNavigator.prototype.requestTopLevelData = function() {
    this.jah = new JiraApiHandler(this.jiraUrl, this);
    this.jah.requestProjects(function(data) {
        this.receiveProjectData(data);
    }.bind(this));
}

FixVersionNavigator.prototype.receiveProjectData = function(views) {
	this.projectsDropDown.visible(true);
	JiraNavigator.setDropDown(this.projectsDropDown.options, views, "key", "name");
}

FixVersionNavigator.prototype.receiveFixVersionsData = function(views) {
	this.sprintsDropDown.visible(true);
	JiraNavigator.setDropDown(this.sprintsDropDown.options, views, "id", "name");
}

FixVersionNavigator.prototype.receiveJiraCallback = function(jiras) {
	this.jiraNavigator.receiveJiraCallback(jiras);
}