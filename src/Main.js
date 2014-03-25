

var jiraRequestedTimeout = null;
var oApp = null;
var columnCounter = 0;
var pageElement = document.createElement("div");

issueChecklistUl = document.getElementById("jiraListUrl");
var ich = new IssueChecklistHandler(issueChecklistUl);
var ah = new AuthenticationHandler();

function getParameter(l_sName) {
	var l_oMatch = window.location.search.match(new RegExp("[?&]" + l_sName + "=([^&]*)"));
	return ((l_oMatch == null) ? null : l_oMatch[1]);
}

function wizard() {
	var url = document.getElementById("wizard").value;
	var hostName = getHostFromUrl(url);
	if (hostName == null) {
		alert ("That URL doesn't contain a hostName");
	} else {

		document.getElementById("jiraLocation").value = hostName;
		var urlType = getUrlType(url);
		if (urlType == "fixVersion") {
			var projectStart = url.indexOf("browse/");
			var fixVersionStart = url.indexOf("fixforversion/");

			if (projectStart != -1 && fixVersionStart != -1) {
				setWizardCookie();
				project = url.substring(projectStart + 7, fixVersionStart - 1);
				fixversion = url.substring(fixVersionStart + 14);
				debugger;
			} else {
				alert("This url was unrecognized");
				alert("try: \"http://jira.caplin.com/browse/PSL/fixforversion/12733\"")
			}
		} else if (urlType == "rapidBoard") {
			var sprint = RapidBoardHandler.getSprintIfFromURL(url);
			debugger;
			//document.getElementById("rapidSprint").value = sprint;
		} else if (urlType == "jira") {
			jn.setJira(getJiraFromUrl(url));
		}
		document.getElementById("wizard").value = "";
	}
}

function getUrlType(url) {
	if (url.indexOf("fixforversion") != -1) {
		return "fixVersion";
	} else if (url.indexOf("browse") != -1) {
		return "jira";
	} else if (url.indexOf("RapidBoard.jspa") != -1) {
		return "rapidBoard";
	} else {
		return "null";
	}
}

function setJiraLocation(url) {
    ah.location(url);
}

function getJiraFromUrl(url) {
	return url.split("/browse/")[1];
}

function getHostFromUrl(url) {
	var protocol = url.split("://")[0];
	if (protocol == null) return null;
	var restOfUrl = url.split("://")[1];
	if (restOfUrl == null) return null;
	var host = restOfUrl.split("/")[0];
	if (host == null) return null;
	return protocol + "://" + host;
}

function getJiraCallback(e) {
	oApp.processJiraData(e);
}

function getJiras() {
	var project = document.getElementById("project").value;
	var fixVersion = document.getElementById("fixversion").value;
	var sprint = document.getElementById("rapidSprint").value;
	var jiraUrl = document.getElementById("jiraLocation").value;
	var jah = new JiraApiHandler(jiraUrl, this);
	if (project != "" && fixVersion != "") {
		setCookies();
		jah.requestFixVersion(project, fixVersion);
	} else if (sprint != "") {
		jah.requestRapidBoard(sprint);
	}
}

function toggleOptions()
{
	var stageFour = document.getElementById("stageFour");
	var toggleOptionsButton = document.getElementById("toggleOptionsButton");
	if (stageFour.style.display == "none") {
		stageFour.style.display = "block";
		toggleOptionsButton.innerHTML = "Hide Options";
	} else {
		stageFour.style.display = "none";
		toggleOptionsButton.innerHTML = "Show Options";
	}

}

function receiveJiraCallback(issues) {
	var stageThree = document.getElementById("stageThree");
	stageThree.style.display = "block";

	clearTimeout(jiraRequestedTimeout);
    ich.receiveIssues(issues);
}

function generateTickets() {
	window.location.hash = "#tickets";
	var jiraUrl = document.getElementById("jiraLocation").value;
	var jiraChecklists = document.getElementsByClassName("jiracheck");
	var checklistToDisplay = ich.getChecked();
	hideInterface();

	var color = document.getElementById("color").checked;
	var qrcode = document.getElementById("qrcode").checked;
	var parentDescription = document.getElementById("parentdescription").checked;
	var componentDescription = document.getElementById("componentdescription").checked;
	var tagDescription = document.getElementById("tagdescription").checked;
    var businessValue = document.getElementById("businessvalue").checked;
    var epicsEnabled = document.getElementById("epicsEnabled").checked;

	oApp = new jira.App(document.getElementById('tickets'), jiraUrl, null, color, qrcode, parentDescription, componentDescription, tagDescription, businessValue, epicsEnabled);
	oApp.requestIssues(checklistToDisplay);
}

