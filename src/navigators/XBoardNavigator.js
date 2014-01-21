var XBoardNavigator = function(jiraUrl, jiraNavigator) {
	this.jiraNavigator = jiraNavigator;
    this.jiraUrl = jiraUrl;
	this.xBoardDropDown = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
            if (this.xBoardDropDown.value().value !== "none") {
                this.jah.requestXBoard(this.xBoardDropDown.value().value, this.receiveXBoardData.bind(this));
            }
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
    this.jah = new JiraApiHandler(this.jiraUrl, this);
    this.jah.requestXBoards(this.receiveXBoardList.bind(this));
}

XBoardNavigator.prototype.init = function() {
	ko.applyBindingsToNode(document.getElementById("xBoardDropDown"), null, this);
	ko.applyBindingsToNode(document.getElementById("xBoardSprints"), null, this);
}

XBoardNavigator.prototype.hideAll = function() {
	this.xBoardDropDown.visible(false);
    this.xBoardSprintsDropDown.visible(false);
}

XBoardNavigator.prototype.receiveXBoardData = function(jiraData) {
    //TODO: Cleanup this architecture, we need to pass epics data to the app nicely somehow
    epics = jiraData.epicData.epics;
    this.sprints = this.getSprints(jiraData);
    this.xBoardSprintsDropDown.visible(true);
    JiraNavigator.setDropDown(this.xBoardSprintsDropDown.options, this.sprints, "name", "name");
}

XBoardNavigator.prototype.receiveXBoardList = function(jiraData) {
    this.xBoardDropDown.visible(true);
    JiraNavigator.setDropDown(this.xBoardDropDown.options, jiraData.views, "id", "name");
}

XBoardNavigator.prototype.getSprints = function(jiraData) {
    var sprints = [];
    if (jiraData.openSprints) {
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
    } else {
       var jiraMap = {};
        jiraData.issues.forEach(function(issue) {
            jiraMap[issue.id] = issue;
        })
        //var sprintIssueArray = [];
        jiraData.sprints.forEach(function(sprint) {
            var sprintIssues = [];
            sprint.issuesIds.forEach(function(issueId) {
                sprintIssues.push(jiraMap[issueId].key);
                delete jiraMap[issueId];
            })
            sprints.push({name: sprint.name, jiras: sprintIssues});
        });
        var sprintIssues = [];
        for (var key in jiraMap) {
            sprintIssues.push(jiraMap[key].key);
        }
        sprints.push({name: "Backlog", jiras: sprintIssues});

    }
    return sprints

}

XBoardNavigator.prototype.getKeyFromIssue = function(issues) {
    var returnKeys = [];
    issues.forEach(function(_) {
        returnKeys.push(_.key);
    })
    return returnKeys;
}
