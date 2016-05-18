(function() {
    angular
        .module('DogWalkingSchedule')
        .directive('initializeCalendar', ['$kinvey',
            function ($kinvey) {

                function convertEventsData(events) {
                    var result = [];

                    for (var i in events) {
                        if (!isNaN(i)) {
                            result.push(events[i]);
                        }
                    }

                    return result;
                }

                function link(scope, element, attrs) {
                    var events = $kinvey.Object('Events');
                    var allEvents = events.query({
                        query: {
                            assignee: 'dead4y'
                        }
                    }).$promise.then(function (success) {
                        $(element).fullCalendar({
                            header:
                            {
                                left: '',
                                right: ''
                            },
                            editable: false,
                            defaultView: 'agendaWeek',
                            lang: 'bg',
                            events: convertEventsData(success)
                        });

                    }, function (error) {
                        alertify.notify('Проблем със връзката със сървъра. Питай любо', 'error', 7);
                        console.error(error);
                    });
                }

                return {
                    link: link
                }
            }
        ]);
})();