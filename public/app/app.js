angular.module('app', ['ngResource', 'ngRoute', 'ui.tree']);

angular.module('app').config(function($routeProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push('LoadingInterceptor');
    var routeRoleCheck = {
        admin: {
            auth: function (mvAuth) {
                return mvAuth.authorizeCurrentUserForRoute('admin');
            }
        },
        user: {
            auth: function(mvAuth) {
                return mvAuth.authorizeAuthenticatedUserForRoute();
            }
        },
        nouser: {
            auth: function(mvAuth) {
                return mvAuth.authorizeNotAuthenticatedUserForRoute();
            }
        }
    };

    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', { templateUrl: '/partials/main/main', controller: 'mvMainCtrl', resolve: routeRoleCheck.user })
        .when('/admin/users' , { templateUrl: '/partials/admin/users/user-list' , controller: 'mvUserListCtrl',
            resolve: routeRoleCheck.admin })
        .when('/admin/expertise' , { templateUrl: '/partials/admin/expertise/expertise-list' , controller: 'mvExpertiseListCtrl',
            resolve: routeRoleCheck.admin })
        .when('/admin/doctors' , { templateUrl: '/partials/admin/doctors/doctor-list' , controller: 'mvDoctorListCtrl',
            resolve: routeRoleCheck.admin })
        .when('/signup', { templateUrl: '/partials/account/signup', controller: 'mvSignupCtrl',
            resolve: routeRoleCheck.admin })
        .when('/signin', { templateUrl: '/partials/account/signin', controller: 'mvLoginCtrl',
            resolve: routeRoleCheck.nouser })
        .when('/forgotpassword', { templateUrl: '/partials/account/forgotpassword', controller: 'mvForgotPasswordCtrl',
            resolve: routeRoleCheck.nouser })
        .when('/resetpassword', {templateUrl: '/partials/account/resetpassword', controller: 'mvResetPasswordCtrl',
            resolve: routeRoleCheck.nouser })
        .when('/changepassword', {templateUrl: '/partials/account/changepassword', controller: 'mvChangePasswordCtrl',
            resolve: routeRoleCheck.user })
        .when('/profile', { templateUrl: '/partials/account/profile', controller: 'mvProfileCtrl',
            resolve: routeRoleCheck.user });
});

angular.module('app').directive('loader', function ($rootScope) {
    return function($scope, element, attrs){
        $scope.$on("loader_show", function() {
            return element.show();
        });
        $scope.$on("loader_hide", function() {
            return element.hide();
        });
    }
});

angular.module('app').run(function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
        if(rejection === 'not authorized') {
            $location.path('/signin');
        }
    });
});