var jiraRequestedTimeout = null;
var oApp = null;

function getParameter(l_sName) {
	var l_oMatch = window.location.search.match(new RegExp("[?&]" + l_sName + "=([^&]*)"));
	return ((l_oMatch == null) ? null : l_oMatch[1]);
}

function addQRCode(divId, url, size) {
	if (size == null || size == undefined) size = 50;
	document.getElementById(divId).innerHTML = '<img style="margin-top: 20px;" width="' + size + 'px" height="' + size + 'px" src="http://qr.kaywa.com/?s=8&d=http%3A%2F%2F' + url + '" alt="QRCode"/>';
}

function wizard() {
	var url = document.getElementById("wizard").value;
	var projectStart = url.indexOf("browse/");
	var fixversionStart = url.indexOf("fixforversion/");

	if (projectStart != -1 && fixversionStart != -1) {
		project = url.substring(projectStart + 7, fixversionStart - 1);
		fixversion = url.substring(fixversionStart + 14);
		document.getElementById("project").value = project;
		document.getElementById("fixversion").value = fixversion;
		document.getElementById("wizard").value = "";
	} else {
		alert("This url was unrecognized");
		alert("try: \"http://jira.caplin.com/browse/PSL/fixforversion/12733\"")
	}
}

jiraId = getParameter("jira");

function drawExampleCard() {

	var card = {
		"issueId": "PCTCUT-511",
		"issueUrl": "https://jira.caplin.com/browse/PCTCUT-511",
		"issueType": "Technical task",
		"checkBoxes": ["Rel Note", "Wiki", "Review"],
		"estimate": 3,
		"summary": "A tech task.",
		"component": "COMP",
		"tag": "TAG",
		"parentIssueId": "PCTCUT-523",
		"colorEnabled": true,
		"qrCodeEnabled": true
	}

	var parentCard = {
			"issueId": "PCTCUT-523",
			"issueUrl": "https://jira.caplin.com/browse/PCTCUT-523",
			"issueType": "Story",
			"checkBoxes": ["Doc", "Demo", "Review"],
			"estimate": 2,
			"summary": "A marvelous summary.",
			"component": "COMP",
			"tag": "TAG",
			"parentSummary": "A parent summary",
			"componentEnabled": true,
			"tagEnabled": true
		};

	var parentMap = {};
	var ticket = new Card( card.issueId,
		card.issueUrl, card.issueType, card.estimate,
		card.summary, card.component, card.tag, card.parentIssueId);

	parentMap[card.issueId] = card;
	parentMap[parentCard.issueId] = parentCard;

	var view = new CardView(ticket, parentMap, card.checkBoxes,
		document.getElementById("parentdescription").checked,
		document.getElementById("componentdescription").checked,
		document.getElementById("tagdescription").checked,
		document.getElementById("color").checked,
		document.getElementById("qrcode").checked);

	document.getElementById("example-card").innerHTML = "";
	document.getElementById("example-card").appendChild(view.getElement());
}

drawExampleCard();

function initializeFields() {
	var project = getParameter("project");
	var fixversion = getParameter("fixversion");
	document.getElementById("project").value = project;
	document.getElementById("fixversion").value = fixversion;
}

initializeFields();

var pageElement = document.createElement("div");
function getJiraCallback(e) {
	oApp.processJiraData(e);
}


//JIRA DISPALYER
function getJiras() {
	var project = document.getElementById("project").value;
	var fixversion = document.getElementById("fixversion").value;
	var jiraUrl = document.getElementById("jiraLocation").value;
	var jah = new JiraApiHandler(jiraUrl, this);
	jah.requestFixVersion(project, fixversion);
}

function receiveJiras(e) {
	clearTimeout(jiraRequestedTimeout);
	issueChecklistUl = document.getElementById("jiraListUrl");
	var ich = new IssueChecklistHandler(issueChecklistUl, e.issues);
}

columnCounter = 0;
function addQRCodeDiv() {
	var QRCodeDiv = document.createElement("span");
	QRCodeDiv.style.width = "200px";
	QRCodeDiv.style.height = "200px";
	QRCodeDiv.style.margin = "20px";
	QRCodeDiv.id = "qrcode_" + columnCounter++;
	document.body.appendChild(QRCodeDiv);
	return QRCodeDiv.id;
}

function hideInterface() {
	var interf = document.getElementById("ticketManager");
	interf.style.display = "none";
}

function clearTickets() {
	document.getElementById("tickets").innerHTML = "";
}

function showInterface() {
	clearTickets();
	var interf = document.getElementById("ticketManager");
	interf.style.display = "block";
}

function generateTickets() {
	var jiraUrl = document.getElementById("jiraLocation").value;
	var jiraChecklists = document.getElementsByClassName("jiracheck");
	var checklistToDisplay = getChecked("jiracheck");
	hideInterface();

	var color = document.getElementById("color").checked;
	var qrcode = document.getElementById("qrcode").checked;
	var parentDescription = document.getElementById("parentdescription").checked;
	var componentDescription = document.getElementById("componentdescription").checked;
	var tagDescription = document.getElementById("tagdescription").checked;

	oApp = new jira.App(document.getElementById('tickets'), jiraUrl, document.getElementById("fixversion").value, color, qrcode, parentDescription, componentDescription, tagDescription);
	oApp.requestIssues(checklistToDisplay);
}

//COLUMNS

function addColumnsToInterface() {
	var columnsArray = ["Backlog", "In Dev", "Awaiting QA", "In QA", "Resolved"];
	for (var i = 0; i < columnsArray.length; i++) {
		addCheckList("columnListUl", columnsArray[i], null, "columncheck");
	}
}

function generateColumns() {
	var project = document.getElementById("project").value;
	var jiraUrl = document.getElementById("jiraLocation").value;
	if (project != "") {
		var columnsMap = {
			"Backlog": "Backlog",
			"In Dev": "In%20Progress%3A%20Development",
			"Awaiting QA": "Awaiting%20Test",
			"In QA": "In%20Progress%3A%20QA%2FTest",
			"Resolved": "Resolved"
		};
		var columnChecklists = getChecked("columncheck");
		for (var i = 0; i < columnChecklists.length; i++) {
			var url = jiraUrl + "/secure/IssueNavigator.jspa?jqlQuery=project+%3D+" + project + "+AND+status+%3D+" + columnsMap[columnChecklists[i]];
			hideInterface();
			addQRCode(addQRCodeDiv(), url, 200)
		}
	} else {
		alert("You have not set the Project Name");
	}
}

//addColumnsToInterface();
