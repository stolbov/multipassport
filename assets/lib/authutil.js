/**
 * Created by tetarenko on 26.01.14.
 */

var db = require('./db');

module.exports.authUser = function (user, done) {
    if (user.guest) {
        db.usersGetByName("guest", function (err, record) {
            done(err, record[0].GeoWorksUserID);
        });
    } else {
        db.usersGetByName(user.profile._json.userPrincipalName, function (err, record) {
            if (record.length > 0) {
                done(err, record[0].GeoWorksUserID);
            } else {
                user.guest = true;
                db.usersGetByName("guest", function (err, record) {
                    done(err, record[0].GeoWorksUserID);
                });
            }
        });
    }
};
