var app = angular.module('RequestBlockerApp', []);

app.controller('PopupController', function($scope) {

    $scope.isValidPattern = function(urlPattern) {
      var validPattern = /^(file:\/\/.+)|(https?|ftp|\*):\/\/(\*|\*\.([^\/*]+)|([^\/*]+))\//g;
      return !!urlPattern.match(validPattern);
    }

    $scope.backgroundPage = chrome.extension.getBackgroundPage();
    $scope.pattern = $scope.backgroundPage.pattern;

    

   

    $scope.save = function() {
        var pattern = $scope.pattern;

        $scope.backgroundPage.save(pattern, function() {
            $scope.$apply(function() {
                $scope.success('pattern saved successfully!');
            });
        });
    };

    $scope.success = function(message, title) {
        $scope.modal(message, title || "Success", "text-info");
    }
    $scope.error = function(message, title) {
        $scope.modal(message, title || "Error", "text-danger");
    }
    $scope.modal = function(message, title, modalClass) {
        $scope.modalClass = modalClass;
        $scope.modalTitle = title;
        $scope.modalMessage = message;
        $('#modal').modal();
    }
});
