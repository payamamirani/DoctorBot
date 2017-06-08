angular.module('app').controller('mvChangePasswordCtrl', function($scope, mvCaptcha, mvAuth, mvNotifier, $location) {
    $scope.refreshCaptcha = mvCaptcha.refreshCaptcha;
    $scope.refreshCaptcha();
    $scope.changePassword = function () {
        var passwordData = {
            CurrentPassword: $scope.currentPassword,
            Password: $scope.password,
            ConfirmPassword: $scope.confirmPassword,
            captcha: $scope.captcha
        };

        if(passwordData.Password !== passwordData.ConfirmPassword) {
            mvNotifier.warningNotify(texts.WarningAction, texts.PasswordNotEqualWithConfirmPassword);
            return;
        }

        mvAuth.updateCurrentUser(passwordData).then(function() {
            $scope.refreshCaptcha();
            mvNotifier.successNotify(texts.SuccessAction, texts.SuccessResetPassword);
            $location.path('/');
        }, function (error) {
            $scope.refreshCaptcha();
            mvNotifier.errorNotify(texts.ErrorAction, !!error ? error : texts.ErrorResetPassword);
        });
    }
});