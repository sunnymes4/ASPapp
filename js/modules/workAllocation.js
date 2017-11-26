
var workAllocation = angular.module('workAllocation', [])

    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider
        .state('index.workAllocation', {
            'url': '/Work_Allocation',
            'templateUrl': 'views/workAllocation/workAllocation.html',
            'controller': 'workAllocationCtrl',
            'activetab': "Inventory"
            //resolve: {
            //    loadModule: function ($ocLazyLoad) {
            //        return $ocLazyLoad.load([
            //            {
            //                name: 'workAllocation',
            //                files: [
            //                    'controllers/workAllocationCtrl.js',
            //                    'services/workAllocationService.js'
            //                ]
            //            }
            //        ]);
            //    }
            //}
        })
    }])

//.directive("usersMultiselect", function () {
//    return {
//        restrict: "E",
//        scope: {
//            selectedUsers: "=",
//            listedUsers:"="
//        },
//        template: 
//                "<div class='btn-group' data-ng-class='{open:open}' style='width:200px'>" +
//                    "<button class='btn btn-small' style='width:160px'>----Select-----</button>" +
//                    "<button class='btn btn-small dropdown-toggle'  data-ng-click='openDropdown()' style='width:40px'><span class='caret'></span></button>" +
                    
//                    "<ul class='dropdown-menu' aria-labelledby='dropdownMenu' style='position:relative;'>" +
                        
//                        "<li style='cursor:pointer' data-ng-repeat='user in listedUsers'><a data-ng-click='toggleSelectedItem(user)'><span data-ng-class='getClassName(user)' aria-hidden='true'></span>{{user.name}}</a></li>" +
//                    "</ul>" +
                    
//                "</div>",

//        controller: function ($scope) {

//            $scope.selectedUsers = [];

//            $scope.openDropdown = function () {

//                $scope.open = !$scope.open;

//            };

//            $scope.toggleSelectedItem = function (user) {
//                var userIndex = -1;

//                angular.forEach($scope.selectedUsers, function (value, key) {

//                    console.log("key" + key);
//                    console.log("value" + value.id)
//                    console.log("user.id" + user.id)
//                    if (value.id === user.id) {
//                        userIndex = key;
//                    }
//                })

//                if (userIndex >= 0) {
//                    $scope.selectedUsers.splice(userIndex,1)
//                }
//                else {
//                    $scope.selectedUsers.push(user);
//                }
//            }

//            $scope.getClassName = function (users) {

//                var className = 'glyphicon glyphicon-remove-circle';

//                angular.forEach($scope.selectedUsers, function (item, index) {
//                    if (users.id == item.id) {
//                        className = 'glyphicon glyphicon-ok-circle'
//                    }
//                });

//                return className;
//            }
//            $scope.allUsers = [{
//                "id": 1,
//                "name": "Sujith"
//            }, {
//                "id": 2,
//                "name": "Velu"
//            }, {
//                "id": 3,
//                "name": "Bhupinders"
//            }, {
//                "id": 4,
//                "name": "Dhaniya"
//            }, {
//                "id": 5,
//                "name": "Khaleel"
//            }];

//        }
        
//        }
//})