//drop course collection to prevent duplication everytime you run it.
db.course.drop();
print('Log: course collection refreshed.');

//create course collection and add documents to it.
//
//course collection description ->
//
//course {
//		title
//		description
//		author
//		start_date
//		category []
//		thumbnail
//		rating
//		fee {
//			currency
//			amount
//		}
//		language []
//		faq []
//		intro_video
//		tags []
//}

db.course.insert({'title' : 'Quantum Physics Fundamentals',
				'description' : 'Learn how the universe works with the help of simple mathematics.',
				'author' : '3lnl3mn3332332',
				'start_date' : '11:05:2016 16:00',
				'category' : ['physics', 'mathematics', 'astrophysics'],
				'thumbnail' : 'imageFileId',
				'rating' : '4.2',
				'fee' : {
					'currency' : 'usd',
					'amount' : '55'
				},
				'language' : ['eng', 'fre', 'chn'],
				'faq' : {
					'qa' : [{
						'ques' : 'question 1',
						'ans' : 'answer 1'
					}, {
						'ques' : 'question 2',
						'ans' : 'answer 2'
					}]
				},
				'intro_video' : 'videofileid', 
				'tags' : ['physics', 'Quantum', 'mathematics', 'theoretical']
});

print('Log: course collection created and document added.');
