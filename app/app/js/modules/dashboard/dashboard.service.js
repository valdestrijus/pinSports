(function () {
    'use strict';

    /**
     * @name DashboardService
     * @description Dashboard service responsible
     * for the user data visualization
     */
    //@ngInject
    function DashboardService () {

        /**
         * Public API.
         */
        var service = {};

        service.data = null;
        service.data2 = {
            series: ['<em>500</em> Keyboards', '<em>105</em> Laptops', '<em>100</em> TVs'],
            data : [{
                x : 'Sales',
                y: [100, 503, 0],
                tooltip:'this is tooltip'
            },
                {
                    x : 'Income',
                    y: [300, 100, 100]
                },
                {
                    x : 'Expense',
                    y: [351, 50, 25]
                }]
        };
        service.chartType = 'bar';
        service.config2 = {
            labels: false,
            title : 'HTML-enabled legend',
            legend : {
                display:true,
                htmlEnabled: true,
                position:'right'
            },
            lineLegend: 'traditional'
        };

        return service;
    }

    angular
        .module('dashboard')
        .factory('DashboardService', DashboardService);

})();