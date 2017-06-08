angular.module('app').controller('mvSignupCtrl', function($scope, mvAuth, mvNotifier, $location, mvCaptcha) {
    $scope.refreshCaptcha = mvCaptcha.refreshCaptcha;
    $scope.refreshCaptcha();
    $scope.signup = function () {
        var newUserData = {
            Username: $scope.email,
            Password: $scope.password,
            FirstName: $scope.firstName,
            LastName: $scope.lastName
        };

        mvAuth.createUser(newUserData).then(function() {
            $scope.refreshCaptcha();
            mvNotifier.successNotify(texts.SuccessAction, "User account created!");
            $location.path("/");
        }, function(error) {
            $scope.refreshCaptcha();
            mvNotifier.errorNotify(texts.ErrorAction, !!error ? error : texts.ErrorResetPassword);
        });
    }
});
