var CSVNavigator = function(jiraUrl, jiraNavigator) {
	this.jiraNavigator = jiraNavigator;
	this.jah = new JiraApiHandler(jiraUrl, this);

	this.csvJirasField = {
		value: ko.observable(),
		visible: ko.observable(false),
		change: function() {
			this.updateJiraListWithIndividualJiras();
			return
		}
	}
}

CSVNavigator.prototype.getDisplayName = function() {
	return "Comma Seperated Jiras";
}

CSVNavigator.prototype.requestTopLevelData = function() {
	this.csvJirasField.visible(true);
}

CSVNavigator.prototype.init = function() {
	ko.applyBindingsToNode(document.getElementById("csvJiras"), null, this);
}

CSVNavigator.prototype.updateJiraListWithIndividualJiras = function() {
	var jiras = this.csvJirasField.value().split(",").map(λ("_.trim()"));
	this.jiraNavigator.receiveJiraCallback(jiras);
}

CSVNavigator.prototype.hideAll = function() {
	this.csvJirasField.visible(false);
}