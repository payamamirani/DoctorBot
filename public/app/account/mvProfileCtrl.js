angular.module('app').controller('mvProfileCtrl', function($scope, mvAuth, mvIdentity, mvNotifier) {
    $scope.email = mvIdentity.currentUser.Username;
    $scope.firstName = mvIdentity.currentUser.FirstName;
    $scope.lastName = mvIdentity.currentUser.LastName;

    $scope.update = function () {
        var newUserData = {
            Username: $scope.email,
            FirstName: $scope.firstName,
            LastName: $scope.lastName
        };

        if($scope.password && $scope.password.length > 0)
            newUserData.Password = $scope.password;

        mvAuth.updateCurrentUser(newUserData).then(function() {
            mvNotifier.successNotify("Success", "Your user account has been updated.");
        }, function (reason) {
            mvNotifier.errorNotify("Error", reason);
        })
    }
});