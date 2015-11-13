var app = angular.module("theQ").controller("chartStatsQueueCtrl", function($scope, socketIoSrvc, $filter) {
  var socket = socketIoSrvc.getSocket();
  $scope.chartData = [];
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
    cellRenderer: miliToTime
  }, {
    headerName: "Time Waited",
    field: "timeWait",
    cellRenderer: miliToTime
  }, {
    headerName: "Time Self Helped",
    field: "timeSelfHelp",
    cellRenderer: miliToTime
  }];

  var rowData = [{
    name: "Brack",
    mentorName: "Carmony"
  }];

  $scope.gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    enableColResize: true
  };

  socket.emit('request queue stats');
  socket.on('report queue stat data', function(queueData) {
    //console.log(queueData);
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
      var day = new Date(item.timeWhenEntered);
      item.date = day.getMonth()+"/"+ day.getDay() +"/"+ day.getYear() % 100;
      if (item.mentorName) {
        item.timeHelped = new Date(item.timeQuestionAnswered) - new Date(item.timeMentorBegins);
        item.timeWait = new Date(item.timeMentorBegins) - new Date(item.timeWhenEntered);
        item.timeSelfHelp = 0;
      }else{
        item.timeSelfHelp = new Date(item.timeQuestionAnswered) - new Date(item.timeWhenEntered);
        item.timeHelped = 0;
        item.timeWait = 0;
      }
    });

    var chartData = _.groupBy(queueData.map(function(item){
      return {
        category:item.date,
        timeHelped:item.timeHelped,
        timeWait: item.timeWait,
        timeSelfHelp: item.timeSelfHelp
      };
    }),'category');

    chartData = _.map(chartData,function(item, key){
      return item.reduce(function(prev, cur, index, array){
        prev.data[0] += cur.timeHelped;
        prev.data[1] += cur.timeWait;
        prev.data[2] += cur.timeSelfHelp;
        return prev;
      }, {category:key, data:[0,0,0]});
    });
    console.log(chartData);
    $scope.chartData = queueData;
    $scope.gridOptions.api.setRowData(queueData);
    $scope.gridOptions.api.sizeColumnsToFit();

    $scope.$apply();
  });

  function miliToTime(params) {
    var day = new Date(params.value);
    if (params.value) {
      return pad(day.getUTCHours()) + ":" + pad(day.getUTCMinutes()) + ":" + pad(day.getUTCSeconds());
    }
    return "";
  }

  function pad(number) {
    //helper function to pend a leading 0 for times;
    return (number < 10 ? "0" + number : number);

  }
});
