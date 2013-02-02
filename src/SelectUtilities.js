var SelectUtilities = function() {};

SelectUtilities._getBasicDropDown = function (name, callbackClass, callbackMethod) {
	var select = document.createElement("select");
	select.name = name;
	select.style.width = "300px";
	var self = callbackClass
	select.onchange = function() {self[callbackMethod](this)};
	return select;
}


SelectUtilities._createOption = function(value, display) {
	var option = document.createElement("option");
	option.setAttribute("value", value);
	option.innerHTML = display;
	return option;
}

SelectUtilities._createNoneOption = function() {
	return this._createOption("none", "None")
}

SelectUtilities._populateSelect = function(select, array, valueKey, nameKey) {
	for (var i=0; i < array.length; i++) {
		var value = array[i][valueKey];
		var name = array[i][nameKey];
		var option = this._createOption(value, name);
		select.appendChild(option);
	}
}