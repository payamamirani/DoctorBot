angular.module('app').factory('mvAuth', function($http, mvIdentity, $q, mvUser) {
    return {
        authenticateUser: function (username, password, remember, captcha) {
            var dfd = $q.defer();
            $http.post('/login', {username: username, password: password, remember: remember, captcha: captcha}).then(function(response) {
                if(response.data.success) {
                    var user = new mvUser();
                    angular.extend(user, response.data.user);
                    mvIdentity.currentUser = user;
                    dfd.resolve(true);
                } else {
                    dfd.reject(response.data.error);
                }
            });
            return dfd.promise;
        },
        logoutUser: function () {
            var dfd = $q.defer();
            $http.post('/logout', { logout: true }).then(function() {
                mvIdentity.currentUser = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        },
        authorizeCurrentUserForRoute: function (role) {
            if(mvIdentity.isAuthorized(role))
                return true;
            else
                return $q.reject('not authorized');
        },
        authorizeAuthenticatedUserForRoute: function () {
            if(mvIdentity.isAuthenticated())
                return true;
            else
                return $q.reject('not authorized');
        },
        authorizeNotAuthenticatedUserForRoute: function() {
            if(!mvIdentity.isAuthenticated())
                return true;
            else
                return $q.reject('not authorized');
        },
        createUser: function (newUserData) {
            var newUser = new mvUser(newUserData);
            var dfd = $q.defer();

            newUser.$save().then(function() {
                mvIdentity.currentUser = newUser;
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        updateCurrentUser: function (newUserData) {
            var dfd = $q.defer();
            var clone = angular.copy(mvIdentity.currentUser);
            angular.extend(clone, newUserData);
            clone.$update().then(function(response) {
                mvIdentity.currentUser = response.data;
                dfd.resolve(response.data.success);
            }, function(response) {
                dfd.reject(response.data.error);
            });
            return dfd.promise;
        },
        forgotPassword: function(username, captcha) {
            var dfd = $q.defer();
            $http.post('/api/forgotPassword', {username: username, captcha: captcha}).then(function(response) {
                if(response.data.success) {
                    dfd.resolve(true);
                } else {
                    dfd.reject(response.data.error);
                }
            });

            return dfd.promise;
        },
        resetPassword: function(params) {
            var dfd = $q.defer();
            $http.post('/api/resetPassword', params).then(function(response) {
                if(response.data.success)
                    dfd.resolve(true);
                else
                    dfd.reject(response.data.error);
            });
            return dfd.promise;
        }
    };
});