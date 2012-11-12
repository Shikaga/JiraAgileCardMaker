jira.App = function(divId, fixVersion)
{
	this.fixVersion = fixVersion;
	this.ticketId = 0;
	this.divId = divId;
	this.totalTickets = 0;
	this.issueTypeColors = {
		"Bug": "#C00"
		,"Documentation": "#FFD600"
		,"Improvement": "#090"
		,"Story": "#909"
		,"Technical task": "#099"}
	this.colorEnabled = getParameter("color");
}

jira.App.prototype.x = function(e)
{
	
	for (var issue in e.issues)
	{
		var jiraUrl = "https://jira.caplin.com/rest/api/latest/issue/" + e.issues[issue].key + "?jsonp-callback=getJiraCallback";
		var scriptElement = document.createElement("script");
		scriptElement.setAttribute("type", "text/javascript");
		scriptElement.setAttribute("src", jiraUrl);
		document.head.appendChild(scriptElement);
	}
}

jira.App.prototype.matchFixVersion = function(e)
{
	var matchesFixVersion = false;
	var fixVersions = e.fields.fixVersions;
	for (var version in fixVersions)
	{
		if (fixVersions[version].id == this.fixVersion) matchesFixVersion = true;
	}
	return matchesFixVersion;
}

jira.App.prototype.getJiraCallback = function(e, pageElement)
{
	if (this.matchFixVersion(e)) {
		this.totalTickets++;
        if (e.fields.parent)
        var parent = e.fields.parent.key;
		var jiraId = e.key;
		var jiraEstimate = e.fields["customfield_10243"];
		var jiraSummary = e.fields.summary;
		var color = this.colorEnabled ? this.issueTypeColors[e.fields.issuetype.name] : null;
		this.addTicket(this.divId,"jira.caplin.com/browse/" + jiraId, jiraId, jiraEstimate, jiraSummary, parent, color, pageElement);
	}
}

jira.App.prototype.addTicket = function(divId, url, title, estimate, summary, parent, color, pageElement)
{
	this.ticketId++;
	var titleElement = document.createElement("div");
	titleElement.setAttribute("id", divId + "_ticket" + this.ticketId);
	pageElement.appendChild(titleElement);
	new jira.ticketviewer.ticketgenerator.TicketGenerator(divId + "_ticket" + this.ticketId,url, title, estimate, summary, parent, color);	
}
