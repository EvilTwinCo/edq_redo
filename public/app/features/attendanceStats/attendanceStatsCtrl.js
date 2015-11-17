angular.module('theQ').controller('attendanceStatsCtrl', function(socketIoSrvc, $scope) {

  var socket = socketIoSrvc.getSocket();
  var self = this;
  self.attendees = [];
  this.showGraphs = false;

  //the first makes empty graphs. This will activate the newChart(data) function on 1 and only 1
  self.countChartCall = 0;
  //////
  ///sockets to get data


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

    if (self.countChartCall == 1) {
      self.dataArray.forEach(function(item) {
        self.countChartCall += 1;
        newChart(item);
      })
    }
    self.countChartCall += 1;


  })

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
    getDataForChart(rowData);
    self.showGraphs = true;

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
    var eDivPercentBar = document.createElement('div');
    eDivPercentBar.className = 'div-percent-bar';
    eDivPercentBar.style.width = value + '%';
    if (value < 20) {
      eDivPercentBar.style.backgroundColor = 'red';
    } else if (value < 60) {
      eDivPercentBar.style.backgroundColor = '#ff9900';
    } else if (value > 90) {
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
    } else if (value > 90) {
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

  /////////////////
  //////    D3
  // //////////////self.attendees
  function getDataForChart(arr) {
    self.groupAttendance = 0;
    self.groupScore = 0;
    self.groupTardiness = 0;
    self.groupEarlyLeaving = 0;

    for (var i = 0; i < arr.length; i++) {
      self.groupAttendance += arr[i]['attendence'];
    }
    for (var i = 0; i < arr.length; i++) {
      self.groupScore += arr[i]['score'];
    }
    for (var i = 0; i < arr.length; i++) {
      self.groupTardiness += arr[i]['tardiness'];
    }
    for (var i = 0; i < arr.length; i++) {
      self.groupEarlyLeaving += arr[i]['earlyLeft'];
    }

    self.groupAttendance = self.groupAttendance / arr.length;
    self.groupAttendanceOpposite = 100 - self.groupAttendance;
    self.attendanceData = [

      {
        "label": "",
        "value": self.groupAttendanceOpposite
      },
      {
      "label": "Classes Missed: " + self.groupAttendance + "%",
      "value": self.groupAttendance
    }
  ];


    self.groupScore = self.groupScore / arr.length;
    self.groupScoreOpposite = 3 - self.groupScore;
    self.scoreData = [{
      "label": "Score: " + self.groupScore + " of 3",
      "value": self.groupScore
    }, {
      "label": "",
      "value": self.groupScoreOpposite
    }];

    self.groupTardiness = self.groupTardiness / arr.length;
    self.groupTardinessOpposite = 100 - self.groupTardiness;
    self.tardinessData = [{
      "label": "",
      "value": self.groupTardinessOpposite
    },{
      "label": "Tardiness: " + self.groupTardiness + "%",
      "value": self.groupTardiness
    }
  ];

    self.groupEarlyLeaving = self.groupEarlyLeaving / arr.length;
    self.groupEarlyLeavingOpposite = 100 - self.groupEarlyLeaving;
    self.earlyLeavingData = [{
      "label": "",
      "value": self.groupEarlyLeavingOpposite
    },
    {
      "label": "Left Early: " + self.groupEarlyLeaving + "%",
      "value": self.groupEarlyLeaving
    }
  ];

    self.dataArray = [self.attendanceData, self.earlyLeavingData, self.tardinessData, self.scoreData];

  }



  ///make a chart function
  function newChart(data) {

var widthOfWindow = document.getElementById("sizeTester").clientWidth;

var heightOfWindow = document.getElementById("sizeTester").clientHeight;

    var w = widthOfWindow/4 -50;
    var h = w + 50;
    var r = Math.min(w, h) / 2;
    var color = d3.scale.category10();
    //builtin range of colors
    var vis = d3.select("#targetContainer")
      .append("svg:svg")
      .data([data])
      .attr("width", w)
      .attr("height", h)
      .append("svg:g")
      .attr("transform", "translate(" + r + "," + r + ")");

    var arc = d3.svg.arc()
      .outerRadius(r);

    var pie = d3.layout.pie()
      .value(function(d) {
        return d.value;
      });

    var arcs = vis.selectAll("g.slice")
      .data(pie)
      .enter()
      .append("svg:g")
      .attr("class", "slice");

    arcs.append("svg:path")
      .attr("fill", function(d, i) {
        console.log(i);
        return color((i+2));
      })
      .attr("d", arc);

    vis.append("svg:text")

      .attr("x", 0)
      .attr("y", w/2 + 40)
      .attr("class", "flow-text")
      .attr("class", 'pieT')
      .attr("text-anchor", "middle")
      .text(function(d, i) {
        if(data[i].label != ""){
        return data[i].label;
      }
      else{
        return data[i+1].label;
      }
      });

  }

})
