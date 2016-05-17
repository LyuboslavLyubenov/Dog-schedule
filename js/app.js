(function() {
    var initialized = false;

    angular
        .module('DogWalkingSchedule', ['ngRoute'])
        .constant('kinveyConfig', {
            appKey: 'kid_Wkc5Z0XpfW',
            appSecret: '5e75ec49d5a44349a121863c660a01ae'
        })
        .run(['$kinvey, $rootScope', '$location', 'kinveyConfig',
            function ($kinvey, $rootScope, $location, kinveyConfig) {
                $rootScope.$on('$locationChangeStart', function (event, newUrl) {
                    event.preventDefault();

                    // Initialize Kinvey
                    $kinvey.init(kinveyConfig).then(function() {
                        initialized = true;
                        $location.path($location.url(newUrl).hash); // Go to the page
                    }, function(err) {
                        alertify.notify('Има проблем с връзката със сървъра. Кажи на любо!!!', 'error', 7);
                        console.error(err.message);
                    });
                });
            }
        ]);
})();