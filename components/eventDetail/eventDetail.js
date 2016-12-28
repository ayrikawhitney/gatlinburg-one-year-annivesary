(function (angular) {
    'use strict';

    angular.module('thanks-obama.eventDetail', [
        'utils',
        'social-buttons'
    ])

    .directive('eventDetail', [function () {
        return {
            scope: {
                event: '='
            },
            templateUrl: 'components/eventDetail/eventDetail.html',
            restrict: 'E',
            controller: 'eventDetail',
            link: function ($scope, $element, $attr) {}
        };
    }])

    // see https://docs.angularjs.org/api/ng/filter/date for date formatting
    .controller('eventDetail', ['$scope', function ($scope) {
        var _this = this;

        $scope.close_click = function() {
            $scope.event = null;
        };

        $scope.set_sentiment = function(sentiment) {
            $scope.event.sentiment = sentiment;
        }


    }]);

})(window.angular);
