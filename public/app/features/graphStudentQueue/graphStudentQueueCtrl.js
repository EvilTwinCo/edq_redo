//console.log("The file is getting loaded at least?");
var app = angular.module("theQ").controller("graphStudentQueueCtrl", function($scope, $element, $interval) {
  //console.log("Chart Module Load");
  var self = this;

  var svg = $element.find('svg');
  svg.attr("id", "chartToSelect");
  var d3Svg = d3.select("#chartToSelect");
  svg.attr("id", "");



  $scope.$watch('is.chartData', function() {
    console.log(self.chartData);
    if (self.chartData.length) {
      svg.empty();
      draw();
    }
  });

  function draw() {

    var margin = {
      top: 50,
      right: 50,
      bottom: 60,
      left: 80
    };
    var width = 1400 - margin.left - margin.right;
    var height = 1000 - margin.top - margin.bottom;
    var filterData = _.filter(self.chartData, function(item){
      return !!item.timeQuestionAnswered;
    });
    var groupedData = _.groupBy(filterData, function(item) {
      return item.date;
    });

    //console.log(groupedData);

    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1);

    x.domain(_.map(groupedData, function(d, key) {
      //console.log(d, key);
      return key;
    }));

    groupedData = _.toArray(groupedData);
    var formatTime= d3.time.format("%H:%M");
    var formatMili = function(d){return formatTime(new Date(2012,0,1,0,0,0,d));};
    var y = d3.scale.linear()
      .range([height, 0])
      .domain([0,10000000])
      .clamp(true);

      var maxRange = d3.max(groupedData, function(d){
        //console.log(d);
        var x = d;
        var y =2;
        y = y +2;
        return d3.sum(d, function(item){
          return item.timeSelfHelp + item.timeHelped + item.timeWait;
        });
      });

      //console.log(maxRange);

      y.domain([0, maxRange*1.1]);

    // y.domain([0, d3.max(groupedData, function(d) {
    //   console.log(d);
    //   return d.timeWait + d.timeHelped + d.timeSelfHelp;
    // })]);

    var color = d3.scale.ordinal()
      .range(["#3E36A1", "#18116D", "#7287C5"]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(formatMili).ticks(10);
    var legendArray = ["Wait Time", "Mentor Time", "Self Help"];
    var legendObj = [{c:color[0],t:legendArray[0]},{c:color[1],t:legendArray[1]},{c:color[2],t:legendArray[2]}];

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




      chart.selectAll(".day").data({}).exit().remove();

    var state = chart.selectAll(".day")
      .data(groupedData)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d, index) {

        return "translate(" + x(d[0].date) + ")";
      });



    var questions = state.selectAll("rect").data(function (d){
      var squareData = d.map(function(itm, ind, arr){
        itm.start = (ind===0?0:arr[ind-1].start+arr[ind-1].timeWait+arr[ind-1].timeHelped+arr[ind-1].timeSelfHelp);
        //console.log(itm);
        return itm;
      });
      return squareData;
    })
      .enter().append("g")
      .attr("class", "question")
      .attr("height",function(d){

          return  y(d.start) - y(d.start +d.timeWait + d.timeHelped + d.timeSelfHelp);
      })
      .attr("transform", function(d){
        //console.log(d.start, d.timeWait, d.timeHelped, d.timeSelfHelp);
        return "translate(0,"+y(d.start +d.timeWait + d.timeHelped + d.timeSelfHelp)+")";});

      questions.selectAll("rect").data(function(d){

          return [[0, d.timeWait], [d.timeWait,d.timeWait+d.timeHelped], [0,d.timeSelfHelp]];
      }).enter().append("rect")
      .attr("data-legend", function(d,i){return legendArray[i];})
        .attr("width",x.rangeBand())
        .attr("height",function(d){
          return y(d[0])-y(d[1]);
        })
        .attr("y", function(d){
          return -y(d[0]) + y(0);
        })
        .style("fill", function(d,i){return color(i);});

        console.log("But I make it here!!!");
        console.log(legendArray);
        d3Svg.selectAll(".legend").data(legendArray)
        .enter()
        .append("text")
        .attr("class","legend")
        .text(function(d, i){
          console.log("here");
          console.log(d);
          return d;})
        .attr("x", 1000)
        .attr("y", function(d, i){return 50+50*i;})
        .attr("font-family", "sans-serif")
        .attr("font-size", "40px")
        .attr("fill", function(d,i){return color(i);});

        d3Svg.selectAll(".legend-box").data(legendArray)
        .enter()
        .append("rect")
        .attr("x", 1000-40)
        .attr("y", function(d,i){return 15+50*i;})
        .attr("height", 40)
        .attr("width", 40)
        .attr("fill", function(d,i){return color(i);});

      //.style("fill", function(d){return d3.rgb(150,150,Math.floor(Math.random()*255));});

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
