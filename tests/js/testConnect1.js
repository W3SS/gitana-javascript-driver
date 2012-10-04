(function() {

    module("connect1");

    // Test case : Gitana Connect #1
    test("Gitana Connect #1", function()
    {
        stop();

        expect(20);

        var appKey = "app-" + new Date().getTime();

        var f1 = function()
        {
            // use the connect() method to take advantage of Gitana's automatic connection loading
            // this will sign on anew and pre-load information for the given stack
            // if a "key" is provided, the driver is cached
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_ID,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin",
                "application": appKey
            }).app(function(err) {

                // this = app helper

                this.datastore("content").listBranches().then(function() {
                    ok(true, "Pass 1 - Found content");
                });
                this.datastore("users").listUsers().then(function() {
                    ok(true, "Pass 1 - Found users");
                });
                this.datastore("app").then(function() {
                    ok(true, "Pass 1 - Found app");
                });
                this.datastore("analytics").then(function() {
                    ok(true, "Pass 1 - Found analytics");
                });
                this.then(function() {
                    f2();
                });
            });
        };

        var f2 = function()
        {
            // now request again, should incur no reload
            var count1 = Gitana.requestCount;
            Gitana.connect().app(function(err) {

                this.datastore("content").then(function() {
                    ok(true, "Pass 2 - Found content");
                });
                this.datastore("users").then(function() {
                    ok(true, "Pass 2 - Found users");
                });
                this.datastore("app").then(function() {
                    ok(true, "Pass 2 - Found app");
                });
                this.datastore("analytics").then(function() {
                    ok(true, "Pass 2 - Found analytics");
                });
                this.then(function() {
                    equal(Gitana.requestCount, count1, "Request count did not go up");
                    f3();
                });
            });
        };

        var f3 = function()
        {
            // and again, using only string
            var count2 = Gitana.requestCount;
            Gitana.connect().app(function(err) {
                this.datastore("content").then(function() {
                    ok(true, "Pass 3 - Found content");
                });
                this.datastore("users").then(function() {
                    ok(true, "Pass 3 - Found users");
                });
                this.datastore("app").then(function() {
                    ok(true, "Pass 3 - Found app");
                });
                this.datastore("analytics").then(function() {
                    ok(true, "Pass 3 - Found analytics");
                });
                this.then(function() {
                    equal(Gitana.requestCount, count2, "Request count did not go up");
                    f4();
                });
            });
        };

        var f4 = function()
        {
            // now disconnect
            Gitana.disconnect();
            ok(true, "Successfully disconnected");

            // now connect and ensure re-authentication
            var count3 = Gitana.requestCount;
            Gitana.connect({
                "clientKey": GitanaTest.TEST_CLIENT_ID,
                "clientSecret": GitanaTest.TEST_CLIENT_SECRET,
                "username": "admin",
                "password": "admin"
            }).app(appKey, function(err) {
                this.datastore("content").then(function() {
                    ok(true, "Pass 4 - Found content");
                });
                this.datastore("users").then(function() {
                    ok(true, "Pass 4 - Found users");
                });
                this.datastore("app").then(function() {
                    ok(true, "Pass 4 - Found app");
                });
                this.datastore("analytics").then(function() {
                    ok(true, "Pass 4 - Found analytics");
                });
                this.then(function() {
                    ok(Gitana.requestCount > count3, "Request count increased");
                    success();
                });
            });
        };

        var success = function()
        {
            start();
        };


        // create stack + some data stores and things
        GitanaTest.authenticateFullOAuth().then(function() {

            // this == platform

            var stack = null;
            this.createStack().then(function() {
                stack = this;
            });
            this.then(function() {

                // this == platform

                this.createRepository().then(function() {
                    this.subchain(stack).assignDataStore(this, "content");
                });
                this.createDomain().then(function() {
                    this.subchain(stack).assignDataStore(this, "users");
                });
                this.createApplication({"key": appKey}).then(function() {
                    this.subchain(stack).assignDataStore(this, "app");
                });
                this.createWarehouse().then(function() {
                    this.subchain(stack).assignDataStore(this, "analytics");
                });
            }).then(function() {
                f1();
            });
        });

    });

}());
