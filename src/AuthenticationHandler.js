function AuthenticationHandler() {
    this.locationFormVisible = ko.observable(true);
    this.loginFormVisible = ko.observable(false);
    this.location = ko.observable("");
    this.username = ko.observable("");
    this.password = ko.observable("");
    this.setLocation = function() {
        this.hideLocation();
        this.showLogin();
    }
    this.setCredentials = function() {
        this.hideLogin();
        var locationElement = document.getElementById("jiraLocation");
        if (locationElement != null) {
            var location = locationElement.value;

            if (location == "") {
                alert("You need to set a valid Jira Location")
                jn = null;
                return;
            }

            var stageTwo = document.getElementById("stageTwo");
            stageTwo.style.display = "block";

            jn = new JiraNavigator(location);
            jn.clearJiraList();
            jn.init();
        }
    }
    ko.applyBindings(this, document.getElementById('setUrlPanel'));
    ko.applyBindings(this, document.getElementById('stageOne'));
    x = this
}

AuthenticationHandler.prototype.showLogin = function() {
    this.loginFormVisible(true);
}

AuthenticationHandler.prototype.hideLogin = function() {
    this.loginFormVisible(false);
}

AuthenticationHandler.prototype.hideLocation = function() {
    this.locationFormVisible(false);
}