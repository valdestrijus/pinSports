(function () {
    'use strict';

    /**
     * @name EventService
     * @description Handles app events, sets notification, controls app flow on global events.
     * @param {Object} $location
     * @param {Object} SETTINGS
     * @returns {Object} public API
     */
    // @ngInject
    function EventService($injector, $location, SETTINGS) {
        var service = {};

        service.events = {
            sessionCreated: {
                message: 'event.session_created',
                resolve: [
                    { service: 'LoginService', action: 'removeMessage' }
                ]
            },
            sessionDestroyed: {
                message: 'event.session_destroyed',
                resolve: [
                    { service: 'ModalService', action: 'dismiss' },
                    { redirect: SETTINGS.app.auth_login }
                ]
            },
            loginSuccess: {
                message: 'event.login_success',
                resolve: [
                    { redirect: SETTINGS.app.auth_redirect }
                ]
            },
            loginFailed: {
                message: 'event.invalid_credentials',
                resolve: [
                    { service: 'LoginService', action: 'setMessage' }
                ]
            },
            notAuthenticated: {
                message: 'event.not_authenticated',
                resolve: [
                    { service: 'ModalService', action: 'dismiss' },
                    { service: 'LoginService', action: 'setMessage' },
                    { redirect: SETTINGS.app.auth_login }
                ]
            },
            notAuthorized: {
                message: 'event.not_authorized',
                resolve: [
                    { service: 'ModalService', action: 'dismiss' },
                    { service: 'LoginService', action: 'setMessage' },
                    { redirect: SETTINGS.app.auth_login }
                ]
            },
            notFound: {
                message: 'event.not_found',
                resolve: [
                    { service: 'NotificationService', action: 'setError' }
                ]
            },
            internalServerError: {
                message: 'event.internal_server_error',
                resolve: [
                    { service: 'NotificationService', action: 'setError' }
                ]
            },
            badGateway: {
                message: 'event.bad_gateway',
                resolve: [
                    { service: 'NotificationService', action: 'setError' }
                ]
            },
            requestTimeout: {
                message: 'event.request_timeout',
                resolve: [
                    { redirect: '/' },
                    { service: 'NotificationService', action: 'setError' }
                ]
            }
        };

        /**
         * @name resolve
         * @description Resolves event into message and action
         * @param {Object} Event
         */
        service.resolve = function (event) {
            if (typeof event !== 'object' || !event.resolve) {
                return;
            }

            angular.forEach(event.resolve, function (resolver) {
                if (resolver.redirect) {
                    redirect(resolver.redirect);
                }

                if (resolver.service && resolver.action) {
                    $injector.get(resolver.service)[resolver.action](event.message);
                }
            });
        };

        return service;

        /**
         * @name redirect
         * @description Redirects to given url if current location is different from it.
         * @param {string} url to redirect to
         */
        function redirect(url) {
            if ($location.path() !== url) {
                $location.path(url);
            }
        }
    }

    angular
        .module('event')
        .factory('EventService', EventService);
})();