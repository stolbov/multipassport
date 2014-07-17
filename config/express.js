var iisBaseUrl = require('iis-baseurl');
module.exports.express = {
    customMiddleware: function (app) {
        app.use(iisBaseUrl());
    }
};