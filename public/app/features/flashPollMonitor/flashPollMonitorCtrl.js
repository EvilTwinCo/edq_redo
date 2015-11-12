var app = angular.module("theQ").controller("flashPollMonitorCtrl", function(socketIoSrvc, $scope) {
  var socket = socketIoSrvc.getSocket();
  var aCount, bCount, cCount, scale;


  socket.on('flashPoll', function(data) {
    $scope.dataSet = data
    updateResults();
  })

// bryans

// $scope.dataSet = [1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 2, 2, 2, 2,2, 2, 2, 2, 3, 3, 3];
$scope.dataSet =[];

var socket = socketIoSrvc.getSocket();

socket.on('flashPoll', function(data){
  console.log(data);
  $scope.dataSet.push(data)
})



  // var dataSet = fm.votesArray;


  var aCount = $scope.dataSet.filter(function(item) {return (item === 1 ? true : false)}).length;
  var bCount = $scope.dataSet.filter(function(item) {return (item === 2 ? true : false)}).length;
  var cCount = $scope.dataSet.filter(function(item) {return (item === 3 ? true : false)}).length;

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

  var labels = baseBox.selectAll("labels")
    .data(labels)
    .enter()
    .append('text')
    .text(function(d) {
      return d;
    })
    .attr('x', function(d, i) {
      return containerWidth * (.5 + i);
    })
    .attr('y', 98)
    .attr("font-family", "sans-serif")
    .attr('fill', "black")
    .attr('font-size', "10")
    .attr("text-anchor", "middle")
    .classed('labels', true);

  var resultSet;

  this.clearData = function() {
    socket.emit('removeStudentFlashPollData')
    $scope.dataSet = [];
    updateResults();
  }

  function updateResults() {
    aCount = $scope.dataSet.filter(function(item) {
      return (item === "A" ? true : false)
    }).length;
    bCount = $scope.dataSet.filter(function(item) {
      return (item === "B" ? true : false)
    }).length;
    cCount = $scope.dataSet.filter(function(item) {
      return (item === "C" ? true : false)
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
        return containerWidth * (.5 + i);
      })
      .attr('y', function(d) {
        return 88 - scale(d);
      })
      .attr("font-family", "sans-serif")
      .attr('font-size', "10")
      .attr("text-anchor", "middle");
  }






  // .attr("text-anchor", "middle" )


  // end bryans

  //
  //
  // $element[0].width = 500;
  // $element[0].height = 500;
  //
  // var dataSet = [1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3];
  // //var dataSet = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
  // //var dataSet = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 2, 2, 3, 3, 3];
  // //var dataSet = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
  //
  // var aCount = dataSet.filter(function(item) {return (item === 1 ? true : false)}).length;
  // var bCount = dataSet.filter(function(item) {return (item === 2 ? true : false)}).length;
  // var cCount = dataSet.filter(function(item) {return (item === 3 ? true : false)}).length;
  //
  // var resultSet = [aCount, bCount, cCount];
  //
  // console.log(resultSet);
  //
  // var h = $element[0].height;
  // var w = $element[0].width;
  // var xPadding = w*.1;
  // var maxResult = d3.max(resultSet);
  //
  // var yScale = d3.scale.linear()
  //     .domain([0, dataSet.length])
  //     .range([0, h])
  //
  // var chart = d3.select('#svgChart')
  //     .attr("width", w + "%")
  //     .attr("height", h)
  //     .style({
  //         "border-bottom": "1px solid black"
  //     });
  //
  // var dataBars = chart.selectAll('rect')
  //     .data(resultSet)
  //     .enter()
  //     .append('rect')
  //     .attr({
  //         "x": function (d, i) {
  //             return (xPadding/2 + i*(w/resultSet.length));
  //         },
  //         "y": function (d) {
  //             return (h - yScale(d));
  //         },
  //         "width": function(d) {
  //             return (w/resultSet.length-xPadding);
  //         },
  //         "height": function(d) {
  //             return yScale(d);
  //         }
  //     })
  //     .style({
  //         "fill": function (d) {
  //             return d3.rgb(0, (d/dataSet.length)*255, 0);
  //         }
  //     })
  //
  // var labels = chart.selectAll('text')
  //     .data(resultSet)
  //     .enter()
  //     .append('text')
  //     .text(function(d) {
  //         return d;
  //     })
  //     .attr({
  //         "x": function (d, i) {
  //             return (xPadding/2 + i*(w/resultSet.length) + (w/resultSet.length-xPadding)/2);
  //         },
  //         "y": function (d) {
  //             if (d > .8*dataSet.length) return (h - yScale(d) + 40);
  //             else return (h - yScale(d) - 10);
  //         },
  //         "font-family": "sans-serif",
  //         "font-size": "40px",
  //         "text-anchor": "middle"
  //     })
  //     .style({
  //         "fill": function (d) {
  //             /*if (d > .8*dataSet.length) return "white";
  //             else return "black"*/
  //             return "black"
  //         }
  //     });
  //
  //
});
