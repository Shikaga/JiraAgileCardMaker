var XBoardNavigator = function(jiraUrl, jiraNavigator) {
	this.jiraNavigator = jiraNavigator;
	this.jah = new JiraApiHandler(jiraUrl, this);
	this.xBoardIdField = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
			this.jah.requestXBoard(this.xBoardIdField.value());
		}
	}
	this.xBoardSprintsDropDown = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
			if (this.xBoardSprintsDropDown.value().value !== "none") {
                for (var i=0; i < this.sprints.length; i++) {
                    var sprint = this.sprints[i];
                    if (sprint.name == this.xBoardSprintsDropDown.value().value) {
                        this.jiraNavigator.receiveJiraCallback(sprint.jiras);
                    }
                }
			}
		}
	}
}

XBoardNavigator.prototype.getDisplayName = function() {
	return "XBoard";
}

XBoardNavigator.prototype.requestTopLevelData = function() {
    this.xBoardIdField.visible(true);
}

XBoardNavigator.prototype.init = function() {
	ko.applyBindingsToNode(document.getElementById("xBoardId"), null, this);
	ko.applyBindingsToNode(document.getElementById("xBoardSprints"), null, this);
}

XBoardNavigator.prototype.hideAll = function() {
	this.xBoardIdField.visible(false);
    this.xBoardSprintsDropDown.visible(false);
}

XBoardNavigator.prototype.receiveXBoardData = function(jiraData) {
    this.epics = jiraData.epicData.epics;
    this.sprints = this.getSprints(jiraData);
    this.xBoardSprintsDropDown.visible(true);
    JiraNavigator.setDropDown(this.xBoardSprintsDropDown.options, this.sprints, "name", "name");
}

XBoardNavigator.prototype.getSprints = function(jiraData) {
    var sprints = [];
    for (var i=0; i < jiraData.openSprints.length; i++) {
        var openSprint = jiraData.openSprints[i];
        sprints.push({name: openSprint.name, jiras: this.getKeyFromIssue(openSprint.issues)});
    }
    for (var i=0; i < jiraData.markers.length; i++) {
        var marker = jiraData.markers[i];
        var sprint = {name: marker.name, jiras: []}
        sprints.push(sprint);
        while (jiraData.issues.length !== 0){
            if (marker.afterIssueKey === undefined) {
                break;
            }
            var jira = jiraData.issues.shift();
            sprint.jiras.push(jira.key);
            if (jira.key == marker.afterIssueKey) {
                break
            }
        }

    }
    sprints.push({name: "Backlog", jiras: this.getKeyFromIssue(jiraData.issues)});
    return sprints

}

XBoardNavigator.prototype.getKeyFromIssue = function(issues) {
    var returnKeys = [];
    issues.forEach(function(_) {
        returnKeys.push(_.key);
    })
    return returnKeys;
}
