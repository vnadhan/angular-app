//drop course_rating collection to prevent duplication everytime you run it.
db.course_rating.drop();
print('Log: course_rating collection refreshed.');

//create course_rating collection and add documents to it.
//
//course_rating collection description ->
//
//course_rating {
//		course_id
//		client_rating [{
//			user_id
//			rating
//		}]
//		rating_score
//		no_of_clients_enrolled
//}

db.course_rating.insert({'course_id' : '5kn98s33393233',
				'student_rating' : [{
					'user_id' : '23523nmn32423n',
					'rating' : '4.3'
				},
				{
					'user_id' : '3232lk32432l',
					'rating' : '3.3'
				}],
				'rating_score' : '4.0',
				'enroll_count' : '233'
});

print('Log: course_rating collection created and document added.');
