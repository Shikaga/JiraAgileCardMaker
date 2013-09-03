var JiraApi = function(domain, json, username, password) {
    this.dataType = "jsonp"
    if (json === true) {
        this.dataType = "json";
        this.username = username;
        this.password = password;
    }
	this.domain = domain
    this.jsonApiUrl = this.domain + "/rest/api/latest/";
    this.jsonGreenhopperApiUrl = this.domain + "/rest/greenhopper/latest/";

    this.jch = new JiraCommunicationHandler(domain, username, password);
}

JiraApi.getRandomString = function() {
	return Math.random().toString().substr(2);
}

JiraApi.getRandomFunction = function(callback) {
	var randomString = this.getRandomString();
	var functionName = "cb" + randomString;
	JiraApi[functionName] = function(data) {
		delete window["JiraApi"][functionName];
		callback(data)
	};
	return "JiraApi." + functionName;
}

JiraApi.prototype.getProjects = function(callback) {
	this.getData(callback, "project")
}

JiraApi.prototype.getVersions = function(callback, project) {
	var uriSuffix = "project/" + project + "/versions";
	this.getData(callback, uriSuffix)
}

JiraApi.prototype.getVersion = function(callback, project, fixVersionId) {
	var uriSuffix = "search?jql=project=" + project + "+AND+fixversion=" + fixVersionId + "&maxResults=1000";
	this.getData(callback, uriSuffix)
}

JiraApi.prototype.getIssue = function(callback, issue) {
    var uriSuffix = "issue/" + issue;
    this.getData(callback, uriSuffix)
}

JiraApi.prototype.getGreenhopperList = function(callback) {
    var uriSuffix = "rapidviews/list";
    this.getData(callback, uriSuffix, true)
}

JiraApi.prototype.getGreenhopperSprints = function(callback, sprintId) {
    var uriSuffix = "sprints/" + sprintId;
    this.getData(callback, uriSuffix, true)
}

JiraApi.prototype.getGreenhopperSprint = function(callback, rapidViewId, sprintId) {
    var uriSuffix = "rapid/charts/sprintreport?rapidViewId=" + rapidViewId + "&sprintId=" + sprintId;
    this.getData(callback, uriSuffix, true);
}

JiraApi.prototype.getData = function(callback, type, isGreenhopper) {

    var requestUrl = this.jsonApiUrl + type;
    if (isGreenhopper === true) {
        requestUrl = this.jsonGreenhopperApiUrl + type;
    }

    this.jch.getData(callback, requestUrl);
}
