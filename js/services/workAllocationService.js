workAllocation.service('workAllocationService', function ($http, $q, API_CONFIG) {
    var sCHMapID = 11
    this.importFileList = function () {

        var Indata = {
            CHMapID: sCHMapID
        };

        var defer = $q.defer();
        $http({
            method: 'POST',
            url: API_CONFIG().baseUrl + 'WorkAllocation/ImportFileList',
            headers: {
                'Content-Type': 'application/json'
            },
            data: Indata
        })
            .then(function (data) {
                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }

    this.GetUsersByCHMapId = function () {

        var Indata = {
            CHMapID: sCHMapID
        };

        var defer = $q.defer();
        $http({
            method: 'POST',
            url: API_CONFIG().baseUrl + 'WorkAllocation/GetUsersByCHMapId',
            headers: {
                'Content-Type': 'application/json'
            },
            data: Indata
        })
            .then(function (data) {
                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }

    

    this.getAccounts = function (id, Customfilter, Payerfilter, sTenureCode, SelectedMenu, sAccountStatusCode, sAgentUnassighnUserID) {

        var Indata = {
            ImportFileID: id,
            Filterdata: Customfilter,
            PayerDetails: Payerfilter,
            TenureCode: sTenureCode,
            QueName: SelectedMenu,
            AccountStatusCode: sAccountStatusCode,
            AgentunassignUserID: sAgentUnassighnUserID

        };
        ignoreLoadingBar: true;

        var defer = $q.defer();
        $http({
            method: 'POST',
            url: API_CONFIG().baseUrl + 'WorkAllocation/AccountDetails',
            headers: {
                'Content-Type': 'application/json'
            },
            data: Indata

        })
            .then(function (data) {
                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }


    this.AssignInventory = function (rowselected) {

        var Indata = {
            InventoryData: rowselected,
           
        };

        ignoreLoadingBar: true;

        var defer = $q.defer();
        $http({
            method: 'POST',
            url: API_CONFIG().baseUrl + 'WorkAllocation/AssignInventory',
            headers: {
                'Content-Type': 'application/json'
            },
            data:  JSON.stringify(Indata.InventoryData)

        })
            .then(function (data) {
                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }

    this.ReAssignInventory = function (rowselected) {

        var Indata = {
            InventoryData: rowselected,

        };

        ignoreLoadingBar: true;

        var defer = $q.defer();
        $http({
            method: 'POST',
            url: API_CONFIG().baseUrl + 'WorkAllocation/ReAssignInventory',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(Indata.InventoryData)

        })
            .then(function (data) {
                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }

    

    this.UnAssignInventory = function (rowselected) {

        var Indata = {
            InventoryData: rowselected
          
        };
        ignoreLoadingBar: true;

        var defer = $q.defer();
        $http({
            method: 'POST',
            url: API_CONFIG().baseUrl + 'WorkAllocation/UnAssignInventory',
            headers: {
                'Content-Type': 'application/json'
            },
            data:  JSON.stringify(Indata.InventoryData)

        })
            .then(function (data) {
                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }

  

    this.clienColumns = function () {

       
        var Indata = {
            CHMapID: sCHMapID
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

               
                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }



    this.AgingSummery = function (id,activeMenu) {

        
        var Indata = {
            ImportFileID: id,
            Status: activeMenu
        };

        var defer = $q.defer();
        $http({
            method: 'POST',
            url: API_CONFIG().baseUrl + 'WorkAllocation/AgingSummery',
            headers: {
                'Content-Type': 'application/json'
            },
            data: Indata

        })
            .then(function (data) {

               
                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }


    this.PayerSummery = function (id, TernarCode, dynamicField, activeMenu) {


        var Indata = {
            ImportFileID: id,
            TenureCode: TernarCode,
            InventoryField: dynamicField,
            Status: activeMenu
        };

        var defer = $q.defer();
        $http({
            method: 'POST',
            url: API_CONFIG().baseUrl + 'WorkAllocation/PayerSummery',
            headers: {
                'Content-Type': 'application/json'
            },
            data: Indata

        })
            .then(function (data) {

               
                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }

    this.GetValuesByPracticeField = function (sInventoryField, inventoryIDs) {


        var Indata = {
            InventoryId: inventoryIDs,
            InventoryField: sInventoryField
        };

        var defer = $q.defer();
        $http({
            method: 'POST',
            url: API_CONFIG().baseUrl + 'WorkAllocation/GetValuesByPracticeField',
            headers: {
                'Content-Type': 'application/json'
            },
            data: Indata

        })
            .then(function (data) {


                defer.resolve(data);
            })
            .catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
        return defer.promise;
    }

});