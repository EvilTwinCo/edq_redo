angular.module('theQ').controller('attendanceStatsCtrl', function(socketIoSrvc, $scope) {

  var socket = socketIoSrvc.getSocket();
  var self = this;
  self.attendees = [];

  //////
  ///sockets to get data
  //////[{attendance[], attendee{fnam, lastname}}]

  $scope.$watch('is.cohortId', function() {
    if (self.cohortId) {


      socket.emit("getAllAttendanceOfCohort", self.cohortId);
    }
  })

  socket.on('All attendance for a cohort', function(users) {
      self.attendees.push(users);
      $scope.$apply();


      createRowData(self.attendees);
      $scope.gridOptions.api.setRowData(createRowData(self.attendees));
      var targetParent = document.getElementById('targetContainer');
        console.log(rowData);


        //here is whewre I want to format the data

    })


    /////////
    //sockets end
    ///////

  ////????////////////////////
  //??%%%%    ag-grid start /////
  ////////////////////////////

  var columnDefs = [{
      headerName: "Student Name",
      field: "name",
      width: 150
    }, {
      headerName: "Student Id",
      field: "studentId",
      width: 90
    }, {
      headerName: "Attendence (%)",
      field: "attendence",
      width: 150,
      cellRenderer: percentCellRenderer
    }, {
      headerName: "Days Late (%)",
      field: "tardiness",
      width: 150,
      cellRenderer: invertedPercentCellRenderer
    }, {
      headerName: "Days Left Early (%)",
      field: "earlyLeft",
      width: 150,
      cellRenderer: invertedPercentCellRenderer
    }, {
      headerName: "Average Daily Score",
      field: "score",
      width: 150
    }

  ];

  $scope.gridOptions = {
    columnDefs: columnDefs,
    rowData: createRowData(self.attendees),
    onModelUpdated: onModelUpdated,
    rowHeight: 22,
    enableColResize: true,

  };


var rowData = [];
  function createRowData(attendees) {
  rowData = [];

    for (var i = 0; i < self.attendees.length; i++) {
      rowData.push({

        name: self.attendees[i].attendee.firstName + ' ' + self.attendees[i].attendee.lastName,
        studentId: self.attendees[i].attendee.devMtn.id,
        attendence: computePrecentAttended(self.attendees[i].attendance),
        tardiness: computeTardiness(self.attendees[i].attendance),
        earlyLeft: computeLeftEarly(self.attendees[i].attendance),
        score: computeScore(self.attendees[i].attendance)

      });
    }

    return rowData;
  }

  function computeScore(attendanceObj) {

    var avScore;
    var number = attendanceObj.length;
    var total = 0;

    for (var i = 0; i < attendanceObj.length; i++) {

      if (attendanceObj[i].attendanceData.score != null) {

        total += attendanceObj[i].attendanceData.score;
      }
    }
    avScore = total / number;

    return avScore;

  }

  function computeLeftEarly(attendanceObj) {

    var avScore;
    var number = attendanceObj.length;
    var total = 0;

    for (var i = 0; i < attendanceObj.length; i++) {

      if (attendanceObj[i].attendanceData.timeOut != null) {
        var hours = attendanceObj[i].attendanceData.timeOut.slice(11, 13);

        if (hours < 17) {
          total += 1;
        }
      }
    }
    avScore = Math.round((total / number) * 100);

    return avScore;

  }


  function computeTardiness(attendanceObj) {

    var avScore;
    var number = attendanceObj.length;
    var total = 0;


    for (var i = 0; i < attendanceObj.length; i++) {

      if (attendanceObj[i].attendanceData.timeIn != null) {
        var hours = attendanceObj[i].attendanceData.timeIn.slice(11, 13);
        if (hours > 9) {
          total += 1;
        }
      }
    }

    avScore = Math.round((total / number) * 100);

    return avScore;

  }

  function computePrecentAttended(attendanceObj) {
    var avScore;
    var number = attendanceObj.length;
    var total = 0;

    for (var i = 0; i < attendanceObj.length; i++) {
      if (attendanceObj[i].attendanceData.timeIn != null) {
        total += 1;
      }
    }

    avScore = Math.round((total / number) * 100);

    return avScore;

  }

//////colors not showing css conflict??

  function percentCellRenderer(params) {
    var value = params.value;
    console.log(value)
    var eDivPercentBar = document.createElement('div');
    eDivPercentBar.className = 'div-percent-bar';
    eDivPercentBar.style.width = value + '%';
    if (value < 20) {
      eDivPercentBar.style.backgroundColor = 'red';
    } else if (value < 60) {
      eDivPercentBar.style.backgroundColor = '#ff9900';
    } else if(value >90) {
      eDivPercentBar.style.backgroundColor = '#00A000';
    }

    var eValue = document.createElement('div');
    eValue.className = 'div-percent-value';
    eValue.innerHTML = value + '%';

    var eOuterDiv = document.createElement('div');
    eOuterDiv.className = 'div-outer-div';
    eOuterDiv.appendChild(eValue);
    eOuterDiv.appendChild(eDivPercentBar);

    return eOuterDiv;
  }





  function invertedPercentCellRenderer(params) {
    var value = params.value;

    var eDivPercentBar = document.createElement('div');
    eDivPercentBar.className = 'div-percent-bar';
    eDivPercentBar.style.width = value + '%';
    if (value < 70) {
      eDivPercentBar.style.backgroundColor = 'red';
    } else if (value < 90) {
      eDivPercentBar.style.backgroundColor = '#ff9900';
    } else if(value >90){
      eDivPercentBar.style.backgroundColor = '#00A000';
    }

    var eValue = document.createElement('div');
    eValue.className = 'div-percent-value';
    eValue.innerHTML = value + '%';

    var eOuterDiv = document.createElement('div');
    eOuterDiv.className = 'div-outer-div';
    eOuterDiv.appendChild(eValue);
    eOuterDiv.appendChild(eDivPercentBar);

    return eOuterDiv;
  }





  function onModelUpdated() {
    var model = $scope.gridOptions.api.getModel();
    var totalRows = $scope.gridOptions.rowData.length;
    var processedRows = model.getVirtualRowCount();
    $scope.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
  }


  //// ----ag-grid end----////

/////////////////
  //////    D3
//////////////self.attendees
var test = {test1: 12, test2:44};




var test = [{"label":"one", "value":20},
        {"label":"two", "value":50},
        {"label":"three", "value":30}];

var windowWidth =  window.innerWidth - 20;


var width = windowWidth/4;
var height = window.innerHeight * 0.7;
var radius = Math.min(width, height) / 2;
console.log(width);
console.log(height);
console.log(radius);
var color = d3.scale.ordinal().range(["#016A2B", "#967601", "#79241D"]);
//first will be maped to the first element in values


var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });

var svg = d3.select("#targetContainer").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  var g = svg.selectAll(".arc")
      .data([test])
    .enter().append("g")
      .attr("class", "arc");
console.log(rowData);
  g.append("path")
      .attr("d", arc)
      .style("fill", function(d,i) {


         return color(i);
       });

  g.append("text")
      .attr("transform", function(d) {

         return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) {
         return d.data; });



/////////   END    d3

})
