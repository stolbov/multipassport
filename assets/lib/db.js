/**
 * Created by tetarenko on 25.01.14.
 */

var sql     = require('mssql');
var options = require('./options');

var sqlConfig = {
    user    : options.database.user,
    password: options.database.password,
    server  : options.database.server,
    database: options.database.database
};

var sqlRequest = module.exports.sqlRequest = function (sqlStr, done) {
    var connection = new sql.Connection(sqlConfig, function(err) {
        var request = new sql.Request(connection);
        request.query(sqlStr, function (err, recordset) {
            done(err,recordset);
        });
    });
};

module.exports.layersGet = function (userId, done) {
    var sqlStr;

    if (!!userId) {
        sqlStr =    'SELECT DISTINCT dbo.GeoWorksLayers.* FROM' +
                    ' (dbo.GeoWorksLayers INNER JOIN dbo.GeoWorksLayerInRoles' +
                    ' ON dbo.GeoWorksLayers.GeoWorksLayerID = dbo.GeoWorksLayerInRoles.GeoWorksLayerID)' +
                    ' INNER JOIN dbo.GeoWorksUserGeoWorksRoles' +
                    ' ON dbo.GeoWorksLayerInRoles.GeoWorksRoleID =' +
                    ' dbo.GeoWorksUserGeoWorksRoles.GeoWorksRole_GeoWorksRoleID' +
                    ' WHERE (((dbo.GeoWorksUserGeoWorksRoles.GeoWorksUser_GeoWorksUserID)=' + userId + '))';
    } else {
        sqlStr = 'SELECT * FROM dbo.GeoWorksLayers';
    }

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.mapsGet = function (userId, done) {
    var sqlStr;

    if (!!userId) {
        sqlStr =    'SELECT DISTINCT dbo.GeoWorksMaps.*' +
                    ' FROM ((dbo.GeoWorksMaps INNER JOIN dbo.GeoWorksLayers ON' +
                    ' dbo.GeoWorksLayers.GeoWorksMapID = dbo.GeoWorksMaps.GeoWorksMapID)' +
                    ' INNER JOIN dbo.GeoWorksLayerInRoles' +
                    ' ON dbo.GeoWorksLayers.GeoWorksLayerID = dbo.GeoWorksLayerInRoles.GeoWorksLayerID)' +
                    ' INNER JOIN dbo.GeoWorksUserGeoWorksRoles' +
                    ' ON dbo.GeoWorksLayerInRoles.GeoWorksRoleID =' +
                    ' dbo.GeoWorksUserGeoWorksRoles.GeoWorksRole_GeoWorksRoleID' +
                    ' WHERE (((dbo.GeoWorksUserGeoWorksRoles.GeoWorksUser_GeoWorksUserID)=' + userId + '))';
    } else {
        sqlStr = 'SELECT * FROM dbo.GeoWorksMaps';
    }

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.maptipsGet = function (userId, done) {
    var sqlStr;

    if (!!userId) {
        sqlStr =    'SELECT DISTINCT dbo.GeoWorksMapTips.*' +
                    ' FROM ((dbo.GeoWorksMapTips INNER JOIN dbo.GeoWorksLayers ON' +
                    ' dbo.GeoWorksLayers.GeoWorksMapTipID = dbo.GeoWorksMapTips.GeoWorksMapTipID)' +
                    ' INNER JOIN dbo.GeoWorksLayerInRoles' +
                    ' ON dbo.GeoWorksLayers.GeoWorksLayerID = dbo.GeoWorksLayerInRoles.GeoWorksLayerID)' +
                    ' INNER JOIN dbo.GeoWorksUserGeoWorksRoles' +
                    ' ON dbo.GeoWorksLayerInRoles.GeoWorksRoleID =' +
                    ' dbo.GeoWorksUserGeoWorksRoles.GeoWorksRole_GeoWorksRoleID' +
                    ' WHERE (((dbo.GeoWorksUserGeoWorksRoles.GeoWorksUser_GeoWorksUserID)=' + userId + '))';
    } else {
        sqlStr = 'SELECT * FROM dbo.GeoWorksMapTips';
    }

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.paramsGet = function (done) {
    var sqlStr = 'SELECT * FROM dbo.GeoWorksParams';

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.serviceRepresentationsGet = function (userId, done) {
    var sqlStr;

    if (!!userId) {
        sqlStr =    'SELECT DISTINCT dbo.GeoWorksServiceRepresentations.*' +
                    ' FROM ((dbo.GeoWorksServiceRepresentations INNER JOIN dbo.GeoWorksLayers ON' +
                    ' dbo.GeoWorksLayers.GeoWorksServiceRepresentationID =' +
                    ' dbo.GeoWorksServiceRepresentations.GeoWorksServiceRepresentationID)' +
                    ' INNER JOIN dbo.GeoWorksLayerInRoles' +
                    ' ON dbo.GeoWorksLayers.GeoWorksLayerID = dbo.GeoWorksLayerInRoles.GeoWorksLayerID)' +
                    ' INNER JOIN dbo.GeoWorksUserGeoWorksRoles' +
                    ' ON dbo.GeoWorksLayerInRoles.GeoWorksRoleID =' +
                    ' dbo.GeoWorksUserGeoWorksRoles.GeoWorksRole_GeoWorksRoleID' +
                    ' WHERE (((dbo.GeoWorksUserGeoWorksRoles.GeoWorksUser_GeoWorksUserID)=' + userId + '))';
    } else {
        sqlStr = 'SELECT * FROM dbo.GeoWorksServiceRepresentations';
    }

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.serversGet = function (userId, done) {
    var sqlStr;

    if (!!userId) {
        sqlStr =    'SELECT DISTINCT dbo.GeoWorksServers.*' +
                    ' FROM (((dbo.GeoWorksServers INNER JOIN dbo.GeoWorksServiceRepresentations' +
                    ' ON dbo.GeoWorksServers.GeoWorksServerID = dbo.GeoWorksServiceRepresentations.GeoWorksServerID)' +
                    ' INNER JOIN dbo.GeoWorksLayers ON' +
                    ' dbo.GeoWorksLayers.GeoWorksServiceRepresentationID =' +
                    ' dbo.GeoWorksServiceRepresentations.GeoWorksServiceRepresentationID)' +
                    ' INNER JOIN dbo.GeoWorksLayerInRoles' +
                    ' ON dbo.GeoWorksLayers.GeoWorksLayerID = dbo.GeoWorksLayerInRoles.GeoWorksLayerID)' +
                    ' INNER JOIN dbo.GeoWorksUserGeoWorksRoles' +
                    ' ON dbo.GeoWorksLayerInRoles.GeoWorksRoleID =' +
                    ' dbo.GeoWorksUserGeoWorksRoles.GeoWorksRole_GeoWorksRoleID' +
                    ' WHERE (((dbo.GeoWorksUserGeoWorksRoles.GeoWorksUser_GeoWorksUserID)=' + userId + '))';
    } else {
        sqlStr = 'SELECT * FROM dbo.GeoWorksServers';
    }

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.userParamsGet = function (userId, name, done) {
    var sqlStr;

    if ((!!userId) && (!!name)) {
        sqlStr =    'SELECT DISTINCT dbo.GeoWorksUserParams.*' +
                    ' FROM dbo.GeoWorksUserParams' +
                    ' WHERE (((dbo.GeoWorksUserParams.GeoWorksUserID)=' + userId + ') AND ((dbo.GeoWorksUserParams.Name)=' + name  + '))';
    } else {
        sqlStr = 'SELECT * FROM dbo.GeoWorksUserParams';
    }

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.userParamsPost = function (obj, done) {
    var sqlStr =    'INSERT INTO dbo.GeoWorksUserParams' +
                    ' (GeoWorksUserID ,Name ,Value)' +
                    ' VALUES' +
                    ' (' + obj.GeoWorksUserID + ',' +
                    ' ' + obj.Name + ',' +
                    " '" + obj.Value + "')";

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.userParamsPut = function (obj, done) {
    var sqlStr =    ' UPDATE dbo.GeoWorksUserParams' +
                    ' SET' +
                    " Name = '" + obj.Name +"'" +
                    " ,Value = '" + obj.Value + "'" +
                    ' WHERE dbo.GeoWorksUserParams.GeoWorksUserID = ' + obj.GeoWorksUserID;
    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.usersGetById = function (userId, done) {
    var sqlStr =    'SELECT dbo.GeoWorksUsers.*' +
                    ' FROM dbo.GeoWorksUsers' +
                    ' WHERE (((dbo.GeoWorksUsers.GeoWorksUserID)=' + userId + '))';

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.usersGetByName = function (name, done) {
    var sqlStr =    'SELECT dbo.GeoWorksUsers.*' +
                    ' FROM dbo.GeoWorksUsers' +
                    " WHERE (((dbo.GeoWorksUsers.Name)='" + name + "'))";

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.usersGet = function (userId, done) {
    var sqlStr;

    if (!!userId) {
        sqlStr =    'SELECT dbo.GeoWorksUsers.*' +
                    ' FROM dbo.GeoWorksUsers' +
                    ' WHERE (((dbo.GeoWorksUsers.GeoWorksUserID)=' + userId + '))';
    } else {
        sqlStr = 'SELECT * FROM dbo.GeoWorksUsers';
    }

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.rolesGetByUserId = function (userId, done) {
    var sqlStr =    'SELECT dbo.GeoWorksRoles.GeoWorksRoleID AS ID, dbo.GeoWorksRoles.Name AS Name' +
                    ' FROM dbo.GeoWorksRoles INNER JOIN dbo.GeoWorksUserGeoWorksRoles' +
                    ' ON dbo.GeoWorksRoles.GeoWorksRoleID =' +
                    ' dbo.GeoWorksUserGeoWorksRoles.GeoWorksRole_GeoWorksRoleID' +
                    ' WHERE (((dbo.GeoWorksUserGeoWorksRoles.GeoWorksUser_GeoWorksUserID)=' + userId + '))';

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.subjectGetById = function (subjectId, done) {
    var sqlStr =    'SELECT dbo.GeoWorksSubjects.*' +
                    ' FROM dbo.GeoWorksSubjects' +
                    ' WHERE (((dbo.GeoWorksSubjects.GeoWorksSubjectID)=' + subjectId + '))';

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};

module.exports.roleRightsGet = function (userId, done) {
    var sqlStr =    'SELECT DISTINCT dbo.GeoWorksLayers.GeoWorksLayerID, dbo.GeoWorksLayerInRoles.Rights FROM' +
                    ' (dbo.GeoWorksLayers INNER JOIN dbo.GeoWorksLayerInRoles' +
                    ' ON dbo.GeoWorksLayers.GeoWorksLayerID = dbo.GeoWorksLayerInRoles.GeoWorksLayerID)' +
                    ' INNER JOIN dbo.GeoWorksUserGeoWorksRoles' +
                    ' ON dbo.GeoWorksLayerInRoles.GeoWorksRoleID =' +
                    ' dbo.GeoWorksUserGeoWorksRoles.GeoWorksRole_GeoWorksRoleID' +
                    ' WHERE (((dbo.GeoWorksUserGeoWorksRoles.GeoWorksUser_GeoWorksUserID)=' + userId + '))';

    sqlRequest(sqlStr, function (err, recordset) {
        done(err, recordset);
    });
};
