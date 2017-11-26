

var myApp = angular.module('myApp',
    [
        'ui.router',
        '720kb.datepicker',
        'ui.grid',
        'ui.grid.cellNav',
        'ui.grid.edit',
        'ui.grid.resizeColumns',
         'ui.grid.expandable', 'ui.grid.selection', 'ui.grid.pinning',
        'ui.grid.moveColumns',
        'ui.grid.exporter',
        'ui.grid.grouping',
        'ui.grid.pagination',
        'ui.bootstrap.modal',
        'ui.bootstrap',
        'ngMessages',
        'angular-loading-bar',
        'jcs-autoValidate',
        'oc.lazyLoad',
        'API_CONFIG_CONSTANT',
        'inboxAnalyst',
        'agentAnalyst',
        'workAllocation',
        'user',
       // 'filters',
        'common',
        "kickoutRule",
        "allocationRule"
    ]);


myApp.run(
        ['$rootScope', '$state', '$stateParams', '$templateCache', 'bootstrap3ElementModifier',
            function ($rootScope, $state, $stateParams, $templateCache, bootstrap3ElementModifier) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                bootstrap3ElementModifier.enableValidationStateIcons(true);
                //$rootScope.$on('$viewContentLoaded', function () {
                //    $templateCache.removeAll();
                //});
            }     
        ]     
    )

//myApp.run([
//        'bootstrap3ElementModifier',
//        function (bootstrap3ElementModifier) {
//            bootstrap3ElementModifier.enableValidationStateIcons(true);
//        }]);

//myApp.run([
//       'validator',
//       'foundation5ElementModifier',
//       function (validator, foundation5ElementModifier) {
//           validator.setDefaultElementModifier(foundation5ElementModifier.key);
//       }]);

myApp.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    //cfpLoadingBarProvider.includeBar = false;
    //cfpLoadingBarProvider.includeSpinner = false;
    //cfpLoadingBarProvider.latencyThreshold = 5000;
    //cfpLoadingBar.set(0.3);
    cfpLoadingBarProvider.spinnerTemplate = '<div id="divLoading">' +
                                                '<p id="loader">' +
                                                    'Loading please wait... <img src="images/loading_logo.gif"/>' +
                                                '</p>' +
                                            '</div>';
}])

myApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $http) {



    $stateProvider.state('index', {
        'templateUrl': 'views/common/content.html'
    }).state('index.home', {
        'url': '/home',
        'templateUrl': 'views/home.html'
    }).state('index.user', {
        'url': '/user',
        'templateUrl': 'views/masters/user.html'
    })
    .state('login', {
        'url': '/login',
        'templateUrl': 'views/Login.html'
    })

    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/home')
}]);

myApp.directive('modalDialog', function () {
    return {
        restrict: 'E',
        scope: {
            show: '='
        },
        
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
        link: function (scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function () {
                scope.show = false;
            };
        },
        template: ''
    };
});


myApp.controller('loginController', ['$scope','$state', function ($scope, $state) {
    //$scope.go = function () {
    //    $state.go(index.inventory);
    //}
}])

//myApp.controller('inboxController', ['$http', 'ImportDetailsFactory', '$scope', function ($http, ImportDetailsFactory, $scope) {
    
//    $scope.ImportData = {};

//    $scope.$on('greetingsChanged', function (event, args) {
//        $scope.ImportData = args.changedGreeting;
//    })


//    var importData = function () {
//        ImportDetailsFactory.importDetails().then(function (res) {

//            $scope.ImportData = JSON.parse(res.data);
//            //console.log($scope.ImportData);
//        })
//    }
//    importData();

//    $scope.users = [
//            { name: "Madhav Sai", age: 10, location: 'Nagpur' },
//            { name: "Suresh Dasari", age: 30, location: 'Chennai' },
//            { name: "Rohini Alavala", age: 29, location: 'Chennai' },
//            { name: "Praveen Kumar", age: 25, location: 'Bangalore' },
//            { name: "Sateesh Chandra", age: 27, location: 'Vizag' }
//        ];


//}])

