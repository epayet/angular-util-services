// TODO gulp this

angular.module("angular-util-services", []);

angular.module("angular-util-services").factory('AlertService', ["$timeout",
    function($timeout) {
        var AlertService = function(scope, scopeCloseDelay) {
            this.scope = scope;
            this.scopeCloseDelay = scopeCloseDelay ? scopeCloseDelay : 8000;
            this.initializeScope();
        };

        AlertService.prototype.add = function(msg, type) {
            var scope = this.scope;
            if(!type)
                type = "danger";
            scope.alerts.push({type:type, "message":msg});
            $timeout(function() {
                scope.closeAlert(scope.alerts.length - 1);
            }, this.scopeCloseDelay);
        };

        AlertService.prototype.initializeScope = function() {
            var scope = this.scope;
            if(scope.alerts == null)
                scope.alerts = [];

            if(scope.closeAlert == null) {
                scope.closeAlert = function(index) {
                    scope.alerts.splice(index, 1);
                };
            }
        };

        return AlertService;
    }]);

angular.module("angular-util-services").factory('ResourceFactory', ['$resource',
    function($resource) {
        return {
            createResource : function(resourceInfo) {
                var idField = resourceInfo.idField;
                var apiUrl = resourceInfo.apiUrl + resourceInfo.name + "/:" + idField;

                var paramFieldInfo = {};
                paramFieldInfo[idField] = '@' + idField;

                var resource = $resource(apiUrl, {}, {
                    update: {method:'PUT', params:paramFieldInfo}
                });

                resource.getFromAvailable = function(availableResources, resourceId) {
                    if(availableResources == null)
                        return null;

                    for(var i=0; i<availableResources.length; i++) {
                        if(availableResources[i] != null && availableResources[i][idField] == resourceId)
                            return availableResources[i];
                    }
                };

                return resource;
            }
        }
    }]);

angular.module("angular-util-services").factory('util', [
    function() {
        var copy = function(obj) {
            switch(typeof obj) {
                default:
                    return obj;
                case "object":
                    if(Array.isArray(obj)) {
                        return obj.slice(0);
                    } else {
                        var obj2 = {};
                        for (var attr in obj) {
                            obj2[attr] = copy(obj[attr]);
                        }
                        return obj2;
                    }
            }
        };

        return {
            escapeStr : function(str) {
                if(!str) return "";
                return str.replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&apos;');
            },

            copy : copy,

            guessType : function(str) {
                var firstChar = str.substr(0, 1);
                switch(firstChar) {
                    case "[":
                    case "{":
                        return "json";
                    case "<":
                        return "xml";
                }
            }
        }
    }]);

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