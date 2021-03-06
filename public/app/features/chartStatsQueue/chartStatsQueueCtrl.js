var app = angular.module("theQ").controller("chartStatsQueueCtrl", function($scope, socketIoSrvc, $filter) {
  var socket = socketIoSrvc.getSocket();
  $scope.chartData = [];
  var filteredData = [];

  $scope.$watch('is.cohortId', function(newValue, oldValue){

    $scope.gridOptions.api.onFilterChanged();
  });

  var columnDefs = [{
    headerName: "Student",
    field: "name",
    filter:'set'
  }, {
    headerName: "Mentor",
    field: "mentorName",
    filter:'set'

  }, {
    headerName: "Day",
    filter:'set',
    valueGetter: function(params) {
      return $filter('date')(params.data.timeWhenEntered, "yy/M/d EEE");
    }
  }, {
    headerName: "Objective",
    field: "directive",
    filter:'set'
  }, {
    headerName: "Category",
    field: "questionCategory",
    filter:'set'
  }, {
    headerName: "Time Waited",
    field: "timeWait",
    aggFunc:"sum",
    cellRenderer: miliToTime
  }, {
    headerName: "Time Helped",
    field: "timeHelped",
    aggFunc:"sum",
    cellRenderer: miliToTime
  }, {
    headerName: "Time Self Helped",
    field: "timeSelfHelp",
    aggFunc:"sum",
    cellRenderer: miliToTime
  }];

  var rowData = [{
    name: "Brack",
    mentorName: "Carmony"
  }];

  $scope.gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    enableColResize: true,
    enableFilter:true,
    onBeforeFilterChanged: beforeFilterChanged,
    onAfterFilterChanged: afterFilterChanged,
    isExternalFilterPresent:isExternalFilterPresent,
    doesExternalFilterPass:doesExternalFilterPass
  };

  function isExternalFilterPresent(){
      return $scope.is.cohortId !== 'all' && $scope.is.cohortId !== undefined && $scope.is.cohortId !== null;
  }

  function doesExternalFilterPass(node){
    return $scope.is.cohortId == node.data.cohortId;
  }

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
    $scope.chartData = queueData;
    $scope.gridOptions.api.setRowData(queueData);
    $scope.gridOptions.api.sizeColumnsToFit();

    $scope.$apply();
  });

  function afterFilterChanged(){
    $scope.gridOptions.api.forEachNodeAfterFilter(filteredDataAggregator);
    $scope.chartData = filteredData;
  }

  function beforeFilterChanged() {
        filteredData = [];
    }

  function filteredDataAggregator (node) {
        filteredData.push(node.data);
    }

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
