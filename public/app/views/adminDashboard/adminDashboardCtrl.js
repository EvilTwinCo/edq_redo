angular.module('theQ').controller('adminDashboardCtrl', function(socketIoSrvc) {
  var socket = socketIoSrvc.getSocket();

  socket.emit('instructor login');
});
