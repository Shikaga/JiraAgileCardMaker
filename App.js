jira.App = function(divId)
{
	this.ticketId = 0;
	this.divId = divId;
	var iterationVersion = "https://jira.caplin.com/rest/api/latest/search?jql=project=PCTCUT&fixversion=12994&fields=key";
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

jira.App.prototype.getJiraCallback = function(e)
{
	var jiraId = e.key;
	var jiraEstimate = e.fields["customfield_10243"];
	var jiraSummary = e.fields.summary;
	console.log("Callback!", jiraId, jiraEstimate, jiraSummary);
	this.addTicket(this.divId,"jira.caplin.com/browse/" + jiraId, jiraId, jiraEstimate, jiraSummary);
}

jira.App.prototype.addTicket = function(divId, url, title, estimate, summary)
{
	this.ticketId++;
	var titleElement = document.createElement("div");
	titleElement.setAttribute("id", divId + "_ticket" + this.ticketId);
	document.getElementById(divId).appendChild(titleElement);
	new jira.ticketviewer.ticketgenerator.TicketGenerator(divId + "_ticket" + this.ticketId,url, title, estimate, summary);	
}
