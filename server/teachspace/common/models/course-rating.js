var app = require('../../server/server');
module.exports = function(CourseRating) {

	/*{
"userId" : "shriya.s@gmail.com",
"rating" : 4,
"comments" : "Awesome",
"courseId"  "5752e8d675d73448110a07dc"
}*/
	CourseRating.remoteMethod(
		'rateByUserId', {
			http: {path: '/rateCourse', verb: 'post'},
			accepts: [ {arg: 'comments', type: 'object', http: { source: 'body' } }],
			returns: {arg: 'returnval', type: 'object', root: true},
			description: ['Rate a course by user ID']
		}
		);

	CourseRating.rateByUserId = function(data, callback) {
		var Usr = app.models.Usr;
		console.log(data.courseId)
		// db check for usr
		Usr.findById(data.userId, function(err, user){
			if(err) callback(err);
			if(user) { 
				console.log(user.email);
				CourseRating.find({where:{'course_id':data.courseId}}, function(err, cratingFound){
					if(cratingFound) {
						console.log(JSON.stringify(cratingFound[0]));
						cratingFound[0].student_rating.findById(user.email, function(userfound_error, userfound) {
							if(userfound_error) callback(userfound_error);
							if(userfound) {
								console.log(userfound);
								cratingFound[0].student_rating.updateById(user.email, {
								"user_id": user.email,
								"rating": data.rating,
								"comments": data.comments
								}, function(err1, studentrating){
									if(err1) callback(err1);
									callback(null, studentrating);
								});
							} else {
								cratingFound[0].student_rating.create({
								"user_id": user.email,
								"rating": data.rating,
								"comments": data.comments
								}, function(err1, studentrating){
									if(err1) callback(err1);
									callback(null, studentrating);
								});
							}
						});	
					} else {
						CourseRating.create({
							"course_id": data.courseId,
							"_student_rating": [
							{
								"user_id": user.email,
								"rating": data.rating,
								"comments": data.comments
							}
							]
						}, function(err, newcrating){
							if(err2) callback(err2);
							callback(null, newcrating._student_rating[0])
						});
					}
				});
			} else {
				callback("user not found");
			}
		});
	};
};