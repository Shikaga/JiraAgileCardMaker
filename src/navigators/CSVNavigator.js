var CSVNavigator = function(jiraUrl, jiraNavigator) {
	this.jiraNavigator = jiraNavigator;
    this.jiraUrl = jiraUrl;

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
    this.jah = new JiraApiHandler(this.jiraUrl, this);
    this.csvJirasField.visible(true);
}

CSVNavigator.prototype.init = function() {
	ko.applyBindings(this, document.getElementById("csvJiras"));
}

CSVNavigator.prototype.updateJiraListWithIndividualJiras = function() {
	var jiras = this.csvJirasField.value().split(",").map(λ("_.trim()")).map(λ("_.toUpperCase()"));
	this.jiraNavigator.receiveJiraCallback(jiras);
}

CSVNavigator.prototype.hideAll = function() {
	this.csvJirasField.visible(false);
}