(function () {
    'use strict';

    /**
     * @name HomeService
     * @description Home service for getting the initial posts
     */
    //@ngInject
    function HomeService($http, SETTINGS) {

        /**
         * Public API.
         */
        var service = {};

        service.data = null;

        service.getPosts = function () {
            return $http.get(SETTINGS.api.posts)
                .then(function (response) {
                    service.data = response.data;
                    return service.data;
                });
        };

        return service;
    }

    angular
        .module('home')
        .factory('HomeService', HomeService);

})();