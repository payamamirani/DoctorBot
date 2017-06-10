angular.module('app').controller('mvExpertiseListCtrl', function ($scope, $timeout, mvExpertise, mvNotifier) {
    $scope.refresh = function () {
        $timeout(function(){
            $scope.expertise = mvExpertise.query();
        });
    };

    $scope.refresh();

    $scope.AddNew = function () {
        $("#AddExpertise").modal('show');
        $scope.Id = null;
        $scope.expertiseTitle = null;
        $scope.expertiseFees = null;
        $scope.expertiseIsActive = null;
        $scope.method = "AddNew";
        $scope.ModalTitle = texts.AddExpertise;
    };

    $scope.Edit = function (obj) {
        $("#AddExpertise").modal('show');
        $scope.Id = obj._id;
        $scope.expertiseTitle = obj.Title;
        $scope.expertiseFees = obj.Fees;
        $scope.expertiseIsActive = obj.IsActive;
        $scope.method = "Edit";
        $scope.ModalTitle = texts.EditExpertise;
    };

    $scope.ChangeActive = function(obj){
        obj.IsActive = !obj.IsActive;
        obj.$update().then(function(){
            mvNotifier.successNotify(texts.SuccessAction, "");
            $scope.refresh();
        }, function(response) {
            mvNotifier.errorNotify(texts.ErrorAction, response.data.reason);
        });
    };

    $scope.SaveExpertise = function () {
        var expertiseData = {
            Title: $scope.expertiseTitle,
            IsActive: !!$scope.expertiseIsActive,
            Fees: $scope.expertiseFees
        };

        switch ($scope.method) {
            case "Edit":
                expertiseData._id = $scope.Id;
                break;
        }

        var newExpertise = new mvExpertise(expertiseData);
        if ($scope.method !== "Edit") {
            newExpertise.$save().then(function () {
                mvNotifier.successNotify(texts.SuccessAction, "");
                $("#AddExpertise").modal('hide');
                $scope.refresh();
            }, function (response) {
                mvNotifier.errorNotify(texts.ErrorAction, response.data.reason);
            })
        } else {
            newExpertise.$update().then(function () {
                mvNotifier.successNotify(texts.SuccessAction, "");
                $("#AddExpertise").modal('hide');
                $scope.refresh();
            }, function (response) {
                mvNotifier.errorNotify(texts.ErrorAction, response.data.reason);
            })
        }
    };
});