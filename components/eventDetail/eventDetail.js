(function (angular) {
    'use strict';

    angular.module('weinstein-timeline.eventDetail', [
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
                var el = $element[0];
                if (window.SharingTwitter) {
                    window.SharingTwitter.watch(el);
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
    .controller('eventDetail', ['$scope', '$element', '$timeout', function ($scope, $element, $timeout) {
        var _this = this;

        $scope.close_click = function() {
            document.querySelector('body').classList.remove('noscroll');
            $scope.event = null;
        };

        // user clicks on white background
        $scope.off_click = function(e) {
            if (e.target.classList.contains('event-detail-wrap') ||
                e.target.classList.contains('event-detail-content-container') ||
                e.target.classList.contains('event-detail-content-container')) {
                $scope.close_click();
            }
        };

        $scope.set_sentiment = function(sentiment) {
            $scope.event.sentiment = sentiment;
            if (sentiment == 'positive') {
                $scope.event.share_text = 'Thanks Obama: ' + $scope.event.headline;
                $scope.event.share_text_twitter = 'Thanks Obama 👍 : ' + $scope.event.headline;
            } else if (sentiment == 'negative') {
                $scope.event.share_text = 'Thanks Obama: ' + $scope.event.headline;
                $scope.event.share_text_twitter = 'Thanks Obama 👎 : ' + $scope.event.headline;
            }
            $timeout(function() {
                if (window.SharingFacebook) {
                    window.SharingFacebook.watch($element[0]);
                }
            });
        }


    }]);

})(window.angular);
