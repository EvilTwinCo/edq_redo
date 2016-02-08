angular.module('theQ').controller('dayNotesCtrl', function(learningObjSrvc, $scope) {
    var self = this;

    $scope.$watch('is.trackables', function() {
        if (self.trackables) {
            if (Object.keys(self.trackables).length === 0) {
                self.noTrackables = true;
            } else {
                self.noTrackables = false;
            }
        }
    })
});
