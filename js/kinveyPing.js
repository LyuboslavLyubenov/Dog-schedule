(function() {
    angular.controller('KinveyPing', ['$kinvey',
        function ($kinvey) {
            var pingResponse = $kinvey.ping();

            pingResponse.then(function () {
                alertify.notify('Успепно се свърза със съвръра', 'success', 3);
            }, function (error) {
                alertify.notify('Няма връзка със сървъра. Провери интернет връзката или викни любо', 'error', 7);
                console.error(error.description);
            });
        }
    ]);
})();