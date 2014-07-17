/**
 * Created by tetarenko on 25.01.14.
 */

var db = require('./db');
var auth = require('./auth');
var authUtil = require('./authutil');

var requestWrapperFactory = function (dbGetter) {
    return function (req, res) {
        authUtil.authUser(req.user, function (err, userId) {
            if (err) {
                res.send(500, err);
            } else {
                dbGetter(userId, function (err, recordset) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json({ value: recordset});
                    }
                });
            }
        });
    }
};

module.exports = function (app, baseUrl) {
    app.get(
        baseUrl + '/odata/geoworkslayers',
        auth.middlewares,
        requestWrapperFactory(db.layersGet)
    );

    app.get(baseUrl + '/odata/geoworksmaps',
        auth.middlewares,
        requestWrapperFactory(db.mapsGet)
    );

    app.get(baseUrl + '/odata/geoworksmaptips',
        auth.middlewares,
        requestWrapperFactory(db.maptipsGet)
    );

    app.get(baseUrl + '/odata/geoworksparams', function (req, res) {
        db.paramsGet(function (err, recordset) {
            if (err) {
                res.send(err);
            } else {
                res.json({ value: recordset });
            }
        });
    });

    app.get(baseUrl + '/odata/geoworksservicerepresentations',
        auth.middlewares,
        requestWrapperFactory(db.serviceRepresentationsGet)
    );

    app.get(baseUrl + '/odata/geoworksservers',
        auth.middlewares,
        requestWrapperFactory(db.serversGet)
    );

    app.get(baseUrl + '/odata/geoworksuserparams',
        auth.middlewares,
        function (req, res) {
            //http://si-sdiis/GeoWorks/api/odata/GeoWorksUserParams?$filter=(GeoWorksUserID eq 1)and(Name eq '1')
            var buf = req.query.$filter.slice('(GeoWorksUserID eq '.length, -1);
            var userId = parseInt(buf.substring(0, buf.indexOf(')')));
            var name = buf.slice(buf.indexOf(')') + "and(Name eq '".length + 1, -1);
            console.log(userId);
            console.log(name);
            db.userParamsGet(userId, name, function (err, recordset) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({ value: recordset });
                }
            });
    });

    app.post(baseUrl + '/odata/geoworksuserparams',
        auth.middlewares,
        function (req, res) {
            authUtil.authUser(req.user, function (err, userId) {
                if (err) {
                    res.send(500, err);
                } else {
                    if (!req.user.guest) {
                        db.userParamsPost(req.body, function (err, recordset) {
                            if (err) {
                                res.send(500, err);
                            } else {
                                res.json(201, recordset);
                            }
                        });
                    } else {
                        res.json(200, "user is guest");
                    }
                }
            });
    });

    app.put(baseUrl + '/odata/geoworksuserparams/(:userId)',
        auth.middlewares,
        function (req, res) {
            authUtil.authUser(req.user, function (err, userId) {
                if (err) {
                    res.send(500, err);
                } else {
                    if (!req.user.guest) {
                        db.userParamsPut(req.body, function (err, recordset) {
                            if (err) {
                                res.send(500, err);
                            } else {
                                res.json(204, recordset);
                            }
                        });
                    } else {
                        res.json(200, "user is guest");
                    }
                }
            });
    });

    app.get(baseUrl + '/webapi/geoworksutils/validateconnection', function (req, res) {
        var result = {
            Result: "Ok",
            Message: "GeoWorks OData service v0.0.1"
        };

        db.usersGet(null, function (err, recordset) {
            if (err) {
                res.send(err);
            } else {
                res.json(200, result);
            }
        });
    });

    app.get(baseUrl + '/webapi/geoworksutils/useridentity',
        auth.middlewares,
        function (req, res) {
            authUtil.authUser(req.user, function (err, userId) {
                db.usersGet(userId, function (err, rec) {
                    if (err) {
                        res.send(err);
                    } else {
                        var usr = {
                            ID: rec[0].GeoWorksUserID,
                            DisplayName: rec[0].DisplayName,
                            Name: rec[0].Name,
                            Error: '',
                            SubjectID: rec[0].GeoWorksSubjectID,
                            IsAuthenticated: true,
                            SubjectName: '',
                            Roles: []
                        };
                        db.rolesGetByUserId(rec[0].GeoWorksUserID, function (err, rec) {
                            if (err) {
                                usr.Error = err;
                            } else {
                                usr.Roles = rec;
                            }
                            if (!!usr.SubjectID) {
                                db.subjectGetById(usr.SubjectID, function (err, rec) {
                                    if (err) {
                                        usr.Error += err;
                                    } else {
                                        usr.SubjectName = rec[0].Name;
                                    }
                                    res.json(200, usr);
                                });
                            } else {
                                res.json(200, usr);
                            }
                        });
                    }
                });
            });
        }
    );

    app.get(
        baseUrl + '/webapi/geoworksutils/getrolerights',
        auth.middlewares,
        function (req, res) {
            authUtil.authUser(req.user, function (err, userId) {
                if (err) {
                    res.send(500, err);
                } else {
                    db.roleRightsGet(userId, function (err, recordset) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.json(200, recordset);
                        }
                    });
                }
            });
        }
    );
};