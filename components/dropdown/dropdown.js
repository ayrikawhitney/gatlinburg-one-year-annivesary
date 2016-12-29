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
        console.log($scope);

        $scope.option_click = function(option) {
            console.log(option);
            option.checked = !option.checked;
            $scope.$emit('option-click', option)
        };

    }])

    .directive('scrollToBottom', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                $timeout(function () {
                    $element[0].addEventListener('scroll', function () {
                        if (this.scrollTop + this.clientHeight === this.scrollHeight) {
                            $scope[$attrs.scrollToBottom] = true;
                            $scope.$apply();
                        }
                        else {
                            $scope[$attrs.scrollToBottom] = false;
                            $scope.$apply();
                        }
                    });
                }, 100);
            }
        };
    }]);

})(window.angular);
