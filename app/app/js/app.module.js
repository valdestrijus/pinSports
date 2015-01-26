// ************************************
// when we not use $scope
// we can use 'this'

// var vm = this;
// vm.someSortOfProperty = 'property name';

// in html we can then access this element in a Controller As way

// <div ng-controller="AppCtrl as app">
//   <p> {{ app.omeSortOfProperty }} </p>
//      <div ng-controller="OtherContorller as other">
//          <p> {{ other.omeSortOfProperty }} </p>
//      </div>
// </div>

// ************************************
(function () {
    'use strict';

    angular.module('app', [
        /*
         * Angular modules
         */
        'ngRoute',
        'ngSanitize',
        /*
         * Reusable cross app code modules
         */
        'home',
        'dashboard',
        'templates',
        /*
         * 3rd Party modules
         */
        'pascalprecht.translate'
    ]);
})();