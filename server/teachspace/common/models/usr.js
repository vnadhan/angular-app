var app = require('../../server/server');
module.exports = function(Usr) {
  // Get all users with user ratings
  Usr.getAllUsrs = function(cb) {
    Usr.find({
      fields: ['id', 'fname', 'lname', 'thumbnail', 'email'],
        include: [{
            relation: 'usr_rating'
        }
        ]},
        function(err, usrs) {
            if (err) return cb(err);
            cb(null, usrs);
        });
  };
  Usr.remoteMethod(
    'getAllUsrs', {
        http: {path: '/getAllUsrs', verb: 'get'},
        accepts: [],
        returns: {arg: 'usrs', type: 'object', root: true},
        description: ['Return usrs, usr_rating with limited information']
    }
  );

  // Get a user using emailId with user ratings
  Usr.getUsrSnapshot = function(email, cb) {
    Usr.find({where: {email : email},
      fields : ['id', 'fname', 'lname', 'thumbnail'],
        include: [{
            relation: 'usr_rating'
        }
        ]},
        function(err, usrFound) {
            if (err) return cb(err);
            cb(null, usrFound);
        });
  };
  Usr.remoteMethod(
    'getUsrSnapshot', {
        http: {path: '/getUsrSnapshot', verb: 'get'},
        accepts: [{arg: 'email', type: 'string'}],
        returns: {arg: 'usrs', type: 'object', root: true},
        description: ['Return usr, usr_rating with limited information']
    }
  );

  // get user detail to splash on user dashboard screen
  Usr.remoteMethod(
    'getUsrDetail', {
        http: {path: '/getUsrDetail', verb: 'get'},
        accepts: [{arg: 'ce', type: 'string'}],
        returns: {arg: 'usr', type: 'object', root: true},
        description: ['Return usr complete detail']
    }
  );
  Usr.getUsrDetail = function(ce, cb) {
    Usr.find({where: {
          or: [{
            'email':  ce
           }, {
            'id': ce
          }]
        },
        include: [{
            relation: 'courses'
        },
        {
            relation: 'usr_rating'
        }
        ]},
        function(err, usrFound) {
            if (err) return cb(err);
            cb(null, usrFound);
        });
  };
};
