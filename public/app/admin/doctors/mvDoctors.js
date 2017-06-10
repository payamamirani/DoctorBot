angular.module('app').factory('mvDoctors', function ($resource) {
    var DoctorResource = $resource('/api/doctors/:_id', {_id: "@id"}, {
        update: {method: 'PUT', isArray: false}
    });

    return DoctorResource;
});

