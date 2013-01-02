var card1 = new Card("PCTCUT-511", "https://jira.caplin.com/browse/PCTCUT-511", "Technical task", 3, "A tech task.", "COMP", "TAG", 6, "PCTCUT-523");

var card2 = new Card("PCTCUT-523", "https://jira.caplin.com/browse/PCTCUT-523", "Technical task", null, "A parent task.", "COMP", "TAG", 6, null);

var parentMap = {};
parentMap[card1.issueId] = card1;
parentMap[card2.issueId] = card2;

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

test( "Estimate is shown in TitleRow>Estimate", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["titleRow", "estimate"]);
	ok("3" == div.innerHTML, "Passed!" );
});


test( "Estimate is shown as 'Estimate' in TitleRow>Estimate if not defined ", function() {
	var view = new CardView(card2, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["titleRow", "estimate"]);
	ok("Estimate" == div.innerHTML, "Passed!" );
});

test( "Actual is shown in TitleRow>Actual as 'Actual'", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["titleRow", "actual"]);
	ok("Actual" == div.innerHTML, "Passed!" );
});

test( "Owner is shown in TitleRow>Owner as 'Owner'", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["titleRow", "actual"]);
	ok("Actual" == div.innerHTML, "Passed!" );
});

test( "Summary is shown in SummaryElement>Summary 'Owner'", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["summaryElement", "summary"]);
	ok("A tech task." == div.innerHTML, "Passed!" );
});

test( "Parent Summary is not shown by default", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["summaryElement", "parentSummary"]);
	ok(null == div, "Passed!" );
});

test( "Parent Summary is shown in SummaryElement>ParentSummary if configured", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		true, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["summaryElement", "parentSummary"]);
	ok("A parent task." == div.innerHTML, "Passed!" );
});

test( "Component is not shown by default", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["summaryElement", "component"]);
	ok(null == div, "Passed!" );
});

test( "Component is shown in SummaryElement>Component if configured", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, true, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["summaryElement", "component"]);
	ok("COMP" == div.innerHTML, "Passed!" );
});

test( "Tag is not shown by default", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, false, false, false);
	var cardElement = view.getElement();
	var div = getChildElementByClassNames(cardElement, ["summaryElement", "tag"]);
	ok(null == div, "Passed!" );
});

test( "Tag is shown in Tag if configured", function() {
	var view = new CardView(card1, parentMap, ["Doc", "Demo", "Review"],
		false, false, true, false, false);
	var cardElement = view.getElement();
	console.log(cardElement);
	var div = getChildElementByClassNames(cardElement, ["tag"]);
	ok("TAG" == div.innerHTML, "Passed!" );
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