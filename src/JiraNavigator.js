var JiraNavigator = function(jiraUrl) {
	this.renderElement = null;
	this.navigationTypes = this.getNavigationTypes();
	this.viewDropDown = null;
	this.jah = new JiraApiHandler(jiraUrl, this);
}

JiraNavigator.prototype.renderInElement = function(element) {
	this.renderElement = element;
	this.render();
}

JiraNavigator.prototype.render = function() {
	this.renderElement.innerHTML = "";
	this.renderElement.appendChild(this.navigationTypes);
	if (this.navigationTypes.value == "rapidboard") {
		this.renderElement.appendChild(this.navigationTypes);
		if (this.viewDropDown != null) {
			this.renderElement.appendChild(document.createElement("br"));
			this.renderElement.appendChild(this.viewDropDown);
		}
	}
}

JiraNavigator.prototype.onchange = function() {
	console.log(this.navigationTypes.value)
	this.render();
	if (this.navigationTypes.value == "rapidboard") {
		if (this.viewDropDown != null && this.viewDropDown.value != "None") {
			this.jah.requestRapidSprints(this.viewDropDown.value);
		} else {
			this.jah.requestRapidViews();
		}

	}
}

JiraNavigator.prototype.getNavigationTypes = function(projects) {
	var select = document.createElement("select");
	select.style.width = "300px";
	var self = this;
	select.onchange = function() {self.onchange()};

	var blankOption;
	blankOption = document.createElement("option");
	blankOption.setAttribute("value", "none");
	blankOption.innerHTML = "None"
	select.appendChild(blankOption);

	var option;
	option = document.createElement("option");
	option.setAttribute("value", "fixversion");
	option.innerHTML = "FixVersion"
	select.appendChild(option);

	var option2;
	option2 = document.createElement("option");
	option2.setAttribute("value", "rapidboard");
	option2.innerHTML = "Rapid Board"
	select.appendChild(option2);

	return select;
}

JiraNavigator.prototype.getProjectDropDown = function(projects) {
	var select = document.createElement("select");
	select.style.width = "300px";
	select.onchange = function() {alert('Project Switched')};

	for (var i=0; i < projects.length; i++) {
		var project = projects[i];
		var option;

		option = document.createElement("option");
		option.setAttribute("value", project.key);
		option.innerHTML = project.name;
		select.appendChild(option);
	}
	return select;
}

JiraNavigator.prototype.getFixVersionsDropDown = function(fixVersions) {
	var select = document.createElement("select");
	select.style.width = "300px";
	select.onchange = function() {alert('FixVersion Switched')};

	for (var i=0; i < fixVersions.length; i++) {
		var fixVersion = fixVersions[i];
		var option;

		option = document.createElement("option");
		option.setAttribute("value", fixVersion.id);
		option.innerHTML = fixVersion.description;
		select.appendChild(option);
	}
	return select;
}

JiraNavigator.prototype.getRapidViewDropDown = function(rapidViews) {
	var select = document.createElement("select");
	select.style.width = "300px";
	var self = this;
	select.onchange = function() {self.onchange()};

	var option;
	option = document.createElement("option");
	option.setAttribute("value", "none");
	option.innerHTML = "None";
	select.appendChild(option);

	for (var i=0; i < rapidViews.views.length; i++) {
		var rapidView = rapidViews.views[i];
		var option;

		option = document.createElement("option");
		option.setAttribute("value", rapidView.id);
		option.innerHTML = rapidView.name;
		select.appendChild(option);
	}
	return select;
}

JiraNavigator.prototype.getRapidViewSprintDropDown = function(sprints) {
	console.log(sprints);
	var select = document.createElement("select");
	select.style.width = "300px";
	var self = this;
	select.onchange = function() {self.onchange()};

	for (var i=0; i < sprints.sprints.length; i++) {
		var sprint = sprints.sprints[i];
		var option;

		option = document.createElement("option");
		option.setAttribute("value", sprint.id);
		option.innerHTML = sprint.name;
		select.appendChild(option);
	}
	return select;
}

JiraNavigator.prototype.receiveRapidBoardViews = function(views) {
	this.viewDropDown = this.getRapidViewDropDown(views);
	this.render();
}

JiraNavigator.prototype.receiveJiraCallback = function(jiras) {
	receiveJiraCallback(jiras);
}