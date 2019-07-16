//drop user_course collection to prevent duplication everytime you run it.
db.usr_course.drop();
print('Log: user_course collection refreshed.');

//create user_course collection and add documents to it.
//
//user_course collection description ->
//
//user_course {
//		user_id
//		course [{
//			course_id
//			flag
//		}]
//}
//
//Flag variable values: ENR, ONG, FIN, DRP

db.usr_course.insert({'user_id' : '11601806677',
				'course' : [{
					'course_id' : '987239872398',
					'flag' : 'ENR'
				},
				{
					'course_id' : '893749827333',
					'flag' : 'ONG'
				}]
});

print('Log: user_course collection created and document added.');
