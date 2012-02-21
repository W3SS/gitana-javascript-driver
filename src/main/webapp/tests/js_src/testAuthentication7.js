(function($) {

    //
    // Test case : Authentication 7
    //
    // This tests out OAuth authentication and ensures that the GITANA_TICKET cookie is written and that it works
    // after authentication for calls that originate outside of the driver.
    //
    // The GITANA_TICKET cookie is an encrypted cookie that is written by the Gitana server and contains enough
    // information so that the Gitana Server can determine the access token that was issued to the client.  This
    // allows standard GET and POST methods originating from the browser to work against Gitana.
    //
    module("authentication7");

    test("Authentication7", function()
    {
        stop();
        expect(2);

        var gitana = new Gitana({
            "clientId": GitanaTest.TEST_CLIENT_ID,
            "clientSecret": GitanaTest.TEST_CLIENT_SECRET
        });

        gitana.authenticate({
            "username": GitanaTest.TEST_USER_CREDENTIALS_KEY,
            "password": GitanaTest.TEST_USER_CREDENTIALS_SECRET
        }).then(function() {

            // NOTE: this = platform

            ok(true, "Successfully authenticated");

            // now try to get something from Gitana using a direct Ajax call
            $.get("/proxy/repositories", function(data)
            {
                ok(true, "Successfully retrieved a list of repositories via normal Ajax");
                start();
            });
        });
    });

}(jQuery) );