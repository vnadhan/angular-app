var loopback = require('loopback');
var fs = require("fs");
var async = require('async');
var path = require('path');

//http://stackoverflow.com/questions/26119001/loopback-hasmanythrough-relation-where-to-add-it
//https://github.com/strongloop/loopback/issues/466
//https://docs.strongloop.com/display/public/LB/HasAndBelongsToMany+relations
//http://localhost:3000/api/course/Business001?filter[include]=usrs&filter[include]=course_rating&filter[include]=categories
//https://docs.strongloop.com/display/public/LB/Setting+debug+strings
module.exports = function(app) {
  var ds = app.dataSources.teachspacemongodb;

  if(ds.connected) {
    loadData();
  } else {
    ds.once('connected', loadData);
  }

  function loadData() {
    var Catalog = app.models.Catalog;
    var Category = app.models.Category;
    var Usr_course_model = app.models.Usr_course;
    var file = path.resolve(__dirname, '../../common/data/combinedData_test.json');
     
    // Delete all docs
    Catalog.remove({});
    Category.remove({});
    app.models.Course.remove({});
    app.models.Course_rating.remove({});
    app.models.Usr_course.remove({});

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
          console.log('Error: ' + err);
        } else {
          data = JSON.parse(data)
          var categories = data.category;

          Catalog.create(data, function(err, catalog){
            if(err)
              console.log(err);
            

            async.each(categories, function(eachCategory, callbackall) {
              // what to do with each category ?
              var courses = eachCategory.courses;
              var refCategory;
              var refCourse;
              catalog.category.create(eachCategory, function(err1, newCategory) {
                if(err1) return callbackall(err1);
                refCategory= newCategory
                async.each(courses, function(eachCourse, callback1) {
                  var usrs = eachCourse.usrs;
                  var course_rating = eachCourse.course_rating;
                  var _faq = eachCourse._faq;
                  delete eachCourse._faq;
                  delete eachCourse.usrs;

                  async.series([
                    function(callback) {
                      refCategory.courses.create(eachCourse, function(err, newCourse) {
                        if (err) return callback(err);
                        refCourse = newCourse;
                        callback();
                      });
                    },
                    function(callback) {
                      // Add FAQs
                      async.each(_faq, function(faq, done) {
                        refCourse.faq.create(faq, function(err, newFaq) {
                          if(err) return callback(err);
                          done();
                        });
                      }, function(err1) {
                        if(err1) callback(err1);
                        // after all faqs are created
                        callback();
                      });
                    },
                    function(callback) {
                      // Add Usrs
                      async.each(usrs, function(eachuser, done) {
                        eachuser.course_date = refCourse.start_date;
                        eachuser.courseId = refCourse.courseId; //- auto from the course.
                        app.models.Usr.find({where: {'email': eachuser.email}}, function(err, auser) {
                          if(err) return callback(err);
                          if(auser) {
                            Usr_course_model.create({'usrId' : auser[0].id, 'courseId' : refCourse.id, 'course_date' : refCourse.start_date}, function(err1, usrcourse) {
                              if(err1) return callback(err);
                              done();
                            });
                          } else {
                            callback(err1);
                          }
                        });
                      }, function(err2) {
                        // after all usrs are created
                        if(err2) return callback(err2);
                        callback();
                      });
                    },
                    function(callback) {
                      // Add Course_rating
                      var user_rating = course_rating._student_rating;
                      delete course_rating._student_rating;
                      refCourse.course_rating.create(course_rating, function(err, cRating) {
                        if(err) return callback(err);

                        async.each(user_rating, function(eachURating, done){
                          // Add student_rating
                          cRating.student_rating.create(eachURating, function(err6, uRatings) {
                            if(err6) return callback(err6);
                            done();
                          });
                        }, function(err1) {
                          // after all usrs are created
                          if(err1) return callback(err1);
                          callback();
                        });
                      });
                    }
                  ], function(errcom) {
                    if (errcom) return callback1(errcom);
                    callback1(); // this gets called after all the 4 callbacks or a course is dne.
                  });
                });
                callbackall();
              });
            }, function(err){
              // what to do when all categories are added ?
            });
          });
        }
    });
  }
};
