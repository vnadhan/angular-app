//drop catalog collection to prevent duplication everytime you run it.
db.catalog.drop();
print('Log: Catalog collection refreshed.');

//create catalog collection and add documents to it.
//
//catalog collection description ->
//
//catalog {
//		thumbnail
//		name
//		description
//}

db.catalog.insert({'thumbnail' : 'imagefileid',
				'name' : 'Physics',
				'description' : 'Learn the fundamentals of how the universe works!'
});

print('Log: catalog collection created and document added.');
