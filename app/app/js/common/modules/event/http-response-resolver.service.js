(function () {
    'use strict';

    // @ngInject
    function HttpResponseResolver($q, EventService) {
        var service = {};

        service.handle = function (response) {
            EventService.resolve(getEvent(response.status));

            return $q.reject(response);
        };

        return service;

        /**
         * @name getEvent
         * @description Returns mapped event
         * @param {Object} Status code
         * @returns {Object} Mapped event reason
         */
        function getEvent(code) {
            return {
                401: EventService.events.notAuthenticated,
                403: EventService.events.notAuthorized,
                404: EventService.events.notFound,
                500: EventService.events.internalServerError,
                502: EventService.events.badGateway,
                504: EventService.events.requestTimeout
            }[code];
        }
    }

    angular
        .module('event')
        .factory('HttpResponseResolver', HttpResponseResolver);
})();