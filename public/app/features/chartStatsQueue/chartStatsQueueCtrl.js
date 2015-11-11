var app = angular.module("theQ").controller("chartStatsQueueCtrl", function($scope, socketIoSrvc, $filter) {
  var socket = socketIoSrvc.getSocket();

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
      if (params.value) {
        return pad(params.value.getUTCHours()) + ":" + pad(params.value.getUTCMinutes()) + ":" + pad(params.value.getUTCSeconds());
      }
      return "";
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
        item.timeHelped = new Date(new Date(item.timeQuestionAnswered) - new Date(item.timeMentorBegins));
        item.timeWait = new Date(new Date(item.timeMentorBegins) - new Date(item.timeWhenEntered));
      }else{
        item.timeSelfHelp = new Date(new Date(item.tineQuestionAnswered)- new Date(item.timeWhenEntered));
      }
    })

    var chartData = queueData.map(function(item){
      return {
        date: item.timeWhenEntered.getMonth()+"/"+ item.timeWhenEntered.getDay() +"/"+ item.timeWhenEntered.getYear();
      }
    })

    $scope.gridOptions.api.setRowData(queueData);
    $scope.gridOptions.api.sizeColumnsToFit();

    $scope.$apply();
  });

  function pad(number) {
    //helper function to pend a leading 0 for times;
    return (number < 10 ? "0" + number : number)

  }
})
