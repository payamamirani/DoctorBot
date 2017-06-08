angular.module('app').controller('mvResetPasswordCtrl', function($scope, $location, mvCaptcha, mvAuth, mvNotifier) {
    $scope.refreshCaptcha = mvCaptcha.refreshCaptcha;
    $scope.refreshCaptcha();
    $scope.Username = $location.search().u;
    $scope.resetPassword = function () {
        var data = {
            password: $scope.password,
            confirmPassword: $scope.confirmPassword,
            captcha: $scope.captcha,
            username: $location.search().u,
            token: $location.search().t
        };

        if(data.password !== data.confirmPassword) {
            mvNotifier.warningNotify(texts.WarningAction, texts.PasswordNotEqualWithConfirmPassword);
            return;
        }

        mvAuth.resetPassword(data).then(function() {
            $scope.refreshCaptcha();
            mvNotifier.successNotify(texts.SuccessAction, texts.SuccessResetPassword);
            $location.path('/signin');
        }, function (error) {
            $scope.refreshCaptcha();
            mvNotifier.errorNotify(texts.ErrorAction, !!error ? error : texts.ErrorResetPassword);
        })
    };
});