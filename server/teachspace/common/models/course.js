var app = require('../../server/server');
var async = require('async');
module.exports = function(Course) {
  // Get all courses with course ratings - for display on user screen
  Course.getAllCourses = function(cb) {
    Course.find({
        fields: ['id', 'title', 'description', 'start_date', 'thumbnail', 'tags', 'authorId'],
        include: [{
          relation: 'course_rating'
        }, {
          relation: 'author',
          scope: { // further filter the author object
            fields: ['thumbnail', 'fname', 'lname'], // only show 3 fields
            include: { // include usr_rating for the author
              relation: 'usr_rating'
            } }
        }]
      },
      function(err, courses) {
        if (err) return cb(err);
        cb(null, courses);
      });
  };
  Course.remoteMethod(
    'getAllCourses', {
      http: {
        path: '/allCourses',
        verb: 'get'
      },
      accepts: [],
      returns: {
        arg: 'courses',
        type: 'object',
        root: true
      },
      description: ['Return all courses and respective course ratings with limited information']
    }
  );

  // Get courseDetail
  Course.courseDetail = function(ce, cb) {
    Course.find({
        where: {
          or: [{
            'code': {
              like: ce
            }
          }, {
            'id': ce
          }]
        },
        fields: ['code', 'id', 'title', 'description', 'start_date', 'thumbnail', 'tags', 'authorId', '_faq', '_fee'],
        include: [{
          relation: 'course_rating'
        }, {
          relation: 'author',
          scope: { // further filter the author object
            fields: ['thumbnail', 'fname', 'lname'], // only show 3 fields
            include: { // include usr_rating for the author
              relation: 'usr_rating'
            }
          }
        }]
      },
      function(err, course) {
        if (err) cb(err);
        cb(null, course);
      });
  };
  Course.remoteMethod(
    'courseDetail', {
      http: {
        path: '/courseDetail',
        verb: 'get'
      },
      accepts: [{
        arg: 'ce',
        type: 'string',
        required: true
      }],
      returns: {
        arg: 'course',
        type: 'object',
        root: true
      },
      description: ['Return complete course detail']
    }
  );

  // search course by tag value
  Course.remoteMethod(
    'coursesByTag', {
      http: {
        path: '/coursesByTag',
        verb: 'get'
      },
      accepts: [{
        arg: 'tag',
        type: 'object',
        http: {
          source: 'body'
        }
      }],
      returns: {
        arg: 'courses',
        type: 'object',
        root: true
      },
      description: ['Return courses by tag']
    }
  );
  Course.coursesByTag = function(tag, cb) {
    console.log("To search in --- " + JSON.stringify(tag));
    Course.find({
        where: {
          'tags': {
            inq: tag.tags
          }
        },
        fields: ['id', 'title', 'description', 'start_date', 'thumbnail', 'tags', 'authorId'],
        include: [{
          relation: 'course_rating'
        }, {
          relation: 'author',
          scope: { // further filter the author object
            fields: ['thumbnail', 'fname', 'lname'], // only show 3 fields
            include: { // include usr_rating for the author
              relation: 'usr_rating'
            }
          }
        }]
      },
      function(err, courses) {
        if (err) cb(err);
        cb(null, courses);
      });
  };

  // search course by like name
  Course.remoteMethod(
    'coursesByName', {
      http: {
        path: '/coursesByName',
        verb: 'get'
      },
      accepts: [{
        arg: 'name',
        type: 'string',
        required: true
      }],
      returns: {
        arg: 'courses',
        type: 'object',
        root: true
      },
      description: ['Return courses with matching name']
    }
  );
  Course.coursesByName = function(name, cb) {
    console.log("To search by name --- " + JSON.stringify(name));
    //  console.log("To search in --- " + tag);
    Course.find({
        where: {
          'name': {
            like: name
          }
        },
        fields: ['id', 'title', 'description', 'start_date', 'thumbnail', 'tags', 'authorId'],
        include: [{
          relation: 'course_rating'
        }, {
          relation: 'author',
          scope: { // further filter the author object
            fields: ['thumbnail', 'fname', 'lname'], // only show 3 fields
            include: { // include usr_rating for the author
              relation: 'usr_rating'
            }
          }
        }]
      },
      function(err, courses) {
        if (err) cb(err);
        cb(null, courses);
      });
  };

  // before save hook on course to attach faq


  // Add Usr to course. - Apply for a course
  /* {
      "usrId" : "575126fe0b9b256c84bea914",
      "code" : "Business001",
      "start_date" : "2016-05-29"
     }
  */
  Course.remoteMethod(
    'joinCourse', {
      http: {
        path: '/joinCourse',
        verb: 'post'
      },
      accepts: [{
        arg: 'body',
        type: 'object',
        http: {
          source: 'body'
        },
        required: true
      }],
      returns: {
        arg: 'usr_course',
        type: 'object',
        root: true
      },
      description: ['Join a course']
    }
  );
  Course.joinCourse = function(details, cb) {
    console.log("user --- " + details.usrId);
    var courseId;
    var detailsVerified = false;
    var Usr_course_model = app.models.Usr_course;

    async.series([
      //Load user to get `userId` first
      function(callback) {
        if (details.usrId) {
          if (details.code) {
            Course.findOne({
                where: {
                  'code': details.code
                },
                fields: ['id']
              },
              function(err, courseFound) {
                if (err) cb(err);

                if (typeof courseFound !== 'undefined' && courseFound) {
                  courseId = courseFound.id;
                  detailsVerified = true;
                  callback();
                } else {
                  cb("Invalid course details!");
                }
              });
          } else if (details.courseId) {
            courseId = details.courseId;
            detailsVerified = true;
            callback();
          } else {
            cb("Invalid course details!");
          }
        } else {
          cb("Invalid user details!");
        }
      }
    ], function(err) { //This function gets called after the tsk have called their "task callbacks"
      if (err) return cb(err);
      if (detailsVerified) {
        console.log(" Details for the enrollment : " + JSON.stringify(details));
        Usr_course_model.create({
          'usrId': details.usrId,
          'courseId': courseId,
          'course_date': details.start_date
        }, function(err, usrcourse) {
          if (err) cb(err);
          console.log("user enrolled for the course : " + JSON.stringify(usrcourse));
          cb(null, usrcourse);
        });
      } else {
        cb("Invalid details!");
      }
    });
  };

  // Leave the course
  Course.remoteMethod(
    'leaveCourse', {
      http: {
        path: '/leaveCourse',
        verb: 'post'
      },
      accepts: [{
        arg: 'usrId',
        type: 'string',
        required: true
      }, {
        arg: 'courseId',
        type: 'string',
        required: true
      }],
      returns: {
        arg: 'usr_course',
        type: 'object',
        root: true
      },
      description: ['Join a course']
    }
  );
  Course.leaveCourse = function(usrId, courseId, cb) {
    console.log("user --- " + usrId);
    console.log("user --- " + courseId);
    var courseId = "";

    if (usrId) {
      if (courseId) {
        Course.find({
            where: {
              'code': courseId
            },
            fields: ['id']
          },
          function(err, courseFound) {
            if (err) cb(err);
            courseFound.usrs.remove({
              'id': usrId
            }, function(err) {
              if (err) cb(null, {
                'success': false
              });
              courseFound.usrs.findById(usrId, function(err1, usr_course) {
                if (err1) cb(null, {
                  'success': true
                });
                cb(null, {
                  'success': false
                });
              });
            })
          });
      }
    }
  };

  // before delete hook on course, to delete the usrs and the faq

  

  // add course
  Course.remoteMethod(
    'addCourse', {
      http: {
        path: '/addCourse',
        verb: 'post'
      },
      accepts: [{
        arg: 'body',
        type: 'object',
        http: {
          source: 'body'
        },
        required: true
      }],
      returns: {
        arg: 'course',
        type: 'object',
        root: true
      },
      description: ['Add a course']
    }
  );
  /*{
  "catalogname" : "Business",
  "categoryname" : "Marketing",
  "categoryId" : "5752c769a02f2bf03388a82e",
  "code": "EP002",
  "title": "Negotiation Learning",
  "description": "Negotiation Learning",
  "start_date": "2016-07-01",
  "language": [
    "en_us"
  ],
  "tags": [
    "Entrepreneurship",
    "Negotiation"
  ],
  "authorId": "tom.l@gmail.com",
  "_faq": [
    {
      "ques": "What is the refund policy?",
      "ans": "You are eligible for a refund until two weeks after your payment date, or until two weeks after the course or Specialization launches on the platform, whichever is later. You are not eligible for a refund after earning a Course Certificate, even if you complete a course within the two-week period."
    },
    {
      "ques": "Is financial aid available?",
      "ans": "Yes, we provides financial aid to learners who cannot afford the fee."
    }
  ],
  "_fee": {
    "amount": "1000",
    "currency": "USD"
  }
} */
  Course.addCourse = function(data, callback) {
    console.log(" adding course data verif : " + JSON.stringify(data));
    data.tags.push(data.catalogname,data.categoryname);
    var _faq = data._faq;
    var Category = app.models.Category;
    var categoryId = data.categoryId;
    delete data._faq;
    delete data.catalogname;
    delete data.categoryname;
    delete data.categoryId;
    Category.find({where: {'id' : categoryId}}, function(err, refCategory) {
      refCategory[0].courses.create(data, function(err, course) {
        if (err) return callback(err);
        console.log("course created : " + JSON.stringify(course));
        // Add FAQs
        if (_faq) {
          console.log("faq is not empty " + _faq.length);
          async.each(_faq, function(eachfaq, done) {
            course.faq.create(eachfaq, function(err1, newFaq) {
              if (err1) return done(err1);
              console.log("faq created : " + JSON.stringify(newFaq));
              done();
            });
          }, function(err1) {
            if (err1) callback(err1);
            
            // after all faqs are created
            console.log(" Course Added :::: " + JSON.stringify(course));
            callback(null, course);
          });
        } else {
          console.log("----- No faq -----, Course Added :::: " + JSON.stringify(course));
          callback(null, course);
        }
      });
    });
  };
};
