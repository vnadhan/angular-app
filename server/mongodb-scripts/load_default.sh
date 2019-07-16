#!/bin/sh
if [ $1 ]
then 
	echo "Loading all default scripts...";
	PATH_TO_SCRIPTS=$1;
	cd $PATH_TO_SCRIPTS;
	if [ $# -eq 2 ]
		then
		if [ $2 == "--force-path" ]
			then
			export MONGO_PATH=/usr/local/mongodb
			export PATH=$PATH:$MONGO_PATH/bin
			echo "Mongo DB path set forcibly."
		fi
	fi
	mongo db_connection.js;
	mongo db_user.js;
	mongo db_catalog.js;
	mongo db_category.js;
	mongo db_user_rating.js;
	mongo db_course_rating.js;
	mongo db_course.js;
	mongo db_user_course.js;
	echo "Default scripts load complete.";
else
	echo "Usage: ./load_default.sh <PATH_TO_SCRIPTS> <OPTION>";
fi