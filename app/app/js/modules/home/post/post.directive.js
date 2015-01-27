(function () {
    'use strict';

    function postWidthAdjustment() {
        return {
            restrict: 'A',
            priority: 1000,
            link: function (scope, element, attr) {
                element.width(attr.postWidthAdjustment);
            }
        };
    }

    angular
        .module('post')
        .directive('postWidthAdjustment', postWidthAdjustment);
})();