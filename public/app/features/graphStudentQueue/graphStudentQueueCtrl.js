//console.log("The file is getting loaded at least?");
var app = angular.module("theQ").controller("graphStudentQueueCtrl", function($scope, $element, $interval) {
  console.log("Chart Module Load");
  var self = this;

  var svg = $element.find('svg');
  svg.attr("id", "chartToSelect");
  var d3Svg = d3.select("#chartToSelect");
  svg.attr("id", "");



  $scope.$watch('is.chartData', function() {
    console.log(self.chartData);
    if (self.chartData.length) {
      draw();
    }
  });

  function draw() {

    var margin = {
      top: 5,
      right: 5,
      bottom: 6,
      left: 8
    };
    var width = 140 - margin.left - margin.right;
    var height = 100 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1);

    x.domain(self.chartData.map(function(d) {
      return d.category;
    }));


    var y = d3.scale.linear()
      .rangeRound([height, 0]);

    y.domain([0, d3.max(self.chartData, function(d) {
      return d.data[0] + d.data[1] + d.data[2];
    })]);

    var color = d3.scale.ordinal()
      .range(["red", "yellow", "green"]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);

    chart = d3Svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "translate(5,0)")
      .attr("y", 6)
      .attr("dy", ".02em")
      .style("text-anchor", "start")
      .text("Time");

    var state = chart.selectAll(".day")
      .data(self.chartData)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d, index) {
        console.log("group", d);
        return "translate(" + x(d.category) + ")";
      });

    state.selectAll("rect")
      .data(function(d) {
        return d.data.reduce(function(prev, item, index, arr) {
          if (index > 0) {
            prev.push({
              start: prev[index - 1].end,
              end: prev[index - 1].end + item
            });
            return prev;
          } else {
            prev.push({
              start: 0,
              end: item
            });
            return prev;
          }
        }, []);
      }).enter().append("rect")
      .attr("width", function(d){
        return x.rangeBand()*0.95;
      })
      .attr("y", function(d) {
        console.log("piece", d);
        return y(d.end);
      })
      .attr("height", function(d) {
        return -y(d.end) + y(d.start);
      })
      .style("fill", function(d, i) {
        return color(i);
      });



  }
});
