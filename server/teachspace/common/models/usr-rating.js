var app = require('../../server/server');
module.exports = function(UsrRating) {
    
    UsrRating.remoteMethod(
        'rateByUserId', {
            http: {path: '/rateUser', verb: 'post'},
            accepts: [{arg: 'comments', type: 'object', http: {source: 'body'}}],
            returns: {arg: 'returnval', type: 'object', root: true},
            description: ['Rate a user by userId']
        }
    );
    /* {
"sourceId" : "shriya.s@gmail.com",
"targetId" : "",
"sourceRole" : "coach",
"rating" : 4,
"comments" : "Awesome"
}*/
    UsrRating.rateByUserId = function(data, callback) {
        var Usr = app.models.Usr;
        console.log("TargetId in data: " + data.targetId);
        console.log("SourceId in data: " + data.sourceId);
        Usr.find({where: {
            or: [
              {'usrId': data.sourceId},
              {'email': data.sourceId}]}}, function(err, user) {
           if(err) callback(err);
           if(user) {
               console.log("SourceId found: " + user[0].email);
               UsrRating.find({where: {'user_id' : data.targetId}}, function(userRatingFound_error, userRatingFound) {
                   if(userRatingFound_error) callback(userRatingFound_error);
                   if(userRatingFound && userRatingFound.length>0) {
                       console.log("User rating found: " + userRatingFound[0].user_id);
                       var ratingPostData = {
                           "user_id" : data.sourceId, 
                           "rating" : data.rating,
                           "comments" : data.comments
                       };
                       if(data.sourceRole == "coachee") {
                           userRatingFound[0].student_rating.findById(user[0].email, function(err1,rfound){
                               if(err1) callback(err1);
                               // success
                               if(rfound) {
                                   userRatingFound[0].student_rating.updateById(user[0].email, ratingPostData, function(err2, updatedrating) {
                                       if(err2) callback(err2);
                                       callback(null, updatedrating);
                                   });
                               } else {
                                  userRatingFound[0].student_rating.create(ratingPostData, function(err2, updatedrating) {
                                       if(err2) callback(err2);
                                       callback(null, updatedrating);
                                   }); 
                               }
                           });
                       } else if(data.sourceRole == "coach") {
                           userRatingFound[0].coach_rating.findById(user[0].email, function(err1,rfound){
                               if(err1) callback(err1);
                               // success
                               if(rfound) {
                                   userRatingFound[0].coach_rating.updateById(user[0].email, ratingPostData, function(err2, updatedrating) {
                                       if(err2) callback(err2);
                                       callback(null, updatedrating);
                                   });
                               } else {
                                   userRatingFound[0].coach_rating.create(ratingPostData, function(err2, updatedrating) {
                                       if(err2) callback(err2);
                                       callback(null, updatedrating);
                                   });
                               }
                           });
                       }
                   } else {
                       console.log("New user rating");
                       var newPost = {
                            "user_id": data.targetId,
                       };
                       if(data.sourceRole === "coach") { 
                           newPost._coach_rating = [{
                                "user_id": data.sourceId,
                                "rating": data.rating,
                                "comments": data.comments 
                            }];
                       } else if(data.sourceRole === "coachee"){
                           newPost._student_rating = [{
                               "user_id" : data.sourceId,
                               "rating" : data.rating,
                               "comments" : data.comments
                           }];
                       } else {
                           callback("Invalid Role");
                       }
                       UsrRating.create(newPost, function(newUserRating_error, newUsrRating) {
                           if(newUserRating_error) callback(newUserRating_error);
                          if(data.sourceRole === "coach") { 
                           callback(null, newUsrRating._coach_rating[0]);
                       } else if(data.sourceRole === "coachee"){
                           callback(null, newUsrRating._student_rating[0]);
                       } else
                           callback(newUserRating_error);
                       });
                   }
               });
           } else {
               callback("SourceId not found.");
           }
        });
    }
};
