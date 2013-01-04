//KeyMaster JS
(function(e){function a(e,t){var n=e.length;while(n--)if(e[n]===t)return n;return-1}function f(e,t){var i,o,f,l,c;i=e.keyCode,a(u,i)==-1&&u.push(i);if(i==93||i==224)i=91;if(i in r){r[i]=!0;for(f in s)s[f]==i&&(h[f]=!0);return}if(!h.filter.call(this,e))return;if(!(i in n))return;for(l=0;l<n[i].length;l++){o=n[i][l];if(o.scope==t||o.scope=="all"){c=o.mods.length>0;for(f in r)if(!r[f]&&a(o.mods,+f)>-1||r[f]&&a(o.mods,+f)==-1)c=!1;(o.mods.length==0&&!r[16]&&!r[18]&&!r[17]&&!r[91]||c)&&o.method(e,o)===!1&&(e.preventDefault?e.preventDefault():e.returnValue=!1,e.stopPropagation&&e.stopPropagation(),e.cancelBubble&&(e.cancelBubble=!0))}}}function l(e){var t=e.keyCode,n,i=a(u,t);i>=0&&u.splice(i,1);if(t==93||t==224)t=91;if(t in r){r[t]=!1;for(n in s)s[n]==t&&(h[n]=!1)}}function c(){for(t in r)r[t]=!1;for(t in s)h[t]=!1}function h(e,t,r){var i,u,a,f;r===undefined&&(r=t,t="all"),e=e.replace(/\s/g,""),i=e.split(","),i[i.length-1]==""&&(i[i.length-2]+=",");for(a=0;a<i.length;a++){u=[],e=i[a].split("+");if(e.length>1){u=e.slice(0,e.length-1);for(f=0;f<u.length;f++)u[f]=s[u[f]];e=[e[e.length-1]]}e=e[0],e=o[e]||e.toUpperCase().charCodeAt(0),e in n||(n[e]=[]),n[e].push({shortcut:i[a],scope:t,method:r,key:i[a],mods:u})}}function p(e){if(typeof e=="string"){if(e.length!=1)return!1;e=e.toUpperCase().charCodeAt(0)}return a(u,e)!=-1}function d(){return u}function v(e){var t=(e.target||e.srcElement).tagName;return t!="INPUT"&&t!="SELECT"&&t!="TEXTAREA"}function m(e){i=e||"all"}function g(){return i||"all"}function y(e){var t,r,i;for(t in n){r=n[t];for(i=0;i<r.length;)r[i].scope===e?r.splice(i,1):i++}}function b(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent&&e.attachEvent("on"+t,function(){n(window.event)})}function E(){var t=e.key;return e.key=w,t}var t,n={},r={16:!1,18:!1,17:!1,91:!1},i="all",s={"⇧":16,shift:16,"⌥":18,alt:18,option:18,"⌃":17,ctrl:17,control:17,"⌘":91,command:91},o={backspace:8,tab:9,clear:12,enter:13,"return":13,esc:27,escape:27,space:32,left:37,up:38,right:39,down:40,del:46,"delete":46,home:36,end:35,pageup:33,pagedown:34,",":188,".":190,"/":191,"`":192,"-":189,"=":187,";":186,"'":222,"[":219,"]":221,"\\":220},u=[];for(t=1;t<20;t++)s["f"+t]=111+t;for(t in s)h[t]=!1;b(document,"keydown",function(e){f(e,i)}),b(document,"keyup",l),b(window,"focus",c);var w=e.key;e.key=h,e.key.setScope=m,e.key.getScope=g,e.key.deleteScope=y,e.key.filter=v,e.key.isPressed=p,e.key.getPressedKeyCodes=d,e.key.noConflict=E,typeof module!="undefined"&&(module.exports=key)})(this);

