var async = require('async');
module.exports = function (app) {
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;
    var Usr = app.models.Usr;
    
    /* hack to enable fetching roles for a particular userId - Not required */
    /*RoleMapping.belongsTo(AppUser);
    AppUser.hasMany(RoleMapping, {
        foreignKey: 'principalId'
    });
    Role.hasMany(AppUser, {
        through: RoleMapping,
        foreignKey: 'roleId'
    });*/
    /* hack to enable fetching roles for a particular userId - Not required */

    // Delete all docs in Role and RoleMapping
    Role.remove({});
    RoleMapping.remove({});

    console.log("Adding 'DENY' ACL to Role, RoleMapping and Usr models ..");
    // Init
    var aclToAdd = {};
    if (Role.settings.acls === undefined)
        Role.settings.acls = [];
    if (RoleMapping.settings.acls === undefined)
        RoleMapping.settings.acls = [];
    if (Usr.settings.acls === undefined)
        Usr.settings.acls = [];

    // Add restriction on Role and RoleMapping models
    aclToAdd.accessType = "*";
    aclToAdd.principalId = "$everyone";
    aclToAdd.principalType = "ROLE";
    aclToAdd.permission = "DENY";

    Role.settings.acls.push(aclToAdd);
    RoleMapping.settings.acls.push(aclToAdd);

    aclToAdd = {};
    aclToAdd.accessType = "READ";
    aclToAdd.principalId = "$authenticated";
    aclToAdd.principalType = "ROLE";
    aclToAdd.permission = "ALLOW";

    Role.settings.acls.push(aclToAdd);
    RoleMapping.settings.acls.push(aclToAdd);

    //Usr tables -- Access
    aclToAdd = {};
    aclToAdd.accessType = "*";
    aclToAdd.principalId = "$everyone";
    aclToAdd.principalType = "ROLE";
    aclToAdd.permission = "DENY";
    Usr.settings.acls.push(aclToAdd);
    
    // Create all Role.
    var roles = [{
        name: 'TS_ADMIN'
    },{
        name: 'TS_COACHEE'
    },{
        name: 'TS_COACH'
    }];
    async.each(roles, function(role, done) {
        Role.create(role, function (err, newrole) {
            if (err) throw err;
            done();
        });
    }, function(err){
        if(err) console.log(err);
        console.log(" Added 3 roles ");
        // Role and Rolemapping
        // read access
        aclToAdd = {};
        aclToAdd.accessType = "READ";
        aclToAdd.principalId = roles[0].name;
        aclToAdd.principalType = "ROLE";
        aclToAdd.permission = "ALLOW";
        aclToAdd.property = "find";
        Role.settings.acls.push(aclToAdd);
        RoleMapping.settings.acls.push(aclToAdd);

        // deny write access for $everyone
        aclToAdd = {};
        aclToAdd.accessType = "WRITE";
        aclToAdd.principalId = "$everyone";
        aclToAdd.principalType = "ROLE";
        aclToAdd.permission = "DENY";
        aclToAdd.property = "create";
        Role.settings.acls.push(aclToAdd);
        RoleMapping.settings.acls.push(aclToAdd);

        // allow write access for superadmin
        aclToAdd = {};
        aclToAdd.accessType = "WRITE";
        aclToAdd.principalId = roles[0].name;
        aclToAdd.principalType = "ROLE";
        aclToAdd.permission = "ALLOW";
        aclToAdd.property = "create";
        Role.settings.acls.push(aclToAdd);
        RoleMapping.settings.acls.push(aclToAdd);
    });
};