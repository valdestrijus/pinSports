(function () {
    'use strict';

    window.deferredBootstrapper.bootstrap({
        element: window.document,
        module: 'app',
        resolve: {
            TRANSLATIONS: function ($http) {
                // Available options: mockups only
                var target = 'config';
                return $http.get(target + '/translations.json');
            },
            SETTINGS: function ($http) {
                // Available options: mockups only
                var target = 'config';
                return $http.get(target + '/settings.json');
            }
        },
        onError: function () {
            window.location = 'error.html';
        }
    });

})();