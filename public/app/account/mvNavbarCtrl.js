angular.module('app').controller('mvNavbarCtrl', function ($scope, mvNotifier, mvIdentity, mvAuth, $location) {
   $scope.identity = mvIdentity;
   $scope.logout = function () {
       mvAuth.logoutUser().then(function() {
           $("#myPanel").modal('hide');
           $scope.password = $scope.username = "";
           mvNotifier.infoNotify("Info", "You have successfully signed out!");
           $location.path('/');
       });
   };
});