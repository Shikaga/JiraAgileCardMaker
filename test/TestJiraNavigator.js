//https://jira.springsource.org/rest/api/latest/project
var listOfProjects = [{"self":"https://jira.springsource.org/rest/api/2/project/GREENHOUSE","id":"10540","key":"GREENHOUSE","name":"Greenhouse","avatarUrls":{"16x16":"https://jira.springsource.org/secure/projectavatar?size=small&pid=10540&avatarId=10070","48x48":"https://jira.springsource.org/secure/projectavatar?pid=10540&avatarId=10070"}},{"self":"https://jira.springsource.org/rest/api/2/project/IMPALA","id":"11102","key":"IMPALA","name":"Impala","avatarUrls":{"16x16":"https://jira.springsource.org/secure/projectavatar?size=small&pid=11102&avatarId=11390","48x48":"https://jira.springsource.org/secure/projectavatar?pid=11102&avatarId=11390"}}]

//https://jira.springsource.org/rest/api/latest/project/BATCH/versions
var listOfVersions = [{"self":"https://jira.springsource.org/rest/api/latest/version/10608","id":"10608","description":"Pre-release - internal working version","name":"1.0-m1","archived":false,"released":true,"releaseDate":"2007-04-30","userReleaseDate":"30/Apr/07"},{"self":"https://jira.springsource.org/rest/api/latest/version/10607","id":"10607","description":"Milestone 2 (first public release)","name":"1.0-m2","archived":false,"released":true,"releaseDate":"2007-09-26","userReleaseDate":"26/Sep/07"},{"self":"https://jira.springsource.org/rest/api/latest/version/10650","id":"10650","description":"1.0 Milestone 3","name":"1.0-m3","archived":false,"released":true,"releaseDate":"2007-12-04","userReleaseDate":"04/Dec/07"}]

//https://jira.caplin.com/rest/greenhopper/latest/rapidviews/list
var listOfRapidViews = {"views":[{"id":8,"name":"FatBoy","canEdit":true,"owner":{"userName":"avinashk","renderedLink":"        <a class=\"user-hover\" rel=\"avinashk\" id=\"_avinashk\" href=\"/secure/ViewProfile.jspa?name=avinashk\">Avinash Kendagannaswamy </a>"},"filter":{"id":11697,"name":"New FatBoy","query":"project in (\"Product: StreamLink for Java\", \"Product: Liberator\", \"Product: Streamlink\", \"Product: Transformer\", \"Product: DataSource SDK\",  \"Product: DataSource SDK for Java\",  \"Product: StreamLink for iOS\", \"Product: Caplin Xaqua Deployment Framework\") AND status in (Backlog, \"Awaiting Test\", \"In Progress\", \"In Progress: Development\", \"In Progress: QA/Test\", Open, Resolved) ORDER BY Rank ASC","owner":{"userName":"avinashk","renderedLink":"        <a class=\"user-hover\" rel=\"avinashk\" id=\"_avinashk\" href=\"/secure/ViewProfile.jspa?name=avinashk\">Avinash Kendagannaswamy </a>"},"canEdit":false,"isOrderedByRank":true,"permissionEntries":[{"values":[{"type":"Project","name":"Product: Caplin Integration Suite"}]},{"values":[{"type":"Project","name":"Product: Caplin Management Console"}]},{"values":[{"type":"Project","name":"Product: DataSource for IDC"}]},{"values":[{"type":"Project","name":"Product: Liberator"}]},{"values":[{"type":"Project","name":"Product: StreamLink for .Net"}]},{"values":[{"type":"Project","name":"Product: StreamLink for Java"}]}]}},{"id":11,"name":"Jackhammer","canEdit":true,"owner":{"userName":"richardc","renderedLink":"        <a class=\"user-hover\" rel=\"richardc\" id=\"_richardc\" href=\"/secure/ViewProfile.jspa?name=richardc\">Richard Chamberlain</a>"},"filter":{"id":11711,"name":"Jackhammer","query":"project = \"Internal: Release Engineering\" ORDER BY Rank ASC","owner":{"userName":"richardc","renderedLink":"        <a class=\"user-hover\" rel=\"richardc\" id=\"_richardc\" href=\"/secure/ViewProfile.jspa?name=richardc\">Richard Chamberlain</a>"},"canEdit":false,"isOrderedByRank":true,"permissionEntries":[{"values":[{"type":"Project","name":"Internal: Release Engineering"}]}]}},{"id":16,"name":"Sabre","canEdit":true,"owner":{"userName":"adami","renderedLink":"        <a class=\"user-hover\" rel=\"adami\" id=\"_adami\" href=\"/secure/ViewProfile.jspa?name=adami\">Adam Iley</a>"},"filter":{"id":11714,"name":"Sabre","query":"project in (\"Product: CT2\", \"Product: CT3\", \"BladeRunner Beta\", \"Product: BladeRunner\") ORDER BY Rank ASC","owner":{"userName":"adami","renderedLink":"        <a class=\"user-hover\" rel=\"adami\" id=\"_adami\" href=\"/secure/ViewProfile.jspa?name=adami\">Adam Iley</a>"},"canEdit":false,"isOrderedByRank":true,"permissionEntries":[{"values":[{"type":"Project","name":"Product: BladeRunner"}]},{"values":[{"type":"Project","name":"Product: CT2"}]},{"values":[{"type":"Project","name":"Product: CT3"}]},{"values":[{"type":"Project","name":"zzOBS - Product: Presenter Library"}]}]}}]};

