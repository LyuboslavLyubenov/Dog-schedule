(function() {
    angular
        .module('DogWalkingSchedule')
        .config(['$routeProvider',
            function ($routeProvider) {

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

                function redirectLoggedInUser() {
                    if (sessionStorage.getItem('username')) {
                        $location.url('/');
                    }
                }

                $routeProvider.when('/', {
                    templateUrl: 'partials/guest-screen.html',
                    controller: 'GuestScreenController',
                    resolve: resolveRedirectLoggedInUser
                });

                $routeProvider.when('/calendar', {
                    templateUrl: 'partials/user-screen.html',
                    controller: 'UserScreenController',
                    resolve: resolveRedirectGuestUser
                });
            }
        ]);
})();