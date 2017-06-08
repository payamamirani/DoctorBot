angular.module('app').factory('mvExpertise', function ($resource) {
    var ExpertiseResource = $resource('/api/expertise/:id', {_id: "@id"}, {
        update: {method: 'PUT', isArray: false}
    });

    return ExpertiseResource;
});
