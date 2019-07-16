var loopback = require('loopback');
var fs = require("fs");
var async = require('async');
var path = require('path');

module.exports = function (app) {
    var ds = app.dataSources.teachspacemongodb;

    if (ds.connected) {
        loadData();
    } else {
        ds.once('connected', loadData);
    }

    function loadData() {
        var Usr = app.models.Usr;

        var file = path.resolve(__dirname, '../../common/data/combinedData_Usrs.json');

        // Delete all docs
        Usr.remove({});
        console.log("............... users ............");
        // Read file
        fs.readFile(file, 'utf8', function (err1, data) {
            if (err1) {
                console.log('Error: ' + err1);
            } else {
                async.each(JSON.parse(data), function (user, done) {
                    Usr.create(user, function (err, newusr) {
                        if (err) done(err);
                        // attach to role.
                        app.models.Role.find({ where: { name: newusr.role[0] } }, function (err, role) {
                            role[0].principals.create({
                                principalType: app.models.RoleMapping.USER,
                                principalId: newusr.id
                            }, function (err, principal) {
                                if (err) throw err;
                                done();
                            });
                        });
                    });
                }, function (err) {
                    if (err) console.log(err);
                    console.log("Added all users and principals")
                    Usr.count({}, function(err, count){
                      console.log("Number of Usrs added : " + count);
                    });
                });
            }
        });
    }
};
