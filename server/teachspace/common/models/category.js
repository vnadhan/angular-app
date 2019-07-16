var app = require('../../server/server');
var async = require('async');
module.exports = function(Category) {

    //Delete a Category
    // Associations present : Category has courses, courses have course_rating
    // courses has presence in usr_course
    Category.remoteMethod(
        'delCategory', {
            http: {
                path: '/delCategory',
                verb: 'get'
            },
            accepts: [{
                arg: 'categoryId',
                type: 'string',
                required: true
            }],
            returns: {
                arg: 'response',
                type: 'object',
                root: true
            },
            description: ['Delete a category']
        }
    );

    Category.delCategory = function(categoryId, callback) {

        // remove course_rating from course.
        var Course_rating = app.models.Course_rating;

        //get the courses for the category
        Category.find({ where: { 'id': categoryId } }, function(err, refCategory) {
            if (err) callback(err);
            console.log("category found : " + JSON.stringify(refCategory[0]));
            refCategory[0].courses(function(err1, courses) {
                if (err1) callback(err1);
                console.log("courses found : " + JSON.stringify(courses));
                if (courses) {
                    if (courses.length > 0) {
                        async.each(courses, function(course, done) {
                            async.parallel([
                                function(cb) {
                                    course.course_rating.destroy(function(err4) {
                                        if (err4) callback(err4);
                                        cb();
                                    });
                                },
                                function(cb) {
                                    app.models.Usr_course.find({where : {'courseId' : course.id}}, function(ucourse, err4) {
                                        if (err4) callback(err4);
                                        if(ucourse) {
                                            if(ucourse.length > 0) {
                                                async.each(ucourse, function(c, done) {
                                                    app.models.Usr_course.delete(ucourse.id, function(err, res){
                                                        if(err) callback(err);
                                                        done();
                                                    },cb);
                                                });
                                            } else
                                                cb();
                                        } else
                                            cb();
                                    });
                                },
                                function(cb) {
                                    course.delete(function(err4) {
                                        if (err4) callback(err4);
                                        cb();
                                    });
                                }
                            ], function(err3) {
                                if (err3) callback(err3);
                                done();
                            });
                            
                        }, function(err2) {
                            // all courses done
                            // now delete category
                            Category.destroyById(categoryId, function(err, res){
                                if(err) callback(err);
                                callback(res);
                            });
                        });
                    } else {
                        // now delete category
                        Category.destroyById(categoryId, function(err, res){
                            if(err) callback(err);
                            callback(res);
                        });
                    }
                } else {
                    // now delete category
                    Category.destroyById(categoryId, function(err, res){
                        if(err) callback(err);
                        callback(res);
                    });
                }
            });
        });
    };
};
