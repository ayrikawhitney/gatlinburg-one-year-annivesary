(function (angular) {
    'use strict';

    angular.module('thanks-obama.modal', [
        'utils'
    ])

    .directive('modal', [function () {
        return {
            scope: {
                open: '=?'
            },
            transclude: true,
            templateUrl: 'components/modal/modal.html',
            restrict: 'E',
            controller: 'modal',
            link: function ($scope, $element, $attr) {}
        };
    }])

    // see https://docs.angularjs.org/api/ng/filter/date for date formatting
    .controller('modal', ['$scope', function ($scope) {
        var _this = this;

    }]);

})(window.angular);