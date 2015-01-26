(function () {
    'use strict';

    /**
     * @name HomeCtrl
     * @description Responsible for user dashboard display
     */
        // @ngInject
    function HomeCtrl(HomeService) {
        var vm = this;

        vm.data = HomeService.data;

        console.log(vm.data);
    }

    angular
        .module('home')
        .controller('HomeCtrl', HomeCtrl);

})();