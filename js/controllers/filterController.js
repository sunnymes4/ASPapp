
var filterCtrl = angular.module('filters', []);

filterCtrl.controller('filterCtrl', ['$scope', 'workAllocationService', '$rootScope', function ($scope, workAllocationService, $rootScope) {
    $scope.getImportFileList = {};
    $scope.getImportFileList = {};
    $scope.getAccounts = {};
    $scope.multiplefilter = [];
    $scope.showModal = false;
    $scope.selectedUsers = [];
    $scope.AssignAccounts = [];
    $scope.gridoptions = {};
    $scope.columns = [];
    $scope.categorie = {};
    $scope.accountStatus = {};
    $scope.agent_assign_queue = 0;
    $scope.agent_unassign_queue = 0;
    $scope.qca_unassign_queue = 0;
    $scope.clients = {};
    $scope.getcolumns = {};
    $scope.VarcharFields = [];
    $scope.InputCount = '';
    $scope.InputCount1 = '';

    var importFileList = function () {
        $scope.loading = true;
        workAllocationService.importFileList().then(function (res) {
            $scope.getImportFileList = res.data;
            //toastr.success('File Details loaded Successfully');
            $scope.loading = false;
        }, function () {
            toastr.error('Details are not found');
        })
    }
    importFileList();



   // $rootScope.$emit("CallParentMethod", {});
    var clientColumns = function () {
        workAllocationService.clienColumns().then(function (res) {
            $scope.clients = res.data;

            angular.forEach($scope.clients, function (value, key) {
                if (value.DataType == 'STRING') {
                    $scope.VarcharFields.push(value);
                }
            });

            //toastr.success('practice columns loaded Successfully');
        }, function () {
            toastr.error('Details are not found');
        })

    }
    clientColumns();

    $scope.$on('someEvent', function (e) {
       return e.targetScope;

    });

    //$scope.$on('parent', function (event, data) {
    //    //var data = data;
    //    $scope.myFunc = data;

    //});

    $scope.ConditionAll = [
    {
        id: '1',
        name: '= (Equal to)'
    }, {
        id: '2',
        name: '> (Greater than)'
    }, {
        id: '3',
        name: '< (Less than)'
    }, {
        id: '4',
        name: '>= (Greater than or equal to)'
    }, {
        id: '5',
        name: '<= (Less than or equal to)'
    }];

    $scope.item = {};
    $scope.myCondition = function () {
        var datatypevalue = '';
       // Valuesdynamic($scope.clients.PracticeColumnName);
        angular.forEach($scope.clients, function (value, key) {

            if (value.PracticeColumnName == $scope.clients.PracticeColumnName) {
                return datatypevalue = value.DataType;
            }
        });

        switch (datatypevalue) {
            case 'STRING':
                var objCondition = $.grep($scope.ConditionAll, function (element, entry) {
                    return (element.id === '1');
                });

                $scope.Condition = objCondition;
                break;
            case 'DATE':
                $scope.Condition = $scope.ConditionAll;
                break;
            case 'DECIMAL':
                $scope.Condition = $scope.ConditionAll;
                break;
            default:

        }

    };

    

    //-- Binding AgingSummery values -- //
    $scope.AgingDetails = [];
    $scope.AgingSummery = function () {
        var agingcount = 0;
        delete $scope.AgingDetails;
        $scope.AgingDetails = [];
        workAllocationService.AgingSummery($scope.getImportFileList.ImportFileID, $scope.activeMenu).then(function (res) {
            $scope.AgingDetails.push({ 'TenureID': 0, 'TenureCode': 'ALL', 'TenureName': 'ALL', 'AgingCount': agingcount, 'Billed_Amount': 0 });
            for (var i = 0; i < res.data.length; i++) {
                $scope.AgingDetails.push(res.data[i]);
                agingcount = agingcount + res.data[i].AgingCount
            }
            angular.forEach($scope.AgingDetails, function (item, key) {
                if (item.TenureCode == 'ALL') {
                    item.AgingCount = agingcount;
                }
            });

            $scope.selectedRow = "ALL";
            //toastr.success('Aging Details loaded Successfully');
        }, function () {
            toastr.error('Details are not found');
        })
    };

    //-- Binding PayerSummery values --//
    $scope.PayerDetails = [];
    $scope.PayerSummery = function (Ternurecode) {
        $scope.selectedRow = '';
        $scope.selectedRow = Ternurecode;

        delete $scope.VarcharFields;
        $scope.VarcharFields = [];

        angular.forEach($scope.clients, function (value, key) {
            if (value.DataType == 'STRING') {
                $scope.VarcharFields.push(value);
            }
        });

        delete $scope.PayerDetails;
        $scope.PayerDetails = [];
    };

    //--AccountChangeStatus --//

    

}])