//https://jira.caplin.com/rest/greenhopper/latest/sprints/8
var listOfRapidViewSprints = {"sprints":[{"id":15,"name":"Sprint 0","closed":false}],"rapidViewId":8};

var JiraApiHandler = function(url, jn) {
	this.jn = jn;
};

JiraApiHandler.prototype.requestRapidViews = function() {
	var listOfRapidViews = {"views":[{"id":8,"name":"FatBoy","canEdit":true,"owner":{"userName":"avinashk","renderedLink":"        <a class=\"user-hover\" rel=\"avinashk\" id=\"_avinashk\" href=\"/secure/ViewProfile.jspa?name=avinashk\">Avinash Kendagannaswamy </a>"},"filter":{"id":11697,"name":"New FatBoy","query":"project in (\"Product: StreamLink for Java\", \"Product: Liberator\", \"Product: Streamlink\", \"Product: Transformer\", \"Product: DataSource SDK\",  \"Product: DataSource SDK for Java\",  \"Product: StreamLink for iOS\", \"Product: Caplin Xaqua Deployment Framework\") AND status in (Backlog, \"Awaiting Test\", \"In Progress\", \"In Progress: Development\", \"In Progress: QA/Test\", Open, Resolved) ORDER BY Rank ASC","owner":{"userName":"avinashk","renderedLink":"        <a class=\"user-hover\" rel=\"avinashk\" id=\"_avinashk\" href=\"/secure/ViewProfile.jspa?name=avinashk\">Avinash Kendagannaswamy </a>"},"canEdit":false,"isOrderedByRank":true,"permissionEntries":[{"values":[{"type":"Project","name":"Product: Caplin Integration Suite"}]},{"values":[{"type":"Project","name":"Product: Caplin Management Console"}]},{"values":[{"type":"Project","name":"Product: DataSource for IDC"}]},{"values":[{"type":"Project","name":"Product: Liberator"}]},{"values":[{"type":"Project","name":"Product: StreamLink for .Net"}]},{"values":[{"type":"Project","name":"Product: StreamLink for Java"}]}]}},{"id":11,"name":"Jackhammer","canEdit":true,"owner":{"userName":"richardc","renderedLink":"        <a class=\"user-hover\" rel=\"richardc\" id=\"_richardc\" href=\"/secure/ViewProfile.jspa?name=richardc\">Richard Chamberlain</a>"},"filter":{"id":11711,"name":"Jackhammer","query":"project = \"Internal: Release Engineering\" ORDER BY Rank ASC","owner":{"userName":"richardc","renderedLink":"        <a class=\"user-hover\" rel=\"richardc\" id=\"_richardc\" href=\"/secure/ViewProfile.jspa?name=richardc\">Richard Chamberlain</a>"},"canEdit":false,"isOrderedByRank":true,"permissionEntries":[{"values":[{"type":"Project","name":"Internal: Release Engineering"}]}]}},{"id":16,"name":"Sabre","canEdit":true,"owner":{"userName":"adami","renderedLink":"        <a class=\"user-hover\" rel=\"adami\" id=\"_adami\" href=\"/secure/ViewProfile.jspa?name=adami\">Adam Iley</a>"},"filter":{"id":11714,"name":"Sabre","query":"project in (\"Product: CT2\", \"Product: CT3\", \"BladeRunner Beta\", \"Product: BladeRunner\") ORDER BY Rank ASC","owner":{"userName":"adami","renderedLink":"        <a class=\"user-hover\" rel=\"adami\" id=\"_adami\" href=\"/secure/ViewProfile.jspa?name=adami\">Adam Iley</a>"},"canEdit":false,"isOrderedByRank":true,"permissionEntries":[{"values":[{"type":"Project","name":"Product: BladeRunner"}]},{"values":[{"type":"Project","name":"Product: CT2"}]},{"values":[{"type":"Project","name":"Product: CT3"}]},{"values":[{"type":"Project","name":"zzOBS - Product: Presenter Library"}]}]}}]};

	this.jn.receiveRapidBoardViews(listOfRapidViews)
}

JiraApiHandler.prototype.requestRapidSprints = function() {

}


test( "JiraNavigator Test", function() {
	jn = new JiraNavigator();
	var element = document.createElement("div");
	jn.renderInElement(element);
	document.body.appendChild(element);
//	var navigationTypeDropDown = jn.getNavigationTypes(listOfProjects);
//	document.body.appendChild(navigationTypeDropDown);
//	var projectDropDown = jn.getProjectDropDown(listOfProjects);
//	document.body.appendChild(projectDropDown);
//	var fixVersions = jn.getFixVersionsDropDown(listOfVersions);
//	document.body.appendChild(fixVersions);
//	var rapidViews = jn.getRapidViewDropDown(listOfRapidViews);
//	document.body.appendChild(rapidViews);
//	var sprints = jn.getRapidViewSprintDropDown(listOfRapidViewSprints);
//	document.body.appendChild(sprints);
	equal(1,1);
});