myApp.controller('filtersController', ['$http', 'inboxAnalystService', '$scope', 'ClientColumnFactory', function ($http, inboxAnalystService, $scope, ClientColumnFactory) {
    $scope.listItems = {};
    $scope.greetings = {};

    $scope.onGreetingsChange = function (id) {

        console.log(id);
        $scope.$emit('greetingsChanged', {
            changedGreeting: id   
        })
        console.log(changedGreeting);
    }

    var abc = function () {
        inboxAnalystService.abc().then(function (res) {

            $scope.greetings = JSON.parse(res.data);
            console.log($scope.greetings);
        })
    }

    $scope.myFunc = function (id) {

        $scope.listItems = id;
        console.log($scope.listItems);
    };

    function getSelectedRows() {
        alert("d");
        selectedRowsData = rowSelected.concat(rowSelected);
        console.log(rowSelected);
    }


    abc();


    //$scope.listItems = {};
    $scope.clients = {};
    var clientColumns = function () {
        ClientColumnFactory.clienColumns().then(function (res) {

            console.log('Inside - app.js');
            $scope.clients = res.data;
           
            //console.log($scope.clients);
        })
    }
    clientColumns();

   

}])

myApp.controller('sideMenuController', ['$scope', function ($scope) {
    $scope.arrow = "fa-arrow-left";
    $scope.show = false;
    $scope.showmenu = function() {
        $scope.show = $scope.show ? false : true;
        if ($scope.show == true) {
            $scope.arrow = "fa-arrow-right";
            angular.element('.showSideBarBtn').removeClass("alpha");
            angular.element('.productivity-spmenu').addClass("animate");
        } else {
            $scope.arrow = "fa-arrow-left";
            angular.element('.showSideBarBtn').addClass("alpha");
            angular.element('.productivity-spmenu').removeClass("animate");
        }

        $('#productivity-spmenu-s1').addClass('animated zoomIn');
    }

    $scope.$on('EventFromSideMenuController', function (data) {

        $scope.hideAlias = data.hideAlias;

    });

}])

myApp.controller('topBarScrollController', ['$http', 'inboxAnalystService', '$scope', '$window', '$state', '$rootScope', function ($http, inboxAnalystService, $scope, $window, $state, $rootScope) {

    $scope.signIn = "Login";
    $scope.signOut = "Logout";
    $scope.signInIcon = "fa-sign-in";
    $scope.signOutIcon = "fa-sign-out";
    $scope.userName = true;
    $scope.locations = true;

    // for hidding top bar on scroll down

    var scroll = $(document).scrollTop();
    var headerHeight = $('.navbar-fixed-top').outerHeight();
   
    $(window).scroll(function () {
        var scrolled = $(document).scrollTop();
        if (scrolled > headerHeight) {
            $('.navbar-fixed-top').addClass('off-canvas');
            $('.toTopBtn').css('display', 'block');
            $('.container.mar-t-50').css('margin-top', '70px');

        } else {
            $('.navbar-fixed-top').removeClass('off-canvas');
            $('.toTopBtn').css('display', 'none');
        }

    });

    $('.toTopBtn').click(function () {
        $window.scrollTo(0, 0);
    })

    // for hidding menu bar in home page
    $scope.setActive = function (menuItem) {
        $scope.activeMenu = menuItem
    }


    
    var controllerState = 'index.home';
    $scope.showBackground = true;

    $rootScope.$on('$stateChangeSuccess', onStateChange);

    init();

    function init() {
        onStateChange();
        
    }

    function onStateChange() {
        $scope.showBackground = $state.is(controllerState);
       
    }


}])

myApp.controller('mastersUserController', ['$scope', function ($scope) {

    $scope.format = 'MM/dd/yyyy';
    $scope.altInputFormats = ['MM!/dd!/yyyy!'];

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.datePopup = function () {
        $scope.dateIsOpen.opened = true;
    };

    $scope.dateIsOpen = {
        opened: false
    };

    
}])

//myApp.service('inboxFactory', function ($http, $q, API_CONFIG) {

//    this.abc = function () {
//        var defer = $q.defer();
//        $http({
//            method: 'GET',
//            url: API_CONFIG().baseUrl + 'ImportFileDetails'
                
//        })
//            .then(function (data) {
//                defer.resolve(data);
//            })
//            .catch(function (err) {
//                console.log(err);
//                defer.reject(err);
//            });
//        return defer.promise;
//    }
//})

