var IssueChecklistHandler = function(issueChecklistUl) {
    this.issues = ko.observableArray([]);
    ko.applyBindings(this, document.getElementById('jiraListIssues'))
}

IssueChecklistHandler.prototype.receiveIssues = function(issues) {
    this.addJirasToInterface(issues);
}

IssueChecklistHandler.prototype.addJirasToInterface = function(issues) {
    this.issues([]);
	for (var i = 0; i < issues.length; i++) {
        this.issues.push({data: issues[i], checked: true});
	}
}

IssueChecklistHandler.prototype.getChecked = function() {
    return _.pluck(this.issues().filter(function(issue) {return issue.checked}), "data");
}
