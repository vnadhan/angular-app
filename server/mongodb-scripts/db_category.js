//drop category collection to prevent duplication everytime you run it.
db.category.drop();
print('Log: Category collection refreshed.');

//create category collection and add documents to it.
//
//category collection description ->
//
//category {
//		catalog_id
//		name
//		description
//}

db.category.insert({'catalog_id' : '779980kj863044',
				'thumbnail' : 'imagefileid',
				'name' : 'Quantum Physics',
				'description' : 'Browse through the courses in Quantum Physics'
});

print('Log: category collection created and document added.');