myApp.service('ClientColumnFactory', function ($http, $q, API_CONFIG) {

    this.clienColumns = function () {

        var Indata = {
            CHMapID: 1
        };

        var defer = $q.defer();
        $http({
            method: 'POST',
            url: API_CONFIG().baseUrl + 'WorkAllocation/InventoryFields',
            headers: {
                'Content-Type': 'application/json'
            },
            data: Indata
        })
            .then(function (data) {
                console.log(data.data);
                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }
})

myApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

myApp.directive("modalBox", function () {
    return {
        restrict: 'EA',
        scope: {
            title: "=modalTitle",
            header: "=modalHeader",
            body: "=modalBody",
            footer: "=modalFooter",
            action: "&callAction",
            callBackClose: "&",
            modalID: "=id",
            name: '=modalName'
        },
        templateUrl: "views/common/partialModal.html",
        transclude: true,
        controller: function ($scope) {
            $scope.modalID = 'pop';


        }
    }
});
myApp.directive('setFocus', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('click', function () {
              document.querySelector('#' + attrs.setFocus).focus();
            })
        }
    }
})
myApp.directive('dropdownMultiselect', function ($document) {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '=',
            action: '&',
            selectAll: '&',
            deselectAll:'&'
        },
        template:
                "<div class='btn-group' data-ng-class='{open: open}' style='width:100%'>" +
                    "<button class='btn btn-small dropdown-toggle' style='width:100%' data-ng-click='openDropdown()'><p style='text-overflow:ellipsis; white-space: nowrap;overflow: hidden; width:80%; float:left'><i ng-show='!deselectAll'>---Select Users--- </i><i ng-repeat='selectedmodel in model'>{{selectedmodel.name}},</i></p><span class='caret pull-right' style='margin-top:5px;'></span></button>" +
                    "<ul class='dropdown-menu' aria-labelledby='dropdownMenu' style='width:100%'>" +
                    "<li><a data-ng-click='selectAll()'><span class='glyphicon glyphicon-ok green' aria-hidden='true'></span> Check All</a></li>" +
                    "<li><a data-ng-click='deselectAll();'><span class='glyphicon glyphicon-remove red' aria-hidden='true'></span> Uncheck All</a></li>" +
                    "<li class='divider'></li>" +
                    "<li data-ng-repeat='option in options' ng-click='action()'><a data-ng-click='toggleSelectItem(option)'><span data-ng-class='getClassName(option)' aria-hidden='true'></span> {{option.name}}</a></li>" +
                    "</ul>" +
                    "</div>",

        link: function(scope, element, attr){
    
            scope.open = false;

            scope.toggleSelect = function(){
                scope.isPopupVisible = !scope.isPopupVisible;
            }

            $document.bind('click', function(event){
                var isClickedElementChildOfPopup = element
                  .find(event.target)
                  .length > 0;
          
                if (isClickedElementChildOfPopup)
                    return;
          
                scope.open = false;
                scope.$apply();
            });
        },
        
        controller: function ($scope, $document) {
        $scope.openDropdown = function () {
            console.log($scope.open)
            $scope.open = !$scope.open;
        };

        


        $scope.selectAll = function () {
            $scope.model = [];
            angular.forEach($scope.options, function (item, index) {
                $scope.model.push(item);
            });
        };

        $scope.deselectAll = function () {
            $scope.model = [];
        };

        $scope.toggleSelectItem = function (option) {
            var intIndex = -1;
            angular.forEach($scope.model, function (item, index) {
                if (item.name == option.name) {
                    intIndex = index;
                }
            });

            if (intIndex >= 0) {
                $scope.model.splice(intIndex, 1);
            }
            else {
                $scope.model.push(option);
            }
        };

        $scope.getClassName = function (option) {
            var varClassName = 'glyphicon glyphicon-remove red';
            angular.forEach($scope.model, function (item, index) {
                if (item.name == option.name) {
                    varClassName = 'glyphicon glyphicon-ok green';
                }
            });
            return (varClassName);
        };

    }
}
});

//myApp.service('ImportDetailsFactory', function ($http, $q, API_CONFIG) {

//    this.importDetails = function () {
//        var defer = $q.defer();
//        $http({
//            method: 'GET',
//            url: API_CONFIG().baseUrl + 'Inbox?ImportFileID=1334',

//        })
//            .then(function (data) {
//                defer.resolve(data);
//            })
//            .catch(function (err) {
//                console.log(err);
//                defer.reject(err);
//            });
//        return defer.promise;
//    }
//})


