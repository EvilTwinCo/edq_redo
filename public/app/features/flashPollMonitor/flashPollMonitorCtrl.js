var app = angular.module("theQ").controller("flashPollMonitorCtrl", function(socketIoSrvc, $scope, $element) {
  var socket = socketIoSrvc.getSocket();
    var self = this;
  var aCount, bCount, cCount, scale;

  socket.on('flashPoll', flashPoll);
    
  function flashPoll (data) {
      $scope.dataSet = data;
      updateResults();
  }

  $scope.dataSet = [];
  var labels = ['A', 'B', 'C'];
  var resultSet = [0, 0, 0];
  var padding = 5;
  var containerWidth = (100 / resultSet.length);
  var barWidth = containerWidth - padding;

  var baseBox = d3.select("#baseBox");
  baseBox.style("background-color", "#fafafa");

  var bars = baseBox.selectAll("bars")
    .data(resultSet)
    .enter()
    .append("rect")
    .classed('bars', true);

  var voteNumber = baseBox.selectAll("voteNumbers")
    .data(resultSet)
    .enter()
    .append('text')
    .classed('voteNumbers', true);

   labels = baseBox.selectAll("labels")
    .data(labels)
    .enter()
    .append('text')
    .text(function(d) {
      return d;
    })
    .attr('x', function(d, i) {
      return containerWidth * (0.5 + i);
    })
    .attr('y', 98)
    .attr("font-family", "sans-serif")
    .attr('fill', "black")
    .attr('font-size', "10")
    .attr("text-anchor", "middle")
    .classed('labels', true);

  this.clearData = function() {
    console.log(self.cohortId);
    socket.emit('removeStudentFlashPollData', self.cohortId);
    $scope.dataSet = [];
    updateResults();
  };

  function updateResults() {
    aCount = $scope.dataSet.filter(function(item) {
      return (item === "A" ? true : false);
    }).length;
    bCount = $scope.dataSet.filter(function(item) {
      return (item === "B" ? true : false);
    }).length;
    cCount = $scope.dataSet.filter(function(item) {
      return (item === "C" ? true : false);
    }).length;

    resultSet = [aCount, bCount, cCount];

    scale = d3.scale.linear()
      .domain([0, $scope.dataSet.length])
      .range([0, 80]);

    bars = baseBox.selectAll(".bars")
      .data(resultSet)
      .attr("height", function(d, i) {
        return scale(d);
      })
      .attr('width', barWidth)
      .attr('x', function(d, i) {
        return padding / 2 + containerWidth * i;
      })
      .attr('y', function(d, i) {
        return 90 - scale(d);
      })
      .attr("fill", function(d) {
        return "rgb(0, 0, " + (d * 2) + ")";
      });

    voteNumber = baseBox.selectAll(".voteNumbers")
      .data(resultSet)
      .text(function(d) {
        return d;
      })
      .attr('x', function(d, i) {
        return containerWidth * (0.5 + i);
      })
      .attr('y', function(d) {
        return 88 - scale(d);
      })
      .attr("font-family", "sans-serif")
      .attr('font-size', "10")
      .attr("text-anchor", "middle");
  }
    
    $element.on('$destroy', function () {
        socket.off('flashPoll', flashPoll);
    })
});
