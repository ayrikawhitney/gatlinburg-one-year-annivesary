(function (angular) {
    'use strict';

    angular.module('thanks-obama', [
        'thanks-obama.viz'
    ])

    .config(['$locationProvider', function($locationProvider) {
        // overwrites a analytics/teallium error on scroll
        window.s_PPVevent = function(e) {}
    }])

    .filter('assetPath', function() {
        return function(input) {
            var isDev = window.location.href.indexOf('localhost') > 0;

            if (isDev) {
                return input;
            } else {
                return 'https://www.gannett-cdn.com/experiments/usatoday/2017/weinstein-timeline/' + input;
            }
        }
    });

    

})(window.angular);
