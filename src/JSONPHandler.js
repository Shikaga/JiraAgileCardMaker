JiraApiHandler.prototype.requestRapidSprints = function(sprintId) {
	this.showLoadingIndicator();
//https://jira.caplin.com/rest/greenhopper/latest/sprint/10/issues
	var callbackName = this.getCallbackName();
    this.jiraApi.getGreenhopperSprints(function(data) {window[callbackName](data)}, sprintId);
}

JiraApiHandler.prototype.requestRapidViews = function() {
	this.showLoadingIndicator();
	//https://jira.caplin.com/rest/greenhopper/latest/rapidviews/list
	var callbackName = this.getCallbackName();
    this.jiraApi.getGreenhopperList(function(data) {window[callbackName](data)});
}

JiraApiHandler.prototype.requestProjects = function() {
	this.showLoadingIndicator();
	var callbackName = this.getCallbackName();
    this.jiraApi.getProjects(function(data) {window[callbackName](data)});
}

JiraApiHandler.prototype.requestFixVersions = function(project) {
	this.showLoadingIndicator();
	var callbackName = this.getCallbackName();
    this.jiraApi.getVersions(function(data) {window[callbackName](data)}, project);
}

JiraApiHandler.prototype.requestFixVersion = function(project, fixversion) {
	this.showLoadingIndicator();
	var callbackName = this.getCallbackName();
    this.jiraApi.getVersion(function(data) {window[callbackName](data)}, project, fixversion);
};

JiraApiHandler.prototype.requestJira = function(jiraId) {
	this.showLoadingIndicator();
	var callbackName = this.getCallbackName();
    this.jiraApi.getIssue(function(data) {window[callbackName](data)}, jiraId);
};

JiraApiHandler.prototype.getCallbackName = function() {
	var callbackName = "_jiraProcessData_";
	while (window[callbackName]) {
		callbackName += "X";
	}
	window[callbackName] = function(jiraData) {
		this.processJiraData(jiraData);
		delete window[callbackName];
	}.bind(this);
	return callbackName
}