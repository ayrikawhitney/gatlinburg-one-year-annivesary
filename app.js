(function (angular) {
    'use strict';

    angular.module('thanks-obama', [
        'thanks-obama.viz'
    ])

    .config(['$locationProvider', function($locationProvider) {
        // overwrites a analytics/teallium error on scroll
        window.s_PPVevent = function(e) {}
    }]);

    

})(window.angular);
