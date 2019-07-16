/*Created by aayusharora (@angularboy) on 10/10/2016*/
"use strict";

angular.module('landing.controller',[]);
angular.module('landing.controller')
	.controller('landingController', landingController)
    
    landingController.$inject = ['landingService','$scope','$rootScope'];

    function landingController (landingService,$scope,$rootScope)
	 {
	  // Do something with myService
        var allCourses = allCourses;
            getsliderImages = getsliderImages;
            allCourses();
            getsliderImages(); 

	       function allCourses() {

	       		var myDataPromise = landingService.getCourseData(); 
	       		//////
	       		myDataPromise.then(function(result) {
	       			 $scope.mydata = result;
	       		})
	       		
                $scope.mydata = myDataPromise;
                console.log(myDataPromise);
	       	} 
	     
	     function getsliderImages () {

	     	 $scope.prod = {imagePaths: []};
				$scope.prod.imagePaths = [
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg' },
				  	{ custom: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg', thumbnail: 'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'}
				];
	     }
	 };

