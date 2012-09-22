var jira = function() {};
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
		this.addTicket(this.divId,"jira.caplin.com/browse/" + e.issues[issue].key, e.issues[issue].key);
		console.log(issue, e.issues[issue]);
	}
}

jira.App.prototype.addTicket = function(divId, url, title, estimate)
{
	this.ticketId++;
	var titleElement = document.createElement("div");
	titleElement.setAttribute("id", divId + "_ticket" + this.ticketId);
	document.getElementById(divId).appendChild(titleElement);
	new jira.ticketviewer.ticketgenerator.TicketGenerator(divId + "_ticket" + this.ticketId,url, title, null);	
}
