var card1 = new Card(
	"PCTCUT-511", "https://jira.caplin.com/browse/PCTCUT-511",
	"Technical task", 3, "A tech task.",
	"COMP", "TAG", "PCTCUT-523");

var card2 = new Card(
	"PCTCUT-511", "https://jira.caplin.com/browse/PCTCUT-511",
	"Technical task", null, "A tech task.",
	"COMP", "TAG", "PCTCUT-523");

var parentMap = {};
parentMap[card1.issueId] = card1;

test( "Project Key is shown in TitleRow>Key>Project", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["titleRow", "key", "project"]);
	ok("PCTCUT" == div.innerHTML, "Passed!" );
});

test( "Number Key is shown in TitleRow>Key>Number", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["titleRow", "key", "number"]);
	ok("511" == div.innerHTML, "Passed!" );
});

test( "Estimate is shown as 'Estimate' in TitleRow>Estimate if not defined ", function() {
	var view = new CardView(card2, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["titleRow", "estimate"]);
	ok("Estimate" == div.innerHTML, "Passed!" );
});

test( "Estimate is shown in TitleRow>Estimate", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["titleRow", "estimate"]);
	ok("3" == div.innerHTML, "Passed!" );
});



function getChildElementByClassName(element, className) {
	for (var i = 0; i < element.childNodes.length; i++) {
		if (element.childNodes[i].className.indexOf(className) != -1) {
			return element.childNodes[i];
		}
	}
	return null;
}

function getChildElementByClassNames(element, classNames) {
	var className = classNames.shift();
	var child = getChildElementByClassName(element, className);
	if (classNames.length == 0) return child;
	return getChildElementByClassNames(child, classNames);
}