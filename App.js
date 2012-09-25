jira.App = function(divId, fixVersion)
{
	this.fixVersion = fixVersion;
	this.ticketId = 0;
	this.divId = divId;
	this.totalTickets = 0;
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
		console.log(issue, e.issues[issue]);
	}
}

jira.App.prototype.matchFixVersion = function(e)
{
	var matchesFixVersion = false;
	console.log(e.key, fixVersions);
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
		var jiraId = e.key;
		var jiraEstimate = e.fields["customfield_10243"];
		var jiraSummary = e.fields.summary;
		console.log("Callback!", jiraId, jiraEstimate, jiraSummary);
		this.addTicket(this.divId,"jira.caplin.com/browse/" + jiraId, jiraId, jiraEstimate, jiraSummary, pageElement);
		console.log("Tickets Produced", this.totalTickets);
	}
}

jira.App.prototype.addTicket = function(divId, url, title, estimate, summary, pageElement)
{
	this.ticketId++;
	var titleElement = document.createElement("div");
	titleElement.setAttribute("id", divId + "_ticket" + this.ticketId);
	pageElement.appendChild(titleElement);
	new jira.ticketviewer.ticketgenerator.TicketGenerator(divId + "_ticket" + this.ticketId,url, title, estimate, summary);	
}
