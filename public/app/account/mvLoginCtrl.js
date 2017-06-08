angular.module('app').controller('mvLoginCtrl', function($scope, mvAuth, mvNotifier, $location, mvCaptcha) {
    $scope.refreshCaptcha = mvCaptcha.refreshCaptcha;
    $scope.refreshCaptcha();
    $scope.rememberMe = function () {
        $scope.remember = !$scope.remember;
    };
    $scope.signin = function () {
        mvAuth.authenticateUser($scope.username, $scope.password, $scope.remember, $scope.captcha).then(function () {
            $scope.refreshCaptcha();
            mvNotifier.successNotify(texts.SuccessAction, 'logged in!');
            $location.path('/');
        } , function(error) {
            $scope.refreshCaptcha();
            mvNotifier.errorNotify(texts.ErrorAction, !!error ? error : 'failed to log in!');
        });
    };
});