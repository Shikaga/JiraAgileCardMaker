var IssueChecklistHandler = function(issueChecklistUl, issues) {
	this.issueChecklistUl = issueChecklistUl;
	this.addJirasToInterface(issues);
}

IssueChecklistHandler.prototype.addCheckList = function(ul, name, callback, className) {
	var jiraList = this.issueChecklistUl;
	var li = document.createElement("li");

	var checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.className = className;
	checkbox.name = name;
	checkbox.checked = true;

	if (callback != null && callback != undefined) {
		checkbox.onclick = callback;
	}

	var label = document.createTextNode(name);

	li.appendChild(checkbox);
	li.appendChild(label);

	jiraList.appendChild(li);
}


IssueChecklistHandler.prototype.addJirasToInterface = function(issues) {
	this.issueChecklistUl.innerHTML = "";
	this.addCheckList("jiraListUrl", "All", this.allJirasClicked, null);
	for (var i = 0; i < issues.length; i++) {
		var issue = issues[i];
		this.addCheckList(this.issueChecklistUl, issue, null, "jiracheck");
	}
}


IssueChecklistHandler.prototype.allJirasClicked = function() {
	var jiraChecklists = document.getElementsByClassName("jiracheck");
	for (var i = 0; i < jiraChecklists.length; i++) {
		jiraChecklists[i].checked = this.checked;
	}
}

function getChecked(className) {
	var columnsChecklists = document.getElementsByClassName(className);
	var checklistToDisplay = [];
	for (var i = 0; i < columnsChecklists.length; i++) {
		var columnCheck = columnsChecklists[i];
		if (columnCheck.checked) {
			checklistToDisplay.push(columnCheck.name);
		}
	}
	return checklistToDisplay;
}
