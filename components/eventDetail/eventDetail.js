(function (angular) {
    'use strict';

    angular.module('thanks-obama.eventDetail', [
        'utils'
    ])

    .directive('eventDetail', [function () {
        return {
            scope: {
                event: '='
            },
            templateUrl: 'components/eventDetail/eventDetail.html',
            restrict: 'E',
            controller: 'eventDetail',
            link: function ($scope, $element, $attr) {
                console.log('link', $scope);
                var el = $element[0];
                if (window.SharingTwitter) {
                    window.SharingTwitter.watch(el);
                }
                if (window.SharingFacebook) {
                    window.SharingFacebook.watch(el);
                }
                if (window.SharingEmail) {
                    window.SharingEmail.watch(el);
                }
                if (window.Tracker) {
                    window.Tracker.track(el);
                }
            }
        };
    }])

    // see https://docs.angularjs.org/api/ng/filter/date for date formatting
    .controller('eventDetail', ['$scope', function ($scope) {
        var _this = this;

        $scope.close_click = function() {
            document.querySelector('body').classList.remove('noscroll');
            $scope.event = null;
        };

        $scope.set_sentiment = function(sentiment) {
            $scope.event.sentiment = sentiment;
            if (sentiment == 'positive') {
                $scope.event.share_text = 'Thanks Obama 👍: ' + $scope.event.headline;
            } else if (sentiment == 'negative') {
                $scope.event.share_text = 'Thanks Obama 👎: ' + $scope.event.headline;
            }
        }


    }]);

})(window.angular);
