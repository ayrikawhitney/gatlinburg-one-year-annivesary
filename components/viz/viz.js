(function (angular) {
    'use strict';

    angular.module('thanks-obama.viz', [
        'resizer',
        'timeline'
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
              gulp   }
                if (window.Ads) {
                    // create new ads. Pass in app name.
                    new window.Ads(app_name);
                }
            }
        };
    }])

    .controller('viz', ['$scope', '$timeout', '$timeline', function ($scope, $timeout, $timeline) {
        $scope.$on('timeline-btn-click', function(e, button) {
            // button is the button markup
            // event available under button.event
            console.log(button);
        });

        var events_set_1 = [
            {
                date: new Date(2016, 0, 5),
                markup: '' +
                    '<p>Some kind of html markup</p>' +
                    '',
                classes: 'red-background',
                buttons: [
                    {
                        markup: '<span>my button 1</span>',
                        // can put whatever you want in here, doesn't have to be id
                        id: '#thanksobama not nicely'
                    },
                    {
                        markup: '<span>my button 2</span>',
                        id: '#thanksobama nicely'
                    }
                ]
            },
            {
                date: new Date(2016, 1, 5),
                markup: '' +
                    '<p>Some kind of html markup</p>' +
                    '',
                classes: 'red-background'
            },
            {
                date: new Date(2016, 2, 5),
                markup: '' +
                    '<p>Some kind of html markup</p>' +
                    '',
                classes: 'green-background'
            }
        ],
        events_set_2 = [
            {
                date: new Date(2016, 11, 5),
                markup: '' +
                    '<p>Some kind of html markup</p>' +
                    '',
                classes: 'red-background'
            },
            {
                date: new Date(2016, 12, 5),
                markup: '' +
                    '<p>Some kind of html markup</p>' +
                    '',
                classes: 'blue-background'
            }
        ],
        new_event = {
            date: new Date(2016, 1, 7),
            markup: '' +
                '<p>Some kind of html markup</p>' +
                '',
            classes: 'red-background'
        };

        console.info('adding events');
        $timeline.add_events(events_set_1);
        $timeline.add_events(events_set_2);

        $timeout(function() {
            console.info('adding an event');
            $timeline.add_event(new_event);
        }, 1000);

        $timeout(function() {
            console.info('removing event');
            $timeline.remove_event(new_event);
        }, 2000);

        $timeout(function() {
            console.info('removing events');
            $timeline.remove_events(events_set_2);
        }, 3000);

    }]);

})(window.angular);