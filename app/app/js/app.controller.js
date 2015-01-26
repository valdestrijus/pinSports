(function () {
    'use strict';

    // @ngInject
    function AppCtrl($location, SETTINGS) {
        var vm = this;

        $location.path(SETTINGS.app.url.home);
    }


    angular
        .module('app')
        .controller('AppCtrl', AppCtrl);

})();