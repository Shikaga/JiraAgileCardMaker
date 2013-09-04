var JiraNavigator = function(jiraUrl) {
	this._noneOptionArray = [{value: "none", text: "None"}];
	this.selectionMethod = {
		value: ko.observable(),
		visible: ko.observable(true),
		options: this._noneOptionArray.concat(this.getNavigationTypes()),
		change: function() {
			var value = this.selectionMethod.value().value
			if (value == "rapidboard") {
				this.clearRapidViewsIfNecessary();
			} else if (value == "fixversion") {
				this.clearJiraList();
				this.clearFixViewIfNecessary();
			} else if (value == "jiras") {
				this.showIndividualJirasField();
			}
		}
	}
	this.renderElement = null;
	this.viewDropDown = null;
	this.projectDropDown = null;
	this.fixVersionsDropDown = null;
	this.jirasField = null;
	this.jah = new JiraApiHandler(jiraUrl, this);
}

JiraNavigator.prototype.renderInElement = function(element) {
	this.renderElement = element;
	this.render();
}

JiraNavigator.prototype.render = function() {
	this.renderElement.innerHTML = "";
	if (this.selectionMethod.value()) {
		if (this.selectionMethod.value().value == "rapidboard") {
			if (this.viewDropDown != null) {

				this.renderElement.appendChild(document.createElement("br"));
				this.renderElement.appendChild(document.createTextNode("Select RapidBoard : "));
				this.renderElement.appendChild(this.viewDropDown);
				if (this.openRapidBoardSprintDropDown != null) {
					this.renderElement.appendChild(document.createElement("br"));
					this.renderElement.appendChild(document.createTextNode("Select RapidBoard Sprint: "));
					this.renderElement.appendChild(this.openRapidBoardSprintDropDown);
				}
			}
		} else if (this.selectionMethod.value().value == "fixversion") {
			if (this.projectDropDown != null) {
				this.renderElement.appendChild(document.createElement("br"));
				this.renderElement.appendChild(document.createTextNode("Select Project: "));
				this.renderElement.appendChild(this.projectDropDown);
				if (this.fixVersionsDropDown != null ) {
					this.renderElement.appendChild(document.createElement("br"));
					this.renderElement.appendChild(document.createTextNode("Select Sprint: "));
					this.renderElement.appendChild(this.fixVersionsDropDown);
				}
			}
		} else if (this.selectionMethod.value().value == "jiras") {
			this.renderElement.appendChild(document.createElement("br"));
			this.renderElement.appendChild(document.createTextNode("Enter Jira IDs seperated by comma: "));
			this.renderElement.appendChild(this.jirasField);
		}
	}
}

JiraNavigator.prototype.onchange = function(dropdown) {
	console.log(dropdown.name);
	if (dropdown.name == "jiras") {
		this.updateJiraListWithIndividualJiras();
		return;
	}
	if (dropdown.name == "navigationTypes") {
		this.viewDropDown = null;
		this.projectDropDown = null;
		this.fixVersionsDropDown = null;
	}

	if (dropdown.name == "project") {
		this.viewDropDown = null;
		this.fixVersionsDropDown = null;
	}

	console.log(this.selectionMethod.value().value)
	if (this.selectionMethod.value().value == "rapidboard") {
		this.clearRapidViewsIfNecessary();
	} else if (this.selectionMethod.value().value == "fixversion") {
		this.clearJiraList();
		this.clearFixViewIfNecessary();
	} else if (this.selectionMethod.value().value == "jiras") {
		this.showIndividualJirasField();
	}
	this.render();
}


JiraNavigator.prototype.updateJiraListWithIndividualJiras = function() {
	var jiras = this.jirasField.value.split(",").map(function(jira) { return jira.trim()});
	this.receiveJiraCallback(jiras);
}

