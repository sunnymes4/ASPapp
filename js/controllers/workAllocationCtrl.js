workAllocation.controller('workAllocationCtrl', ['$http', '$scope', '$state', 'workAllocationService', 'ClientColumnFactory', 'commonService', '$document', '$filter', '$sce', function ($http, $scope, $state, workAllocationService, ClientColumnFactory, commonService, $document, $filter, $sce) {

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
  

    //--start show model popup --//

    $scope.open = function () {
        $scope.showModal = true;
    };
    $scope.cancel = function () {
        $scope.showModal = false;
    };

    //--end show model popup --//
   
    // --- start Import file list data --- //

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

    // --- end Import file list data --- //


    // --- start Import file list data --- //

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
  

    // -- Binding values based on imported file -- //

    $scope.myFunc = function () {

        //-- Start -- validation for file -- //

        var retunvalue = ValidationFile();
        if (retunvalue == false)
        {
            return false;
        }

        // -- end -- validation for file --//

      

        //-- Start -- Taking  payer Details-- //
        var PayerDetailsselected = ''
        var payeroutput = '';
        var incondition = '';
        if ($scope.PayerDetails.length > 0) {
            angular.forEach($scope.PayerDetails, function (Payer) {
                if (!!Payer.selected) {
                    payeroutput += "'" + Payer.InventoryField + "'" + ',';
                }
            })
            if (payeroutput != '')
                PayerDetailsselected = $scope.findInventorycolumnname($scope.VarcharFields.PracticeColumnName) + ' IN (' + payeroutput.substring(0, payeroutput.length - 1) + ' )';
           
        }
        //-- END -- Taking  payer Details-- //

        //-- Start -- Taking  Custom search table value-- //
        var CustomSearchfilter = '';
        var output = '';
        if ($scope.multiplefilter.length > 0) {

            angular.forEach($scope.multiplefilter, function (item) {

                switch (item.condition) {
                    case '= (Equal to)':
                        output += $scope.findInventorycolumnname(item.field) + ' = ';
                        output += "'" + item.value + "'" + ' AND ';
                        break;
                    case '> (Greater than)':
                        output += $scope.findInventorycolumnname(item.field) + ' > ';
                        output += "'" + item.value + "'" + ' AND ';
                        break;
                    case '< (Less than)':
                        output += $scope.findInventorycolumnname(item.field) + ' < ';
                        output += "'" + item.value + "'" + ' AND ';
                        break;
                    case '>= (Greater than or equal to)':
                        output += $scope.findInventorycolumnname(item.field) + ' >= ';
                        output += "'" + item.value + "'" + ' AND ';
                        break;
                    case '<= (Less than or equal to)':
                        output += $scope.findInventorycolumnname(item.field) + ' <= ';
                        output += "'" + item.value + "'" + ' AND ';
                        break;
                    default:
                }
            });
            if (output != '')
                CustomSearchfilter = output.substring(0, output.length - 4);
        }
        //-- END -- Taking  Custom search table value-- //

        workAllocationService.getAccounts($scope.getImportFileList.ImportFileID, CustomSearchfilter, PayerDetailsselected, $scope.selectedRow, $scope.activeMenu, $scope.accountStatus.AccountStatusCode, AgentUnassighnUserID).then(function (res) {

            $scope.Valuesforselec = [];
            $scope.gridoptions = {};
           // $scope.columns = [];
           // $scope.getcolumns = {};
            $scope.getAccounts = {};
            angular.forEach(res.data, function (value, key) {
                if (key == 'Accounts') {
                    //  if (res.data.QueuesCount.length > 0 && res.data.QueuesCount.length == 3) {
                    $scope.getAccounts = value;

                    $scope.getcolumns = value[0];

                    if ($scope.activeMenu == 'Agent Unassign Que') {
                        $scope.GetUnallocatedUsers();
                    }


                    angular.forEach($scope.getcolumns, function (key1, value1) {

                        if (value1 == 'InventoryID' || value1 == 'UserID') {
                           // $scope.columns.push({ name: value1, enableSorting: false, showColumnMenu: false, visible: false });
                        }
                        else {

                            if ($scope.findInventorydataType(value1) == 'DATE') {

                                $scope.columns.push({ name: value1, enableFiltering: true, enableSorting: true, cellFilter: 'date:\'MM/dd/yyyy\'' });
                            }
                            else {
                                $scope.columns.push({ name: value1, enableFiltering: true, enableSorting: true });
                            }
                        }
                    })

                    $scope.gridoptions.data = value;
                    $scope.columns = [];

                } else if (key == 'QueuesCount') {

                    angular.forEach(value, function (value, key) {


                        if (value.QueueCode == 'FRS' ) {
                            $scope.agent_assign_queue = value.NoOfAccounts;

                        }
                        else if (value.QueueCode == 'AAQ') {
                            $scope.agent_unassign_queue = value.NoOfAccounts;
                        }
                        else if (value.QueueCode == 'QUQ') {
                            $scope.qca_unassign_queue = value.NoOfAccounts;
                        }

                    });
                    $scope.Menu();
                }

            });
            
        })

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



    $scope.PayerDetails = [];
    $scope.myDynamicField = function (Ternurecode) {
        
        workAllocationService.PayerSummery($scope.getImportFileList.ImportFileID, $scope.selectedRow, $scope.findInventorycolumnname($scope.VarcharFields.PracticeColumnName), $scope.activeMenu).then(function (res) {
            angular.forEach(res.data, function (item, value) {
                $scope.PayerDetails.push(item);
            })
        })
        $scope.PayerDetails = [];
    };



    $scope.changeAccountStatus = function () {
        $scope.myFunc();
    };

    //--Setting count in input box--//

    $scope.SelectRows = function (value) {
        if ($scope.gridoptions.data.length >= value) {

        if ($scope.activeMenu != 'Agent Unassign Que') {
            
                angular.forEach(rowSelected, function (item, index) {
                    item.AgentName = '';
                    item.UserID = '';
                })

        }

        
            $scope.selectedUsers = [];
            $scope.gridApi.selection.clearSelectedRows();

            for (var i = 0; i < value; i++) {
                $scope.gridApi.selection.toggleRowSelection($scope.gridoptions.data[i]);
            }
          
            //  $scope.onUserChange;

        }
        else {
            toastr.error('Entered count more then inventory count');
        }

        value = '';
        $scope.InputCount = '';
        $scope.InputCount1 = '';
    }


    //-- Taking Inventory Column based practice column--//
    $scope.findInventorycolumnname = function (practiceColumnName) {
        var inventorycol = '';
        angular.forEach($scope.clients, function (item) {
            if (item.PracticeColumnName == practiceColumnName) {
                inventorycol += item.InventoryColumnName;
            }
        });
        return inventorycol;
    };

    //-- Taking datatype based practice column--//
    $scope.findInventorydataType = function (practiceColumnName) {
        var inventorydataType = '';
        angular.forEach($scope.clients, function (item) {
            if (item.PracticeColumnName == practiceColumnName) {
                inventorydataType += item.DataType;
            }
        });
        return inventorydataType;
    };




    //--Ui Grid Settings for to display data--//
    var rowSelected = [];
    var selectedRowsData = [];
    $scope.gridoptions = {
        minRowsToShow: 5,
        enableGridMenu: true,
        enableSorting: true,
        paginationPageSizes: [10,50, 100, 150, 200, 500],
        paginationPageSize: 10,
        enablePaginationControls: true,
        multiSelect: true,
        enableFullRowSelection: false,
        enableSelectAll: true,
        enableHorizontalScrollbar: 1,
        enableVerticalScrollbar: 1,
        enableCellEditOnFocus: true,
        columnDefs: $scope.columns,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;

            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                rowSelected = $scope.gridApi.selection.getSelectedRows();
            });

            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                rowSelected = $scope.gridApi.selection.getSelectedRows();
            });
        }
    };

    //-- Binding condition list box in custom search--//
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
        Valuesdynamic($scope.clients.PracticeColumnName);

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
    //-- Binding values based on field--//
    var Valuesdynamic = function (id) {
        $scope.Valuesforselec = {};
        $scope.inventoryIDs = {};
        if ($scope.findInventorycolumnname(id) == 'Claim_No' || $scope.findInventorycolumnname(id) == 'Patient_Account') {
            $scope.inventoryIDs = _.uniq(_.pluck(_.flatten($scope.getAccounts), 'InventoryID'));
            workAllocationService.GetValuesByPracticeField($scope.findInventorycolumnname(id), $scope.inventoryIDs).then(function (res) {
               
                $scope.Valuesforselec = _.pluck(res.data, 'InventoryField');
            })
        }
        else {
            $scope.Valuesforselec = _.uniq(_.pluck(_.flatten($scope.getAccounts), id));
        }
        //$scope.inventoryIDs = _.uniq(_.pluck(_.flatten($scope.getAccounts), 'InventoryID'));
        //workAllocationService.GetValuesByPracticeField($scope.findInventorycolumnname(id), $scope.inventoryIDs).then(function (res) {
        //    $scope.Valuesforselec = res.data;
        //})
        //$scope.Valuesforselec = $.map($scope.getAccounts, function (o) { return o[id]; })
        

       //$.grep($scope.getAccounts, function (element, entry) {
       //    $scope.Valuesforselec.push(element[id]);
       //});
    }

    //$scope.Valuesdynamic = function (id) {
        
    //    return _.pluck($scope.getAccounts, id);
    //};

    //console.log($scope.Valuesdynamic);
    //-- validation for Add/Search Button for custom search--//
    function validationcheck() {

        $scope.ValidationClass_filefield = '';
        $scope.ValidationClassmsg_filefield = '';
        $scope.ValidationClass_field = '';
        $scope.ValidationClassmsg_field = '';
        $scope.ValidationClass_Condition = '';
        $scope.ValidationClassmsg_Condition = '';
        $scope.ValidationClass_Value = '';
        $scope.ValidationClassmsg_Value = '';


        var isInvalid = true;

        if ($scope.getImportFileList.ImportFileID == 'ng-invalid') {

            $scope.ValidationClass_filefield = 'has-error';
            $scope.ValidationClassmsg_filefield = 'Please select the File name';
            isInvalid = false;
        } else {
            $scope.ValidationClass_filefield = 'has-success';
        }

        if ($scope.clients.PracticeColumnName == undefined || $scope.clients.PracticeColumnName == null) {

            $scope.ValidationClass_field = 'has-error';
            $scope.ValidationClassmsg_field = 'Please select the field';
            isInvalid = false;
        }
        if ($scope.Condition == undefined || $scope.Condition.name == 0 || $scope.Condition.name == null) {

            $scope.ValidationClass_Condition = 'has-error';
            $scope.ValidationClassmsg_Condition = 'Please select the condition';
            isInvalid = false;
        }
        if ($scope.Valuesforselec == undefined || $scope.Valuesforselec.valuebind == undefined) {

            $scope.ValidationClass_Value = 'has-error';
            $scope.ValidationClassmsg_Value = 'Please select the value';
            isInvalid = false;
        }



        return isInvalid;
    };

    //-- Adding row in table in custom search--//
    $scope.AddRow = function () {
        isInvalid = true;
        if ($scope.getImportFileList.ImportFileID == undefined) {

            $scope.ValidationClass_filefield = 'has-error';
            $scope.ValidationClassmsg_filefield = 'Please select the File name';
            isInvalid = false;
        } else {
            $scope.ValidationClass_filefield = 'has-success';
            $scope.ValidationClassmsg_filefield = '';
        }

        //if (validationcheck()) {
            $scope.multiplefilter.push({ 'field': $scope.clients.PracticeColumnName, 'fieldtablecolumn': $scope.clients.InventoryColumnName, 'condition': $scope.Condition.name, 'value': $scope.Valuesforselec.valuebind });

        //}


    };

    //--removing rows's from table in custom search--//
    $scope.removeAll = function () {

        delete $scope.multiplefilter;
        $scope.multiplefilter = [];
    };
    //--removing rows from table in custom search--//
    $scope.removeRow = function (name) {
        debugger
        var index = -1;
        var comArr = eval($scope.multiplefilter);
        for (var i = 0; i < comArr.length; i++) {

            if (comArr[i].field === name) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            toastr.error('Something gone wrong');
        }
        $scope.multiplefilter.splice(index, 1);
    };

    //--menu allocation list--//
    $scope.Menu = function () {
        $scope.menuItems = [
           { item: 'Agent Assign Que', records: $scope.agent_assign_queue, icon: "fa-flag-checkered bg-warning" },
           { item: 'Agent Unassign Que', records: $scope.agent_unassign_queue, icon: "fa-futbol-o bg-success" },
           { item: 'QCA Unassign Que', records: $scope.qca_unassign_queue, icon: "fa-share-square-o bg-danger" }
        ];
    }
    $scope.Menu();
    $scope.activeMenu = $scope.menuItems[0].item;

    //--click ebevnt for menu option--//
    $scope.setActive = function (menuItem) {

        $scope.activeMenu = menuItem
        $scope.InputCount = '';
        $scope.InputCount1 = '';
        delete $scope.AgingDetails;
        $scope.AgingDetails = [];

      
        $scope.AgingSummery();
        $scope.selectedRow = '';

        delete $scope.VarcharFields;
        $scope.VarcharFields = [];

        //angular.forEach($scope.clients, function (value, key) {
        //    if (value.DataType == 'STRING') {
        //        $scope.VarcharFields.push(value);
        //    }
        //});

        delete $scope.PayerDetails;
        $scope.PayerDetails = [];

        $scope.ClearCustomSearch();
        $scope.multiplefilter = [];
       
        
        $scope.UnallocatedUsers = [];
        AgentUnassighnUserID = 0;
        rowSelected = [];
        $scope.selectedUsers = [];
        $scope.myFunc();

       
       // PayerSummery('ALL');
    }



    $scope.ClearCustomSearch = function () {
       // angular.element(document.querySelector("div.has-success")).removeClass("has-success");
        //$document.find(".has-success").removeClass('has-success');
        delete $scope.clients;
        $scope.clients = [];

        delete $scope.Condition;
        $scope.Condition = [];

        delete $scope.Valuesforselec;
        $scope.Valuesforselec = [];
        clientColumns();
    }

    //-- Master Configuration API call   --//

    var masterConfigDetails = function () {
        commonService.ConfigurationDetails().then(function (res) {

            angular.forEach(res.data, function (value, key) {

                if (key == "Category") {
                    $scope.categories = value;
                }
                else if (key == "AccountStatus") {
                    $scope.accountStatus = value;
                }
            })

            $scope.accountStatus.AccountStatusCode = "FRS";

            //toastr.success('Status details loaded Successfully');
        }, function () {
            toastr.error('Details are not found');
        })
    }

    masterConfigDetails();



  function ValidationFile () {

        if ($scope.getImportFileList.ImportFileID == undefined) {
            toastr.error('Please Select File to proceed!');
            return false;
        }
    }

    //Taking User details based on CHMapID

    $scope.allUsers = {};
    $scope.GetUsersByCHMapId = function () {
        workAllocationService.GetUsersByCHMapId().then(function (res) {
            $scope.allUsers = res.data;
        })
    };
    $scope.GetUsersByCHMapId();


    $scope.UnallocatedUsers = [];
    $scope.GetUnallocatedUsers = function () {
        angular.forEach($scope.getAccounts, function (item, index) {
            var exists = false;
            angular.forEach($scope.UnallocatedUsers, function (val2, index) {
                if (angular.equals(item.UserID, val2.UserId))
                {
                    exists = true
                };
            })
            if (exists == false && item.UserID != "")
            {
                $scope.UnallocatedUsers.push({ 'name': item.AgentName, 'UserId': item.UserID });
               // newArr.push(value);
            }
            
        })
    };
    $scope.GetUsersByCHMapId();



    //$scope.allUsers = [{
    //    UserId: 2,
    //    name: "SujithkuR",
    //    target: "10"
    //}, {
    //    UserId: 1,
    //    name: "VelmurugB",
    //    target: "20"
    //}, {
    //    UserId: 3,
    //    name: "Bhupinders",
    //    target: "30"
    //}, {
    //    UserId: 4,
    //    name: "Dhaniya",
    //    target: "30"
    //}, {
    //    UserId: 3,
    //    name: "KhaleelS",
    //    target: "50"
    //},
    // {
    //     UserId: 5,
    //     name: "Sureshk8",
    //     target: "60"
    // }];

   var AgentUnassighnUserID = 0;
    //-- Agent Unassighn user selection--//
   $scope.changeuserName = function () {

       AgentUnassighnUserID = $scope.UnallocatedUsers.UserId == null ? 0 : $scope.UnallocatedUsers.UserId;
       $scope.myFunc();
   }


   $scope.Showmodel = function () {

       $('#multiplevalue').modal('show');
      
   }


    // --Agent assign que function for assigning selected accounts to multiple users.--//

    var selectedUsers =[];
    $scope.AssignUsers =[];
    var users = { };
    var user1 =[];
    var accounts =[];
    var userAccounts =[];
    $scope.getSelectedRows = function (status) {

        if ($scope.selectedUsers.length <= 0) {
            toastr.error('Please select atleast one user to proceed!');
           // rowSelected = [];
            return false;
        }

        if (rowSelected.length <= 0) {
            toastr.error('Please select atleast one inventory to proceed!');
            $scope.selectedUsers = [];
            return false;
        }

        if ($scope.selectedUsers.length > rowSelected.length) {

            toastr.error('Selected users reached more then inventories count!');
          
            return false;
        }

        if (rowSelected.length > 0) {
            var returnvalue = true;
            angular.forEach(rowSelected, function (item, index) {
                if(item.AgentName == " ")
                {
                    returnvalue = false;
                  toastr.error('Some of the selected inventories user name not assighned!');
              }
            })

            if (returnvalue == false) {
                return returnvalue;
            }
           
       }
       
          //  selectedUsers.push($scope.selectedUsers);

            delete $scope.AssignAccounts;
            $scope.AssignAccounts = [];

            var k = 0;
            for (var i = 0; i < $scope.selectedUsers.length; i++) {
                users = {
                    'UserID': $scope.selectedUsers[i].UserId,
                    'UserName': $scope.selectedUsers[i].name,
                    'Target': $scope.selectedUsers[i].target,
                };
                angular.forEach(rowSelected, function (item, index) {

                    if ($scope.selectedUsers[i].name == item.AgentName) {
                        k += 1;
                    }
                })
                userAccounts = {
                    'users': users, 'accounts': k
                };
                $scope.AssignAccounts.push(userAccounts);

                k = 0;
            }

            if (status == 'ReAssign') {
                $('#Idconfirm').hide();
                $('#Idreconfirm').show();
            }
            else {

                $('#Idreconfirm').hide();
                $('#Idconfirm').show();
            }
            $scope.showModal = true;
            k = 0;

            //  $scope.onUserChange(); 
    }

    //--AssignInventory for selected users--//
            $scope.selectedUsersToAssign =[];
            var Takingusers = { };
            $scope.confirmAssign = function () {
            

            workAllocationService.AssignInventory(rowSelected).then(function (res) {

                

                angular.forEach(rowSelected, function (data, index) {
                    $scope.gridoptions.data.splice($scope.gridoptions.data.lastIndexOf(data), 1);
            });
                toastr.success('Records successfully allocated.');

                angular.forEach(res.data, function (value, key) {
                    if (value.QueueCode == 'FRS') {
                        $scope.agent_assign_queue = value.NoOfAccounts;
                    }
                    else if (value.QueueCode == 'AAQ') {
                        $scope.agent_unassign_queue = value.NoOfAccounts;
                    }
                    else if (value.QueueCode == 'QUQ') {
                        $scope.qca_unassign_queue = value.NoOfAccounts;
                    }
                });
                $scope.Menu();
                rowSelected = [];
                $scope.selectedUsers = [];

            }, function () {
                toastr.error('Details are not found');
            })

            $scope.showModal = false;

            };

    //-- ReAssignInventory for selected users--//
            $scope.confirmReAssign = function () {
                
                workAllocationService.ReAssignInventory(rowSelected).then(function (res) {

                    $scope.gridApi.selection.clearSelectedRows();
                    toastr.success('Records successfully re allocated.');

                    angular.forEach(res.data, function (value, key) {
                        if (value.QueueCode == 'FRS') {
                            $scope.agent_assign_queue = value.NoOfAccounts;
                        }
                        else if (value.QueueCode == 'AAQ') {
                            $scope.agent_unassign_queue = value.NoOfAccounts;
                        }
                        else if (value.QueueCode == 'QUQ') {
                            $scope.qca_unassign_queue = value.NoOfAccounts;
                        }
                    });
                    $scope.Menu();

                    rowSelected = [];
                    $scope.selectedUsers = [];


                }, function () {
                    toastr.error('Details are not found');
                })

              
                $scope.showModal = false;

            };

    //-- UnassignAccount for selected users--//
            $scope.UnassignAccount = function () {

                if (rowSelected.length <= 0) {
                    toastr.error('Please select atleast one inventory to proceed!');
                    $scope.selectedUsers = [];
                    return false;
                }

                workAllocationService.UnAssignInventory(rowSelected).then(function (res) {

                    angular.forEach(rowSelected, function (data, index) {
                        $scope.gridoptions.data.splice($scope.gridoptions.data.lastIndexOf(data), 1);
                    });
                    toastr.success('Records successfully Unassignd.');
                    angular.forEach(res.data, function (value, key) {
                        if (value.QueueCode == 'FRS') {
                            $scope.agent_assign_queue = value.NoOfAccounts;
                        }
                        else if (value.QueueCode == 'AAQ') {
                            $scope.agent_unassign_queue = value.NoOfAccounts;
                        }
                        else if (value.QueueCode == 'QUQ') {
                            $scope.qca_unassign_queue = value.NoOfAccounts;
                        }
                    });
                    $scope.Menu();
                    rowSelected = [];
                    $scope.selectedUsers = [];
                    AgentUnassighnUserID = 0;
                   
                }, function () {
                    toastr.error('Details are not found');
                })

                $scope.showModal = false;

            }

    //--Assighning  mutiple users fro multiple inventory--//
            $scope.onUserChange = {
                selectUsers: function () {

                    if (rowSelected.length <= 0)
                    {
                        toastr.error('Please select atleast one inventory to proceed!');
                        $scope.selectedUsers = [];
                        return false;
                    }

                    if ($scope.selectedUsers.length <= 0)
                    {
                        toastr.error('Please select atleast one user to proceed!');
                       // rowSelected = [];
                        return false;
                    }

                    if ($scope.selectedUsers.length > rowSelected.length) {

                        toastr.error('Selected users reached more then inventories count!');
                        //$scope.selectedUsers = [];
                       // rowSelected = [];
                       // $scope.gridApi.selection.clearSelectedRows();

                        return false;
                    }

                    $scope.userAccountCount = []
                    var currentUserCount = 0;
                    var userIndex = -1;

                    angular.forEach(rowSelected, function (item, index) {

                       // var resultSet = _.find($scope.userAccountCount, function (list) { return list.userID == $scope.selectedUsers[currentUserCount].UserId == null ? 0 : $scope.selectedUsers[currentUserCount].UserId; });
                       // console.log(resultSet);

                        angular.forEach($scope.userAccountCount, function (user, tempIndex) {

                            if(user.userID == $scope.selectedUsers[currentUserCount].UserId)
                            {
                                userIndex = tempIndex;
                            }
                        });

                        if (userIndex >= 0)
                        {
                            $scope.userAccountCount[userIndex].accountCount = $scope.userAccountCount[userIndex].accountCount + 1;
                        }
                        else
                        {
                            $scope.userAccountCount.push({ 'userID': $scope.selectedUsers[currentUserCount].UserId, 'agentName': $scope.selectedUsers[currentUserCount].name, 'accountCount': 1 });
                        }
                        

                        if ( ($scope.selectedUsers.length - 1) == currentUserCount)
                        {
                            currentUserCount = 0;
                        }
                        else
                        {
                            currentUserCount = currentUserCount + 1;
                        }
                        
                    });

                    var accountAllotedIndex = 0;
                    angular.forEach($scope.userAccountCount, function (allotedUser, allotedUserIndex) {

                        for(var i = 0 ; i < $scope.userAccountCount[allotedUserIndex].accountCount ; i++ )
                        {
                            rowSelected[accountAllotedIndex].AgentName = $scope.userAccountCount[allotedUserIndex].agentName;
                            rowSelected[accountAllotedIndex].UserID = $scope.userAccountCount[allotedUserIndex].userID;

                            accountAllotedIndex = accountAllotedIndex + 1;
                        }

                        
                    });

                }
            }

    //-- end Assighning  mutiple users fro multiple inventory--//
}])