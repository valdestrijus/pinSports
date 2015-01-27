(function () {
    'use strict';

    /**
     * @name PostCtrl
     * @description Responsible for user dashboard display
     */
    //@ngInject
    function PostCtrl($scope, PostService) {
        $scope.item = $scope.ngDialogData;

        $scope.next = function (id) {
            PostService.next(id);
        };

        $scope.prev = function (id) {
            PostService.prev(id);
        };
    }

    angular
        .module('post')
        .controller('PostCtrl', PostCtrl);

})();