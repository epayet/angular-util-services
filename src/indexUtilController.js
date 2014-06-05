angular.module(APP_NAME_CONTROLLERS).controller('IndexUtilController', [ '$scope', '$location',
    function($scope, $location) {
        $scope.isActive = function(route) {
            return route === $location.path();
        }
    }]);