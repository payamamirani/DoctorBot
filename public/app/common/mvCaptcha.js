angular.module('app').factory('mvCaptcha', function() {
    return {
        refreshCaptcha: function() {
            $("img.captcha").attr("src", "/captcha?" + new Date().getMilliseconds());
        }
    };
});