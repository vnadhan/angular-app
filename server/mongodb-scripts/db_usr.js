//drop user collection to prevent duplication everytime you run it.
db.usr.drop();
print('Log: User collection refreshed.');

//create user collection and add documents to it.
//
//user collection description ->
//
//user {
//		thumbnail
//		fname
//		lname
//		email
//		password
//		userRole []
//		phone
//		language []
//		watchlist {
//			course []
//			users []
//		}
//}

db.usr.insert({'thumbnail' : 'imagefileid',
				'fname' : 'sanjay',
				'lname' : 'kumar',
				'email' : 'sanjaykumara1994@gmail.com',
				'password' : 'abc@123',
				'role' : ['admin', 'coach'],
				'phone' : {
					'number' : '909090900',
					'countrycode' : '+91'
				},
				'language' : ['eng', 'fre', 'ger'],
				'watchlist' : {
					'course' : ['CCode1', 'CCode2', 'CCode3', 'CCode4'],
					'user' : ['88hkj9jb3233', '20983r909802', '98293fdf109820']
				}
});

print('Log: user collection created and document added.');
