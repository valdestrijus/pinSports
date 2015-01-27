(function () {
    'use strict';

    /**
     * @name Session
     * @description Session service.
     * Responsible for user control, setups additional info, parameters required for session.
     * @returns {Object} service
     */
    // @ngInject
    function Session($http, $interval, EventService, SETTINGS) {

        /**
         * Public API.
         */
        var service = {};
        var shortTimeout = null;
        var longTimeout = null;

        /**
         * @name create
         * @description Creates session.
         * @param {Object} response with user data
         */
        service.create = function (response) {
            service.user = response.data.user;
            service.setCsrfToken();
            service.setTimeouts(response);
            EventService.resolve(EventService.events.sessionCreated);
        };

        /**
         * @name destroy
         * @description Destroys current session.
         */
        service.destroy = function () {
            service.setCsrfToken();
            service.user = shortTimeout = longTimeout = null;
            EventService.resolve(EventService.events.sessionDestroyed);
        };

        /**
         * @name setCsrfToken
         * @description Stores CSRF token retrieved from back-end into HTTP header.
         */
        service.setCsrfToken = function () {
            $http.defaults.headers.common['X-CSRF-Token'] = (service.user && service.user.csrf_token) ?
                service.user.csrf_token : null;
        };

        /**
         * @name setTimeouts
         * @description Handles http response and sets timeouts
         * @param {Object}
         */
        service.setTimeouts = function (response) {
            // skip cached requests, because session wasn't renewed
            if (response.config.cached) {
                return;
            }

            if (service.user) {
                service.setShortTimeout(response.config.url);
                service.setLongTimeout();
            }
        };

        /**
         * @name setLongTimeout
         * @description Sets long timeout to cancel session
         */
        service.setLongTimeout = function () {
            if (longTimeout !== null || !service.user.long_session_timeout) {
                return;
            }

            longTimeout = $interval(function () {
                service.destroy();
            }, service.user.long_session_timeout, 1);
        };

        /**
         * @name setShortTimeout
         * @description Sets short timeout to cancel session
         * @param {String} Request url address
         */
        service.setShortTimeout = function (url) {
            if (service.user.remember_me || (url === SETTINGS.api.ideas_updated) || !service.user.short_session_timeout) {
                return;
            }

            if (shortTimeout !== null) {
                $interval.cancel(shortTimeout);
            }

            shortTimeout = $interval(function () {
                service.destroy();
            }, service.user.short_session_timeout, 1);
        };

        return service;
    }

    angular
        .module('security')
        .factory('Session', Session);
})();