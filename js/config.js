(function() {
    var appKey = 'kid_Wkc5Z0XpfW',
        appSecret = '5e75ec49d5a44349a121863c660a01ae';

    angular
        .module('DogWalkingSchedule')
        .config(['$routeProvider', '$kinveyProvider' ,
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

                function redirectGuestUser($location) {
                    if (!sessionStorage.getItem('username')) {
                        $location.url('/');
                    }
                }

                function redirectLoggedInUser($location) {
                    if (sessionStorage.getItem('username')) {
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
                }).otherwise('/');
            }
        ]);
})();