JiraNavigator.prototype.clearRapidViewsIfNecessary = function() {
	if (this.viewDropDown != null && this.viewDropDown.value != "None") {
        if (this.openRapidBoardSprintDropDown != null && this.openRapidBoardSprintDropDown.value != "None") {
            this.jah.getRapidBoardSprint(this.viewDropDown.value, this.openRapidBoardSprintDropDown.value);
        } else {
            this.jah.requestRapidSprints(this.viewDropDown.value);
        }
	} else {
		this.jah.requestRapidViews();
	}
}

JiraNavigator.prototype.clearFixViewIfNecessary = function() {
	if (this.projectDropDown != null && this.projectDropDown.value != "None") {
		if (this.fixVersionsDropDown != null && this.fixVersionsDropDown.value != "None") {
			this.jah.requestFixVersion(this.projectDropDown.value, this.fixVersionsDropDown.value);
		} else {
			this.jah.requestFixVersions(this.projectDropDown.value);
		}
	} else {
		this.jah.requestProjects();
	}
}

JiraNavigator.prototype.showIndividualJirasField = function() {
	var self = this;
	var input = document.createElement("input");
	input.onkeyup = function() {self.onchange(this)};
	input.name = "jiras";
	this.jirasField = input;
}

JiraNavigator.prototype.getNavigationTypes = function() {
	return [
		{value: "fixversion", text: "Sprint"},
		{value: "rapidboard", text: "Rapid Board"},
		{value: "jiras", text: "Comma Seperated Jiras"}
	];
}

JiraNavigator.prototype.getProjectDropDown = function(projects) {
	var select = SelectUtilities._getBasicDropDown("project", this, "onchange");
	select.appendChild(SelectUtilities._createNoneOption());
	SelectUtilities._populateSelect(select, projects, "key", "name");
	return select;
}

JiraNavigator.prototype.getFixVersionsDropDown = function(fixVersions) {
	var select = SelectUtilities._getBasicDropDown("fixVersions", this, "onchange");
	select.appendChild(SelectUtilities._createNoneOption());
	SelectUtilities._populateSelect(select, fixVersions, "id", "name");
	return select;
}

JiraNavigator.prototype.getOpenRapidBoardSprintsDropDown = function(ids) {
    var select = SelectUtilities._getBasicDropDown("openRapidBoard", this, "onchange");
    select.appendChild(SelectUtilities._createNoneOption());
    SelectUtilities._populateSelect(select, ids, "id", "name");
    console.log(select);
    return select;
}

JiraNavigator.prototype.getRapidViewDropDown = function(rapidViews) {
	var select = SelectUtilities._getBasicDropDown("rapidView", this, "onchange");
	select.appendChild(SelectUtilities._createNoneOption());
	SelectUtilities._populateSelect(select, rapidViews.views, "id", "name");
	return select;
}

JiraNavigator.prototype.receiveRapidBoardViews = function(views) {
	this.viewDropDown = this.getRapidViewDropDown(views);
	this.render();
}

JiraNavigator.prototype.receiveProjectData = function(views) {
	this.projectDropDown = this.getProjectDropDown(views);
	this.render();
}

JiraNavigator.prototype.receiveFixVersionsData = function(views) {
    this.fixVersionsDropDown = this.getFixVersionsDropDown(views);
    this.render();
}

JiraNavigator.prototype.receiveOpenRapidBoardSprints = function(ids) {
    this.openRapidBoardSprintDropDown = this.getOpenRapidBoardSprintsDropDown(ids);
    this.render();
}

JiraNavigator.prototype.receiveJiraCallback = function(jiras) {
	receiveJiraCallback(jiras);
}

JiraNavigator.prototype.clearJiraList = function(jiras) {
	var stageThree = document.getElementById("stageThree");
	stageThree.style.display = "none";
}

JiraNavigator.prototype.setJira = function(jira) {
	this.navigationTypes.selectedIndex = 3;
	this.onchange(this);
	this.jirasField.value = jira;
	this.onchange(this.jirasField);
}