var JiraNavigator = function() {

}

JiraNavigator.prototype.getProjectDropDown = function(projects) {
	var select = document.createElement("select");
	select.style.width = "300px";
	select.onchange = function() {alert('Project Switched')};

	for (var i=0; i < projects.length; i++) {
		var project = projects[i];
		var option;

		/* we are going to add two options */
		/* create options elements */
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

		/* we are going to add two options */
		/* create options elements */
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
	select.onchange = function() {alert('Rapid Views Switched')};

	for (var i=0; i < rapidViews.views.length; i++) {
		var rapidView = rapidViews.views[i];
		var option;

		/* we are going to add two options */
		/* create options elements */
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
	select.onchange = function() {alert('Rapid Views Switched')};

	for (var i=0; i < sprints.sprints.length; i++) {
		var sprint = sprints.sprints[i];
		var option;

		/* we are going to add two options */
		/* create options elements */
		option = document.createElement("option");
		option.setAttribute("value", sprint.id);
		option.innerHTML = sprint.name;
		select.appendChild(option);
	}
	return select;
}