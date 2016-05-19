(function () {
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

                    events.query({
                        query: {
                            assignee: 'dead4y'
                        }
                    }).$promise.then(function (success) {
                        $(element).fullCalendar({
                            header: {
                                left: '',
                                right: ''
                            },
                            editable: false,
                            defaultView: 'agendaWeek',
                            lang: 'bg',
                            events: convertEventsData(success),
                            scope: {},
                            eventClick: function (calEvent, jsEvent, view) {
                                const errorMessage = 'Проблем при връзката със сървъра. Моля провери интернет връзката си и викни любо!!!';

                                var startDate = moment(calEvent.start).calendar(),
                                    endDate = moment(calEvent.end).calendar();

                                alertify.confirm().setting({
                                    labels: {
                                        ok: 'Окей',
                                        cancel: 'Не съм сигурен'
                                    },
                                    title: '',
                                    message: 'Потвърждаваш ли че ще разходиш кучето от ' + startDate + ' до ' + endDate,
                                    modal: true,
                                    movable: false,
                                    resizable: false,
                                    onok: onOK
                                }).show();



                                function onOK() {
                                    //TODO
                                    var allEvents = $kinvey.Object('Events'),
                                        startDate = formatDate(calEvent.start),
                                        endDate = formatDate(calEvent.end),
                                        username = sessionStorage.getItem('username'),
                                        event = allEvents.query({
                                            query: {
                                                start: startDate,
                                                end: endDate,
                                                assignee: username
                                            }
                                        });

                                    function formatDate(date) {
                                        var result = moment(date).format();
                                        return result.slice(0, result.length - 1);
                                    }

                                    event.$promise.then(function (success) {
                                        success[0].isCompleted = true;
                                        success.$save().$promise.then(function () {
                                            alertify.notify('Успешно изпълни задача! Браво!', 'success', 5);
                                        }, function (error) {
                                            alertify.notify(errorMessage, 'error', 7);
                                            console.error(error);
                                        });
                                    }, function (error) {
                                        alertify.notify(errorMessage, 'error', 7);
                                        console.error(error);
                                    });

                                }
                            }
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