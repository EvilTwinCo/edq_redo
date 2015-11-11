var app = angular.module("theQ").controller("chartStatsQueueCtrl", function($scope, socketIoSrvc, $filter) {
  var socket = socketIoSrvc.getSocket();

  console.log(self);
  var columnDefs = [{
    headerName: "Student",
    field: "name"
  }, {
    headerName: "Mentor",
    field: "mentorName"
  }, {
    headerName: "Day",
    valueGetter: function(params) {
      return $filter('date')(params.data.timeWhenEntered, "EEE d/M/yy");
    }
  }, {
    headerName: "Objective",
    field: "directive"
  }, {
    headerName: "Category",
    field: "questionCategory"
  }, {
    headerName: "Time Helped",
    field: "timeHelped",
    cellRenderer: function(params) {
      console.log(params);
      console.log($filter('date')(params.value, "HH:mm:ss"))
      return $filter('date')(params.value, "HH:mm:ss");
    }
  }]

  var rowData = [{
    name: "Brack",
    mentorName: "Carmony"
  }];

  $scope.gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    enableColResize: true

  }
  socket.emit('request queue stats');

  socket.on('report queue stat data', function(queueData) {
    console.log(queueData);
    $scope.queueData = queueData;

    $scope.test = _.countBy(queueData, function(item) {
      return Math.floor((new Date(item.timeQuestionAnswered) - new Date(item.timeWhenEntered)) / (1000 * 60));
    });

    $scope.helpedBy = _.countBy(queueData, function(item) {
      return item.mentorName + "/" + item.name;
    });

    $scope.mentors = _.uniq(_.pluck(queueData, 'mentorName'));
    $scope.students = _.uniq(_.pluck(queueData, 'name'));

    queueData.forEach(function(item) {
      if (item.mentorName) {
        item.timeHelped = (new Date(item.timeQuestionAnswered) - new Date(item.timeMentorBegins))
      }
    })

    $scope.gridOptions.api.setRowData(queueData);


    $scope.$apply();

  });
})
