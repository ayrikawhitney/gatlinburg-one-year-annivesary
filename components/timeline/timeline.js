(function (angular) {
    'use strict';

    angular.module('weinstein-timeline.timeline', [
        'weinstein-timeline',
        'utils'
    ])

    .directive('timeline', ['$timeout', function ($timeout) {
        return {
            scope: {
                ascending: '@',
                descending: '@'
            },
            templateUrl: 'components/timeline/timeline.html',
            restrict: 'E',
            controller: 'timeline',
            link: function ($scope, $element, $attr) {
                $scope.$on('repeatFinish', function() {
                    if (window.Tracker) {
                        // track any elements with track attribute
                        Tracker.track($element[0]);
                    }
                });
            }
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
        };

        $scope.$on('events-change', function(e, events) {
            _this.set_events();
        });

        _this.set_events();

        $scope.button_click = function(event, is_positive) {
            $scope.$emit('timeline-btn-click', event, is_positive);
        };

        $scope.event_click = function(event) {
            document.querySelector('body').classList.add('noscroll');
            $rootScope.$broadcast('event-click', event);
        };

    }])

    .service('$timeline', ['$rootScope', '$q', '$http', '$interval', 'assetPathFilter', function ($rootScope, $q, $http, $interval, assetPathFilter) {


        var _this = this,
            is_fetching = false;

        this.events = [];

        this.filters = [];

        this.render = function() {
            $rootScope.$broadcast('events-change', this.get_filtered_events());
        };

        this.sort_events = function(events, use_descending) {
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
                console.log(use_descending);
            return events.sort(sorter);
        };

        this.add_filter = function(new_filter) {
            if (this.filters.indexOf(new_filter) < 0) {
                this.filters.push(new_filter);
                this.render();
            }
        };
        
        this.remove_filter = function(filter) {
            var filter_index = this.filters.indexOf(filter);
            if (filter_index >= 0) {
                this.filters.splice(filter_index, 1);
                this.render();
            }
        };
        
        this.to_UTC_date = function(date){
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        };

        this.parse_date = function(input) {
            // var parts = input.split('/'),
                // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
                // Note: months are 0-based
                // years are in the 2000's
                // date = new Date(parseInt(parts[2]), parseInt(parts[0])-1, parts[1]);
                var date = new Date(input, 0, 1);
            return date;
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
                event.date = this.to_UTC_date(this.parse_date(event.date));
                event.id = i;
                //split comma-seperated tags into an array
                // var split_tags = event.tags.split(';');
                event.tags = [];
                event.clean_tags = [];
                // for (var tag_i = 0; tag_i < split_tags.length; tag_i++) {
                //     var tag = split_tags[tag_i];
                //     event.tags.push(tag.trim());
                //     if (tag.indexOf('&') >= 0) {
                //         var comboTagArray = tag.split('&');
                //         for (var combo_i = 0; combo_i < comboTagArray.length; combo_i++) {
                //             if (comboTagArray[combo_i].indexOf('!') != 0) {
                //                 event.clean_tags.push(comboTagArray[combo_i].trim())
                //             }
                //         }
                //     } else if (tag.trim().indexOf('!') != 0){
                //         event.clean_tags.push(tag.trim());
                //     }
                // }
                //set default sentiment to null
                event.sentiment = null;
            }
            return this.sort_events(events, false);
        };

        this.get_filtered_events = function() {
            // return _this.events;
            return _this.events.map(function(event) {
                event.preview = _this.truncate_html_text(event.blurb, 100);
                return event;
                // for (var i = 0; i < event.tags.length; i++) {
                //     var eventTag = event.tags[i];
                //     //if any event tags are present in the filters, return true
                //     if (eventTag.indexOf('!') == 0) {
                //         return _this.filters.indexOf(eventTag.substr(1)) == -1;
                //     }
                //     if (_this.filters.indexOf(eventTag) > -1) {
                //         return true;
                //     }
                //     //check if eventTag is combo-tag, and check for BOTH
                //     if (eventTag.indexOf('&') > -1) {
                //         var comboTagArray = eventTag.split('&');
                //         var result = true;
                //         for (var tag_i = 0; tag_i < comboTagArray.length; tag_i++) {
                //             var comboTag = comboTagArray[tag_i];
                //             //check to see if tag is a 'NOT' tag
                //             if (comboTag.indexOf('!') == 0) {
                //                 //if result from previous combos is true, check for 'NOT' tag's prescence in current filters
                //                 if (result == true) {
                //                     result = _this.filters.indexOf(comboTag.substr(1)) < 0;
                //                 }
                //             }
                //             else if (_this.filters.indexOf(comboTag) < 0) {
                //                 result = false;
                //             }
                //         }
                //         return result;
                //     }
                // }
                // return false;
            });
        };

        this.get_events = function() {
            var deferred = $q.defer();
            // data is available, immediately resolve
            if (this.events.length > 0) {
                deferred.resolve(this.get_filtered_events());
            }
            // wait for data to get fetched
            else {
                _this.fetch(assetPathFilter('assets/data/events.json')).then(function(events) {
                    _this.events = events;
                    $rootScope.$broadcast('events_set', events);
                    deferred.resolve(_this.get_filtered_events());
                })
            }
            return deferred.promise;
        };

        this.truncate_html_text = function(html, max) {
            // create DOM element to remove markup from html
            var div = document.createElement("div");
                div.innerHTML = html;
            // gets basic text
            var text = div.textContent || div.innerText || "",
                // limits words
                truncated_text = text.substr(0, max);
                // limited cut to full words
                truncated_text = truncated_text.substr(0, Math.min(truncated_text.length, truncated_text.lastIndexOf(' ')));
            if (truncated_text !== text) {
                truncated_text += '...';
            }
            return truncated_text;
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
                    var events = _this.generate_events(response);
                    deferred.resolve(events);
                }, function () {
                    console.warn('Unable to get data');
                });
            }
            return deferred.promise;
        }

    }]);

})(window.angular);