function drawExampleCard() {

	if (document.getElementById("example-card") != null ) {

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
			"qrCodeEnabled": true,
			"businessvalue": "6"
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
			"tagEnabled": true,
			"businessvalue":6
		};

		var parentMap = {};
		var ticket = new Card(card.issueId, card.issueUrl, card.issueType, card.estimate, card.summary, card.component, card.tag, card.businessvalue, card.parentIssueId);

		parentMap[card.issueId] = card;
		parentMap[parentCard.issueId] = parentCard;

		var view = new CardView(ticket, parentMap, card.checkBoxes,
			document.getElementById("parentdescription").checked,
			document.getElementById("componentdescription").checked,
			document.getElementById("tagdescription").checked,
			document.getElementById("color").checked,
			document.getElementById("qrcode").checked,
			document.getElementById("businessvalue").checked);

		document.getElementById("example-card").innerHTML = "";
		document.getElementById("example-card").appendChild(view.getElement());
	}
}

function setCookies() {
	Cookies.set("jiraLocation", document.getElementById("jiraLocation").value);

	Cookies.set("colorEnabled", document.getElementById("color").checked);
	Cookies.set("qrCodeEnabled", document.getElementById("qrcode").checked);
	Cookies.set("parentDescriptionEnabled", document.getElementById("parentdescription").checked);
	Cookies.set("componentEnabled", document.getElementById("componentdescription").checked);
	Cookies.set("tagEnabled", document.getElementById("tagdescription").checked);
	Cookies.set("businessValueEnabled", document.getElementById("businessvalue").value);

	Cookies.set("projectName", document.getElementById("project").value);
	Cookies.set("fixVersion", document.getElementById("fixversion").value);
}

function setWizardCookie() {
	Cookies.set("wizard", document.getElementById("wizard").value);
}

function setConfigFromBooleanCookie(elementId, cookie, def) {
	var string = Cookies.get(cookie);
	var element = document.getElementById(elementId);
	if (string == "true") {
		element.checked = true;
	} else if (string == "false") {
		element.checked = false;
	} else {
		element.checked = def;
	}
}

function setConfigFromCookies() {
	var location = Cookies.get("jiraLocation") || "https://jira.caplin.com";
	if (location != null && document.getElementById("jiraLocation") != null) {
		setJiraLocation(location);
        setConfigFromBooleanCookie("color", "colorEnabled", true);
		setConfigFromBooleanCookie("qrcode", "qrCodeEnabled", true);
		setConfigFromBooleanCookie("parentdescription", "parentDescriptionEnabled", true);
		setConfigFromBooleanCookie("componentdescription", "componentEnabled", true);
		setConfigFromBooleanCookie("tagdescription", "tagEnabled", false);
		setConfigFromBooleanCookie("businessvalue", "businessValueEnabled", false);
        setConfigFromBooleanCookie("epicsEnabled", "epicsEnabled", true);
	//	document.getElementById("project").value = Cookies.get("projectName") || "";
	//	document.getElementById("fixversion").value = Cookies.get("fixVersion") || ""
	//	document.getElementById("wizard").value = Cookies.get("wizard") || "https://jira.springsource.org/browse/BATCH/fixforversion/11327";
	}
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

//Greenhopper data

//https://jira.caplin.com/secure/RapidBoard.jspa?rapidView=11

//https://jira.caplin.com/rest/greenhopper/latest/sprints/11
//{"sprints":[{"id":6,"name":"Sprint 18","closed":true},{"id":9,"name":"Sprint 19","closed":true},{"id":11,"name":"Sprint 0","closed":false}],"rapidViewId":11}

//https://jira.caplin.com/rest/greenhopper/latest/sprint/10/issues
//{"contents":{"issueKeys":["PCINTS-100","PCX1AQA4-112","PCX1AQA4-120","PCX1AQA4-139","PCX1AQA4-145","PCX1AQA4-149","PSL-68","PSL-109","PSL-161","PSL-163","PSL-167","PSL-174","PSL-179","PSL-181","PSL-182","PSL-183","PSL-184","PSL-185","PSL-186","PSL-187","PSL-188","PSL-189","PSL-190","PSL-191","PSL-192","PSL-194","PSL-195","PSL-196","PSL-197","PSL-198","PSL-199","PSL-200","PSL-203","PSL-208","PSL-209","PSL-211","PSL-213"]}}

//
var jiraNavigatorDiv = document.getElementById("jiraNavigator");

function setLoginDetails() {

}

function updateJiraNavigator() {
    debugger;
}


setConfigFromCookies();
drawExampleCard();
window.onhashchange = function() {
	if (window.location.hash !== "#tickets") {
		showInterface();
	}
}