/*! Cookies.js - 0.2.1; Copyright (c) 2012, Scott Hamper; http://www.opensource.org/licenses/MIT */
(function(f,e){var b=function(c,d,a){return 1===arguments.length?b.get(c):b.set(c,d,a)};b.get=function(c){f.cookie!==b._cacheString&&b._populateCache();return b._cache[c]};b.defaults={path:"/"};b.set=function(c,d,a){a={path:a&&a.path||b.defaults.path,domain:a&&a.domain||b.defaults.domain,expires:a&&a.expires||b.defaults.expires,secure:a&&a.secure!==e?a.secure:b.defaults.secure};d===e&&(a.expires=-1);switch(typeof a.expires){case "number":a.expires=new Date((new Date).getTime()+1E3*a.expires);break;
	case "string":a.expires=new Date(a.expires)}c=encodeURIComponent(c)+"="+(d+"").replace(/[^!#-+\--:<-\[\]-~]/g,encodeURIComponent);c+=a.path?";path="+a.path:"";c+=a.domain?";domain="+a.domain:"";c+=a.expires?";expires="+a.expires.toGMTString():"";c+=a.secure?";secure":"";f.cookie=c;return b};b.expire=function(c,d){return b.set(c,e,d)};b._populateCache=function(){b._cache={};b._cacheString=f.cookie;for(var c=b._cacheString.split("; "),d=0;d<c.length;d++){var a=c[d].indexOf("="),g=decodeURIComponent(c[d].substr(0,
	a)),a=decodeURIComponent(c[d].substr(a+1));b._cache[g]===e&&(b._cache[g]=a)}};b.enabled=function(){var c="1"===b.set("cookies.js","1").get("cookies.js");b.expire("cookies.js");return c}();"function"===typeof define&&define.amd?define(function(){return b}):"undefined"!==typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=b),exports.Cookies=b):window.Cookies=b})(document);



var jiraRequestedTimeout = null;
var oApp = null;
var columnCounter = 0;
var pageElement = document.createElement("div");

function getParameter(l_sName) {
	var l_oMatch = window.location.search.match(new RegExp("[?&]" + l_sName + "=([^&]*)"));
	return ((l_oMatch == null) ? null : l_oMatch[1]);
}

function wizard() {
	var url = document.getElementById("wizard").value;
	var projectStart = url.indexOf("browse/");
	var fixversionStart = url.indexOf("fixforversion/");

	if (projectStart != -1 && fixversionStart != -1) {
		setWizardCookie();
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

function getJiraCallback(e) {
	oApp.processJiraData(e);
}

function getJiras() {
	setCookies();
	var project = document.getElementById("project").value;
	var fixversion = document.getElementById("fixversion").value;
	var jiraUrl = document.getElementById("jiraLocation").value;
	var jah = new JiraApiHandler(jiraUrl, this);
	jah.requestFixVersion(project, fixversion);
}

function receiveJiraCallback(e) {
	clearTimeout(jiraRequestedTimeout);
	issueChecklistUl = document.getElementById("jiraListUrl");
	var ich = new IssueChecklistHandler(issueChecklistUl, e.issues);
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
	var businessValue = document.getElementById("businessvalue").checked;

	oApp = new jira.App(document.getElementById('tickets'), jiraUrl, document.getElementById("fixversion").value, color, qrcode, parentDescription, componentDescription, tagDescription, businessValue);
	oApp.requestIssues(checklistToDisplay);
}

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
	document.getElementById("jiraLocation").value = Cookies.get("jiraLocation") || "https://jira.springsource.org";
	setConfigFromBooleanCookie("color", "colorEnabled", true);
	setConfigFromBooleanCookie("qrcode", "qrCodeEnabled", true);
	setConfigFromBooleanCookie("parentdescription", "parentDescriptionEnabled", true);
	setConfigFromBooleanCookie("componentdescription", "componentEnabled", true);
	setConfigFromBooleanCookie("tagdescription", "tagEnabled", false);
	setConfigFromBooleanCookie("businessvalue", "businessValueEnabled", false);
	document.getElementById("project").value = Cookies.get("projectName") || "";
	document.getElementById("fixversion").value = Cookies.get("fixVersion") || ""
	document.getElementById("wizard").value = Cookies.get("wizard") || "https://jira.springsource.org/browse/BATCH/fixforversion/11327";

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

setConfigFromCookies();
drawExampleCard();
key('esc', function(){ showInterface(); });