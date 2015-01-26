(function () {
    'use strict';

    /**
     * @name DahsboardCtrl
     * @description Responsible for user dashboard display
     * @param {object} DashboardService Provides dashboard view with
     * data required for the current user
     */
    // @ngInject
    function DahsboardCtrl(DashboardService) {
        var vm = this;

        vm.data = DashboardService.data;
    }

    angular
        .module('dashboard')
        .controller('DahsboardCtrl', DahsboardCtrl);

})();