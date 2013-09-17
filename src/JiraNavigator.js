_noneOption = {value: "none", text: "None"};
_noneOptionArray = [this._noneOption];

var JiraNavigator = function(jiraUrl) {
	this._noneOption = _noneOption;
	this._noneOptionArray = _noneOptionArray;
	this.selectionMethod = {
		value: ko.observable(),
		visible: ko.observable(true),
		options: this._noneOptionArray.concat(this.getNavigationTypes()),
		change: this.handleSelectionMethodChanged
	}
	this.renderElement = null;
	this.viewDropDown = null;
	this.projectDropDown = null;
	this.fixVersionsDropDown = null;
	this.jirasField = null;
	this.jah = new JiraApiHandler(jiraUrl, this);
	this.fvn = new FixVersionNavigator(jiraUrl, this);
	this.rbn = new RapidBoardNavigator(jiraUrl, this);
	this.csvn = new CSVNavigator(jiraUrl, this);
}

JiraNavigator.prototype.init = function() {
	ko.applyBindingsToNode(document.getElementById("selectionMethod"), null, this);
	this.fvn.init();
	this.rbn.init();
	this.csvn.init();
}

JiraNavigator.prototype.hideAllDropDown = function() {
	this.fvn.hideAll();
	this.rbn.hideAll();
	this.csvn.hideAll();
}

JiraNavigator.prototype.handleSelectionMethodChanged = function() {
	this.hideAllDropDown();
	var value = this.selectionMethod.value().value
	if (value == "rapidboard") {
		this.rbn.requestTopLevelData();
	} else if (value == "fixversion") {
		this.fvn.requestTopLevelData();
	} else if (value == "jiras") {
		this.csvn.requestTopLevelData();
	}
}

JiraNavigator.prototype.getNavigationTypes = function() {
	return [
		{value: "fixversion", text: "Sprint"},
		{value: "rapidboard", text: "Rapid Board"},
		{value: "jiras", text: "Comma Seperated Jiras"}
	];
}

JiraNavigator.prototype.clearJiraList = function(jiras) {
	var stageThree = document.getElementById("stageThree");
	stageThree.style.display = "none";
}

JiraNavigator.prototype.receiveJiraCallback = function(jiras) {
	receiveJiraCallback(jiras);
}

JiraNavigator.setDropDown = function(dropDown, views, value, text) {
	dropDown.splice(0,dropDown().length);
	dropDown.push(_noneOption);
	views.forEach(function(view) {
		dropDown.push({value: view[value], text: view[text]});
	}.bind(this));
}