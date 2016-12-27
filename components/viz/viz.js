(function (angular) {
    'use strict';

    angular.module('thanks-obama.viz', [
        'resizer',
        'thanks-obama.timeline',
        'thanks-obama.modal',
        'thanks-obama.dropdown'
    ])

    .directive('viz', ['$timeout', function ($timeout) {
        return {
            scope: {},
            templateUrl: 'components/viz/viz.html',
            restrict: 'E',
            controller: 'viz',
            link: function ($scope, $element, $attr) {
                var el = $element[0],
                    app_name = 'police-chases';
                if (window.Analytics) {
                    window.Analytics.setup(app_name, {
                        // page views are handled with route success
                        embedded: false,
                        trackTime: true,
                        trackScrollDepth: false
                    });
                    // if (window.Tracker) {
                    //     window.Tracker.track(el);
                    // }
                }
                if (window.Ads) {
                    // create new ads. Pass in app name.
                    new window.Ads(app_name);
                }
            }
        };
    }])

    .controller('viz', ['$scope', '$timeout', '$timeline', '$element', function ($scope, $timeout, $timeline, $element) {

        $scope.$on('timeline-btn-click', function(e, event, is_positive) {
            var el = $element[0],
                sharing_el = el.querySelector('.modal-sharing');
            $scope.modal_event = event;
            $scope.event_is_positive = is_positive;
            $scope.modal_open = true;
            // enable sharing on isolated scope
            window.SharingTwitter.watch(sharing_el);
            window.SharingFacebook.watch(sharing_el);
        });

        $scope.$on('option-click', function(e, option) {
            // the dropdown will add a checked property
            // add events if options is checked
            if (option.checked) {
                console.log(option);
                $timeline.add_filter(option.value);
            }
            // remove events if option is unchecked
            else {
                $timeline.remove_filter(option.value);
            }
        });

        var events_set_1 = [
            {
                date: new Date(2016, 0, 5),
                title: 'You now know obama reads your tests',
                subtitle: 'Snowden leaked information',
                classes: 'red-background',
                image: 'https://placekitten.com/g/600/500',
                text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
                share: 'Thanks to obama, the nsa reads all my text messages 1'
            }
        ],
        events_set_2 = [
            {
                date: new Date(2016, 1, 5),
                title: 'You now know obama reads your tests',
                subtitle: 'Snowden leaked information',
                classes: 'blue-background',
                image: 'https://placekitten.com/g/600/500',
                text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
                share: 'Thanks to obama, the nsa reads all my text messages 2'
            },
            {
                date: new Date(2016, 2, 5),
                title: 'You now know obama reads your tests',
                subtitle: 'Snowden leaked information',
                classes: 'blue-background',
                image: 'https://placekitten.com/g/600/500',
                text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
                share: 'Thanks to obama, the nsa reads all my text messages'
            },
            {
                date: new Date(2016, 10, 5),
                title: 'You now know obama reads your tests',
                subtitle: 'Snowden leaked information',
                classes: 'blue-background',
                image: 'https://placekitten.com/g/600/500',
                text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
                share: 'Thanks to obama, the nsa reads all my text messages'
            },
            {
                date: new Date(2016, 11, 5),
                title: 'You now know obama reads your tests',
                subtitle: 'Snowden leaked information',
                classes: 'green-background',
                image: 'https://placekitten.com/g/600/500',
                text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
                share: 'Thanks to obama, the nsa reads all my text messages'            }
        ],
        events_set_3 = [
            {
                date: new Date(2016, 7, 5),
                title: 'You now know obama reads your tests',
                subtitle: 'Snowden leaked information',
                image: 'https://placekitten.com/g/600/500',
                text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
                share: 'Thanks to obama, the nsa reads all my text messages'
            },
            {
                date: new Date(2016, 8, 5),
                title: 'You now know obama reads your tests',
                subtitle: 'Snowden leaked information',
                image: 'https://placekitten.com/g/600/500',
                text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
                share: 'Thanks to obama, the nsa reads all my text messages'            }
        ],
        events_set_4 = [
            {
                date: new Date(2016, 9, 5),
                title: 'You now know obama reads your tests',
                subtitle: 'Snowden leaked information',
                classes: 'yellow-background',
                image: 'https://placekitten.com/g/600/500',
                text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
                share: 'Thanks to obama, the nsa reads all my text messages'
            },
            {
                date: new Date(2016, 4, 15),
                title: 'You now know obama reads your tests',
                subtitle: 'Snowden leaked information',
                classes: 'yellow-background',
                image: 'https://placekitten.com/g/600/500',
                text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
                share: 'Thanks to obama, the nsa reads all my text messages'            }
        ],
        new_event = {
            date: new Date(2016, 1, 7),
            title: 'New event',
            subtitle: 'Snowden leaked information',
            classes: 'green-background',
            image: 'https://placekitten.com/g/600/500',
            text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
            share: 'Thanks to obama, the nsa reads all my text messages'
        };

        // $timeline.add_events(events_set_1);

        // Below demostrats additional functionality of the $timeline service
        // $timeout(function() {
        //     console.info('adding an event');
        //     $timeline.add_event(new_event);
        // }, 1000);
        //
        // $timeout(function() {
        //     console.info('removing event');
        //     $timeline.remove_event(new_event);
        // }, 2000);
        //
        // $timeout(function() {
        //     console.info('removing events');
        //     $timeline.remove_events(events_set_2);
        // }, 3000);
        //
        $scope.$on('events_set', function(e, events) {
            console.log(events);
            var all_tags = [];
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var new_tags = [];
                angular.forEach(event.tags, function(tag) {
                    if(tag != 'default' && tag.indexOf('-') < 0) {
                        new_tags.push(tag)
                     } else if (tag.indexOf('-') >= 0) {
                        var split_tag_array = tag.split('-');
                        angular.forEach(split_tag_array, function(split_tag) {
                            new_tags.push(split_tag);
                        });
                     } else {
                        new_tags.push(null);
                     }
                 });

                 angular.forEach(new_tags, function(tag) {
                    if (tag && all_tags.indexOf(tag) < 0) {
                        all_tags.push(tag);
                    }
                 });
            }
            $scope.dropdown_options = all_tags.map(function(tag) {
                return {
                    label: tag,
                    value: tag
                };
            });
        });
        
        // $scope.dropdown_options = [
        //     {
        //         label: 'Green',
        //         value: 'green'
        //     },
        //     {
        //         label: 'One',
        //         value: 'one'
        //     },
        //     {
        //         label: 'Alien',
        //         value: events_set_4
        //     },
        //     {
        //         label: 'Something 2',
        //         value: []
        //     },
        //     {
        //         label: 'Something 3',
        //         value: []
        //     },
        //     {
        //         label: 'Something 4',
        //         value: []
        //     },
        //     {
        //         label: 'Something 5',
        //         value: []
        //     },
        //     {
        //         label: 'Something 6',
        //         value: []
        //     },
        //     {
        //         label: 'Something 7',
        //         value: []
        //     }
        // ];

    }]);

})(window.angular);
