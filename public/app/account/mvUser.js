angular.module('app').factory('mvUser', function ($resource) {
    var UserResource = $resource('/api/users/:id', {_id: "@id"}, {
        update: {method: 'PUT', isArray: false}
    });

    UserResource.prototype.isAdmin = function () {
        return this.Roles && this.Roles.indexOf('admin') > -1;
    };

    return UserResource;
});