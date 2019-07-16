angular
    .module('landing')
    .directive('landingImage', landingImage);
 
function landingImage() {
    var directive = {
        link: link,
        templateUrl: 'components/partials/landing/landingimage.html',
        controller: 'landingController',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
      /* */
    }
}
