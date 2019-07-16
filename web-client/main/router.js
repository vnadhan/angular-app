"use strict";
/**
  * Configure the Routes
*/
tsApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    // Home
    .when("/", {templateUrl: "components/partials/home.html", controller: "landingController"})
    // Pages
    .when("/about", {templateUrl: "components/partials/about.html", controller: "appController"})
    .when("/faq", {templateUrl: "components/partials/faq.html", controller: "PageCtrl"})
    .when("/pricing", {templateUrl: "components/partials/pricing.html", controller: "PageCtrl"})
    .when("/services", {templateUrl: "components/partials/services.html", controller: "PageCtrl"})
    .when("/contact", {templateUrl: "components/partials/contact.html", controller: "PageCtrl"})
    // Blog
    .when("/blog", {templateUrl: "components/partials/blog.html", controller: "BlogCtrl"})
    .when("/blog/post", {templateUrl: "components/partials/blog_item.html", controller: "BlogCtrl"})
    // else 404
    .otherwise("/404", {templateUrl: "components/partials/404.html", controller: "PageCtrl"});
}]);
