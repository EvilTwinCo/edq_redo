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

    var groupedData = _.groupBy(self.chartData, function(item) {
      return item.date;
    });

    console.log(groupedData);

    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1);

    x.domain(_.map(groupedData, function(d, key) {
      console.log(d, key);
      return key;
    }));


    var y = d3.scale.linear()
      .rangeRound([height, 0])
      .domain([0,1000000])
      .clamp(true);

    // y.domain([0, d3.max(groupedData, function(d) {
    //   console.log(d);
    //   return d.timeWait + d.timeHelped + d.timeSelfHelp;
    // })]);

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

      groupedData = _.toArray(groupedData);
      console.log(groupedData);
    var state = chart.selectAll(".day")
      .data(groupedData)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d, index) {
        console.log("group", d);
        return "translate(" + x(d[0].date) + ")";
      });

      console.log(state);

    state.selectAll("rect").data(function (d){
      var squareData = d.map(function(itm, ind, arr){
        itm.start = (ind===0?0:arr[ind-1].start+arr[ind-1].timeWait+arr[ind-1].timeHelped+arr[ind-1].timeSelfHelp);
        return itm;
      });
      return squareData;
    })
      .enter().append("rect")
      .attr("width",x.rangeBand() )
      .attr("height",function(d){
        console.log("y",y(d.timeWait + d.timeHelped + d.timeSelfHelp),"---time",(d.timeWait + d.timeHelped + d.timeSelfHelp));
          return  y(d.start) - y(d.start +d.timeWait + d.timeHelped + d.timeSelfHelp);
      })
      .attr("y", function(d){return y(d.start +d.timeWait + d.timeHelped + d.timeSelfHelp);})
      .style("fill", function(d){return d3.rgb(150,150,Math.floor(Math.random()*255));});

      // .attr("width", function(d) {
      //   console.log(test);
      //   return x.rangeBand();
      // })
      // .attr("y", function(d) {
      //   console.log("piece", d);
      //   return y(d.timeWait);
      // })
      // .attr("height", function(d) {
      //   return Math.abs(-y(d.timeWait) + y(d.timeHelped));
      // })
      // .style("fill", function(d, i) {
      //   return color(i);
      // });



  }
});
