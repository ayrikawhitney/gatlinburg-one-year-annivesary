(function (angular) {
    'use strict';

    angular.module('timeline', [
        'utils'
    ])

    .directive('timeline', [function () {
        return {
            scope: {
                ascending: '@',
                descending: '@'
            },
            templateUrl: 'components/timeline/timeline.html',
            restrict: 'E',
            controller: 'timeline',
            link: function ($scope, $element, $attr) {}
        };
    }])

    // see https://docs.angularjs.org/api/ng/filter/date for date formatting
    .controller('timeline', ['$scope', '$timeline', function ($scope, $timeline) {
        var _this = this;

        this.set_events = function() {
            // sorts events based on desired order
            $timeline.sort_events($scope.descending !== undefined);
            $scope.events = $timeline.get_events();
        };

        $scope.$on('events-change', function(e, events) {
            _this.set_events();
        });

        _this.set_events();

        $scope.button_click = function(button, event) {
            button.event = event;
            $scope.$emit('timeline-btn-click', button);
        };

    }])

    .service('$timeline', ['$rootScope', function ($rootScope) {

        this.events = [];

        this.render = function() {
            console.log(this.events);
            $rootScope.$broadcast('events-change', this.events);
        };

        this.add_event = function(event) {
            if (event) {
                this.events.push(event);
                this.sort_events();
                this.render();
            }
        };

        this.add_events = function(events) {
            if (events && events.length > 0) {
                this.events = this.events.concat(events);
                this.sort_events();
                this.render();
            }
        };

        this.remove_event = function(date) {
            var events = [];
            for (var i=0; i<this.events.length; i+=1) {
                var event = this.events[i];
                if (event.date.getTime() !== date.getTime()) {
                    events.push(event);
                }
            }
            this.events = events;
            this.render();
        };

        this.remove_events = function(dates) {
            var time_dates = [],
                events = [];
            // get array of timed dates
            for (var i=0; i<dates.length; i+=1) {
                time_dates.push(dates[i].getTime());
            }
            for (var j=0; j<this.events.length; j+=1) {
                var event = this.events[j];
                // date is not in timed dates
                if (time_dates.indexOf(event.date.getTime()) === -1) {
                    events.push(event);
                }
            }
            this.events = events;
            this.render();
        };

        this.get_events = function() {
            return this.events;
        };

        this.sort_events = function(use_descending) {
            // ascending 1/1/2000 will sort ahead of 1/1/2001
            var ascending = function(a,b) {
                    if (a.date.getTime() < b.date.getTime())
                        return -1;
                    if (a.date.getTime() > b.date.getTime())
                        return 1;
                    return 0;
                },
                // descending 1/1/2001 will sort ahead of 1/1/2000
                descending = function(a,b) {
                    if (a.date.getTime() > b.date.getTime())
                        return -1;
                    if (a.date.getTime() < b.date.getTime())
                        return 1;
                    return 0;
                },
                sorter = use_descending ? descending : ascending;
            this.events.sort(sorter);
        }

    }]);

})(window.angular);