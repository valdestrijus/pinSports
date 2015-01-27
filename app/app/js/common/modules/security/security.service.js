(function () {
    'use strict';

    /**
     * @name Security
     * @description Security service.
     * Responsible for authentication, authorization handling.
     * @param {Object} $http
     * @param {Object} $q
     * @param {Object} Session service
     * @param {Object} EventService service
     * @param {Object} SETTINGS - app settings/constants
     * @return {Object} public API
     */
    // @ngInject
    function Security($http, $q, Session, EventService, SETTINGS) {

        /**
         * Public API.
         */
        var service = {};

        /**
         * @name getCurrentUser
         * @description Returns currently authenticated user.
         * @return {Object} authenticated user
         */
        service.getCurrentUser = function () {
            return Session.user;
        };

        /**
         * @name isAuthenticated
         * @description Checks if user is authenticated.
         * @return {boolean} true if user is authenticated, otherwise false
         */
        service.isAuthenticated = function () {
            return !!service.getCurrentUser();
        };

        /**
         * @name isAuthorized
         * @description Checks if user is authenticated and has specified permission.
         * @param {string} permission to check
         * @return {boolean} true if user is authorized, otherwise false
         */
        service.isAuthorized = function (permission) {
            return (service.isAuthenticated() && service.getCurrentUser().permissions.indexOf(permission) !== -1);
        };

        /**
         * @name login
         * @description Logs user in.
         * Passes authentication credentials to back-end, creates user Session on success, notifies on success or error.
         * @param {Object} credentials
         * @return {Promise}
         */
        service.login = function (credentials) {
            return $http.post(SETTINGS.api.login, credentials)
                .then(function (response) {
                    Session.create(response);
                    EventService.resolve(EventService.events.loginSuccess);
                }, function () {
                    EventService.resolve(EventService.events.loginFailed);
                });
        };

        /**
         * @name logout
         * @description Logs user out.
         * Destroys current session, notifies on success.
         * @return {Promise}
         */
        service.logout = function () {
            return $http.get(SETTINGS.api.logout)
                .then(function () {
                    Session.destroy();
                });
        };

        /**
         * @name requestCurrentUser
         * @description Requests current user from $http if browser was reloaded,
         * recreates Session object, otherwise retrieves user from Session.
         * @return {Promise}
         */
        service.requestCurrentUser = function () {
            if (service.isAuthenticated()) {
                return $q.when(service.getCurrentUser());
            } else {
                return $http.get(SETTINGS.api.current_user)
                    .then(function (response) {
                        Session.create(response);
                        return service.getCurrentUser();
                    }
                );
            }
        };

        /**
         * @name requireAuthorizedUser
         * @description Requests current user from $http if browser was reloaded,
         * checks if user has specified permission. Is used to resolve routes.
         * @param {string} permission to check
         * @return {Promise}
         */
        service.requireAuthorizedUser = function (permission) {
            return service.requestCurrentUser()
                .then(function() {
                    var deferred = $q.defer();
                    if (!!permission && !service.isAuthorized(permission)) {
                        EventService.resolve(EventService.events.notAuthorized);
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                });
        };

        return service;
    }

    angular
        .module('security')
        .factory('Security', Security);
})();