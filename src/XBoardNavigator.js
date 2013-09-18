var XBoardNavigator = function(jiraUrl, jiraNavigator) {
	this.jiraNavigator = jiraNavigator;
	this.jah = new JiraApiHandler(jiraUrl, this);
	this.xBoardIdField = {
		value: ko.observable(),
		visible: ko.observable(false),
		options: ko.observableArray(),
		change: function() {
            debugger;
			this.jah.requestXBoard(this.xBoardIdField.value());
		}
	}
//	this.rapidBoardSprintsDropDown = {
//		value: ko.observable(),
//		visible: ko.observable(false),
//		options: ko.observableArray(),
//		change: function() {
//			if (this.rapidBoardSprintsDropDown.value().value !== "none") {
//				this.jah.getRapidBoardSprint(this.rapidBoardsDropDown.value().value, this.rapidBoardSprintsDropDown.value().value);
//			}
//		}
//	}
}

XBoardNavigator.prototype.getDisplayName = function() {
	return "XBoard";
}

XBoardNavigator.prototype.requestTopLevelData = function() {
    this.xBoardIdField.visible(true);
}

XBoardNavigator.prototype.init = function() {
	ko.applyBindingsToNode(document.getElementById("xBoardId"), null, this);
//	ko.applyBindingsToNode(document.getElementById("rapidBoardSprintsDropDown"), null, this);
}
//
//XBoardNavigator.prototype.receiveRapidBoardViews = function(views) {
//	this.xBoardIdField.visible(true);
//	JiraNavigator.setDropDown(this.xBoardIdField.options, views.views, "id", "name");
//}
//
//XBoardNavigator.prototype.receiveOpenRapidBoardSprints = function(ids) {
//	this.xBoardIdField.visible(true);
//	JiraNavigator.setDropDown(this.xBoardIdField.options, ids, "id", "name")
//}

XBoardNavigator.prototype.hideAll = function() {
	this.xBoardIdField.visible(false);
//	this.rapidBoardSprintsDropDown.visible(false);
}

XBoardNavigator.prototype.receiveJiraCallback = function(jiras) {
    debugger;
	this.jiraNavigator.receiveJiraCallback(jiras);
}