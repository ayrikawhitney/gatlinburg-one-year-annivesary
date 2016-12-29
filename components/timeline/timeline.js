(function (angular) {
    'use strict';

    angular.module('thanks-obama.timeline', [
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
    .controller('timeline', ['$rootScope', '$scope', '$timeline', function ($rootScope, $scope, $timeline) {
        var _this = this;

        this.set_events = function() {
            // sorts events based on desired order
            $timeline.get_events().then(function(events) {
                $scope.events = events;
            });
            // $timeline.sort_events($scope.descending !== undefined);
        };

        $scope.$on('events-change', function(e, events) {
            console.log('events-change', events);
            _this.set_events();
        });

        _this.set_events();

        $scope.button_click = function(event, is_positive) {
            $scope.$emit('timeline-btn-click', event, is_positive);
        };

        $scope.event_click = function(event) {
            document.querySelector('body').classList.add('noscroll')
            $rootScope.$broadcast('event-click', event);
        };

    }])

    .service('$timeline', ['$rootScope', '$q', '$http', '$interval', function ($rootScope, $q, $http, $interval) {


        var self = this,
            is_fetching = false;

        this.events = [];

        this.filters = ['default'];

        this.render = function() {
            $rootScope.$broadcast('events-change', this.get_filtered_events());
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

        this.remove_event = function(event_to_remove) {
            var remaining_events = [];
            for (var i=0; i<this.events.length; i+=1) {
                var event = this.events[i];
                if (event.date.getTime() !== event_to_remove.date.getTime()) {
                    remaining_events.push(event);
                }
            }
            this.events = remaining_events;
            this.render();
        };

        this.remove_events = function(events_to_remove) {
            var time_dates = [],
                remaining_events = [];
            // get array of timed dates
            for (var i=0; i<events_to_remove.length; i+=1) {
                var event_to_remove = events_to_remove[i];
                time_dates.push(event_to_remove.date.getTime());
            }
            for (var j=0; j<this.events.length; j+=1) {
                var event = this.events[j];
                // date is not in timed dates
                if (time_dates.indexOf(event.date.getTime()) === -1) {
                    remaining_events.push(event);
                }
            }
            this.events = remaining_events;
            this.render();
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

        this.add_filter = function(new_filter) {
            if (this.filters.indexOf(new_filter) < 0) {
                this.filters.push(new_filter)
                this.render();
            }
        }
        
        this.remove_filter = function(filter) {
            var filter_index = this.filters.indexOf(filter)
            if (filter_index >= 0) {
                this.filters.splice(filter_index, 1);
                this.render();
            }
        }
        
        this.to_UTC_date = function(date){
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        };

        this.generate_events = function(response) {
            var events = response.data;
            // ensure order
            events = events.sort(function(a, b) {
                if(a.date < b.date) return -1;
                if(a.date > b.date) return 1;
            });
            // create date objects
            for (var i=0; i<events.length; i+=1) {
                var event = events[i];
                // dates are inserted on UTC time. Dates should not be converted to local time.
                event.date = this.to_UTC_date(new Date(event.date));
                event.id = i;
                //split comma-seperated tags into an array
                var split_tags = event.tags.split(',');
                event.tags = [];
                event.clean_tags = [];
                for (var tag_i = 0; tag_i < split_tags.length; tag_i++) {
                    var tag = split_tags[tag_i];
                    event.tags.push(tag.trim());
                    if (tag.indexOf('-') >= 0) {
                        var comboTagArray = tag.split('-');
                        for (var combo_i = 0; combo_i < comboTagArray.length; combo_i++) {
                            if (comboTagArray[combo_i].indexOf('!') != 0) {
                                event.clean_tags.push(comboTagArray[combo_i].trim())
                            }
                        }
                    } else if (tag.trim().indexOf('!') != 0){
                        event.clean_tags.push(tag.trim());
                    }
                }
                //set default sentiment to null
                event.sentiment = null
            }
            return events;
        };

        this.get_filtered_events = function() {
            return self.events.filter(function(event) {
                for (var i = 0; i < event.tags.length; i++) {
                    var eventTag = event.tags[i];
                    //if any event tags are present in the filters, return true
                    if (eventTag.indexOf('!') == 0) {
                        return self.filters.indexOf(eventTag.substr(1)) == -1;
                    }
                    if (self.filters.indexOf(eventTag) > -1) {
                        return true;
                    }
                    //check if eventTag is combo-tag, and check for BOTH
                    if (eventTag.indexOf('-') > -1) {
                        var comboTagArray = eventTag.split('-');
                        var result = true;
                        for (var tag_i = 0; tag_i < comboTagArray.length; tag_i++) {
                            var comboTag = comboTagArray[tag_i];
                            //check to see if tag is a 'NOT' tag
                            if (comboTag.indexOf('!') == 0) {
                                //if result from previous combos is true, check for 'NOT' tag's prescence in current filters
                                if (result == true) {
                                    result = self.filters.indexOf(comboTag.substr(1)) < 0;
                                }
                            }
                            else if (self.filters.indexOf(comboTag) < 0) {
                                result = false;
                            }
                        }
                        return result;
                    }
                }
                return false;
            });
        }

        this.get_events = function() {
            var deferred = $q.defer();
            // data is available, immediately resolve
            if (this.events.length > 0) {
                deferred.resolve(this.get_filtered_events());
            }
            // wait for data to get fetched
            else {
                self.fetch('/data/events.json').then(function(events) {
                    self.events = events;
                    $rootScope.$broadcast('events_set', events);
                    deferred.resolve(self.get_filtered_events());
                })
            }
            return deferred.promise;
        };

        this.fetch = function(url) {
            var deferred = $q.defer();
            if (!is_fetching) {
                is_fetching = true;
                $http({
                    method: 'GET',
                    url: url
                }).then(function (response) {
                    is_fetching = false;
                    // sort data
                    var events = self.generate_events(response);
                    deferred.resolve(events);
                }, function () {
                    console.warn('Unable to get data for ');
                });
            }
            return deferred.promise;
        }

    }]);

})(window.angular);
