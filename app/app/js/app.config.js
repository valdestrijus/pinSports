(function () {
    'use strict';

    /**
     * @name config
     * @description Holds application HTTP configs
     * @param {object} $httpProvider http settings srevice
     * @param {object} $translateProvider applciation translation settings service
     * @param {object} $locationProvider applciation location settings service
     * @param {object} SETTINGS applciation settings which comes from API before application initializes
     * @param {object} TRANSLATIONS application translation tags returned from API before application initializes
     */
        // @ngInject
    function config($httpProvider, $locationProvider, $translateProvider, SETTINGS, TRANSLATIONS) {
        // html5 links
            $locationProvider.html5Mode(true).hashPrefix('!');
        // default route
        //$routeProvider.otherwise({redirectTo: APP.url.login});
        //translations3
        angular.forEach(SETTINGS.app.langs.available, function (key) {
            $translateProvider.translations(key, TRANSLATIONS[key]);
        });
        $translateProvider.usePostCompiling(true).preferredLanguage(SETTINGS.app.langs.default);

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '',
                objPropLength = Object.keys(obj).length,
                name, value, fullSubName, subName, subValue, innerObj, i;

            for (var o = 0; o < objPropLength; ++o) {
                name = Object.keys(obj)[o];
                value = obj[Object.keys(obj)[o]];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value instanceof Object) {
                    var valueObjLength = Object.keys(value).length;
                    for (var v = 0; v < valueObjLength; ++v) {
                        subName = Object.keys(value)[v];
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    }


    angular
        .module('app')
        .config(config);

})();