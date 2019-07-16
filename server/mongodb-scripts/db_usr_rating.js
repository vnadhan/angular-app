//drop user_rating collection to prevent duplication everytime you run it.
db.usr_rating.drop();
print('Log: User_rating collection refreshed.');

//create user_rating collection and add documents to it.
//
//user_rating collection description ->
//
//user_rating {
//		user_id
//		rating {
//			student_rating [{
//				user_id
//				rating
//			}]
//			coach_rating [{
//				user_id
//				rating
//			}]
//		}
//		rating_score
//}

db.usr_rating.insert({'user_id' : '8066779no0863044',
				'rating' : {
					'student_rating' : [{
						'user_id' : '8066779kj0863045',
						'rating' : '3.8'
					}, {
						'user_id' : '8066779ji0863046',
						'rating' : '4.2'
					}],
					'coach_rating' : [{
						'user_id' : '806677kn80863345',
						'rating' : '3.0'
					}, {
						'user_id' : '80667723bo0863046',
						'rating' : '4.2'
					}]
				},
				'rating_score' : '4.5'
});

print('Log: user_rating collection created and document added.');
