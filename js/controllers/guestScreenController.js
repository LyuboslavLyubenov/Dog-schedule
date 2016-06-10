(function() {

    const InvalidCredentials = 'Проблем при влизане във профила. Провери името и паролата и опитай отново!';
    const NetworkProblem = 'Проблем с интернет връзката. Моля опитайте по късно!';

    angular
        .module('DogSchedule')
        .controller('GuestScreenController', ['$kinvey', '$scope', '$location',
            function ($kinvey, $scope, $location) {
                var loginData = {
                    username: '',
                    password: ''
                };

                $scope.loginData = loginData;
                $scope.login = login;

                function login() {
                    var user = new $kinvey.User(loginData);

                    user.$login().then(
                        function (user) {
                            sessionStorage.setItem('username', user.username);
                            alertify.notify('Успешно влезе във профила си', 'success', 5);
                            $location.url('/calendar/');
                        },
                        function (error) {

                            var msg = '';

                            if (error.status === 401) {
                                msg = InvalidCredentials;
                            } else {
                                msg = NetworkProblem;
                            }

                            alertify.notify(msg, 'error', 7);
                            console.error(error);
                        }
                    );
                }
            }
        ]);
})();