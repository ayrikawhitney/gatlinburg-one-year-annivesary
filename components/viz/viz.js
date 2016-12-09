(function (angular) {
    'use strict';

    angular.module('thanks-obama.viz', [
        'resizer',
        'thanks-obama.timeline',
        'thanks-obama.modal'
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
            window.SharingTwitter.watch(sharing_el);
            window.SharingFacebook.watch(sharing_el);
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
            },
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
                classes: 'green-background',
                image: 'https://placekitten.com/g/600/500',
                text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
                share: 'Thanks to obama, the nsa reads all my text messages'
            }
        ],
        events_set_2 = [
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
        new_event = {
            date: new Date(2016, 1, 7),
            title: 'New event',
            subtitle: 'Snowden leaked information',
            classes: 'green-background',
            image: 'https://placekitten.com/g/600/500',
            text: 'We need to dialog around your choice of work attire what\'s the status on the deliverables for eow? meeting assassin data-point, yet this vendor is incompetent quick-win drop-dead date.',
            share: 'Thanks to obama, the nsa reads all my text messages'
        };

        $timeline.add_events(events_set_1);
        $timeline.add_events(events_set_2);

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

    }]);

})(window.angular);