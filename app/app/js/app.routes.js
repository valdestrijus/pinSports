(function () {
    'use strict';

    // @ngInject
    function setupRoutes(ACCESS_LEVELS, $routeProvider) {

        $routeProvider
            .when('/home', {
                templateUrl: 'modules/home/_index.html',
                controller: 'HomeCtrl',
                controllerAs: 'home',
                accessLevel: ACCESS_LEVELS.pub,
                resolve: {
                    data: /*@ngInject*/ function (HomeService) {
                        return HomeService.getPosts();
                    }
                }
            })
            .when('/dashboard', {
                templateUrl: 'modules/dashboard/_index.html',
                controller: 'DashboardCtrl',
                controllerAs: 'dashboard',
                accessLevel: ACCESS_LEVELS.user
            })
            .otherwise({ redirectTo: '/home' });
    }


    angular
        .module('app')
        .config(setupRoutes);

})();