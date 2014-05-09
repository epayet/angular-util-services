'use strict';

angular.module("angular-util-services").factory('WaitingService', ['$modal',
    function($modal) {
        var WaitingService = function() {

        };

        WaitingService.prototype.start = function(message) {
            var self = this;
            if(!message) message = "Processing";
            this.modalInstance = $modal.open({
                template: '<div class="modal-header">' +
                   '<h3>{{message}}...</h3>' +
        '</div>' +
        '<div class="modal-body">' +
            '<div class="progress progress-striped active">' +
                '<div class="progress-bar" style="width: 100%;"></div>' +
            '</div> </div>',
                controller : function($scope) {
                    self.scope = $scope;
                    $scope.message = message;
                    $scope.closeModal = function() {
                        $scope.$close();
                    }
                }
            });
        };

        WaitingService.prototype.setMessage = function(message) {
            if(this.scope)
                this.scope.message = message;
        };

        WaitingService.prototype.stop = function() {
            this.modalInstance.close();
            this.scope = null;
        };

        return WaitingService;
    }]);