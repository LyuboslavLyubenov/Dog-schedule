(function() {
    var appKey = 'kid_Wkc5Z0XpfW',
        appSecret = '5e75ec49d5a44349a121863c660a01ae';

    angular
        .module('DogWalkingSchedule')
        .config(['$routeProvider', '$kinveyProvider',
            function ($routeProvider, $kinveyProvider) {
                $kinveyProvider.init({
                    appKey: appKey,
                    appSecret: appSecret,
                    storage: 'cookies'
                });

                var resolveRedirectGuestUser = {
                    redirectGuestUser: redirectGuestUser
                };

                var resolveRedirectLoggedInUser = {
                    redirectLoggedInUser: redirectLoggedInUser
                };

                function redirectLoggedInUser($location) {
                    if (sessionStorage.getItem('username')) {
                        $location.url('/calendar/');
                    }
                }

                function redirectGuestUser($location) {
                    if (!sessionStorage.getItem('username')) {
                        $location.url('/');
                    }
                }

                $routeProvider.when('/', {
                    templateUrl: 'partials/guest-screen.html',
                    controller: 'GuestScreenController',
                    resolve: resolveRedirectLoggedInUser
                }).when('/calendar/', {
                    templateUrl: 'partials/user-screen.html',
                    controller: 'UserScreenController',
                    resolve: resolveRedirectGuestUser
                }).when('/logout', {
                    controller: ['$kinvey', '$location',
                        function ($kinvey, $location) {
                            var currentUserPromise = $kinvey.User.current();

                            currentUserPromise.$logout().then(function () {
                                alertify.notify('Успешно излезна от профила си', 'success', 5);
                                sessionStorage.clear();
                                $location.url('/');
                            }, function (error) {
                                alertify.notify('Проблем при излизане от профила. Моля провери интернет връзката и/или кажи на любо!!!', 'error', 7);
                                console.error(error);
                            });
                        }
                    ]
                })
                    .otherwise('/');
            }
        ]);
})();