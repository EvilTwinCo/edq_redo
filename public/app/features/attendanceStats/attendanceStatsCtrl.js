angular.module('theQ').controller('attendanceStatsCtrl', function(socketIoSrvc, $scope){

  var socket = socketIoSrvc.getSocket();
  var self = this;
  self.attendees = [];
  //needs to be removed before being ready
  var tempCohort = 28;

  //////
  ///sockets to get data
  //////[{attendance[], attendee{fnam, lastname}}]


  socket.emit("getAllAttendanceOfCohort", tempCohort);
  $scope.$watch('is.cohortId', function () {
      if (self.cohortId) {
        socket.emit("getAllAttendanceOfCohort", self.cohortId);
      }
  })

  socket.on('All attendance for a cohort', function(users){
    self.attendees.push(users);
    $scope.$apply();
    createRowData(self.attendees);
    $scope.gridOptions.api.setRowData(createRowData(self.attendees));

    console.log(self.attendees)
  })
  /////////
//sockets end
///////

////????////////////////////
//??%%%%    ag-grid start /////
////////////////////////////

var columnDefs = [
  {headerName: "Student Name", field: "name", width: 150},
  {headerName: "Student Id", field: "studentId", width: 90},
  {headerName: "Attendence (%)", field: "attendence", width: 150, cellRenderer: percentCellRenderer},
  {headerName: "Days Late (%)", field: "tardiness", width: 150, cellRenderer: invertedPercentCellRenderer},
  {headerName: "Days Left Early (%)", field: "earlyLeft", width: 150, cellRenderer: invertedPercentCellRenderer},
  {headerName: "Average Daily Score", field: "score", width: 150}

];

$scope.gridOptions = {
    columnDefs: columnDefs,
       rowData: createRowData(self.attendees),
onModelUpdated: onModelUpdated,
     rowHeight: 22,
     enableColResize: true,

};



function createRowData(attendees) {
    var rowData = [];

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
console.log(rowData);
    return rowData;
}

function computeScore(attendanceObj){
console.log("computescore", attendanceObj);

var avScore;
var number = attendanceObj.length;
var total = 0;

  for(var i = 0; i > attendanceObj.length; i++){
    if(attendanceObj[i].attendanceData.score != null){
    total += attendanceObj[i].attendanceData.score;
    }
  }
  avScore = total/number *100;
  console.log("computed schoreee", avScore);
  return avScore;

}

function computeLeftEarly(attendanceObj){
// 
//   var percent;
//   var numberOfDays = attendanceObj.attendance.length;
//   var numberEarlyLeave = 0;
//
//
//   for(var i = 0; i > attendanceObj.attendance.length; i++){
//
//     if(attendanceObj.attendance[i].attendanceData.timeIn.getHours() < 16 ){
//       numberEarlyLeave +=1;
//     }
//   }
//   percent = (numberEarlyLeave/numberOfDays)*100;
// // console.log("averageScore", percent);
//   return percent;
}


function computeTardiness(attendanceObj){
//   var percent;
//   var numberOfDays = attendanceObj.attendance.length;
//   var numberLate = 0;
//
//
//   for(var i = 0; i > attendanceObj.attendance.length; i++){
//     if(attendanceObj.attendance[i].attendanceData.timeIn.getHours() > 8 ){
//       numberLate +=1;
//     }
//   }
//   percent = (numberLate/numberOfDays)*100;
// // console.log("averageScore", percent);
//   return percent;
}

function computePrecentAttended(attendanceObj){
//   var percent;
//   var numberOfDays = attendanceObj.attendance.length;
//   var numberAttended = 0;
//
//   for(var i = 0; i > attendanceObj.attendance.length; i++){
//     if(attendanceObj.attendance[i].attendanceData.timeIn != null){
//       numberAttended +=1;
//     }
//   }
//   percent = (numberAttended/numberOfDays)*100;
// // console.log("averageScore", percent);
//   return percent;

}


  function percentCellRenderer(params) {
      var value = params;

      var eDivPercentBar = document.createElement('div');
      eDivPercentBar.className = 'div-percent-bar';
      eDivPercentBar.style.width = value + '%';
      if (value < 20) {
          eDivPercentBar.style.backgroundColor = 'red';
      } else if (value < 60) {
          eDivPercentBar.style.backgroundColor = '#ff9900';
      } else {
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
      var value = params;

      var eDivPercentBar = document.createElement('div');
      eDivPercentBar.className = 'div-percent-bar';
      eDivPercentBar.style.width = value + '%';
      if (value < 70) {
          eDivPercentBar.style.backgroundColor = 'red';
      } else if (value < 90) {
          eDivPercentBar.style.backgroundColor = '#ff9900';
      } else {
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


})
