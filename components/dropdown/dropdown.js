(function(angular) {
    'use strict';

    angular.module('thanks-obama.dropdown', [
        'utils'
    ])

    .directive('dropdown', function () {
        return {
            scope: {
                options: '='
            },
            templateUrl: 'components/dropdown/dropdown.html',
            restrict: 'E',
            controller: 'dropdown'
        };
    })

    .controller('dropdown', ['$scope', function($scope) {

        var self = this;

        $scope.option_click = function(option) {
            console.log($scope.options);
            console.log(option);
            option.checked = !option.checked;
            $scope.$emit('option-click', option)
        };

    }]);

})(window.angular);
