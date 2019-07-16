/* Created By aayusharora(angularboy) on 9/10/2016*/

"use strict";
tsApp.service('appService',appService)

    appService.$inject = ['$http'];

	function appService ($http) {
   
		function getAllCourses () {  

		    var getCourseData = function() {

		        return $http({method:"GET", url:"/data/courseDetails.json"}).then(function(result) {

		            return result.data;
		        });
		    }

		    var getCourseDetails = function() {

		        return $http({method:"GET", url:"/data/courseDetails.json"}).then(function(result) {

		            return result.data;
		        });
		    };  

		   return { 

		   		getCourseData: getCourseData,
                getCourseDetails: getCourseDetails
                      
		   	};

		}

	return getAllCourses();	 

};