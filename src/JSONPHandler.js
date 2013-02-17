JiraApiHandler.prototype.requestRapidSprints = function(sprintId) {

//https://jira.caplin.com/rest/greenhopper/latest/sprint/10/issues
	var callbackName = this.getCallbackName();
	//https://jira.caplin.com/rest/greenhopper/latest/sprints/11
	jiraUrl = this.baseUrl + "/rest/greenhopper/latest/sprints/" + sprintId + "?jsonp-callback=" + callbackName;
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
}

JiraApiHandler.prototype.requestRapidViews = function() {
	//https://jira.caplin.com/rest/greenhopper/latest/rapidviews/list
	var callbackName = this.getCallbackName();
	var jiraUrl = this.baseUrl + "/rest/greenhopper/latest/rapidviews/list" + "?jsonp-callback=" + callbackName;
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
}

JiraApiHandler.prototype.requestProjects = function() {
	//https://jira.springsource.org/rest/api/latest/project
	var callbackName = this.getCallbackName();
	var jiraUrl = this.baseUrl + "/rest/api/latest/project" + "?jsonp-callback=" + callbackName;
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
}

JiraApiHandler.prototype.requestFixVersions = function(project) {
	//https://jira.springsource.org/rest/api/latest/project/BATCH/versions
	var callbackName = this.getCallbackName();
	var jiraUrl = this.baseUrl + "/rest/api/latest/project/" + project + "/versions" + "?jsonp-callback=" + callbackName;
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
}



JiraApiHandler.prototype.requestFixVersion = function(project, fixversion) {
	var callbackName = this.getCallbackName();
	if (project != "" && fixversion != "") {
		jiraUrl = this.baseUrl + "/rest/api/latest/search?jql=project=" + project + "%20AND%20fixversion=" + fixversion + "&fields=key&jsonp-callback=" + callbackName + "&maxResults=1000";

		var scriptElement = document.createElement("script");
		scriptElement.setAttribute("type", "text/javascript");
		scriptElement.setAttribute("src", jiraUrl);
		document.head.appendChild(scriptElement);
		jiraRequestedTimeout = setTimeout(function () {
			alert("The Jira's have not loaded after 2 seconds. Are you sure you are logged in?");
		}, 2000);
	} else {
		alert("You have not set the Project Name or Fix Version");
	}
};

JiraApiHandler.prototype.requestJira = function(jiraId) {
	var callbackName = this.getCallbackName();
	var jiraUrl = this.baseUrl + "/rest/api/latest/issue/" + jiraId + "?jsonp-callback="+callbackName;
	var scriptElement = document.createElement("script");
	scriptElement.setAttribute("type", "text/javascript");
	scriptElement.setAttribute("src", jiraUrl);
	document.head.appendChild(scriptElement);
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