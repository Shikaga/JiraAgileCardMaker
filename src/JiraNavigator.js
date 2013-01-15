var JiraNavigator = function() {

}

JiraNavigator.prototype.getProjectDropDown = function() {
	var select = document.createElement("select");
	select.setAttribute("name", "mySelect");
	select.setAttribute("id", "mySelect");
	select.style.width = "300px";

	/* setting an onchange event */
	select.onchange = function() {dbrOptionChange()};

	var option;

	/* we are going to add two options */
	/* create options elements */
	option = document.createElement("option");
	option.setAttribute("value", "Connection.TRANSACTION_NONE");
	option.innerHTML = "Connection.TRANSACTION_NONE";
	select.appendChild(option);

	option = document.createElement("option");
	option.setAttribute("value", "Connection.TRANSACTION_READ_COMMITTED");
	option.innerHTML = "Connection.TRANSACTION_READ_COMMITTED";
	select.appendChild(option);
	document.body.appendChild(select);
}

JiraNavigator.prototype.getFixVersionsDropDown = function() {

}

JiraNavigator.prototype.getRapidViewDropDown = function() {

}

JiraNavigator.prototype.getRapidViewSprintDropDown = function() {

}