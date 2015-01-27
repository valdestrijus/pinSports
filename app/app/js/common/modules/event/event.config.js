(function () {
    'use strict';

    /**
     * @name config
     * @description Auth module configuration.
     * Adds HTTP response interceptor.
     * @param {Object} $httpProvider
     * @return {Promise}
     */
    // @ngInject
    function config($httpProvider) {
        /*@ngInject*/
        $httpProvider.interceptors.push(function ($injector, HttpResponseResolver) {
            return {
                response: function (response) {
                    $injector.get('Session').setTimeouts(response);
                    return response;
                },
                responseError: function (rejection) {
                    $injector.get('Session').setTimeouts(rejection);
                    return HttpResponseResolver.handle(rejection);
                }
            };
        });
    }

    angular
        .module('event')
        .config(config);
})();