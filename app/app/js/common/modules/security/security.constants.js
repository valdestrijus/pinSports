(function () {
    'use strict';

    /**
     * @name constant
     * @description Auth module permissions constant
     */
    angular
        .module('security')
        .constant('PERMISSIONS', {
            mensView: 'vyrams_view',
            womensView: 'moterims_view',
            universalView: 'unversalus_sportas_view'
        });
})();