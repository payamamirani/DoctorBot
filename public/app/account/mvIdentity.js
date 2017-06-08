angular.module('app').factory('mvIdentity', function ($window, mvUser) {
    var currenUser = undefined;
    if(!!$window.bootstrappedUserObject){
        currenUser = new mvUser();
        angular.extend(currenUser, $window.bootstrappedUserObject[0]);
    }
    return {
        currentUser: currenUser,
        isAuthenticated: function(){
            return !!this.currentUser;
        },
        isAuthorized: function (role) {
            return this.isAuthenticated() && this.currentUser.Roles.indexOf(role) > -1;
        }
    }
});