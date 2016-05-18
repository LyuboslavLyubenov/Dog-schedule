(function() {
    angular
        .module('DogWalkingSchedule')
        .controller('GuestScreenController', ['$kinvey', '$scope',
            function ($kinvey, $scope) {
                var loginData = {
                    username: '',
                    password: ''
                };

                $scope.loginData = loginData;
                $scope.login = login;

                console.log($kinvey.User.current());

                function login() {
                    var user = new $kinvey.User(loginData);

                    user.$login().then(
                        function (user) {
                            console.log(user);
                            sessionStorage.setItem('username', user.username);
                            alertify.notify('Успешно влезе във профила си', 'success', 5);
                        },
                        function (error) {
                            alertify.notify('Проблем при влизане във профила', 'error', 5);
                            console.error(error);
                        }
                    );
                }
            }
        ]);
})();