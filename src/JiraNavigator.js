_noneOption = {value: "none", text: "None"};
_noneOptionArray = [this._noneOption];

var JiraNavigator = function(jiraUrl) {
	this._noneOption = _noneOption;
	this._noneOptionArray = _noneOptionArray;

	this.navigatorMap = {};
	this.navigatorMap["fixversion"] = new FixVersionNavigator(jiraUrl, this);
	this.navigatorMap["rapidboard"] = new RapidBoardNavigator(jiraUrl, this);
	this.navigatorMap["jiras"] = new CSVNavigator(jiraUrl, this);

	this.selectionMethod = {
		value: ko.observable(),
		visible: ko.observable(true),
		options: this._noneOptionArray.concat(this.getNavigationTypes()),
		change: this.handleSelectionMethodChanged
	}
	this.jah = new JiraApiHandler(jiraUrl, this);
}

JiraNavigator.prototype.init = function() {
	ko.applyBindingsToNode(document.getElementById("selectionMethod"), null, this);
	for (var key in this.navigatorMap) {
		var navigator = this.navigatorMap[key];
		navigator.init();
	}
}

JiraNavigator.prototype.hideAllDropDown = function() {
	for (var key in this.navigatorMap) {
		var navigator = this.navigatorMap[key];
		navigator.hideAll();
	}
}

JiraNavigator.prototype.handleSelectionMethodChanged = function() {
	this.hideAllDropDown();
	var value = this.selectionMethod.value().value
	var navigator = this.navigatorMap[value];
	if (navigator !== undefined) {
		navigator.requestTopLevelData();
	}
}

JiraNavigator.prototype.getNavigationTypes = function() {
	var returnArray = [];
	for (var key in this.navigatorMap) {
		var navigator = this.navigatorMap[key];
		returnArray.push({value: key, text: navigator.getDisplayName()});
	}
	return returnArray;
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