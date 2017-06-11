angular.module('app').controller('mvDoctorListCtrl', function ($scope, $timeout, mvDoctors, mvExpertise, mvNotifier) {
    $scope.refresh = function () {
        $timeout(function(){
            $scope.doctors = mvDoctors.query();
            $scope.expertise = mvExpertise.query();
        });
    };

    $scope.refresh();

    $scope.AddNew = function () {
        $("#AddDoctor").modal('show');
        $scope.doctorFullName = $scope.doctorCellNo = $scope.doctorFees = $scope.doctorIsAvailable = $scope.doctorIsActive= $scope.doctorExpertise = null;
        $scope.method = "AddNew";
        $scope.ModalTitle = texts.AddDoctor;
    };

    $scope.Edit = function (obj) {
        $("#AddDoctor").modal('show');
        $scope.Id = obj._id;
        $scope.doctorFullName = obj.FullName;
        $scope.doctorExpertise = obj.Expertise;
        $scope.doctorFees = obj.Fees;
        $scope.doctorIsAvailable = obj.IsAvailable;
        $scope.doctorIsActive = obj.IsActive;
        $scope.doctorCellNo = obj.CellNo;
        $scope.method = "Edit";
        $scope.ModalTitle = texts.EditDoctor;
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

    $scope.ChangeAvailable = function(obj){
        obj.IsAvailable = !obj.IsAvailable;
        obj.$update().then(function(){
            mvNotifier.successNotify(texts.SuccessAction, "");
            $scope.refresh();
        }, function(response) {
            mvNotifier.errorNotify(texts.ErrorAction, response.data.reason);
        });
    };

    $scope.SaveDoctor = function () {
        var doctorData = {
            FullName: $scope.doctorFullName,
            IsAvailable: !!$scope.doctorIsAvailable,
            IsActive: !!$scope.doctorIsActive,
            Fees: $scope.doctorFees,
            Expertise: $scope.doctorExpertise,
            CellNo: $scope.doctorCellNo
        };

        if($scope.method === "Edit")
            doctorData._id = $scope.Id;

        var newDoctor = new mvDoctors(doctorData);
        if ($scope.method !== "Edit") {
            newDoctor.$save().then(function () {
                mvNotifier.successNotify(texts.SuccessAction, "");
                $("#AddDoctor").modal('hide');
                $scope.refresh();
            }, function (response) {
                mvNotifier.errorNotify(texts.ErrorAction, response.data.reason);
            })
        } else {
            newDoctor.$update().then(function () {
                mvNotifier.successNotify(texts.SuccessAction, "");
                $("#AddDoctor").modal('hide');
                $scope.refresh();
            }, function (response) {
                mvNotifier.errorNotify(texts.ErrorAction, response.data.reason);
            })
        }
    };
});