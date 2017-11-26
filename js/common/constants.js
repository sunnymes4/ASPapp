
/* Setting base domain of the API Services */

angular.module('API_CONFIG_CONSTANT',[]).constant('API_CONFIG', function () {

    // This will work on deployment server
   // var baseUrl = 'http://10.1.2.85/AspireAPI/Api/';
    var baseUrl = 'http://localhost:55956/api/';
    // This will work on local instance
    //var baseUrl = 'http://10.8.34.35/AspireAPI/api/';

    return {
        baseUrl: baseUrl,
    }
})