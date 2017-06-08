angular.module('app').controller('mvExpertiseListCtrl', function ($scope, mvExpertise, mvNotifier) {
    $scope.expertise = mvExpertise.query();
    
    $scope.AddNew = function () {
        $("#AddExpertise").modal('show');
        $scope.Id = null;
        $scope.expertiseTitle = null;
        $scope.expertiseIsActive = null;
        $scope.method = "AddNew";
        $scope.ModalTitle = texts.AddExpertise;
    };

    $scope.SaveExpertise = function () {
        var expertiseData = {
            Title: $scope.expertiseTitle,
            IsActive: $scope.expertiseIsActive
        };

        switch ($scope.method) {
            case "Edit":
                expertiseData.Id = $scope.Id;
                break;
        }

        var newExpertise = new mvExpertise(expertiseData);
        if ($scope.method !== "Edit") {
            newExpertise.$save().then(function () {
                mvNotifier.successNotify(texts.SuccessAction, "");
                $("#AddExpertise").modal('hide');
            }, function (response) {
                mvNotifier.errorNotify(texts.ErrorAction, response.data.reason);
            })
        } else {
            newExpertise.$update().then(function () {
                mvNotifier.successNotify(texts.SuccessAction, "");
                $("#AddExpertise").modal('hide');
            }, function (response) {
                mvNotifier.errorNotify(texts.ErrorAction, response.data.reason);
            })
        }
    };
});