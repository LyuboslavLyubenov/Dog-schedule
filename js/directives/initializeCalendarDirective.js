(function () {

    const errorMessage = 'Проблем при връзката със сървъра. Моля провери интернет връзката си и викни любо!!!';

    angular
        .module('DogSchedule')
        .directive('initializeCalendar', ['$kinvey', '$route',
            function ($kinvey, $route) {

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
                    var calendar;

                    events.query({
                        query: {
                            assignee: 'dead4y',
                            isCompleted: false
                        }
                    }).$promise.then(function (success) {
                        calendar = $(element).fullCalendar({
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

                                var start = calEvent.start.local(),
                                    end = calEvent.end.local(),
                                    now = moment();

                                if (now < start || now >= end) {
                                    return;
                                }


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
                                        startDate = calEvent.start.format(),
                                        event = allEvents.query({
                                            query: {
                                                start: startDate.split('+')[0]
                                            }
                                        });

                                    event.$promise.then(function (success) {
                                        var modifiedEvent = success[0];
                                        modifiedEvent.isCompleted = true;
                                        delete modifiedEvent._acl;
                                        delete modifiedEvent._kmd;

                                        modifiedEvent.$save().then(function () {
                                            alertify.notify('Успешно изпълни задача! Браво!', 'success', 5);
                                            $route.reload();
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
                        alertify.notify(errorMessage, 'error', 7);
                        console.error(error);
                    });
                }

                return {
                    link: link
                }
            }
        ]);
})();