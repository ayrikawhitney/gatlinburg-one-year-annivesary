(function(angular) {
    'use strict';

    angular.module('thanks-obama.dropdown', [
        'utils'
    ])

    .directive('dropdown', ['$timeout', function ($timeout) {
        return {
            scope: {
                options: '='
            },
            templateUrl: 'components/dropdown/dropdown.html',
            restrict: 'E',
            controller: 'dropdown',
            link: function($scope, $element, $attr) {
                $scope.$on('repeatFinish', function() {
                    if (window.Tracker) {
                        // track any elements with track attribute
                        Tracker.track($element[0]);
                    }
                });
            }
        };
    }])

    .controller('dropdown', ['$scope', function($scope) {

        var self = this;

        $scope.option_click = function(option) {
            option.checked = !option.checked;
            $scope.$emit('option-click', option)
        };

    }]);

})(window.angular);
