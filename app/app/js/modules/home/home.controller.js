(function () {
    'use strict';

    /**
     * @name HomeCtrl
     * @description Responsible for user dashboard display
     */
        // @ngInject
    function HomeCtrl(HomeService, ngDialog) {
        var vm = this;

        vm.data = HomeService.data;

        vm.openPost = function (item) {
            ngDialog.open({
                template: 'modules/home/post/_index.html',
                className: 'ngdialog-theme-default',
                controller: 'PostCtrl',
                data: item
            });
        };
    }

    angular
        .module('home')
        .controller('HomeCtrl', HomeCtrl);

})();