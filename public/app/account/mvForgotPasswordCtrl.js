angular.module('app').controller('mvForgotPasswordCtrl', function($scope, mvAuth, mvNotifier, mvCaptcha, $location) {
    $scope.refreshCaptcha = mvCaptcha.refreshCaptcha;
    $scope.refreshCaptcha();
    $scope.forgotPassword = function () {
        mvAuth.forgotPassword($scope.username, $scope.captcha).then(function() {
            $scope.refreshCaptcha();
            mvNotifier.successNotify(texts.SuccessAction, texts.SuccessResetPassword);
            $location.path('/');
        }, function(error) {
            $scope.refreshCaptcha();
            mvNotifier.errorNotify(texts.ErrorAction, !!error ? error : texts.ErrorResetPassword);
        });
    }
});